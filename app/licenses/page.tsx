import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licences - MK Beats",
  description: "Détail des 4 types de licences disponibles pour les beats MK",
};

const licenseData = [
  {
    name: "MP3 Lease",
    price: "30€",
    format: "MP3 320kbps",
    features: [
      "Fichier MP3 haute qualité",
      "Usage commercial (jusqu'à 5 000 streams)",
      "Crédit obligatoire (prod. MK)",
      "Non-exclusif",
    ],
  },
  {
    name: "WAV Lease",
    price: "50€",
    format: "WAV 24bit",
    features: [
      "Fichier WAV qualité studio",
      "Usage commercial (jusqu'à 20 000 streams)",
      "Crédit obligatoire (prod. MK)",
      "Non-exclusif",
      "Mixage professionnel recommandé",
    ],
  },
  {
    name: "Stems",
    price: "70€",
    format: "Pistes séparées WAV",
    features: [
      "Toutes les pistes séparées (drums, mélodie, basse...)",
      "Usage commercial (jusqu'à 50 000 streams)",
      "Crédit obligatoire (prod. MK)",
      "Non-exclusif",
      "Liberté totale de mixage",
    ],
  },
  {
    name: "Exclusivité",
    price: "Sur demande",
    format: "WAV + Stems + Projet",
    features: [
      "Droits exclusifs — le beat est retiré du store",
      "Streams illimités",
      "Pas de crédit obligatoire",
      "Fichiers WAV, Stems et projet inclus",
      "Contrat de cession fourni",
    ],
    exclusive: true,
  },
];

export default function LicensesPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        <span className="text-accent">Licences</span>
      </h1>
      <p className="mt-2 text-white/50">
        Choisis la licence adaptée à ton projet.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {licenseData.map((lic) => (
          <div
            key={lic.name}
            className={`flex flex-col rounded border p-6 ${
              lic.exclusive
                ? "border-accent bg-accent/5"
                : "border-white/10 bg-[#1a1a1a]"
            }`}
          >
            <h3 className="text-lg font-bold">{lic.name}</h3>
            <p className="mt-1 text-2xl font-bold text-accent">{lic.price}</p>
            <p className="mt-1 text-xs text-white/40">{lic.format}</p>

            <ul className="mt-5 flex-1 space-y-2">
              {lic.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="mt-0.5 text-accent">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>

            {lic.exclusive ? (
              <a
                href="mailto:leo3elexo3@gmail.com?subject=Demande d'exclusivité"
                className="mt-6 block rounded bg-accent py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Contacter
              </a>
            ) : (
              <a
                href="/beats"
                className="mt-6 block rounded border border-white/20 py-2.5 text-center text-sm font-semibold text-white/70 transition-colors hover:border-accent hover:text-accent"
              >
                Voir les beats
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
