"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/beats", label: "Beats" },
  { href: "/services", label: "Services" },
  { href: "/licenses", label: "Licences" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="px-5 py-4 md:px-8 md:py-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-widest text-accent md:text-xl">
          MK
        </Link>

        {/* Desktop */}
        <div className="hidden gap-8 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs uppercase tracking-wide transition-colors ${
                pathname === l.href ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile */}
        <button
          className="text-white/40 sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-2 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-xs uppercase tracking-wide py-1 ${
                pathname === l.href ? "text-white" : "text-white/40"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
