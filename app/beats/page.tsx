import { supabase } from "@/lib/supabase";
import type { Beat } from "@/lib/types";
import BeatCard from "../components/BeatCard";

export const metadata = {
  title: "Beats - MK Beats",
  description: "Catalogue de beats et instrumentales par MK",
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
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        <span className="text-accent">Beats</span> Store
      </h1>
      <p className="mt-2 text-white/50">
        Écoute, choisis ta licence, et télécharge.
      </p>

      {beats.length === 0 ? (
        <p className="mt-12 text-center text-white/40">
          Aucun beat disponible pour le moment. Reviens bientôt !
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      )}
    </div>
  );
}
