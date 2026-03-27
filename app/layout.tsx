import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "MK Beats - Instrumentales",
  description: "Beats & instrumentales par MK. Licences MP3, WAV, Stems et Exclusivité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 py-6 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} MK Beats. Tous droits réservés.
        </footer>
      </body>
    </html>
  );
}
