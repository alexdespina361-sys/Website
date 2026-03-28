"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";
import AddressBook from "@/components/AddressBook";

export default function AccountPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || "");
      } else {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata.full_name || "",
        });
        setFullName(user.user_metadata.full_name || "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setMessage("Eroare la salvare: " + error.message);
    } else {
      setMessage("Modificările au fost salvate.");
      showToast({
        title: "Profil actualizat",
        description: "Detaliile contului au fost salvate.",
        tone: "success",
      });
    }

    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    showToast({
      title: "Deconectare",
      description: "Sesiunea ta a fost închisă.",
      tone: "info",
    });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <p className="font-label text-xs uppercase tracking-widest text-outline">
            Se încarcă...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

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
                <Link
                  className="block font-label text-[11px] uppercase tracking-widest text-primary border-l-2 border-primary pl-4"
                  href="/account"
                >
                  Setări
                </Link>
                <Link
                  className="block font-label text-[11px] uppercase tracking-widest text-outline hover:text-primary transition-colors pl-4"
                  href="/account/orders"
                >
                  Comenzi
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block font-label text-[11px] uppercase tracking-widest text-outline hover:text-error transition-colors pl-4 mt-8"
                >
                  Deconectare
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="md:col-span-3">
              <h3 className="font-headline text-3xl mb-12">Setări Cont</h3>

              {message && (
                <div className="mb-8 p-4 bg-surface-container font-label text-xs uppercase tracking-widest text-outline">
                  {message}
                </div>
              )}

              <div className="bg-surface-container-lowest p-12">
                <form onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                        Nume Complet
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                        Email
                      </label>
                      <input
                        className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 px-0 font-body text-sm text-outline"
                        type="email"
                        value={email}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mt-12">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-primary text-white px-12 py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
                    >
                      {saving ? "Se salvează..." : "Salvează Modificările"}
                    </button>
                  </div>
                </form>

                {userId ? (
                  <AddressBook
                    userId={userId}
                    defaultRecipientName={fullName}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
