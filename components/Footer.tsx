"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useToast } from "@/components/ToastProvider";
import { SITE_DESCRIPTION, SITE_WORDMARK } from "@/lib/site";

export default function Footer() {
  const { showToast } = useToast();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      showToast({
        title: "Link copiat",
        description: "Adresa site-ului a fost copiata in clipboard.",
        tone: "success",
      });
    } catch {
      showToast({
        title: "Copiere esuata",
        description: "Nu am putut copia linkul in clipboard.",
        tone: "error",
      });
    }
  };

  return (
    <footer className="w-full border-t border-black/5 bg-[#f3f3f4]">
      <div className="grid w-full grid-cols-1 gap-8 px-12 py-16 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="font-serif text-lg font-black uppercase tracking-tighter text-[#1a1c1c]">
            {SITE_WORDMARK}
          </div>
          <p className="font-label text-[11px] uppercase leading-loose tracking-wider text-[#1a1c1c] opacity-60">
            {SITE_DESCRIPTION}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="font-label text-[11px] font-bold uppercase tracking-wider text-[#1a1c1c]">
              Navigare
            </h4>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 transition-all duration-300 hover:text-primary hover:opacity-100"
              href="/shop"
            >
              Colectii
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 transition-all duration-300 hover:text-primary hover:opacity-100"
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
              className="font-label text-[11px] uppercase tracking-wider opacity-60 underline underline-offset-4 transition-all duration-300 hover:opacity-100"
              href="/terms"
            >
              Termeni si Conditii
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 transition-all duration-300 hover:opacity-100"
              href="/privacy"
            >
              Confidentialitate
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 transition-all duration-300 hover:opacity-100"
              href="/contact"
            >
              Contact
            </Link>
            <Link
              className="font-label text-[11px] uppercase tracking-wider opacity-60 transition-all duration-300 hover:opacity-100"
              href="/shipping"
            >
              Livrare
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-black/5 px-12 py-8">
        <div className="font-label text-[11px] uppercase tracking-wider text-[#1a1c1c] opacity-60">
          © 2026 {SITE_WORDMARK}. Toate drepturile rezervate.
        </div>
        <div className="flex gap-8">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Copiaza linkul site-ului"
            className="opacity-60 transition-all duration-300 hover:text-primary hover:opacity-100"
          >
            <Icon name="share" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
