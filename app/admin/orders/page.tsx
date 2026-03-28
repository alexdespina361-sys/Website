"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPriceDetailed } from "@/lib/format";
import type { Order, OrderItem } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";
import Icon from "@/components/Icon";

interface OrderWithItems extends Order {
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Nu am putut încărca comenzile.");
      }

      setOrders(data);
    } catch (error) {
      showToast({
        title: "Eroare admin",
        description:
          error instanceof Error ? error.message : "Nu am putut încărca comenzile.",
        tone: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Nu am putut actualiza statusul.");
      }

      await fetchOrders();
      showToast({
        title: "Status actualizat",
        description: "Comanda a fost actualizată.",
        tone: "success",
      });
    } catch (error) {
      showToast({
        title: "Actualizare eșuată",
        description:
          error instanceof Error ? error.message : "Nu am putut actualiza statusul.",
        tone: "error",
      });
    }
  };

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="px-12 md:px-24 py-32">
          <div className="mb-12">
            <Link
              href="/admin"
              className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors mb-2 block"
            >
              ← Înapoi la Dashboard
            </Link>
            <h1 className="font-headline text-5xl">Comenzi</h1>
          </div>

          {loading ? (
            <p className="font-label text-xs uppercase tracking-widest text-outline py-12">
              Se încarcă comenzile...
            </p>
          ) : orders.length === 0 ? (
            <div className="bg-surface-container-lowest p-12 text-center">
              <Icon
                name="receipt"
                className="mx-auto mb-6 h-14 w-14 text-outline-variant"
              />
              <p className="font-label text-sm uppercase tracking-widest text-secondary">
                Nicio comandă încă.
              </p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/20">
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Comandă</th>
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Client</th>
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Data</th>
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Plată</th>
                    <th className="text-left p-4 font-label text-[10px] uppercase tracking-widest text-outline">Status</th>
                    <th className="text-right p-4 font-label text-[10px] uppercase tracking-widest text-outline">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-label text-sm font-bold">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span className="block font-label text-[10px] text-outline mt-1">
                          {order.items?.length || 0} articol{(order.items?.length || 0) !== 1 ? "e" : ""}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-label text-xs">{order.full_name || "—"}</span>
                        <span className="block font-label text-[10px] text-outline mt-1">
                          {order.email}
                        </span>
                      </td>
                      <td className="p-4 font-label text-xs text-outline">
                        {new Date(order.created_at).toLocaleDateString("ro-RO", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 font-label text-[10px] uppercase tracking-widest text-outline">
                        {order.payment_method === "cash_on_delivery"
                          ? "Ramburs"
                          : "Card"}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.fulfillment_status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`font-label text-[10px] uppercase tracking-widest px-3 py-1 bg-transparent border-0 cursor-pointer ${
                            order.fulfillment_status === "fulfilled"
                              ? "bg-primary/10 text-primary"
                              : "bg-surface-container text-outline"
                          }`}
                        >
                          <option value="unfulfilled">Procesare</option>
                          <option value="shipped">În Tranzit</option>
                          <option value="fulfilled">Livrat</option>
                        </select>
                      </td>
                      <td className="p-4 font-label text-sm text-primary font-bold text-right">
                        {formatPriceDetailed(order.total_cents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
