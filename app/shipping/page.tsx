import EditorialPage from "@/components/EditorialPage";
import { CONTACT_EMAIL, SITE_WORDMARK } from "@/lib/site";

export default function ShippingPage() {
  return (
    <EditorialPage
      eyebrow="Operatiuni"
      title="Livrare si retur"
      intro={`Comenzile ${SITE_WORDMARK} sunt procesate manual pentru a pastra controlul asupra calitatii, ambalarii si acuratetei fiecarei variante trimise.`}
      sections={[
        {
          title: "Livrare",
          body: [
            "Comenzile confirmate sunt expediate in 1-3 zile lucratoare. Vei primi notificari prin email dupa confirmarea comenzii si dupa expediere.",
            "Costul final de livrare este comunicat inainte de expediere, iar plata se face exclusiv ramburs, la primirea coletului.",
          ],
        },
        {
          title: "Retur",
          body: [
            "Produsele pot fi returnate in termen de 30 de zile daca sunt in stare impecabila, cu etichetele si ambalajele originale.",
            `Pentru initierea unui retur, contacteaza echipa ${SITE_WORDMARK} la ${CONTACT_EMAIL} si include numarul comenzii.`,
          ],
        },
        {
          title: "Produse speciale",
          body: [
            "Piesele produse la comanda sau personalizate pot avea conditii distincte de retur, comunicate explicit inainte de confirmarea comenzii.",
          ],
        },
      ]}
    />
  );
}
