import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licences - MK",
};

const licenseData = [
  {
    name: "MP3",
    price: "30",
    detail: "320kbps",
    terms: "5 000 streams, cr\u00e9dit obligatoire",
  },
  {
    name: "WAV",
    price: "50",
    detail: "24bit",
    terms: "20 000 streams, cr\u00e9dit obligatoire",
  },
  {
    name: "Stems",
    price: "70",
    detail: "Pistes s\u00e9par\u00e9es",
    terms: "50 000 streams, cr\u00e9dit obligatoire",
  },
  {
    name: "Exclusivit\u00e9",
    price: null,
    detail: "WAV + Stems + Projet",
    terms: "Streams illimit\u00e9s, pas de cr\u00e9dit, contrat fourni",
  },
];

export default function LicensesPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:max-w-2xl md:px-8">
      <h1 className="text-lg font-bold tracking-wide md:text-2xl">Licences</h1>

      <div className="mt-8 space-y-6 md:grid md:grid-cols-2 md:gap-8 md:space-y-0">
        {licenseData.map((lic) => (
          <div key={lic.name} className="border-b border-white/5 pb-6 md:border-b-0">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-medium md:text-base">{lic.name}</h3>
              {lic.price ? (
                <span className="text-sm text-accent font-medium">{lic.price}&euro;</span>
              ) : (
                <a
                  href="mailto:leo3elexo3@gmail.com?subject=Demande d'exclusivit\u00e9"
                  className="text-xs text-accent hover:text-red-400"
                >
                  Contacter
                </a>
              )}
            </div>
            <p className="mt-1 text-xs text-white/30">{lic.detail}</p>
            <p className="mt-1 text-xs text-white/20">{lic.terms}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
