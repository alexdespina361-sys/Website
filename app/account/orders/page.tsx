import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import { formatPriceDetailed } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AccountOrdersEmptyState from "@/components/AccountOrdersEmptyState";

export const dynamic = "force-dynamic";

async function getUserOrders() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return { orders: orders || [], user };
}

export default async function AccountOrdersPage() {
  const { orders } = await getUserOrders();

  return (
    <div>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="px-12 py-32 md:px-24">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-4">
            <div className="md:col-span-1">
              <h2 className="mb-8 font-headline text-2xl">Contul meu</h2>
              <nav className="space-y-4">
                <a
                  className="block pl-4 font-label text-[11px] uppercase tracking-widest text-outline transition-colors hover:text-primary"
                  href="/account"
                >
                  Setari
                </a>
                <a
                  className="block border-l-2 border-primary pl-4 font-label text-[11px] uppercase tracking-widest text-primary"
                  href="/account/orders"
                >
                  Comenzi
                </a>
              </nav>
            </div>

            <div className="md:col-span-3">
              <h3 className="mb-12 font-headline text-3xl">Comenzile mele</h3>
              {orders.length === 0 ? (
                <AccountOrdersEmptyState />
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col items-start justify-between gap-4 bg-surface-container-lowest p-8 md:flex-row md:items-center"
                    >
                      <div>
                        <h4 className="font-headline text-lg italic">
                          {order.items?.[0]?.product_name || "Comanda"}
                          {order.items?.length > 1
                            ? ` +${order.items.length - 1} alte`
                            : ""}
                        </h4>
                        <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-outline">
                          Comanda #{order.id.slice(0, 8)} ·{" "}
                          {new Date(order.created_at).toLocaleDateString("ro-RO", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <span
                            className={`block font-label text-[10px] uppercase tracking-widest ${
                              order.fulfillment_status === "fulfilled"
                                ? "text-primary"
                                : "text-outline"
                            }`}
                          >
                            {order.fulfillment_status === "fulfilled"
                              ? "Livrat"
                              : order.fulfillment_status === "shipped"
                                ? "In tranzit"
                                : "Procesare"}
                          </span>
                          <span className="mt-2 block font-label text-[10px] uppercase tracking-widest text-outline">
                            {order.payment_method === "cash_on_delivery"
                              ? "Plata la livrare"
                              : "Comanda confirmata"}
                          </span>
                        </div>
                        <span className="font-label text-sm font-bold text-primary">
                          {formatPriceDetailed(order.total_cents)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
