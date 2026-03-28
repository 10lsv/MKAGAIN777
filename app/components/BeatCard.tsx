"use client";

import { useState, useRef } from "react";
import type { Beat } from "@/lib/types";

const licenses = [
  { key: "price_mp3", label: "MP3" },
  { key: "price_wav", label: "WAV" },
  { key: "price_stems", label: "Stems" },
] as const;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function BeatCard({ beat }: { beat: Beat }) {
  const [playing, setPlaying] = useState(false);
  const [showLicenses, setShowLicenses] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  }

  return (
    <div className="border-b border-white/5 py-4">
      <div className="flex items-center gap-3">
        {/* Cover */}
        <button
          onClick={togglePlay}
          className="relative h-12 w-12 shrink-0 rounded overflow-hidden bg-white/5 group"
          aria-label={playing ? "Pause" : "Play"}
        >
          {beat.cover_url ? (
            <img
              src={beat.cover_url}
              alt={beat.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5">
              <svg className="h-5 w-5 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
              </svg>
            </div>
          )}
          {/* Play/Pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            {playing ? (
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </div>
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{beat.title}</p>
          <p className="text-xs text-white/30">
            {beat.bpm} BPM &middot; {beat.genre}
            {beat.duration != null && <> &middot; {formatDuration(beat.duration)}</>}
          </p>
        </div>

        <button
          onClick={() => setShowLicenses(!showLicenses)}
          className="text-xs text-white/30 hover:text-white/60 transition-colors shrink-0"
        >
          {showLicenses ? "Fermer" : "Licences"}
        </button>
      </div>

      <audio
        ref={audioRef}
        src={beat.audio_url}
        onEnded={() => setPlaying(false)}
        onError={() => alert("Erreur audio : impossible de charger " + beat.audio_url)}
        preload="none"
      />

      {showLicenses && (
        <div className="mt-3 ml-15 space-y-1">
          {licenses.map((lic) => (
            <div key={lic.key} className="flex justify-between text-xs">
              <span className="text-white/40">{lic.label}</span>
              <span className="text-white/70">{beat[lic.key]}&euro;</span>
            </div>
          ))}
          <div className="flex justify-between text-xs">
            <span className="text-white/40">Exclusivit&eacute;</span>
            <a
              href={`mailto:leo3elexo3@gmail.com?subject=Offre exclusive - ${encodeURIComponent(beat.title)}`}
              className="text-accent hover:text-red-400"
            >
              Offre
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
