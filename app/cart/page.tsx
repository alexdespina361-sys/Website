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
      <main className="pt-20 min-h-screen">
        <section className="px-12 md:px-24 py-32">
          <h1 className="font-headline text-5xl mb-12">Coșul Tău</h1>

          {items.length === 0 ? (
            <div className="bg-surface-container-lowest p-12 text-center">
              <Icon
                name="shopping-bag"
                className="mx-auto mb-6 h-14 w-14 text-outline-variant"
              />
              <p className="font-label text-sm uppercase tracking-widest text-secondary">
                Coșul tău este gol.
              </p>
              <Link
                href="/shop"
                className="inline-block mt-8 bg-primary text-white px-12 py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500"
              >
                Explorează Colecția
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest p-6 flex gap-6"
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
                            Fără imagine
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-headline text-lg italic">
                            {item.name}
                          </h3>
                          <p className="font-label text-[10px] uppercase tracking-widest text-outline mt-1">
                            {[item.size, item.color].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-outline hover:text-error transition-colors"
                        >
                          <Icon name="close" className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                          >
                            <Icon name="minus" className="h-3 w-3" />
                          </button>
                          <span className="font-label text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.min(item.quantity + 1, item.availableStock)
                              )
                            }
                            className="w-8 h-8 bg-surface-container flex items-center justify-center hover:bg-surface-container-highest transition-colors"
                          >
                            <Icon name="add" className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-label text-sm text-primary font-bold">
                          {formatPrice(item.priceCents * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <div className="bg-surface-container-lowest p-8 sticky top-32">
                  <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-6">
                    Sumar Comandă
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-label text-sm uppercase tracking-widest">
                      Subtotal
                    </span>
                    <span className="font-label text-sm font-bold">
                      {formatPrice(totalCents)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-8 pb-8 border-b border-outline-variant/20">
                    <span className="font-label text-sm uppercase tracking-widest">
                      Livrare
                    </span>
                    <span className="font-label text-sm text-outline">
                      Calculat la checkout
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-8">
                    <span className="font-label text-sm uppercase tracking-widest font-bold">
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
