import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetailClient from "@/components/ProductDetailClient";
import { getProductBySlug } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-headline text-4xl mb-4">Produs negăsit</h1>
            <Link
              href="/shop"
              className="font-label text-xs uppercase tracking-widest text-primary hover:underline"
            >
              Înapoi la Colecții
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </div>
  );
}
