import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "mkbeats48@gmail.com";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Mail non configuré" }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { buyerEmail, beatTitle, license, amount, method } = await request.json() as {
    buyerEmail: string;
    beatTitle: string;
    license: string;
    amount: number;
    method: string;
  };

  if (!buyerEmail || !beatTitle || !license) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "MK Beats <onboarding@resend.dev>",
      to: TO_EMAIL,
      replyTo: buyerEmail,
      subject: `Nouvelle commande - ${beatTitle} (${license})`,
      html: `
        <h2>Nouvelle commande en attente de paiement</h2>
        <table style="border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Beat</td><td><strong>${beatTitle}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Licence</td><td>${license}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Montant</td><td><strong>${amount}&euro;</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Moyen de paiement</td><td>${method}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#888;">Email client</td><td><a href="mailto:${buyerEmail}">${buyerEmail}</a></td></tr>
        </table>
        <p style="margin-top:16px;color:#888;font-size:13px;">
          Vérifie que le paiement est bien reçu, puis envoie le beat à <strong>${buyerEmail}</strong>.
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify order error:", err);
    return NextResponse.json(
      { error: "Erreur envoi notification" },
      { status: 500 }
    );
  }
}
