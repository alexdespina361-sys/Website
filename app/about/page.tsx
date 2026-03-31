import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { images } from "@/lib/constants";
import { SITE_WORDMARK } from "@/lib/site";

export default function AboutPage() {
  return (
    <div>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="relative h-[600px] w-full overflow-hidden bg-surface-container">
          <Image
            alt={`Despre ${SITE_WORDMARK}`}
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={images.hero}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-24 left-12 max-w-4xl md:left-24">
            <h1 className="font-headline text-5xl leading-[0.9] tracking-tighter text-white md:text-7xl">
              Despre noi
            </h1>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-24 px-12 py-32 md:grid-cols-2 md:px-24">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
              Filozofia noastra
            </span>
            <h2 className="mt-6 mb-8 font-headline text-4xl">
              O curatorie de
              <br />
              obiecte si experiente
            </h2>
            <p className="font-body text-lg leading-relaxed text-secondary">
              {SITE_WORDMARK} nu este un magazin de moda obisnuit. Este un spatiu
              dedicat selectiei unor piese cu prezenta puternica, elegante si
              atent alese. Fiecare articol din colectia noastra este selectat
              pentru a pastra echilibrul dintre rafinament, feminitate si impact
              vizual.
            </p>
          </div>
          <div className="flex flex-col gap-12">
            <div>
              <h3 className="mb-4 font-headline text-2xl italic">
                Misiunea noastra
              </h3>
              <p className="font-body leading-relaxed text-secondary">
                Sa oferim acces rapid la piese care arata spectaculos, se simt
                premium si functioneaza usor in garderoba unei femei moderne.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-headline text-2xl italic">
                Viziunea noastra
              </h3>
              <p className="font-body leading-relaxed text-secondary">
                Sa construim un reper local pentru selectie fashion cu accent pe
                styling, prezentare curata si o experienta de cumparare simpla,
                directa si memorabila.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
