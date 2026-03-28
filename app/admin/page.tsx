"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";

export default function AdminPage() {
  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="px-12 md:px-24 py-32">
          <h1 className="font-headline text-5xl mb-12">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link
              href="/admin/products"
              className="bg-surface-container-lowest p-12 group hover:shadow-lg transition-all duration-300"
            >
              <Icon
                name="inventory"
                className="mb-6 h-10 w-10 text-primary"
              />
              <h2 className="font-headline text-2xl mb-2 group-hover:text-primary transition-colors">
                Produse
              </h2>
              <p className="font-label text-[11px] uppercase tracking-widest text-outline">
                Gestionează catalogul de produse
              </p>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-surface-container-lowest p-12 group hover:shadow-lg transition-all duration-300"
            >
              <Icon
                name="receipt"
                className="mb-6 h-10 w-10 text-primary"
              />
              <h2 className="font-headline text-2xl mb-2 group-hover:text-primary transition-colors">
                Comenzi
              </h2>
              <p className="font-label text-[11px] uppercase tracking-widest text-outline">
                Vizualizează și gestionează comenzile
              </p>
            </Link>

            <div className="bg-surface-container-lowest p-12 opacity-50">
              <Icon name="settings" className="mb-6 h-10 w-10 text-outline" />
              <h2 className="font-headline text-2xl mb-2">Setări</h2>
              <p className="font-label text-[11px] uppercase tracking-widest text-outline">
                Configurări magazin (în curând)
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
