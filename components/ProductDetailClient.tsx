"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/format";
import { getProductImage } from "@/lib/constants";
import type { ProductWithDetails } from "@/lib/types";
import Icon from "@/components/Icon";

export default function ProductDetailClient({
  product,
}: {
  product: ProductWithDetails;
}) {
  const initialVariant = product.variants[0] || null;
  const [selectedSize, setSelectedSize] = useState(initialVariant?.size || null);
  const [selectedColor, setSelectedColor] = useState(
    initialVariant?.color || null
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const hasSizeOptions = product.variants.some(
    (variant) => variant.size && variant.size !== "Uni"
  );
  const hasColorOptions = product.variants.some((variant) => variant.color);
  const productImage = getProductImage(product);

  const availableSizes = useMemo(() => {
    const scopedVariants = hasColorOptions
      ? product.variants.filter((variant) => variant.color === selectedColor)
      : product.variants;

    return Array.from(
      new Set(
        scopedVariants
          .map((variant) => variant.size)
          .filter((size): size is string => Boolean(size && size !== "Uni"))
      )
    );
  }, [hasColorOptions, product.variants, selectedColor]);

  const availableColors = useMemo(() => {
    const scopedVariants = hasSizeOptions
      ? product.variants.filter((variant) => variant.size === selectedSize)
      : product.variants;

    return Array.from(
      new Set(
        scopedVariants
          .map((variant) => variant.color)
          .filter((color): color is string => Boolean(color))
      )
    );
  }, [hasSizeOptions, product.variants, selectedSize]);

  const selectedVariant =
    product.variants.find(
      (variant) =>
        (!hasSizeOptions || variant.size === selectedSize) &&
        (!hasColorOptions || variant.color === selectedColor)
    ) || initialVariant;

  useEffect(() => {
    if (hasSizeOptions && selectedSize && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0] || null);
    }
  }, [availableSizes, hasSizeOptions, selectedSize]);

  useEffect(() => {
    if (
      hasColorOptions &&
      selectedColor &&
      !availableColors.includes(selectedColor)
    ) {
      setSelectedColor(availableColors[0] || null);
    }
  }, [availableColors, hasColorOptions, selectedColor]);

  useEffect(() => {
    if (!selectedVariant) {
      return;
    }

    setQuantity((current) =>
      Math.max(1, Math.min(current, selectedVariant.stock))
    );
  }, [selectedVariant]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      return;
    }

    addItem(
      {
        variantId: selectedVariant.id,
        name: product.name,
        slug: product.slug,
        size: selectedVariant.size,
        color: selectedVariant.color,
        priceCents: selectedVariant.price_cents,
        image: productImage,
        availableStock: selectedVariant.stock,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="px-12 md:px-24 py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image */}
        <div className="bg-surface-container-low overflow-hidden">
          {productImage ? (
            <Image
              alt={product.name}
              className="w-full h-auto object-cover"
              src={productImage}
              width={1200}
              height={1500}
              sizes="(min-width: 768px) 50vw, 100vw"
              unoptimized={!productImage.startsWith("/")}
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center px-8 text-center">
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-outline">
                Imagine indisponibilă
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-outline mb-4">
            {product.category}
          </span>
          <h1 className="font-headline text-4xl md:text-5xl mb-4">
            {product.name}
          </h1>
          <p className="font-body text-secondary text-lg mb-8 max-w-lg">
            {product.description}
          </p>
          <p className="font-label text-[10px] uppercase tracking-widest text-outline mb-8">
            {product.material}
          </p>

          {/* Price */}
          <div className="mb-8">
            {selectedVariant ? (
              <>
                <span className="font-headline text-3xl text-primary">
                  {formatPrice(selectedVariant.price_cents)}
                </span>
                {selectedVariant.compare_at_price_cents && (
                  <span className="ml-4 font-label text-sm text-outline line-through">
                    {formatPrice(selectedVariant.compare_at_price_cents)}
                  </span>
                )}
                {selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                  <span className="block font-label text-[10px] uppercase tracking-widest text-outline mt-2">
                    Ultimele {selectedVariant.stock} bucăți
                  </span>
                )}
              </>
            ) : (
              <span className="font-label text-[11px] uppercase tracking-widest text-outline">
                Variantă indisponibilă
              </span>
            )}
          </div>

          {/* Size Selection */}
          {hasSizeOptions && (
            <div className="mb-8">
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4">
                Mărime
              </label>
              <div className="flex gap-3">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 font-label text-xs uppercase tracking-wider transition-all duration-300 ${
                      size === selectedSize
                        ? "bg-primary text-white"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-highest"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasColorOptions && availableColors.length > 0 && (
            <div className="mb-8">
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4">
                Culoare
              </label>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`min-w-[5rem] px-4 py-3 font-label text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                      color === selectedColor
                        ? "bg-primary text-white"
                        : "bg-surface-container text-on-surface hover:bg-surface-container-highest"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-12">
            <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4">
              Cantitate
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
              >
                <Icon name="minus" className="h-4 w-4" />
              </button>
              <span className="font-label text-sm w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(
                    Math.min(selectedVariant?.stock || quantity + 1, quantity + 1)
                  )
                }
                className="w-12 h-12 bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
              >
                <Icon name="add" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="w-full bg-primary text-white py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 shadow-lg hover:shadow-primary/40 hover:-translate-y-1 btn-hover-effect disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added
              ? "Adăugat în Coș!"
              : !selectedVariant || selectedVariant.stock === 0
                ? "Stoc Epuizat"
                : "Adaugă în Coș"}
          </button>

          {/* Additional Info */}
          <div className="mt-12 pt-12 border-t border-outline-variant/20 space-y-6">
            <div className="flex items-center gap-3">
              <Icon name="truck" className="h-4 w-4 text-outline" />
              <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                Livrare gratuită la comenzi peste 500 RON
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="refresh" className="h-4 w-4 text-outline" />
              <span className="font-label text-[10px] uppercase tracking-widest text-outline">
                Returnare în 30 de zile
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
