"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { useToast } from "@/components/ToastProvider";

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setSent(true);
        showToast({
          title: "Mesaj trimis",
          description: "Echipa RED STUDIO revine către tine în scurt timp.",
          tone: "success",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Eroare la trimitere");
      }
    } catch {
      setError("Eroare de rețea. Încearcă din nou.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="pt-20 min-h-screen">
        <section className="px-12 md:px-24 py-32 grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
              Contact
            </span>
            <h1 className="font-headline text-5xl mt-6 mb-8">
              Vorbim la<br />Showroom
            </h1>
            <div className="space-y-8">
              <div>
                <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Showroom
                </h3>
                <p className="font-body text-lg">București, România</p>
                <p className="font-body text-secondary">
                  Calea Victoriei 122, Sector 1
                </p>
              </div>
              <div>
                <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Program
                </h3>
                <p className="font-body text-secondary">
                  Luni — Vineri: 10:00 - 19:00
                </p>
              </div>
              <div>
                <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-2">
                  Email
                </h3>
                <p className="font-body text-secondary">hello@redstudio.ro</p>
              </div>
            </div>
          </div>
          <div>
            {sent ? (
              <div className="bg-surface-container p-8">
                <Icon
                  name="check-circle"
                  className="mb-4 h-10 w-10 text-primary"
                />
                <p className="font-headline text-2xl mb-2">Mesaj Trimis</p>
                <p className="font-body text-secondary">
                  Mulțumim pentru mesaj. Vă vom răspunde în cel mai scurt timp.
                </p>
                <button
                  onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                  className="mt-6 font-label text-[10px] uppercase tracking-widest text-primary hover:underline"
                >
                  Trimite un alt mesaj
                </button>
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
                      Nume
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500"
                      type="text"
                      placeholder="Numele tău"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      Mesaj
                    </label>
                    <textarea
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-4 px-0 font-body text-sm focus:ring-0 focus:border-primary transition-all duration-500 resize-none"
                      rows={4}
                      placeholder="Mesajul tău..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary text-white py-5 font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-all duration-500 disabled:opacity-50"
                  >
                    {sending ? "Se trimite..." : "Trimite Mesaj"}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
