import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - MK Beats",
  description: "Service de modification d'instrumentale sur-mesure par MK",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">
        <span className="text-accent">Services</span> sur-mesure
      </h1>
      <p className="mt-4 text-white/60 leading-relaxed">
        Tu as un beat qui te plaît mais tu veux le modifier ? Changement de BPM,
        ajout ou retrait d&apos;instruments, restructuration du morceau... Décris ta
        demande et je te recontacte avec un devis.
      </p>

      <div className="mt-10 rounded border border-white/10 bg-[#1a1a1a] p-8">
        <h2 className="text-xl font-semibold mb-6">Demande de service</h2>
        <form
          action="https://formspree.io/f/xyzgobvl"
          method="POST"
          className="space-y-5"
        >
          <input type="hidden" name="_subject" value="Demande de service MK Beats" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
              Nom / Pseudo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent"
              placeholder="Ton nom"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent"
              placeholder="ton@email.com"
            />
          </div>

          <div>
            <label htmlFor="beat" className="block text-sm font-medium text-white/70 mb-1">
              Beat concerné (optionnel)
            </label>
            <input
              type="text"
              id="beat"
              name="beat"
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent"
              placeholder="Nom du beat"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">
              Décris ta demande
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full rounded border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent resize-none"
              placeholder="Ex: J'aimerais changer le BPM de 140 à 120 et retirer la hi-hat..."
            />
          </div>

          <button
            type="submit"
            className="rounded bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Envoyer la demande
          </button>
        </form>
      </div>
    </div>
  );
}
