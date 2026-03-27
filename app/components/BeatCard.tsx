"use client";

import { useState, useRef } from "react";
import type { Beat } from "@/lib/types";

const licenses = [
  { key: "price_mp3", label: "MP3 320kbps", format: "MP3" },
  { key: "price_wav", label: "WAV 24bit", format: "WAV" },
  { key: "price_stems", label: "Stems (WAV)", format: "Stems" },
] as const;

export default function BeatCard({ beat }: { beat: Beat }) {
  const [playing, setPlaying] = useState(false);
  const [showLicenses, setShowLicenses] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function handleEnded() {
    setPlaying(false);
  }

  return (
    <div className="rounded border border-white/10 bg-[#1a1a1a] p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{beat.title}</h3>
          <p className="mt-1 text-sm text-white/50">
            {beat.bpm} BPM &middot; {beat.genre}
          </p>
        </div>
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent transition-colors hover:bg-red-700"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
      </div>

      <audio ref={audioRef} src={beat.audio_url} onEnded={handleEnded} preload="none" />

      <button
        onClick={() => setShowLicenses(!showLicenses)}
        className="mt-4 text-sm font-medium text-accent transition-colors hover:text-red-400"
      >
        {showLicenses ? "Masquer les licences" : "Voir les licences"}
      </button>

      {showLicenses && (
        <div className="mt-3 space-y-2">
          {licenses.map((lic) => (
            <div
              key={lic.key}
              className="flex items-center justify-between rounded bg-white/5 px-4 py-2 text-sm"
            >
              <span className="text-white/70">{lic.label}</span>
              <span className="font-semibold">{beat[lic.key]}&euro;</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded bg-white/5 px-4 py-2 text-sm">
            <span className="text-white/70">Exclusivité</span>
            <a
              href={`mailto:leo3elexo3@gmail.com?subject=Offre exclusive - ${encodeURIComponent(beat.title)}`}
              className="font-semibold text-accent hover:text-red-400"
            >
              Faire une offre
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
