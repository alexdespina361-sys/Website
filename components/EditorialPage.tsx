import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_WORDMARK } from "@/lib/site";

interface EditorialSection {
  title: string;
  body: string[];
}

export default function EditorialPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: EditorialSection[];
}) {
  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="border-b border-outline-variant/20 bg-surface-container-low px-12 py-24 md:px-24 md:py-32">
          <span className="font-label text-[10px] uppercase tracking-[0.4em] text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-6 max-w-4xl font-headline text-5xl leading-tight md:text-7xl">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-secondary">
            {intro}
          </p>
        </section>

        <section className="px-12 py-20 md:px-24 md:py-24">
          <div className="grid gap-16 md:grid-cols-[220px_minmax(0,1fr)]">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-outline">
                {SITE_WORDMARK}
              </p>
            </div>
            <div className="space-y-16">
              {sections.map((section) => (
                <section key={section.title} className="border-t border-outline-variant/20 pt-8">
                  <h2 className="font-headline text-3xl italic">{section.title}</h2>
                  <div className="mt-6 space-y-4">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-3xl font-body leading-relaxed text-secondary"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
