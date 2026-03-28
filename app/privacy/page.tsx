import EditorialPage from "@/components/EditorialPage";

export default function PrivacyPage() {
  return (
    <EditorialPage
      eyebrow="Legal"
      title="Politica de Confidențialitate"
      intro="Colectăm doar datele necesare pentru a procesa comenzile, a menține conturile utilizatorilor și a răspunde solicitărilor trimise prin site."
      sections={[
        {
          title: "Date colectate",
          body: [
            "Putem procesa numele, adresa de email, adresa de livrare, istoricul comenzilor și informațiile transmise prin formularul de contact.",
            "Datele de plată nu sunt stocate pe serverele RED STUDIO. Acestea sunt procesate exclusiv prin Stripe.",
          ],
        },
        {
          title: "Utilizarea datelor",
          body: [
            "Folosim datele pentru autentificare, livrarea comenzilor, suport post-vânzare și comunicări tranzacționale precum confirmările de comandă.",
          ],
        },
        {
          title: "Drepturile tale",
          body: [
            "Poți solicita actualizarea sau ștergerea datelor personale, în limita obligațiilor legale privind evidența contabilă și fiscală.",
          ],
        },
      ]}
    />
  );
}
