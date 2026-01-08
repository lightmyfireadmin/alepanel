
import { SellerForm } from "@/components/features";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Céder mon entreprise | alecia",
  description:
    "Vous souhaitez céder votre entreprise ? alecia vous accompagne dans la valorisation et la transmission de votre PME ou ETI.",
};

export default function CederPage() {
  return (
    <>
      
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              Transmission d&apos;entreprise
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-semibold mb-4">
              Vous souhaitez céder votre entreprise
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Remplissez ce formulaire confidentiel pour être recontacté par l&apos;un de nos associés sous 48h.
              Toutes les informations restent strictement confidentielles.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <SellerForm />
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">100% confidentiel</h3>
                <p className="text-sm text-[var(--foreground-muted)]">Vos informations ne sont jamais partagées sans votre accord</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Réponse sous 48h</h3>
                <p className="text-sm text-[var(--foreground-muted)]">Un associé vous contacte rapidement pour un premier échange</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-[var(--foreground)] mb-1">Sans engagement</h3>
                <p className="text-sm text-[var(--foreground-muted)]">Premier échange gratuit et sans obligation</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      
    </>
  );
}
