"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";

interface DisplayProduct {
  name: string;
  slug: string;
  material: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  category?: string;
  season?: string;
}

export default function ShopContent({ products }: { products: DisplayProduct[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"relevance" | "newest">("relevance");

  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  ) as string[];

  const materials = Array.from(
    new Set(
      products
        .flatMap((product) => product.material.split(","))
        .map((material) => material.trim())
        .filter(Boolean)
    )
  );

  const seasons = Array.from(
    new Set(products.map((product) => product.season).filter(Boolean))
  ) as string[];

  const toggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedMaterials([]);
    setSelectedSeason(null);
    setSortBy("relevance");
  };

  // Filter products
  let filtered = products.filter((p) => {
    const query = search.trim().toLowerCase();

    if (
      query &&
      !p.name.toLowerCase().includes(query) &&
      !(p.material || "").toLowerCase().includes(query)
    ) {
      return false;
    }
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (selectedMaterials.length > 0 && !selectedMaterials.some((m) => (p.material || "").toLowerCase().includes(m.toLowerCase()))) {
      return false;
    }
    if (selectedSeason && p.season !== selectedSeason) return false;
    return true;
  });

  // Sort
  if (sortBy === "newest") {
    filtered = [...filtered].reverse();
  }

  const hasActiveFilters =
    Boolean(search.trim()) ||
    Boolean(selectedCategory) ||
    selectedMaterials.length > 0 ||
    Boolean(selectedSeason) ||
    sortBy !== "relevance";

  return (
    <main className="pt-20">
      {/* Search Header */}
      <section className="pt-32 pb-12 px-12 bg-surface">
        <div className="max-w-[1920px] mx-auto border-b border-outline-variant/40 pb-4">
          <div className="flex items-center gap-4 group">
            <Icon
              name="search"
              className="h-10 w-10 text-outline transition-colors duration-500 group-focus-within:text-primary"
            />
            <input
              className="w-full bg-transparent border-none text-4xl md:text-6xl font-headline font-light tracking-tight focus:ring-0 placeholder:text-surface-container-highest transition-all duration-500 focus:placeholder:opacity-0"
              placeholder="EXPLOREAZĂ ARHIVELE..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center mt-6">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
              Se afișează {filtered.length} de rezultate
              {selectedCategory ? ` în ${selectedCategory}` : ""}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                Sortează după:
              </span>
              <button
                onClick={() => setSortBy("relevance")}
                className={`font-label text-[10px] uppercase tracking-[0.2em] py-1 transition-opacity ${
                  sortBy === "relevance"
                    ? "border-b border-primary text-primary"
                    : "text-outline hover:text-primary"
                }`}
              >
                Relevanță
              </button>
              <button
                onClick={() => setSortBy("newest")}
                className={`font-label text-[10px] uppercase tracking-[0.2em] py-1 transition-opacity ${
                  sortBy === "newest"
                    ? "border-b border-primary text-primary"
                    : "text-outline hover:text-primary"
                }`}
              >
                Cele mai noi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex flex-col md:flex-row px-12 max-w-[1920px] mx-auto gap-12 pb-24">
        {/* Sidebar Filters */}
        <aside className="md:w-1/5 shrink-0">
          <div className="sticky top-32 space-y-12">
            <div>
              <h3 className="font-label text-[11px] font-bold uppercase tracking-widest mb-6">
                Categorie
              </h3>
              <ul className="space-y-4 font-label text-[12px] uppercase tracking-widest">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`block pl-4 transition-all duration-300 hover:pl-6 text-left ${
                        selectedCategory === cat
                          ? "text-primary border-l-2 border-primary"
                          : "text-outline hover:text-primary"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-label text-[11px] font-bold uppercase tracking-widest mb-6">
                Material
              </h3>
              <div className="space-y-3">
                {materials.map((mat) => (
                  <label
                    key={mat}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      className="w-4 h-4 border-outline-variant/40 rounded-none text-primary focus:ring-primary transition-colors cursor-pointer"
                      type="checkbox"
                      checked={selectedMaterials.includes(mat)}
                      onChange={() => toggleMaterial(mat)}
                    />
                    <span className="font-label text-[11px] uppercase tracking-widest text-outline group-hover:text-primary transition-colors">
                      {mat}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-label text-[11px] font-bold uppercase tracking-widest mb-6">
                Sezon
              </h3>
              <ul className="space-y-4 font-label text-[12px] uppercase tracking-widest text-outline">
                {seasons.map((season) => (
                  <li key={season}>
                    <button
                      onClick={() => setSelectedSeason(selectedSeason === season ? null : season)}
                      className={`text-left transition-all duration-300 ${
                        selectedSeason === season ? "text-primary" : "hover:text-primary hover:tracking-[0.25em]"
                      }`}
                    >
                      {season}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-8">
              <button
                onClick={resetFilters}
                className="w-full bg-primary py-4 text-white font-label text-[11px] uppercase tracking-widest hover:opacity-90 hover:shadow-lg transition-all duration-300"
              >
                Resetează Tot
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <Icon
                name="inventory"
                className="mx-auto mb-6 h-14 w-14 text-outline-variant"
              />
              <p className="font-headline text-2xl mb-2">Niciun produs găsit</p>
              <p className="font-label text-xs uppercase tracking-widest text-outline">
                {products.length === 0
                  ? "Adaugă produse din panoul admin."
                  : "Încearcă filtre diferite."}
              </p>
              {products.length > 0 && (
                <button
                  onClick={resetFilters}
                  className="mt-6 font-label text-[10px] uppercase tracking-widest text-primary hover:underline"
                >
                  Resetează filtrele
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((product) => (
                <Link
                  key={product.slug}
                  href={`/shop/${product.slug}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-surface-container-low overflow-hidden mb-4 relative">
                    {product.badge && (
                      <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 font-label text-[9px] uppercase tracking-[0.2em] z-20">
                        {product.badge}
                      </span>
                    )}
                    {product.image ? (
                      <Image
                        alt={product.name}
                        className="w-full h-auto grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                        src={product.image}
                        width={900}
                        height={1200}
                        sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 100vw"
                        unoptimized={!product.image.startsWith("/")}
                      />
                    ) : (
                      <div className="flex aspect-[3/4] items-center justify-center bg-surface-container text-outline">
                        <span className="font-label text-[10px] uppercase tracking-[0.3em]">
                          Imagine indisponibilă
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                      <h4 className="font-headline text-lg italic leading-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="font-label text-[10px] uppercase tracking-widest text-outline mt-1">
                        {product.material}
                      </p>
                    </div>
                    {product.originalPrice ? (
                      <div className="text-right">
                        <span className="block font-label text-[10px] text-outline line-through">
                          {product.originalPrice}
                        </span>
                        <span className="font-label text-sm text-primary font-bold">
                          {product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="font-label text-sm text-primary font-bold">
                        {product.price}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {hasActiveFilters ? (
            <div className="mt-24 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="font-label text-[12px] uppercase tracking-[0.4em] border-b-2 border-primary text-primary py-2 hover:bg-primary hover:text-white px-8 transition-all duration-500 transform hover:scale-105 active:scale-95"
              >
                Resetează Vizualizarea
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
