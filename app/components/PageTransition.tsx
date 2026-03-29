"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [transitioning, setTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-opacity duration-300 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{ background: "radial-gradient(circle at center, #DC143C15, #000 70%)" }}
      />
      {/* Red line sweep */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 h-[2px] bg-accent pointer-events-none transition-transform duration-400 ease-out origin-left ${
          transitioning ? "scale-x-100" : "scale-x-0"
        }`}
      />
      {/* Content */}
      <div
        className={`transition-all duration-300 ${
          transitioning
            ? "opacity-0 translate-y-4 scale-[0.98]"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        {displayChildren}
      </div>
    </>
  );
}
