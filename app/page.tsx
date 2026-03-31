"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/components/useScrollReveal";
import { images } from "@/lib/constants";
import Icon from "@/components/Icon";
import { useToast } from "@/components/ToastProvider";
import { SITE_WORDMARK } from "@/lib/site";

export default function Home() {
  const containerRef = useScrollReveal();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed || newsletterLoading) return;

    setNewsletterLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu am putut trimite abonarea.");
      }

      setNewsletterSent(true);
      setEmail("");
      setAgreed(false);
      showToast({
        title: "Abonare trimisa",
        description: "Am trimis adresa ta catre inbox-ul Red Atelier.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Abonare indisponibila",
        description:
          error instanceof Error
            ? error.message
            : "Incearca din nou in cateva momente.",
        tone: "error",
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div ref={containerRef}>
      <Header />

      <main className="pt-20">
        <section className="relative h-[921px] w-full overflow-hidden bg-surface-container">
          <div className="carousel-track absolute inset-0">
            <div className="relative h-full min-w-full">
              <Image
                alt="Fotografie editoriala de moda cu contrast ridicat"
                className="animate-[zoom_20s_infinite_alternate] object-cover scale-105"
                fill
                priority
                sizes="100vw"
                src={images.hero}
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
          <div className="reveal active absolute bottom-24 left-12 z-10 max-w-4xl md:left-24">
            <h1 className="font-headline text-6xl leading-[0.9] tracking-tighter text-white mix-blend-difference md:text-9xl">
              Dialogul
              <br />
              Tacut
            </h1>
            <p className="reveal reveal-delay-1 active mt-8 max-w-md font-label text-sm uppercase tracking-[0.3em] text-white/80">
              Colectia Red Atelier 2026 - o selectie de seara cu forme clare si
              prezenta puternica.
            </p>
            <div className="reveal reveal-delay-2 active mt-12">
              <a
                href="/shop"
                className="btn-hover-effect inline-block bg-primary px-12 py-5 font-label text-xs uppercase tracking-widest text-white shadow-lg transition-all duration-500 hover:-translate-y-1 hover:bg-primary-container hover:shadow-primary/40"
              >
                Exploreaza colectia
              </a>
            </div>
          </div>
          <div className="absolute bottom-12 right-12 flex gap-4">
            <div className="relative h-1 w-12 overflow-hidden bg-white/20">
              <div className="absolute inset-0 origin-left animate-[progress_5s_linear_infinite] bg-white" />
            </div>
            <div className="h-1 w-12 bg-white/20" />
            <div className="h-1 w-12 bg-white/20" />
          </div>
        </section>

        <section className="overflow-hidden border-y border-outline-variant/20 bg-surface py-12">
          <div className="animate-marquee">
            <div className="flex items-center gap-24 pr-24">
              <span className="font-headline text-4xl italic text-on-surface/40">
                Red Atelier
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Rochii de seara
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Editie curata
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Sandale statement
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Accente luxury
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Seturi pentru evenimente
              </span>
            </div>
            <div className="flex items-center gap-24 pr-24">
              <span className="font-headline text-4xl italic text-on-surface/40">
                Red Atelier
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Rochii de seara
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Editie curata
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Sandale statement
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Accente luxury
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Seturi pentru evenimente
              </span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-12 px-12 py-32 md:grid-cols-12 md:gap-24 md:px-24">
          <div className="reveal group relative md:col-span-7">
            <div className="relative h-[700px] overflow-hidden">
              <Image
                alt="Plan editorial cu textura premium si croiala minimalista"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                src={images.editorial}
              />
            </div>
            <div className="reveal reveal-delay-2 absolute -right-8 -bottom-8 max-w-xs border-l-4 border-primary-fixed bg-surface-container-lowest p-8 shadow-xl">
              <h3 className="mb-4 font-headline text-2xl italic">
                Silueta sculptata
              </h3>
              <p className="mb-6 font-body text-sm leading-relaxed text-secondary">
                Piese create pentru aparitii curate, elegante si memorabile,
                selectate special pentru tinute de seara.
              </p>
              <span className="inline-block bg-primary-fixed px-4 py-1 font-label text-xs uppercase tracking-widest text-white opacity-95">
                Selecție nouă
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-24 md:col-span-5 md:pt-48">
            <div className="reveal flex flex-col gap-6">
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary-fixed">
                Focus editorial
              </span>
              <h2 className="font-headline text-5xl leading-tight">
                Tonuri mate &
                <br />
                linii clare
              </h2>
              <p className="max-w-md font-body text-lg text-secondary">
                Selecția noastră pune accent pe piese ușor de recunoscut, cu nume
                curate și prezentare clară, pentru o navigare mai ușoară în shop.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <Link
                href="/shop"
                className="group cursor-pointer reveal reveal-delay-1"
              >
                <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-surface-container-low">
                  <Image
                    alt="Selectie de atelier"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 768px) 22vw, 50vw"
                    src={images.featuredPants}
                  />
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label text-[10px] uppercase tracking-widest transition-colors duration-300 group-hover:text-primary-fixed">
                    Selectie Atelier
                  </span>
                  <span className="font-label text-[10px] font-bold text-primary-fixed">
                    Shop now
                  </span>
                </div>
              </Link>
              <Link
                href="/shop"
                className="group cursor-pointer reveal reveal-delay-2"
              >
                <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-surface-container-low">
                  <Image
                    alt="Accente pentru seara"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 768px) 22vw, 50vw"
                    src={images.featuredShoes}
                  />
                  <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/5" />
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-label text-[10px] uppercase tracking-widest transition-colors duration-300 group-hover:text-primary-fixed">
                    Evening accents
                  </span>
                  <span className="font-label text-[10px] font-bold text-primary-fixed">
                    Shop now
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full overflow-hidden bg-neutral-900 px-12 py-48 text-center text-neutral-50 md:px-24">
          <div className="reveal">
            <h2 className="mx-auto mb-12 max-w-5xl font-headline text-4xl italic leading-tight transition-all duration-1000 md:text-7xl">
              &ldquo;Eleganta devine memorabila atunci cand fiecare detaliu este
              simplu, clar si bine ales.&rdquo;
            </h2>
            <div className="reveal reveal-delay-2 flex items-center justify-center gap-8">
              <div className="h-px w-24 bg-neutral-700" />
              <span className="font-label text-xs uppercase tracking-[0.5em] text-primary-fixed">
                Filosofia {SITE_WORDMARK}
              </span>
              <div className="h-px w-24 bg-neutral-700" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 items-center gap-24 px-12 py-32 md:grid-cols-2 md:px-24">
          <div className="reveal">
            <div className="group relative aspect-square overflow-hidden">
              <Image
                alt="Accesorii si selectie premium"
                className="object-cover grayscale transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                src={images.newsletter}
              />
            </div>
          </div>
          <div className="reveal reveal-delay-1 flex flex-col gap-12">
            <h3 className="font-headline text-5xl">Rămâi în focus.</h3>
            <p className="max-w-md font-body text-lg text-secondary">
              Lasă-ne adresa ta și îți trimitem lansări noi, selecții speciale și
              noutăți Red Atelier direct pe email.
            </p>
            {newsletterSent ? (
              <div className="bg-surface-container p-8">
                <Icon name="mail-check" className="mb-4 h-10 w-10 text-primary" />
                <p className="font-body text-secondary">
                  Multumim! Adresa ta a fost trimisa catre inbox-ul nostru.
                </p>
              </div>
            ) : (
              <form className="flex flex-col gap-8" onSubmit={handleNewsletter}>
                <div className="group relative">
                  <input
                    className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-label text-xs tracking-widest transition-all duration-500 placeholder:text-neutral-400 focus:border-primary focus:ring-0"
                    placeholder="ADRESA TA DE EMAIL"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    className="absolute right-0 bottom-4 transition-transform duration-300 hover:translate-x-2 disabled:opacity-50"
                    type="submit"
                    disabled={newsletterLoading}
                  >
                    <Icon name="arrow-right" className="h-5 w-5 text-primary" />
                  </button>
                  <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-primary transition-all duration-700 group-focus-within:w-full" />
                </div>
                <label className="group flex cursor-pointer items-center gap-3">
                  <input
                    className="h-4 w-4 rounded-none border-outline-variant text-primary transition-all focus:ring-primary"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="font-label text-[10px] uppercase leading-none tracking-widest text-neutral-500 transition-colors duration-300 group-hover:text-primary">
                    Sunt de acord cu politica de confidentialitate
                  </span>
                </label>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
