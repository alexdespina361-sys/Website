import EditorialPage from "@/components/EditorialPage";
import { SITE_WORDMARK } from "@/lib/site";

export default function PrivacyPage() {
  return (
    <EditorialPage
      eyebrow="Legal"
      title="Politica de Confidentialitate"
      intro="Colectam doar datele necesare pentru a procesa comenzile, a mentine conturile utilizatorilor si a raspunde solicitarilor trimise prin site."
      sections={[
        {
          title: "Date colectate",
          body: [
            "Putem procesa numele, adresa de email, adresa de livrare, istoricul comenzilor si informatiile transmise prin formularul de contact.",
            `${SITE_WORDMARK} nu solicita si nu stocheaza date de card, deoarece magazinul foloseste exclusiv confirmarea comenzii cu plata la livrare.`,
          ],
        },
        {
          title: "Utilizarea datelor",
          body: [
            "Folosim datele pentru autentificare, livrarea comenzilor, suport post-vanzare si comunicari tranzactionale precum confirmarile de comanda.",
          ],
        },
        {
          title: "Drepturile tale",
          body: [
            "Poti solicita actualizarea sau stergerea datelor personale, in limita obligatiilor legale privind evidenta contabila si fiscala.",
          ],
        },
      ]}
    />
  );
}
