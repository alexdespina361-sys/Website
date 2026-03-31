"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { useToast } from "@/components/ToastProvider";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  CONTACT_WHATSAPP_URL,
  SITE_NAME,
} from "@/lib/site";

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
          description: `Echipa ${SITE_NAME} revine catre tine in scurt timp.`,
          tone: "success",
        });
      } else {
        const data = await res.json();
        setError(data.error || "Eroare la trimitere");
      }
    } catch {
      setError("Eroare de retea. Incearca din nou.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="min-h-screen pt-20">
        <section className="grid grid-cols-1 gap-24 px-12 py-32 md:grid-cols-2 md:px-24">
          <div>
            <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
              Contact
            </span>
            <h1 className="mt-6 mb-8 font-headline text-5xl">
              Vorbim la
              <br />
              telefon
            </h1>
            <div className="space-y-8">
              <div>
                <h3 className="mb-2 font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                  Telefon
                </h3>
                <a
                  href={CONTACT_PHONE_TEL}
                  className="font-body text-lg transition-colors hover:text-primary"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={CONTACT_WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary px-5 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:opacity-90"
                  >
                    <Icon name="message" className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={CONTACT_PHONE_TEL}
                    className="inline-flex items-center gap-2 border border-outline-variant/40 px-5 py-3 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface transition-all duration-300 hover:border-primary hover:text-primary"
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    Sunati-ne
                  </a>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                  Program
                </h3>
                <p className="font-body text-secondary">
                  Luni - Vineri: 10:00 - 19:00
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                  Email
                </h3>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-body text-secondary transition-colors hover:text-primary"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>
          <div>
            {sent ? (
              <div className="bg-surface-container p-8">
                <Icon name="check-circle" className="mb-4 h-10 w-10 text-primary" />
                <p className="mb-2 font-headline text-2xl">Mesaj trimis</p>
                <p className="font-body text-secondary">
                  Multumim pentru mesaj. Iti raspundem in cel mai scurt timp.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setName("");
                    setEmail("");
                    setMessage("");
                  }}
                  className="mt-6 font-label text-[10px] uppercase tracking-widest text-primary hover:underline"
                >
                  Trimite un alt mesaj
                </button>
              </div>
            ) : (
              <>
                {error ? (
                  <div className="mb-8 bg-error-container p-4 font-label text-xs uppercase tracking-widest text-on-error-container">
                    {error}
                  </div>
                ) : null}
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div>
                    <label className="mb-2 block font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                      Nume
                    </label>
                    <input
                      className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm transition-all duration-500 focus:border-primary focus:ring-0"
                      type="text"
                      placeholder="Numele tau"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      Mesaj
                    </label>
                    <textarea
                      className="w-full resize-none border-0 border-b border-outline-variant bg-transparent px-0 py-4 font-body text-sm transition-all duration-500 focus:border-primary focus:ring-0"
                      rows={4}
                      placeholder="Mesajul tau..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-primary py-5 font-label text-xs uppercase tracking-widest text-white transition-all duration-500 hover:bg-primary-container disabled:opacity-50"
                  >
                    {sending ? "Se trimite..." : "Trimite mesaj"}
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
