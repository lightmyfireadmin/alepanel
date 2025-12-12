import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowRight, Users, TrendingUp, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Nous rejoindre | Carrières chez alecia",
  description:
    "Rejoignez l'équipe alecia. Découvrez nos offres d'emploi et opportunités en fusion-acquisition pour PME et ETI.",
};

const openPositions = [
  {
    id: "1",
    title: "Analyste M&A",
    type: "CDI",
    location: "Paris",
    description:
      "Participez à des opérations de fusion-acquisition aux côtés de nos associés. Vous interviendrez sur l'ensemble du processus : évaluation, négociation et closing.",
    requirements: [
      "Master en finance, école de commerce ou équivalent",
      "1-3 ans d'expérience en M&A, Transaction Services ou Corporate Finance",
      "Excellentes capacités analytiques et de modélisation",
      "Anglais courant",
    ],
  },
  {
    id: "2",
    title: "Stagiaire Analyste",
    type: "Stage 6 mois",
    location: "Paris ou Lyon",
    description:
      "Intégrez notre équipe pour un stage formateur au cœur des opérations M&A. Vous participerez activement aux projets en cours.",
    requirements: [
      "En cours de Master en finance ou école de commerce",
      "Première expérience en finance appréciée",
      "Rigueur et autonomie",
      "Maîtrise d'Excel et PowerPoint",
    ],
  },
];

const values = [
  {
    icon: Users,
    title: "Esprit d'équipe",
    description: "Une collaboration étroite entre associés et analystes sur chaque projet.",
  },
  {
    icon: TrendingUp,
    title: "Développement",
    description: "Des responsabilités croissantes et un accompagnement personnalisé.",
  },
  {
    icon: Heart,
    title: "Qualité de vie",
    description: "Un équilibre travail-vie personnelle respecté et des bureaux modernes.",
  },
];

export default function NousRejoindrePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              Carrières
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Rejoignez l&apos;aventure alecia
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Nous recherchons des talents passionnés par les opérations de haut de bilan
              et le conseil aux entrepreneurs.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-center mb-10 text-[var(--foreground)]">
              Pourquoi nous rejoindre ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-[var(--accent)]" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">{value.title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-8 text-[var(--foreground)]">
              Postes ouverts
            </h2>
            <div className="space-y-6">
              {openPositions.map((position) => (
                <Card key={position.id} className="bg-[var(--card)] border-[var(--border)]">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-xl">
                          {position.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-[var(--foreground-muted)]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {position.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {position.location}
                          </span>
                        </div>
                      </div>
                      <Button asChild className="btn-gold rounded-lg w-fit">
                        <Link href={`/contact?subject=Candidature: ${position.title}`}>
                          Postuler
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--foreground-muted)] mb-4">{position.description}</p>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)] mb-2">Profil recherché :</p>
                      <ul className="space-y-1">
                        {position.requirements.map((req, idx) => (
                          <li key={idx} className="text-sm text-[var(--foreground-muted)] flex items-start gap-2">
                            <span className="text-[var(--accent)]">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Spontaneous Application CTA */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto text-center">
            <Briefcase className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
              Candidature spontanée
            </h2>
            <p className="text-[var(--foreground-muted)] mb-6 max-w-xl mx-auto">
              Aucune offre ne correspond à votre profil ? Envoyez-nous votre candidature spontanée,
              nous sommes toujours à la recherche de nouveaux talents.
            </p>
            <Button asChild className="btn-gold rounded-lg">
              <Link href="/contact?subject=Candidature spontanée">
                Envoyer ma candidature
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
