import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
        <span className="text-accent">MK</span> BEATS
      </h1>
      <p className="mt-6 max-w-lg text-lg text-white/60">
        Instrumentales originales pour artistes ambitieux. Trouve le beat qui correspond à ton son.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/beats"
          className="rounded bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          Explorer les beats
        </Link>
        <Link
          href="/services"
          className="rounded border border-white/20 px-8 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-accent hover:text-accent"
        >
          Services sur-mesure
        </Link>
      </div>

      {/* Features */}
      <div className="mt-24 grid max-w-4xl gap-8 sm:grid-cols-3">
        <div className="rounded border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-accent">Beats originaux</h3>
          <p className="mt-2 text-sm text-white/50">
            Chaque instrumentale est produite de zéro avec un son unique.
          </p>
        </div>
        <div className="rounded border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-accent">4 licences</h3>
          <p className="mt-2 text-sm text-white/50">
            MP3, WAV, Stems ou Exclusivité — choisis ce qui te convient.
          </p>
        </div>
        <div className="rounded border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-accent">Sur-mesure</h3>
          <p className="mt-2 text-sm text-white/50">
            Besoin d&apos;une modification ? Un service personnalisé est disponible.
          </p>
        </div>
      </div>
    </div>
  );
}
