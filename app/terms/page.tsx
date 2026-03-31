import EditorialPage from "@/components/EditorialPage";
import { SITE_WORDMARK } from "@/lib/site";

export default function TermsPage() {
  return (
    <EditorialPage
      eyebrow="Legal"
      title="Termeni si conditii"
      intro={`Acesti termeni descriu modul in care poti utiliza magazinul ${SITE_WORDMARK}, cum plasam comenzile si ce responsabilitati exista de ambele parti.`}
      sections={[
        {
          title: "Comenzi",
          body: [
            `Prin plasarea unei comenzi confirmi ca informatiile furnizate sunt corecte si complete. ${SITE_WORDMARK} poate contacta clientul pentru clarificari inainte de expediere.`,
            "Disponibilitatea produselor depinde de stocul variantelor. In situatia unei erori de inventar, vei fi notificat inainte de expediere pentru confirmare sau anulare.",
          ],
        },
        {
          title: "Preturi si plati",
          body: [
            "Toate preturile sunt afisate in RON si includ taxele aplicabile, daca nu este mentionat altfel. Plata se face exclusiv ramburs, la livrare.",
            "Promotiile, preturile comparative si disponibilitatea pot fi actualizate fara notificare prealabila, insa comenzile confirmate pastreaza totalul comunicat in momentul confirmarii.",
          ],
        },
        {
          title: "Limitarea raspunderii",
          body: [
            `${SITE_WORDMARK} nu raspunde pentru intarzieri cauzate de transportatori, intreruperi ale furnizorilor terti sau evenimente independente de controlul nostru direct.`,
          ],
        },
      ]}
    />
  );
}
