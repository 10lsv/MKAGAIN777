import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-20">
      <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
        <span className="text-accent">MK</span>
      </h1>
      <p className="mt-4 text-sm text-white/40 max-w-xs text-center md:text-base md:max-w-md">
        Instrumentales originales pour artistes.
      </p>

      <div className="mt-10 flex flex-col gap-3 w-full max-w-xs md:flex-row md:max-w-lg md:gap-4">
        <Link
          href="/beats"
          className="block py-3 text-center text-sm font-medium bg-accent text-white hover:bg-red-700 transition-colors md:flex-1"
        >
          Beats
        </Link>
        <Link
          href="/services"
          className="block py-3 text-center text-sm font-medium text-white/50 border border-white/10 hover:text-white hover:border-white/30 transition-colors md:flex-1"
        >
          Services
        </Link>
        <Link
          href="/licenses"
          className="block py-3 text-center text-sm font-medium text-white/50 border border-white/10 hover:text-white hover:border-white/30 transition-colors md:flex-1"
        >
          Licences
        </Link>
      </div>
    </div>
  );
}
