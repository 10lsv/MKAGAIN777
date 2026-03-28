import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - MK",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-12 md:max-w-xl md:px-8">
      <h1 className="text-lg font-bold tracking-wide md:text-2xl">Services</h1>
      <p className="mt-3 text-sm text-white/40 leading-relaxed">
        Modification d&apos;instrumentale sur-mesure. Changement de BPM,
        ajout ou retrait d&apos;instruments, restructuration.
      </p>

      <form
        action="https://formspree.io/f/xyzgobvl"
        method="POST"
        className="mt-8 space-y-4"
      >
        <input type="hidden" name="_subject" value="Demande de service MK Beats" />

        <input
          type="text"
          name="name"
          required
          placeholder="Nom / Pseudo"
          className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent"
        />

        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent"
        />

        <input
          type="text"
          name="beat"
          placeholder="Beat concern&eacute; (optionnel)"
          className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent"
        />

        <textarea
          name="message"
          required
          rows={4}
          placeholder="D&eacute;cris ta demande..."
          className="w-full border-b border-white/10 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-accent resize-none"
        />

        <button
          type="submit"
          className="mt-2 w-full py-3 text-sm font-medium bg-accent text-white hover:bg-red-700 transition-colors md:w-auto md:px-12"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
