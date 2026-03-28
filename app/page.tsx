"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/components/useScrollReveal";
import { images } from "@/lib/constants";
import Icon from "@/components/Icon";

export default function Home() {
  const containerRef = useScrollReveal();
  const [email, setEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !agreed) return;
    setNewsletterSent(true);
  };

  return (
    <div ref={containerRef}>
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[921px] w-full overflow-hidden bg-surface-container">
          <div className="absolute inset-0 carousel-track">
            <div className="min-w-full h-full relative">
              <Image
                alt="Fotografie editorială de modă avant-gardistă cu contrast ridicat"
                className="object-cover scale-105 animate-[zoom_20s_infinite_alternate]"
                fill
                priority
                sizes="100vw"
                src={images.hero}
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
          <div className="absolute bottom-24 left-12 md:left-24 max-w-4xl z-10 reveal active">
            <h1 className="font-headline text-6xl md:text-9xl leading-[0.9] text-white tracking-tighter mix-blend-difference">
              Dialogul <br /> Tăcut
            </h1>
            <p className="mt-8 font-label text-sm uppercase tracking-[0.3em] text-white/80 max-w-md reveal reveal-delay-1 active">
              Colecția Toamnă/Iarnă 2024 — O explorare a formei și a vidului.
            </p>
            <div className="mt-12 reveal reveal-delay-2 active">
              <a
                href="/shop"
                className="inline-block bg-primary text-white px-12 py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 shadow-lg hover:shadow-primary/40 hover:-translate-y-1 btn-hover-effect"
              >
                Explorează Colecția
              </a>
            </div>
          </div>
          <div className="absolute bottom-12 right-12 flex gap-4">
            <div className="h-1 w-12 bg-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-white w-full origin-left animate-[progress_5s_linear_infinite]"></div>
            </div>
            <div className="h-1 w-12 bg-white/20"></div>
            <div className="h-1 w-12 bg-white/20"></div>
          </div>
        </section>

        {/* Marquee */}
        <section className="py-12 bg-surface overflow-hidden border-y border-outline-variant/20">
          <div className="animate-marquee">
            <div className="flex gap-24 items-center pr-24">
              <span className="font-headline text-4xl italic text-on-surface/40">
                Noul Minimal
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Palton din Lână Structurată
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Ediția 01
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Încălțăminte Arhitecturală
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Serie Limitată
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Strat din Organza de Mătase
              </span>
            </div>
            <div className="flex gap-24 items-center pr-24">
              <span className="font-headline text-4xl italic text-on-surface/40">
                Noul Minimal
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Palton din Lână Structurată
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Ediția 01
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Încălțăminte Arhitecturală
              </span>
              <span className="font-headline text-4xl italic text-on-surface/40">
                Serie Limitată
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-on-surface">
                Strat din Organza de Mătase
              </span>
            </div>
          </div>
        </section>

        {/* Asymmetrical Section */}
        <section className="px-12 md:px-24 py-32 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 items-start">
          <div className="md:col-span-7 relative group reveal">
            <div className="relative h-[700px] overflow-hidden">
              <Image
                alt="Plan apropiat editorial cu material de înaltă calitate și croială minimalistă"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                src={images.editorial}
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-surface-container-lowest p-8 max-w-xs shadow-xl border-l-4 border-primary-fixed reveal reveal-delay-2">
              <h3 className="font-headline text-2xl italic mb-4">
                Silueta Sculptată
              </h3>
              <p className="font-body text-sm text-secondary leading-relaxed mb-6">
                O redefinire a îmbrăcămintei exterioare tradiționale, punând
                accent pe linii ascuțite și margini brute.
              </p>
              <span className="inline-block bg-primary-fixed text-white px-4 py-1 text-xs font-label uppercase tracking-widest opacity-95">
                Arhivă: 2.100 RON
              </span>
            </div>
          </div>
          <div className="md:col-span-5 md:pt-48 flex flex-col gap-24">
            <div className="flex flex-col gap-6 reveal">
              <span className="font-label text-xs uppercase tracking-[0.4em] text-primary-fixed">
                Focus Editorial
              </span>
              <h2 className="font-headline text-5xl leading-tight">
                Tonuri Mate &amp;
                <br />
                Forme de Beton
              </h2>
              <p className="font-body text-lg text-secondary max-w-md">
                Selecția noastră de arhivă prezintă piese alese manual din
                sezoanele anterioare, curatoriate pentru o relevanță atemporală.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <Link
                href="/shop/pantalonul-studio"
                className="group cursor-pointer reveal reveal-delay-1"
              >
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-4 relative">
                  <Image
                    alt="Articol vestimentar minimalist pe fundal neutru"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 768px) 22vw, 50vw"
                    src={images.featuredPants}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-label text-[10px] uppercase tracking-widest group-hover:text-primary-fixed transition-colors duration-300">
                    Pantaloni In
                  </span>
                  <span className="text-primary-fixed font-label text-[10px] font-bold">
                    925 RON
                  </span>
                </div>
              </Link>
              <Link
                href="/shop/esarfa-horizon"
                className="group cursor-pointer reveal reveal-delay-2"
              >
                <div className="aspect-[3/4] overflow-hidden bg-surface-container-low mb-4 relative">
                  <Image
                    alt="Încălțăminte de lux din piele într-un cadru minimalist"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 768px) 22vw, 50vw"
                    src={images.featuredShoes}
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                </div>
                <div className="flex justify-between items-start">
                  <span className="font-label text-[10px] uppercase tracking-widest group-hover:text-primary-fixed transition-colors duration-300">
                    Sabot Studded
                  </span>
                  <span className="text-primary-fixed font-label text-[10px] font-bold">
                    1.450 RON
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Full-Width Statement */}
        <section className="w-full bg-neutral-900 text-neutral-50 py-48 px-12 md:px-24 text-center overflow-hidden">
          <div className="reveal">
            <h2 className="font-headline text-4xl md:text-7xl mb-12 italic max-w-5xl mx-auto leading-tight transition-all duration-1000">
              &ldquo;Moda este armura pentru a supraviețui realității vieții de
              zi cu zi.&rdquo;
            </h2>
            <div className="flex justify-center items-center gap-8 reveal reveal-delay-2">
              <div className="h-px w-24 bg-neutral-700"></div>
              <span className="font-label text-xs uppercase tracking-[0.5em] text-primary-fixed">
                Filozofia RED STUDIO
              </span>
              <div className="h-px w-24 bg-neutral-700"></div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="px-12 md:px-24 py-32 grid grid-cols-1 md:grid-cols-2 items-center gap-24">
          <div className="reveal">
            <div className="relative aspect-square overflow-hidden group">
              <Image
                alt="Plan apropiat al unei geanți de designer și accesorii"
                className="object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                src={images.newsletter}
              />
            </div>
          </div>
          <div className="flex flex-col gap-12 reveal reveal-delay-1">
            <h3 className="font-headline text-5xl">Rămâi în focus.</h3>
            <p className="font-body text-secondary text-lg max-w-md">
              Alătură-te cercului nostru restrâns pentru acces exclusiv la
              lansări editoriale, vânzări private din arhivă și perspective
              culturale.
            </p>
            {newsletterSent ? (
              <div className="bg-surface-container p-8">
                <Icon
                  name="mail-check"
                  className="mb-4 h-10 w-10 text-primary"
                />
                <p className="font-body text-secondary">
                  Mulțumim! Vei primi noutățile noastre exclusive.
                </p>
              </div>
            ) : (
              <form
                className="flex flex-col gap-8"
                onSubmit={handleNewsletter}
              >
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-label text-xs tracking-widest focus:ring-0 focus:border-primary placeholder:text-neutral-400 transition-all duration-500"
                    placeholder="ADRESA TA DE EMAIL"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    className="absolute right-0 bottom-4 hover:translate-x-2 transition-transform duration-300"
                    type="submit"
                  >
                    <Icon name="arrow-right" className="h-5 w-5 text-primary" />
                  </button>
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-focus-within:w-full transition-all duration-700"></div>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    className="w-4 h-4 border-outline-variant text-primary focus:ring-primary rounded-none transition-all"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="font-label text-[10px] text-neutral-500 uppercase tracking-widest leading-none group-hover:text-primary transition-colors duration-300">
                    Sunt de acord cu politica de confidențialitate
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
