export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import type { Beat } from "@/lib/types";
import BeatCard from "./components/BeatCard";

export default async function Home() {
  let beats: Beat[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("beats")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) beats = data as Beat[];
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 md:px-8">
      <p className="text-xs text-white/30 mb-10">
        <span className="text-white/60 font-medium">MK Beats</span> — Instrumentales originales
      </p>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold tracking-wide md:text-xl">Catalogue</h1>
        <span className="text-xs text-white/20">{beats.length} beat{beats.length !== 1 ? "s" : ""}</span>
      </div>

      {beats.length === 0 ? (
        <p className="text-sm text-white/30">Aucun beat disponible.</p>
      ) : (
        <div className="md:grid md:grid-cols-2 md:gap-x-8">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      )}
    </div>
  );
}
