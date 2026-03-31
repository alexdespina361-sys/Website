"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signUp } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";
import { SITE_WORDMARK } from "@/lib/site";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signUp(email, password, fullName);

      if (data.session) {
        showToast({
          title: "Cont creat",
          description: `Bine ai venit in ${SITE_WORDMARK}.`,
          tone: "success",
        });
        router.push("/account");
      } else {
        showToast({
          title: "Verifica emailul",
          description:
            "Contul a fost creat. Confirma adresa de email pentru a continua.",
          tone: "info",
        });
        router.push("/login");
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare la inregistrare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="flex min-h-screen items-center justify-center px-12 pt-20">
        <div className="w-full max-w-md py-32">
          <h1 className="mb-4 font-headline text-5xl">Inregistrare</h1>
          <p className="mb-12 font-label text-[11px] uppercase tracking-widest text-secondary">
            Alatura-te cercului {SITE_WORDMARK}
          </p>

          {error ? (
            <div className="mb-8 bg-error-container p-4 font-label text-xs uppercase tracking-widest text-on-error-container">
              {error}
            </div>
          ) : null}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                Nume complet
              </label>
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm transition-all duration-500 focus:border-primary focus:ring-0"
                type="text"
                placeholder="Nume Prenume"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                Email
              </label>
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm transition-all duration-500 focus:border-primary focus:ring-0"
                type="email"
                placeholder="adresa@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-2 block font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                Parola
              </label>
              <input
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm transition-all duration-500 focus:border-primary focus:ring-0"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary py-5 font-label text-xs uppercase tracking-widest text-white transition-all duration-500 hover:bg-primary-container disabled:opacity-50"
            >
              {loading ? "Se creeaza contul..." : "Creeaza cont"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link
              className="font-label text-[10px] uppercase tracking-widest text-outline transition-colors hover:text-primary"
              href="/login"
            >
              Ai deja cont? Autentifica-te
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
