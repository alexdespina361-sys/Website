"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutButton from "@/components/CheckoutButton";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/format";
import Icon from "@/components/Icon";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalCents } = useCart();

  return (
    <div>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="px-12 py-32 md:px-24">
          <h1 className="mb-12 font-headline text-5xl">Cosul tau</h1>

          {items.length === 0 ? (
            <div className="bg-surface-container-lowest p-12 text-center">
              <Icon
                name="shopping-bag"
                className="mx-auto mb-6 h-14 w-14 text-outline-variant"
              />
              <p className="font-label text-sm uppercase tracking-widest text-secondary">
                Cosul tau este gol.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-block bg-primary px-12 py-5 font-label text-xs uppercase tracking-widest text-white transition-all duration-500 hover:bg-primary-container"
              >
                Exploreaza colectia
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 bg-surface-container-lowest p-6"
                  >
                    <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-surface-container">
                      {item.image ? (
                        <Image
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="96px"
                          src={item.image}
                          unoptimized={!item.image.startsWith("/")}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-3 text-center">
                          <span className="font-label text-[9px] uppercase tracking-[0.2em] text-outline">
                            Fara imagine
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-headline text-lg italic">
                            {item.name}
                          </h3>
                          <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-outline">
                            {[item.size, item.color].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-outline transition-colors hover:text-error"
                        >
                          <Icon name="close" className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-6 flex items-end justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center bg-surface-container transition-colors hover:bg-surface-container-highest"
                          >
                            <Icon name="minus" className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-label text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.min(item.quantity + 1, item.availableStock)
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center bg-surface-container transition-colors hover:bg-surface-container-highest"
                          >
                            <Icon name="add" className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-label text-sm font-bold text-primary">
                          {formatPrice(item.priceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="sticky top-32 bg-surface-container-lowest p-8">
                  <h3 className="mb-6 font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                    Sumar comanda
                  </h3>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-label text-sm uppercase tracking-widest">
                      Subtotal
                    </span>
                    <span className="font-label text-sm font-bold">
                      {formatPrice(totalCents)}
                    </span>
                  </div>
                  <div className="mb-8 flex items-center justify-between border-b border-outline-variant/20 pb-8">
                    <span className="font-label text-sm uppercase tracking-widest">
                      Livrare
                    </span>
                    <span className="font-label text-sm text-outline">
                      Confirmata la procesarea comenzii
                    </span>
                  </div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-label text-sm font-bold uppercase tracking-widest">
                      Total
                    </span>
                    <span className="font-headline text-2xl">
                      {formatPrice(totalCents)}
                    </span>
                  </div>
                  <CheckoutButton />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
