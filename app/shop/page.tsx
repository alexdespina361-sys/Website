import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopContent from "@/components/ShopContent";
import { getProducts } from "@/lib/products";
import { formatProductForDisplay } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();
  const displayProducts = products.map((p) => ({
    ...formatProductForDisplay(p),
    category: p.category || "",
    season: p.season || "",
  }));

  return (
    <div>
      <Header />
      <ShopContent products={displayProducts} />
      <Footer />
    </div>
  );
}
