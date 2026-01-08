
import { BuyerForm } from "@/components/features";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acquérir une entreprise | alecia",
  description:
    "Vous recherchez des opportunités d'acquisition ? Inscrivez-vous pour recevoir nos opportunités correspondant à vos critères.",
};

export default function AcquerirPage() {
  return (
    <>
      
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              Croissance externe
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
              Vous recherchez des opportunités d&apos;acquisition
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Inscrivez-vous pour recevoir nos opportunités d&apos;investissement correspondant à vos critères.
              Accédez à des dossiers off-market avant leur mise en marché.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <BuyerForm />
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-center mb-8 text-[var(--foreground)]">
              Pourquoi s&apos;inscrire ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Accès exclusif</h3>
                <p className="text-sm text-[var(--foreground-muted)]">Opportunités off-market non publiées sur le marché</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Matching intelligent</h3>
                <p className="text-sm text-[var(--foreground-muted)]">Dossiers filtrés selon vos critères sectoriels et financiers</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Réactivité</h3>
                <p className="text-sm text-[var(--foreground-muted)]">Alertes en temps réel dès la mise en marché</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
}
