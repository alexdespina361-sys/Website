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
      <main className="pt-20 min-h-screen">
        <section className="px-12 md:px-24 py-32">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <h2 className="font-headline text-2xl mb-8">Contul Meu</h2>
              <nav className="space-y-4">
                <a className="block font-label text-[11px] uppercase tracking-widest text-outline hover:text-primary transition-colors pl-4" href="/account">
                  Setări
                </a>
                <a className="block font-label text-[11px] uppercase tracking-widest text-primary border-l-2 border-primary pl-4" href="/account/orders">
                  Comenzi
                </a>
              </nav>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <h3 className="font-headline text-3xl mb-12">Comenzile Mele</h3>
              {orders.length === 0 ? (
                <AccountOrdersEmptyState />
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-surface-container-lowest p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <h4 className="font-headline text-lg italic">
                          {order.items?.[0]?.product_name || "Comandă"}
                          {order.items?.length > 1 ? ` +${order.items.length - 1} alte` : ""}
                        </h4>
                        <p className="font-label text-[10px] uppercase tracking-widest text-outline mt-1">
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
                                ? "În Tranzit"
                                : "Procesare"}
                          </span>
                          <span className="mt-2 block font-label text-[10px] uppercase tracking-widest text-outline">
                            {order.payment_method === "cash_on_delivery"
                              ? "Plată la livrare"
                              : "Plătit cu cardul"}
                          </span>
                        </div>
                        <span className="font-label text-sm text-primary font-bold">
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
