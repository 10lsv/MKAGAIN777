import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import PostHogProvider from "./components/PostHogProvider";

export const metadata: Metadata = {
  title: "MK Beats",
  description: "Instrumentales par MK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="py-8 text-center text-xs text-white/20">
            MK Beats
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
