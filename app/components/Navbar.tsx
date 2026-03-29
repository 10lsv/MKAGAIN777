"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import Socials from "./Socials";

const links = [
  { href: "/beats", label: "Beats" },
  { href: "/services", label: "Services" },
  { href: "/licenses", label: "Licences" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-white/5 px-5 py-3 md:px-8 md:py-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="text-sm font-bold tracking-widest text-white hidden sm:block">MK BEATS</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 sm:flex">
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
          <Socials />
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
        <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-3 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-xs uppercase tracking-wide py-1.5 ${
                pathname === l.href ? "text-white" : "text-white/40"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Socials className="mt-2 pb-1" />
        </div>
      )}
    </nav>
  );
}
