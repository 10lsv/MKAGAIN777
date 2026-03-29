import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_LICENSES = [
  { id: "mp3", name: "MP3", price: 30, detail: "320kbps", terms: "5 000 streams, crédit obligatoire" },
  { id: "wav", name: "WAV", price: 50, detail: "24bit", terms: "20 000 streams, crédit obligatoire" },
  { id: "stems", name: "Stems", price: 70, detail: "Pistes séparées", terms: "50 000 streams, crédit obligatoire" },
  { id: "exclusive", name: "Exclusivité", price: 200, detail: "WAV + Stems + Projet", terms: "Streams illimités, pas de crédit, contrat fourni" },
];

export async function GET() {
  if (!supabase) {
    return NextResponse.json(DEFAULT_LICENSES);
  }

  const { data, error } = await supabase
    .from("license_config")
    .select("*")
    .order("id");

  if (error || !data || data.length === 0) {
    return NextResponse.json(DEFAULT_LICENSES);
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 500 });
  }

  const licenses = await request.json();

  for (const lic of licenses) {
    const { error } = await supabase
      .from("license_config")
      .upsert(lic, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
