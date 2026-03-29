export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import type { Beat } from "@/lib/types";
import BeatCard from "../components/BeatCard";

export const metadata = {
  title: "Beats - MK",
};

export default async function BeatsPage() {
  let beats: Beat[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("beats")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) beats = data as Beat[];
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:max-w-3xl md:px-8">
      <h1 className="text-lg font-bold tracking-wide md:text-2xl">Beats</h1>

      {beats.length === 0 ? (
        <p className="mt-8 text-sm text-white/30">Aucun beat disponible.</p>
      ) : (
        <div className="mt-6 md:grid md:grid-cols-2 md:gap-x-8">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      )}
    </div>
  );
}
