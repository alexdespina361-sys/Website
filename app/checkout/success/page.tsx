"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/CartContext";
import Icon from "@/components/Icon";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    clearCart();
  }, [clearCart]);

  return (
    <div>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-12 pt-20">
        <div className="w-full max-w-lg py-32 text-center">
          <Icon
            name="check-circle"
            className="mx-auto mb-8 h-16 w-16 text-primary"
          />
          <h1 className="mb-4 font-headline text-4xl">Comanda confirmata</h1>
          <p className="mb-8 font-body text-lg text-secondary">
            Multumim. Comanda a fost inregistrata, iar plata se va face la
            livrare.
          </p>
          <div className="space-y-4">
            <Link
              href="/account/orders"
              className="block w-full bg-primary py-5 font-label text-xs uppercase tracking-widest text-white transition-all duration-500 hover:bg-primary-container"
            >
              Vezi comenzile mele
            </Link>
            <Link
              href="/shop"
              className="block w-full bg-surface-container py-5 font-label text-xs uppercase tracking-widest text-on-surface transition-all duration-500 hover:bg-surface-container-highest"
            >
              Continua cumparaturile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
