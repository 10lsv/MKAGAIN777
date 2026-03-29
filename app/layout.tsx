import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Socials from "./components/Socials";
import PostHogProvider from "./components/PostHogProvider";
import PageTransition from "./components/PageTransition";

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
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="border-t border-white/5 py-8">
            <div className="mx-auto max-w-5xl px-5 md:px-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-xs text-white/20">MK Beats</p>
              <Socials animated />
            </div>
          </footer>
        </PostHogProvider>
      </body>
    </html>
  );
}
