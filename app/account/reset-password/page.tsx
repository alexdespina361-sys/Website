"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      showToast({
        title: "Parolă actualizată",
        description: "Poți continua în zona contului tău.",
        tone: "success",
      });
      router.push("/account");
    }

    setLoading(false);
  };

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center px-12">
        <div className="w-full max-w-md py-32">
          <h1 className="font-headline text-5xl mb-4">Parolă Nouă</h1>
          <p className="font-label text-[11px] uppercase tracking-widest text-secondary mb-12">
            Alege o parolă nouă pentru contul tău.
          </p>

          {error && (
            <div className="mb-8 p-4 bg-error-container text-on-error-container font-label text-xs uppercase tracking-widest">
              {error}
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                Parolă Nouă
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
            <div>
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                Confirmă Parola
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
            >
              {loading ? "Se actualizează..." : "Resetează Parola"}
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link
              className="font-label text-[10px] uppercase tracking-widest text-outline hover:text-primary transition-colors"
              href="/login"
            >
              Înapoi la Autentificare
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
