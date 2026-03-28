"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useToast } from "@/components/ToastProvider";

export default function Footer() {
  const { showToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      showToast({
        title: "Link copiat",
        description: "Adresa site-ului a fost copiată în clipboard.",
        tone: "success",
      });
    } catch {
      showToast({
        title: "Copiere eșuată",
        description: "Nu am putut copia linkul în clipboard.",
        tone: "error",
      });
    }
  };

  return (
    <footer className="w-full border-t border-black/5 bg-[#f3f3f4]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12 py-16 w-full">
        <div className="flex flex-col gap-6">
          <div className="font-serif text-lg text-[#1a1c1c] uppercase tracking-tighter font-black">
            RED STUDIO
          </div>
          <p className="font-label text-[11px] uppercase tracking-wider leading-loose opacity-60 text-[#1a1c1c]">
            O curatorie de obiecte și experiențe pentru minimalistul modern.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="font-label text-[11px] font-bold uppercase tracking-wider text-[#1a1c1c]">
              Navigare
            </h4>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300"
              href="/shop"
            >
              Colecții
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300"
              href="/about"
            >
              Editorial
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-label text-[11px] font-bold uppercase tracking-wider text-[#1a1c1c]">
              Legal
            </h4>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-all duration-300 underline underline-offset-4"
              href="/terms"
            >
              Termeni și Condiții
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-all duration-300"
              href="/privacy"
            >
              Confidențialitate
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-all duration-300"
              href="/contact"
            >
              Contact
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 hover:opacity-100 transition-all duration-300"
              href="/shipping"
            >
              Livrare
            </Link>
          </div>
        </div>
      </div>
      <div className="px-12 py-8 border-t border-black/5 flex justify-between items-center">
        <div className="font-label text-[11px] uppercase tracking-wider text-[#1a1c1c] opacity-60">
          © 2026 RED STUDIO. Toate drepturile rezervate.
        </div>
        <div className="flex gap-8">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Copiază linkul site-ului"
            className="opacity-60 transition-all duration-300 hover:text-primary hover:opacity-100"
          >
            <Icon name="share" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
