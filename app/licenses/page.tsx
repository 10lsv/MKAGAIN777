export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";

interface License {
  id: string;
  name: string;
  price: number;
  detail: string;
  terms: string;
}

const DEFAULT_LICENSES: License[] = [
  { id: "mp3", name: "MP3", price: 30, detail: "320kbps", terms: "5 000 streams, crédit obligatoire" },
  { id: "wav", name: "WAV", price: 50, detail: "24bit", terms: "20 000 streams, crédit obligatoire" },
  { id: "stems", name: "Stems", price: 70, detail: "Pistes séparées", terms: "50 000 streams, crédit obligatoire" },
  { id: "exclusive", name: "Exclusivité", price: 200, detail: "WAV + Stems + Projet", terms: "Streams illimités, pas de crédit, contrat fourni" },
];

export default async function LicensesPage() {
  let licenses: License[] = DEFAULT_LICENSES;

  if (supabase) {
    const { data } = await supabase
      .from("license_config")
      .select("*")
      .order("id");
    if (data && data.length > 0) licenses = data as License[];
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:max-w-2xl md:px-8">
      <h1 className="text-lg font-bold tracking-wide md:text-2xl">Licences</h1>

      <div className="mt-8 space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
        {licenses.map((lic) => (
          <div key={lic.id} className="border-b border-white/5 pb-6 md:border-b-0">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-medium md:text-base">{lic.name}</h3>
              <span className="text-sm text-accent font-medium">{lic.price}&euro;</span>
            </div>
            <p className="mt-1 text-xs text-white/30">{lic.detail}</p>
            <p className="mt-1 text-xs text-white/20">{lic.terms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
