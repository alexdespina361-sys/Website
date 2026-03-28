"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/lib/CartContext";

export default function AccountOrdersEmptyState() {
  const { itemCount } = useCart();
  const hasCartItems = itemCount > 0;

  return (
    <div className="bg-surface-container-lowest p-12 text-center">
      <Icon
        name="receipt"
        className="mx-auto mb-6 h-14 w-14 text-outline-variant"
      />
      <p className="font-label text-sm uppercase tracking-widest text-secondary">
        {hasCartItems
          ? "Nu ai nicio comandă încă. Produsele tale sunt deja în coș."
          : "Nu ai nicio comandă încă."}
      </p>
      <Link
        href={hasCartItems ? "/cart" : "/shop"}
        className="inline-block mt-8 bg-primary text-white px-12 py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500"
      >
        {hasCartItems ? "Vezi Coșul" : "Explorează Colecția"}
      </Link>
    </div>
  );
}
