"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useToast } from "@/components/ToastProvider";
import Icon from "@/components/Icon";

export default function ForgotPasswordPage() {
  const supabase = getSupabaseBrowserClient();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
      showToast({
        title: "Link trimis",
        description: "Verifică inbox-ul pentru a continua resetarea parolei.",
        tone: "success",
      });
    }

    setLoading(false);
  };

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen flex items-center justify-center px-12">
        <div className="w-full max-w-md py-32">
          <h1 className="font-headline text-5xl mb-4">Resetare Parolă</h1>
          <p className="font-label text-[11px] uppercase tracking-widest text-secondary mb-12">
            Introdu adresa de email pentru a primi un link de resetare.
          </p>

          {sent ? (
            <div className="bg-surface-container p-8">
              <Icon
                name="mail-check"
                className="mb-4 h-10 w-10 text-primary"
              />
              <p className="font-body text-secondary mb-4">
                Am trimis un link de resetare la <strong>{email}</strong>.
                Verifică inbox-ul și urmează instrucțiunile.
              </p>
              <Link
                href="/login"
                className="font-label text-[10px] uppercase tracking-widest text-primary hover:underline"
              >
                Înapoi la Autentificare
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-8 p-4 bg-error-container text-on-error-container font-label text-xs uppercase tracking-widest">
                  {error}
                </div>
              )}
              <form className="space-y-8" onSubmit={handleSubmit}>
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
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
                >
                  {loading ? "Se trimite..." : "Trimite Link de Resetare"}
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
