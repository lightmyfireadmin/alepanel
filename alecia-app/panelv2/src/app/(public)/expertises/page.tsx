import { Navbar } from "@/components/public/layout/navbar";
import { Footer } from "@/components/public/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Building2, TrendingUp, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Expertises | Nos services M&A",
  description:
    "Cession & transmission, levée de fonds, acquisition. Découvrez nos expertises en fusion-acquisition pour PME et ETI.",
};

const expertises = [
  {
    id: "cession",
    title: "Cession & transmission",
    description:
      "La cession de votre entreprise est un moment décisif, qui requiert une préparation et une exécution irréprochables. alecia vous accompagne pour sécuriser l'opération, défendre vos intérêts et maximiser la valeur de votre entreprise, dans le respect de votre histoire et de vos collaborateurs.",
    icon: Building2,
    steps: [
      { title: "Préparation", description: "Étude réaliste et transparente de la valeur de votre entreprise, mise en place d'une stratégie de vente." },
      { title: "Identification d'acheteurs", description: "Ciblage et approche discrète des acquéreurs potentiels grâce à notre réseau extensif." },
      { title: "Négociation et closing", description: "Assistance dans toutes les phases de la négociation jusqu'à la conclusion de la vente." },
    ],
    challenges: [
      "Garantir la confidentialité des échanges",
      "Préparer une documentation adaptée aux attentes des acheteurs",
      "Optimiser la valorisation, négocier et faire entendre vos conditions",
    ],
  },
  {
    id: "levee-de-fonds",
    title: "Levée de fonds & financement",
    description:
      "Que ce soit pour financer votre croissance, investir dans de nouveaux projets, restructurer votre capital ou réaliser votre patrimoine, alecia vous offre un conseil expert en levée de fonds, adapté à vos besoins spécifiques.",
    icon: TrendingUp,
    steps: [
      { title: "Stratégie de financement", description: "Élaboration de stratégies innovantes, faisant appel à des instruments dilutifs ou non." },
      { title: "Accès à un réseau étendu", description: "Nous animons un vaste réseau d'investisseurs et d'institutions financières." },
      { title: "Structuration et négociation", description: "Assistance dans la structuration des opérations et négociation des meilleures conditions." },
    ],
    challenges: [
      "Identifier la meilleure combinaison de sources de financement",
      "Préparer une documentation convaincante",
      "Négocier des conditions favorables, alignées avec votre stratégie",
    ],
  },
  {
    id: "acquisition",
    title: "Acquisition",
    description:
      "L'acquisition d'une entreprise est un levier stratégique majeur pour accélérer la croissance de votre société. Nous vous guidons à travers ce processus complexe avec une expertise et une méthodologie éprouvées.",
    icon: Users,
    steps: [
      { title: "Analyse et évaluation", description: "Identification précise des cibles, évaluation de leur valeur et compatibilité stratégique." },
      { title: "Négociation et structuration", description: "Accompagnement dans les négociations pour optimiser les conditions financières." },
      { title: "Intégration post-acquisition", description: "Conseils stratégiques pour une intégration fluide et efficace." },
    ],
    challenges: [
      "Gagner du temps sur la recherche et l'approche de contreparties",
      "Négocier le prix, les conditions et les garanties",
      "Orchestrer des due diligence approfondies",
    ],
  },
];

export default function ExpertisesPage() {
  return (
    <>
      
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Nos expertises
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Vos projets méritent plus qu&apos;une simple expertise. Avec une expérience pointue dans les transactions et opérations financières, alecia accompagne les PME, ETI et entreprises en forte croissance.
            </p>
          </div>
        </section>

        {/* Expertise Sections */}
        {expertises.map((expertise, idx) => (
          <section
            key={expertise.id}
            id={expertise.id}
            className={`py-20 px-6 ${idx % 2 === 1 ? "bg-[var(--background-secondary)]" : ""}`}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left: Description */}
                <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <expertise.icon className="w-7 h-7 text-[var(--accent)]" />
                    </div>
                    <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold">
                      {expertise.title}
                    </h2>
                  </div>
                  <p className="text-[var(--foreground-muted)] text-lg mb-8">
                    {expertise.description}
                  </p>
                  <Button asChild className="btn-gold rounded-lg">
                    <Link href="/contact">
                      Contacter un associé
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Right: Steps & Challenges */}
                <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                  {/* Steps */}
                  <div className="space-y-4 mb-8">
                    {expertise.steps.map((step, stepIdx) => (
                      <Card key={stepIdx} className="bg-[var(--card)] border-[var(--border)]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-[var(--foreground)] text-lg flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] text-sm flex items-center justify-center">
                              {stepIdx + 1}
                            </span>
                            {step.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[var(--foreground-muted)] text-sm">
                            {step.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Challenges */}
                  <div className="bg-[var(--background-tertiary)] rounded-xl p-6 border border-[var(--border)]">
                    <h3 className="text-[var(--foreground)] font-semibold mb-4">
                      Enjeux clés
                    </h3>
                    <ul className="space-y-3">
                      {expertise.challenges.map((challenge, challengeIdx) => (
                        <li key={challengeIdx} className="flex items-start gap-3 text-[var(--foreground-muted)]">
                          <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="py-24 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold mb-6">
              Prêt à démarrer <span className="text-gradient-gold">votre projet</span> ?
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg mb-10 max-w-2xl mx-auto">
              Contactez l&apos;un de nos associés pour une première discussion confidentielle.
            </p>
            <Button size="lg" className="btn-gold text-lg px-10 py-6 rounded-xl" asChild>
              <Link href="/contact">
                Prendre contact
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      
    </>
  );
}
