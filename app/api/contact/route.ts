import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "mkbeats48@gmail.com";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Service mail non configuré" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await request.json();
  const { name, email, beat, message } = body as {
    name: string;
    email: string;
    beat?: string;
    message: string;
  };

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "MK Beats <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: email,
      subject: `Demande de service - ${name}${beat ? ` (${beat})` : ""}`,
      html: `
        <h2>Nouvelle demande de production sur mesure</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        ${beat ? `<p><strong>Beat concerné :</strong> ${beat}</p>` : ""}
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du mail" },
      { status: 500 }
    );
  }
}
