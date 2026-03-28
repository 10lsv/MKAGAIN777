"use client";

import { useState } from "react";

export default function ServicesPage() {
  const [form, setForm] = useState({ name: "", email: "", beat: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }

      setSent(true);
      setForm({ name: "", email: "", beat: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:max-w-xl md:px-8">
      <h1 className="text-lg font-bold tracking-wide md:text-2xl">Services</h1>
      <p className="mt-3 text-sm text-white/40 leading-relaxed">
        Production sur-mesure. Changement de BPM,
        ajout ou retrait d&apos;instruments, restructuration.
      </p>

      {sent ? (
        <div className="mt-8 rounded border border-green-900 bg-green-900/20 px-6 py-4 text-center">
          <p className="text-sm text-green-400">Message envoy&eacute; ! On revient vers toi rapidement.</p>
          <button
            onClick={() => setSent(false)}
            className="mt-3 text-xs text-white/40 hover:text-white/60"
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && (
            <p className="rounded bg-red-900/30 border border-red-900 px-4 py-2 text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Nom / Pseudo"
            className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent"
          />

          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="Email"
            className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent"
          />

          <input
            type="text"
            value={form.beat}
            onChange={(e) => setForm({ ...form, beat: e.target.value })}
            placeholder="Beat concern&eacute; (optionnel)"
            className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent"
          />

          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={4}
            placeholder="D&eacute;cris ta demande..."
            className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent resize-none"
          />

          <button
            type="submit"
            disabled={sending}
            className="mt-2 w-full py-3 text-sm font-medium bg-accent text-white hover:bg-red-700 transition-colors disabled:opacity-50 md:w-auto md:px-12"
          >
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      )}
    </div>
  );
}
