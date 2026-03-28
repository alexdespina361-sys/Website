import EditorialPage from "@/components/EditorialPage";

export default function ShippingPage() {
  return (
    <EditorialPage
      eyebrow="Operațiuni"
      title="Livrare și Retur"
      intro="Comenzile RED STUDIO sunt procesate manual pentru a păstra controlul asupra calității, ambalării și acurateței fiecărei variante trimise."
      sections={[
        {
          title: "Livrare",
          body: [
            "Comenzile confirmate sunt expediate în 1-3 zile lucrătoare. Vei primi notificări prin email după confirmarea plății și după expediere.",
            "Costul final de livrare este afișat în Stripe Checkout înainte de confirmarea plății.",
          ],
        },
        {
          title: "Retur",
          body: [
            "Produsele pot fi returnate în termen de 30 de zile dacă sunt în stare impecabilă, cu etichetele și ambalajele originale.",
            "Pentru inițierea unui retur, contactează echipa RED STUDIO folosind adresa de email din pagina de contact și include numărul comenzii.",
          ],
        },
        {
          title: "Produse speciale",
          body: [
            "Piesele produse la comandă sau personalizate pot avea condiții distincte de retur, comunicate explicit înaintea plății.",
          ],
        },
      ]}
    />
  );
}
