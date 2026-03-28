"use client";

import { useState, useRef } from "react";
import type { Beat } from "@/lib/types";
import { trackEvent } from "./PostHogProvider";

const licenses = [
  { key: "price_mp3", label: "MP3" },
  { key: "price_wav", label: "WAV" },
  { key: "price_stems", label: "Stems" },
  { key: "price_exclusive", label: "Exclusivité" },
] as const;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-accent hover:text-red-400 text-xs ml-2 shrink-0"
    >
      {copied ? "Copié !" : label}
    </button>
  );
}

export default function BeatCard({ beat }: { beat: Beat }) {
  const [playing, setPlaying] = useState(false);
  const [showLicenses, setShowLicenses] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<typeof licenses[number] | null>(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "rib" | null>(null);
  const [notifying, setNotifying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
      trackEvent("beat_play", { beat_name: beat.title, beat_id: beat.id });
    }
    setPlaying(!playing);
  }

  function handleLicenseClick(lic: typeof licenses[number]) {
    trackEvent("license_click", { beat_name: beat.title, beat_id: beat.id, license: lic.label });
    setSelectedLicense(selectedLicense?.key === lic.key ? null : lic);
    setEmailConfirmed(false);
    setPaymentMethod(null);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!buyerEmail || !selectedLicense) return;
    setEmailConfirmed(true);
  }

  async function handlePaymentSelect(method: "paypal" | "rib") {
    setPaymentMethod(method);
    setNotifying(true);
    trackEvent("payment_method_select", { method, beat_name: beat.title, license: selectedLicense!.label, buyer_email: buyerEmail });

    // Notify admin
    try {
      await fetch("/api/notify-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerEmail,
          beatTitle: beat.title,
          license: selectedLicense!.label,
          amount: selectedLicense ? beat[selectedLicense.key] : 0,
          method: method === "paypal" ? "PayPal entre proches" : "Virement bancaire",
        }),
      });
    } catch {
      // Silently fail - don't block the user
    } finally {
      setNotifying(false);
    }
  }

  const selectedPrice = selectedLicense ? beat[selectedLicense.key] : 0;

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
          onClick={() => {
            setShowLicenses(!showLicenses);
            if (showLicenses) {
              setSelectedLicense(null);
              setEmailConfirmed(false);
              setPaymentMethod(null);
            }
          }}
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
            <div
              key={lic.key}
              className={`flex justify-between text-xs cursor-pointer rounded px-2 py-1.5 transition-colors ${
                selectedLicense?.key === lic.key
                  ? "bg-accent/20 text-white"
                  : "hover:bg-white/5"
              }`}
              onClick={() => handleLicenseClick(lic)}
            >
              <span className={selectedLicense?.key === lic.key ? "text-white" : "text-white/40"}>
                {lic.label}
              </span>
              <span className={selectedLicense?.key === lic.key ? "text-accent font-medium" : "text-white/70"}>
                {beat[lic.key]}&euro;
              </span>
            </div>
          ))}

          {/* Email + Payment */}
          {selectedLicense && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-white/50 mb-3">
                {beat.title} &mdash; {selectedLicense.label} &mdash; <span className="text-accent font-medium">{selectedPrice}&euro;</span>
              </p>

              {/* Email step */}
              {!emailConfirmed ? (
                <form onSubmit={handleEmailSubmit} className="space-y-2">
                  <p className="text-xs text-white/40">Ton email pour recevoir le beat :</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                      placeholder="email@exemple.com"
                      className="flex-1 rounded border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-accent"
                    />
                    <button
                      type="submit"
                      className="rounded bg-accent px-4 py-2 text-xs font-medium text-white hover:bg-red-700 shrink-0"
                    >
                      Continuer
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-xs text-white/30 mb-3">
                    Beat envoyé à <span className="text-white/60">{buyerEmail}</span> après paiement.
                    <button onClick={() => setEmailConfirmed(false)} className="text-accent ml-1 hover:text-red-400">Modifier</button>
                  </p>

                  {/* Payment method buttons */}
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handlePaymentSelect("paypal")}
                      disabled={notifying}
                      className={`flex-1 rounded border px-3 py-2 text-xs transition-colors ${
                        paymentMethod === "paypal"
                          ? "border-accent bg-accent/10 text-white"
                          : "border-white/10 text-white/50 hover:border-white/30"
                      }`}
                    >
                      PayPal
                    </button>
                    <button
                      onClick={() => handlePaymentSelect("rib")}
                      disabled={notifying}
                      className={`flex-1 rounded border px-3 py-2 text-xs transition-colors ${
                        paymentMethod === "rib"
                          ? "border-accent bg-accent/10 text-white"
                          : "border-white/10 text-white/50 hover:border-white/30"
                      }`}
                    >
                      Virement
                    </button>
                  </div>

                  {/* PayPal entre proches */}
                  {paymentMethod === "paypal" && (
                    <div className="rounded border border-white/10 bg-white/5 p-3 space-y-2">
                      <p className="text-xs text-white/70 font-medium">Envoyer via PayPal (entre proches)</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-white/50 font-mono">mkerbaul165@gmail.com</p>
                        <CopyButton text="mkerbaul165@gmail.com" label="Copier" />
                      </div>
                      <p className="text-xs text-white/30">
                        Montant : <span className="text-white/60">{selectedPrice}&euro;</span>
                      </p>
                      <p className="text-xs text-white/30">
                        Mets en note : <span className="text-white/50 italic">{beat.title} - {selectedLicense.label}</span>
                        <CopyButton text={`${beat.title} - ${selectedLicense.label}`} label="Copier" />
                      </p>
                      <a
                        href="https://www.paypal.com/myaccount/transfer/homepage/send"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-center rounded bg-[#0070ba] px-4 py-2 text-xs font-medium text-white hover:bg-[#005ea6] transition-colors"
                      >
                        Ouvrir PayPal
                      </a>
                    </div>
                  )}

                  {/* Virement bancaire */}
                  {paymentMethod === "rib" && (
                    <div className="rounded border border-white/10 bg-white/5 p-3 space-y-2">
                      <p className="text-xs text-white/70 font-medium">Virement bancaire</p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/40">Titulaire</p>
                          <p className="text-xs text-white/60">Matis Kerbaul</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/40">IBAN</p>
                          <div className="flex items-center">
                            <p className="text-xs text-white/60 font-mono">FR76 4061 8804 3600 0400 2776 914</p>
                            <CopyButton text="FR7640618804360004002776914" label="Copier" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/40">BIC</p>
                          <div className="flex items-center">
                            <p className="text-xs text-white/60 font-mono">BOUSFRPPXXX</p>
                            <CopyButton text="BOUSFRPPXXX" label="Copier" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-white/30 mt-2">
                        Montant : <span className="text-white/60">{selectedPrice}&euro;</span>
                      </p>
                      <p className="text-xs text-white/30">
                        Motif : <span className="text-white/50 italic">{beat.title} - {selectedLicense.label}</span>
                        <CopyButton text={`${beat.title} - ${selectedLicense.label}`} label="Copier" />
                      </p>
                    </div>
                  )}

                  {paymentMethod && (
                    <p className="text-xs text-white/20 mt-2 text-center">
                      Le beat sera envoyé à ton email après confirmation du paiement.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
