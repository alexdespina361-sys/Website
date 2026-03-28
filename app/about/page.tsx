import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { images } from "@/lib/constants";

export default function AboutPage() {
  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero */}
        <section className="relative h-[600px] w-full overflow-hidden bg-surface-container">
          <Image
            alt="Despre RED STUDIO"
            className="object-cover"
            fill
            priority
            sizes="100vw"
            src={images.hero}
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute bottom-24 left-12 md:left-24 max-w-4xl">
            <h1 className="font-headline text-5xl md:text-7xl leading-[0.9] text-white tracking-tighter">
              Despre Noi
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="px-12 md:px-24 py-32 grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
              Filozofia Noastră
            </span>
            <h2 className="font-headline text-4xl mt-6 mb-8">
              O Curatorie de<br />Obiecte și Experiențe
            </h2>
            <p className="font-body text-lg text-secondary leading-relaxed">
              RED STUDIO nu este un magazin de modă obișnuit. Este un spațiu
              dedicat conservării și colectării pieselor vestimentare rare și a
              capodoperelor contemporane. Fiecare articol din colecția noastră
              este ales cu grijă pentru a reflecta echilibrul perfect între
              tradiție și inovație.
            </p>
          </div>
          <div className="flex flex-col gap-12">
            <div>
              <h3 className="font-headline text-2xl italic mb-4">
                Misiunea Noastră
              </h3>
              <p className="font-body text-secondary leading-relaxed">
                Să oferim minimalistului modern acces la piese care transcend
                tendințele sezoniere, obiecte care vor rămâne relevante
                zeci de ani.
              </p>
            </div>
            <div>
              <h3 className="font-headline text-2xl italic mb-4">
                Viziunea Noastră
              </h3>
              <p className="font-body text-secondary leading-relaxed">
                Să devenim punctul de referință pentru moda de lux sustenabilă
                în România și Europa de Est, demonstrând că eleganța autentică
                nu are nevoie de compromisuri.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
