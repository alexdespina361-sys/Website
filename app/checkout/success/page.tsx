"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/CartContext";
import Icon from "@/components/Icon";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    clearCart();

    const params = new URLSearchParams(window.location.search);
    setIsCashOnDelivery(params.get("method") === "cash_on_delivery");
  }, [clearCart]);

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center px-12">
        <div className="w-full max-w-lg py-32 text-center">
          <Icon
            name="check-circle"
            className="mx-auto mb-8 h-16 w-16 text-primary"
          />
          <h1 className="font-headline text-4xl mb-4">
            Comanda Confirmată
          </h1>
          <p className="font-body text-secondary text-lg mb-8">
            {isCashOnDelivery
              ? "Mulțumim. Comanda a fost înregistrată, iar plata se va face la livrare."
              : "Mulțumim pentru comanda dumneavoastră. Veți primi un email de confirmare în curând."}
          </p>
          <div className="space-y-4">
            <Link
              href="/account/orders"
              className="block w-full bg-primary text-white py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500"
            >
              Vezi Comenzile Mele
            </Link>
            <Link
              href="/shop"
              className="block w-full bg-surface-container text-on-surface py-5 font-label text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-all duration-500"
            >
              Continuă Cumpărăturile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
