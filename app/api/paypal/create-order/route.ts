import { NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const { amount, beatTitle, license } = await request.json();

    if (!amount || !beatTitle || !license) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const order = await createOrder(
      Number(amount),
      `${beatTitle} - Licence ${license}`
    );

    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("PayPal create order error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur PayPal" },
      { status: 500 }
    );
  }
}
