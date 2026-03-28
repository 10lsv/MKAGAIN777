"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export default function PayPalProvider({ children }: { children: React.ReactNode }) {
  if (!clientId) return <>{children}</>;

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "EUR",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
