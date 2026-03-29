import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const config = {
  api: { bodyParser: false },
};

// Allow up to 200MB uploads
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!supabase) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const ext = safeName.split(".").pop()?.toLowerCase() || "";
  const contentTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    flac: "audio/flac",
    m4a: "audio/mp4",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
  };

  const { error } = await supabase.storage
    .from("beats")
    .upload(filename, buffer, {
      contentType: contentTypes[ext] || file.type,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("beats").getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
