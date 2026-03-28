"use client";

import { useState, useEffect, useCallback } from "react";
import type { Beat } from "@/lib/types";

const ADMIN_EMAIL = "leo3elexo3@gmail.com";
const ADMIN_PASSWORD = "MK@beats2026!MadeByLSVprodNuage666!!";
const AUTH_KEY = "mk_admin_auth";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    bpm: 140,
    genre: "",
    price_mp3: 30,
    price_wav: 50,
    price_stems: 70,
    duration: null as number | null,
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Check localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved === "true") setAuthenticated(true);
    setChecking(false);
  }, []);

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
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, "true");
      setAuthenticated(true);
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
  }

  function resetForm() {
    setForm({ title: "", bpm: 140, genre: "", price_mp3: 30, price_wav: 50, price_stems: 70, duration: null });
    setAudioFile(null);
    setCoverFile(null);
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
      duration: beat.duration,
    });
    setAudioFile(null);
    setCoverFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      let audio_url = "";
      let cover_url = "";

      if (audioFile) {
        const fd = new FormData();
        fd.append("file", audioFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        audio_url = uploadData.url;
      }

      if (coverFile) {
        const fd = new FormData();
        fd.append("file", coverFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error);
        cover_url = uploadData.url;
      }

      if (editingId) {
        const body: Record<string, unknown> = { ...form };
        if (audio_url) body.audio_url = audio_url;
        if (cover_url) body.cover_url = cover_url;

        const res = await fetch(`/api/beats/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
      } else {
        if (!audio_url) throw new Error("Fichier audio requis");

        const res = await fetch("/api/beats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, audio_url, cover_url: cover_url || null }),
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
    });

    if (res.ok) {
      await fetchBeats();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  }

  // Loading check
  if (checking) return null;

  // Login screen
  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">Connexion Admin</h1>

          {error && (
            <p className="rounded bg-red-900/30 border border-red-900 px-4 py-2 text-sm text-red-400 text-center">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm text-white/70 mb-1">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent"
              placeholder="Email"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm text-white/70 mb-1">Mot de passe</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent"
              placeholder="Mot de passe"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-accent py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Dashboard <span className="text-accent">Admin</span>
        </h1>
        <button
          onClick={handleLogout}
          className="rounded border border-white/20 px-4 py-1.5 text-xs text-white/50 hover:text-white hover:border-white/40"
        >
          Déconnexion
        </button>
      </div>

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
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setAudioFile(file);
                if (file) {
                  const url = URL.createObjectURL(file);
                  const audio = new Audio(url);
                  audio.addEventListener("loadedmetadata", () => {
                    setForm((prev) => ({ ...prev, duration: Math.round(audio.duration) }));
                    URL.revokeObjectURL(url);
                  });
                }
              }}
              required={!editingId}
              className="w-full text-sm text-white/70 file:mr-3 file:rounded file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:text-white file:cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Cover (optionnel)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
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
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded overflow-hidden bg-white/5">
                    {beat.cover_url ? (
                      <img src={beat.cover_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-white/20">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{beat.title}</p>
                    <p className="text-xs text-white/40">
                      {beat.bpm} BPM &middot; {beat.genre}
                      {beat.duration != null && <> &middot; {Math.floor(beat.duration / 60)}:{String(Math.floor(beat.duration % 60)).padStart(2, "0")}</>}
                      {" "}&middot; MP3: {beat.price_mp3}&euro; / WAV: {beat.price_wav}&euro; / Stems: {beat.price_stems}&euro;
                    </p>
                  </div>
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
