import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId manquant" }, { status: 400 });
    }

    const capture = await captureOrder(orderId);

    if (capture.status === "COMPLETED") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Paiement non complété" },
      { status: 400 }
    );
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur PayPal" },
      { status: 500 }
    );
  }
}
