"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signUp } from "@/lib/auth";
import { useToast } from "@/components/ToastProvider";

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
          description: "Bine ai venit în RED STUDIO.",
          tone: "success",
        });
        router.push("/account");
      } else {
        showToast({
          title: "Verifică emailul",
          description:
            "Contul a fost creat. Confirmă adresa de email pentru a continua.",
          tone: "info",
        });
        router.push("/login");
      }

      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Eroare la înregistrare");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center px-12">
        <div className="w-full max-w-md py-32">
          <h1 className="font-headline text-5xl mb-4">Înregistrare</h1>
          <p className="font-label text-[11px] uppercase tracking-widest text-secondary mb-12">
            Alătură-te cercului RED STUDIO
          </p>

          {error && (
            <div className="mb-8 p-4 bg-error-container text-on-error-container font-label text-xs uppercase tracking-widest">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                Nume Complet
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                type="text"
                placeholder="Nume Prenume"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                Email
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                type="email"
                placeholder="adresa@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                Parolă
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
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
              className="w-full bg-primary text-white py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Se creează contul..." : "Creează Cont"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link
              className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
              href="/login"
            >
              Ai deja cont? Autentifică-te
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
