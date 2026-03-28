import EditorialPage from "@/components/EditorialPage";

export default function TermsPage() {
  return (
    <EditorialPage
      eyebrow="Legal"
      title="Termeni și Condiții"
      intro="Acești termeni descriu modul în care poți utiliza magazinul RED STUDIO, cum plasăm comenzile și ce responsabilități există de ambele părți."
      sections={[
        {
          title: "Comenzi",
          body: [
            "Prin plasarea unei comenzi confirmi că informațiile furnizate sunt corecte și complete. RED STUDIO poate contacta clientul pentru clarificări înainte de expediere.",
            "Disponibilitatea produselor depinde de stocul variantelor. În situația unei erori de inventar, vei fi notificat și plata va fi rambursată conform procesatorului de plăți.",
          ],
        },
        {
          title: "Prețuri și Plăți",
          body: [
            "Toate prețurile sunt afișate în RON și includ taxele aplicabile, dacă nu este menționat altfel. Plata este procesată prin Stripe Checkout.",
            "Promoțiile, prețurile comparative și disponibilitatea pot fi actualizate fără notificare prealabilă, însă comenzile confirmate păstrează totalul afișat la checkout.",
          ],
        },
        {
          title: "Limitarea Răspunderii",
          body: [
            "RED STUDIO nu răspunde pentru întârzieri cauzate de transportatori, întreruperi ale furnizorilor terți sau evenimente independente de controlul nostru direct.",
          ],
        },
      ]}
    />
  );
}
