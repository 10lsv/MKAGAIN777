"use client";

import { useState, useEffect, useCallback } from "react";
import type { Beat } from "@/lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    bpm: 140,
    genre: "",
    price_mp3: 30,
    price_wav: 50,
    price_stems: 70,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const fetchBeats = useCallback(async () => {
    const res = await fetch("/api/beats");
    const data = await res.json();
    if (Array.isArray(data)) setBeats(data);
  }, []);

  useEffect(() => {
    if (authenticated) fetchBeats();
  }, [authenticated, fetchBeats]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password.trim()) {
      setAuthenticated(true);
    }
  }

  function resetForm() {
    setForm({ title: "", bpm: 140, genre: "", price_mp3: 30, price_wav: 50, price_stems: 70 });
    setAudioFile(null);
    setEditingId(null);
  }

  function startEdit(beat: Beat) {
    setEditingId(beat.id);
    setForm({
      title: beat.title,
      bpm: beat.bpm,
      genre: beat.genre,
      price_mp3: beat.price_mp3,
      price_wav: beat.price_wav,
      price_stems: beat.price_stems,
    });
    setAudioFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let audio_url = "";

      // Upload audio if new file
      if (audioFile) {
        const fd = new FormData();
        fd.append("file", audioFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "x-admin-password": password },
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        audio_url = uploadData.url;
      }

      if (editingId) {
        // Update
        const body: Record<string, unknown> = { ...form };
        if (audio_url) body.audio_url = audio_url;

        const res = await fetch(`/api/beats/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
      } else {
        // Create
        if (!audio_url) throw new Error("Fichier audio requis");

        const res = await fetch("/api/beats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password,
          },
          body: JSON.stringify({ ...form, audio_url }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
      }

      resetForm();
      await fetchBeats();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce beat ?")) return;

    const res = await fetch(`/api/beats/${id}`, {
      method: "DELETE",
      headers: { "x-admin-password": password },
    });

    if (res.ok) {
      await fetchBeats();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="w-full rounded bg-accent py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Connexion
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">
        Dashboard <span className="text-accent">Admin</span>
      </h1>

      {/* Beat form */}
      <form onSubmit={handleSubmit} className="mt-8 rounded border border-white/10 bg-[#1a1a1a] p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {editingId ? "Modifier le beat" : "Ajouter un beat"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm text-white/70 mb-1">Titre</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Genre</label>
            <input
              type="text"
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">BPM</label>
            <input
              type="number"
              value={form.bpm}
              onChange={(e) => setForm({ ...form, bpm: Number(e.target.value) })}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Fichier audio {editingId && "(optionnel)"}
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
              required={!editingId}
              className="w-full text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:text-white file:cursor-pointer"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Prix MP3 (&euro;)</label>
            <input
              type="number"
              value={form.price_mp3}
              onChange={(e) => setForm({ ...form, price_mp3: Number(e.target.value) })}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Prix WAV (&euro;)</label>
            <input
              type="number"
              value={form.price_wav}
              onChange={(e) => setForm({ ...form, price_wav: Number(e.target.value) })}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Prix Stems (&euro;)</label>
            <input
              type="number"
              value={form.price_stems}
              onChange={(e) => setForm({ ...form, price_stems: Number(e.target.value) })}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Envoi..." : editingId ? "Mettre à jour" : "Ajouter"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded border border-white/20 px-6 py-2.5 text-sm text-white/70 hover:text-white"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Beats list */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">
          Beats ({beats.length})
        </h2>

        {beats.length === 0 ? (
          <p className="text-white/40 text-sm">Aucun beat.</p>
        ) : (
          <div className="space-y-3">
            {beats.map((beat) => (
              <div
                key={beat.id}
                className="flex items-center justify-between rounded border border-white/10 bg-[#1a1a1a] px-5 py-3"
              >
                <div>
                  <p className="font-medium">{beat.title}</p>
                  <p className="text-xs text-white/40">
                    {beat.bpm} BPM &middot; {beat.genre} &middot; MP3: {beat.price_mp3}&euro; / WAV: {beat.price_wav}&euro; / Stems: {beat.price_stems}&euro;
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(beat)}
                    className="rounded border border-white/20 px-3 py-1.5 text-xs text-white/70 hover:border-accent hover:text-accent"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(beat.id)}
                    className="rounded border border-red-900 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/30"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
