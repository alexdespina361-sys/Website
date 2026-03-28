"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/format";
import type { ProductWithDetails } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";
import Icon from "@/components/Icon";

type VariantRow = {
  size: string;
  color: string;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock: number;
};

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category: "",
    material: "",
    season: "",
    image_url: "",
    image_alt_text: "",
    is_archived: false,
  });
  const [variantRows, setVariantRows] = useState<VariantRow[]>([
    { size: "", color: "", price_cents: 0, compare_at_price_cents: null, stock: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nu am putut încărca produsele.");
      }

      setProducts(data);
    } catch (error) {
      showToast({
        title: "Eroare admin",
        description:
          error instanceof Error ? error.message : "Nu am putut încărca produsele.",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      category: "",
      material: "",
      season: "",
      image_url: "",
      image_alt_text: "",
      is_archived: false,
    });
    setVariantRows([
      { size: "", color: "", price_cents: 0, compare_at_price_cents: null, stock: 0 },
    ]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: ProductWithDetails) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      category: product.category || "",
      material: product.material || "",
      season: product.season || "",
      image_url: product.images[0]?.url || "",
      image_alt_text: product.images[0]?.alt_text || "",
      is_archived: product.is_archived,
    });
    setVariantRows(
      product.variants.length > 0
        ? product.variants.map((v) => ({
            size: v.size || "",
            color: v.color || "",
            price_cents: v.price_cents,
            compare_at_price_cents: v.compare_at_price_cents,
            stock: v.stock,
          }))
        : [
            {
              size: "",
              color: "",
              price_cents: 0,
              compare_at_price_cents: null,
              stock: 0,
            },
          ]
    );
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      variants: variantRows.filter(
        (variant) => (variant.size || variant.color) && variant.price_cents > 0
      ),
    };

    try {
      const response = await fetch(
        editingProduct
          ? `/api/admin/products/${editingProduct.id}`
          : "/api/admin/products",
        {
          method: editingProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu am putut salva produsul.");
      }

      await fetchProducts();
      resetForm();
      showToast({
        title: editingProduct ? "Produs actualizat" : "Produs creat",
        description: "Catalogul a fost actualizat.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Salvare eșuată",
        description:
          error instanceof Error ? error.message : "Nu am putut salva produsul.",
        tone: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur doriți să ștergeți acest produs?")) return;
    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu am putut șterge produsul.");
      }

      await fetchProducts();
      showToast({
        title: "Produs șters",
        description: "Produsul a fost eliminat din catalog.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Ștergere eșuată",
        description:
          error instanceof Error ? error.message : "Nu am putut șterge produsul.",
        tone: "error",
      });
    }
  };

  const addVariantRow = () => {
    setVariantRows([
      ...variantRows,
      { size: "", color: "", price_cents: 0, compare_at_price_cents: null, stock: 0 },
    ]);
  };

  const removeVariantRow = (index: number) => {
    setVariantRows(variantRows.filter((_, i) => i !== index));
  };

  const updateVariantRow = (
    index: number,
    field: keyof VariantRow,
    value: string | number | null
  ) => {
    const updated = [...variantRows];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setVariantRows(updated);
  };

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="px-12 md:px-24 py-32">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Link
                href="/admin"
                className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors mb-2 block"
              >
                ← Înapoi la Dashboard
              </Link>
              <h1 className="font-headline text-5xl">Produse</h1>
            </div>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-primary text-white px-8 py-4 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500"
            >
              + Produs Nou
            </button>
          </div>

          {/* Product Form */}
          {showForm && (
            <div className="bg-surface-container-lowest p-12 mb-12">
              <h3 className="font-headline text-2xl mb-8">
                {editingProduct ? "Editează Produs" : "Produs Nou"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Nume
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Slug
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="auto-generat-din-nume"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Descriere
                    </label>
                    <textarea
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500 resize-none"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Categorie
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Material
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Sezon
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Imagine Principală
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.image_url}
                      onChange={(e) =>
                        setFormData({ ...formData, image_url: e.target.value })
                      }
                      placeholder="/images/products/produs.webp"
                    />
                  </div>
                  <div>
                    <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                      Alt Text Imagine
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      value={formData.image_alt_text}
                      onChange={(e) =>
                        setFormData({ ...formData, image_alt_text: e.target.value })
                      }
                      placeholder="Descriere imagine"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        className="h-4 w-4 rounded-none border-outline-variant text-primary focus:ring-primary"
                        type="checkbox"
                        checked={formData.is_archived}
                        onChange={(e) =>
                          setFormData({ ...formData, is_archived: e.target.checked })
                        }
                      />
                      <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline group-hover:text-primary transition-colors">
                        Marchează produsul ca arhivat
                      </span>
                    </label>
                  </div>
                </div>

                {/* Variants */}
                <h4 className="font-label text-[11px] font-bold uppercase tracking-widest mb-4">
                  Variante
                </h4>
                <div className="space-y-4 mb-8">
                  {variantRows.map((variant, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_140px_140px_100px_auto] gap-4 items-end">
                      <div className="flex-1">
                        <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                          Mărime
                        </label>
                        <input
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:ring-0 focus:border-primary"
                          type="text"
                          value={variant.size}
                          onChange={(e) => updateVariantRow(i, "size", e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                          Culoare
                        </label>
                        <input
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:ring-0 focus:border-primary"
                          type="text"
                          value={variant.color}
                          onChange={(e) => updateVariantRow(i, "color", e.target.value)}
                        />
                      </div>
                      <div className="w-32">
                        <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                          Preț (bani)
                        </label>
                        <input
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:ring-0 focus:border-primary"
                          type="number"
                          value={variant.price_cents}
                          onChange={(e) => updateVariantRow(i, "price_cents", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="w-32">
                        <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                          Preț vechi
                        </label>
                        <input
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:ring-0 focus:border-primary"
                          type="number"
                          value={variant.compare_at_price_cents || ""}
                          onChange={(e) =>
                            updateVariantRow(
                              i,
                              "compare_at_price_cents",
                              parseInt(e.target.value) || null
                            )
                          }
                        />
                      </div>
                      <div className="w-24">
                        <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                          Stoc
                        </label>
                        <input
                          className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-0 font-body text-sm focus:ring-0 focus:border-primary"
                          type="number"
                          value={variant.stock}
                          onChange={(e) => updateVariantRow(i, "stock", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      {variantRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantRow(i)}
                          className="pb-3 text-outline transition-colors hover:text-error"
                        >
                          <Icon name="delete" className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors mb-8 block"
                >
                  + Adaugă Variantă
                </button>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-white px-12 py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
                  >
                    {saving ? "Se salvează..." : "Salvează"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-surface-container text-on-surface px-12 py-5 font-label text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-all duration-500"
                  >
                    Anulează
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          {loading ? (
            <p className="font-label text-xs uppercase tracking-widest text-outline py-12">
              Se încarcă produsele...
            </p>
          ) : products.length === 0 ? (
            <div className="bg-surface-container-lowest p-12 text-center">
              <Icon
                name="inventory"
                className="mx-auto mb-6 h-14 w-14 text-outline-variant"
              />
              <p className="font-label text-sm uppercase tracking-widest text-secondary">
                Niciun produs. Adaugă primul produs.
              </p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Nume</th>
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Categorie</th>
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Material</th>
                    <th className="text-right p-4 font-label text-[10px] uppercase tracking-widest text-outline">Preț</th>
                    <th className="text-right p-4 font-label text-[10px] uppercase tracking-widest text-outline">Stoc</th>
                    <th className="text-right p-4 font-label text-[10px] uppercase tracking-widest text-outline">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                    const minPrice = product.variants?.length
                      ? Math.min(...product.variants.map((v) => v.price_cents))
                      : 0;
                    return (
                      <tr
                        key={product.id}
                        className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <span className="font-headline text-sm italic">{product.name}</span>
                            <span className="block font-label text-[10px] text-outline mt-1">
                              {product.slug}
                              {product.is_archived ? " · Arhivat" : ""}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-label text-xs text-outline">{product.category}</td>
                        <td className="p-4 font-label text-xs text-outline">{product.material}</td>
                        <td className="p-4 font-label text-sm text-primary font-bold text-right">
                          {formatPrice(minPrice)}
                        </td>
                        <td className="p-4 font-label text-sm text-right">{totalStock}</td>
                        <td className="p-4 text-right flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-outline transition-colors hover:text-primary"
                          >
                            <Icon name="edit" className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-outline transition-colors hover:text-error"
                          >
                            <Icon name="delete" className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
