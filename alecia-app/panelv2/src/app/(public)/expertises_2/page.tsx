import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import { TrendingUp, Target, Handshake, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/**
 * Expertises Page V2
 * 
 * Selon cahier des charges :
 * - Simplifier et ne pas aller autant dans le détail
 * - Illustrer chaque expertise avec une étude de cas (style by-cap.com)
 */

const expertises = [
  {
    id: "cession",
    icon: TrendingUp,
    title: "Cession & Transmission",
    subtitle: "Valorisez votre entreprise",
    description: "Nous accompagnons les dirigeants et actionnaires dans la cession totale ou partielle de leur entreprise. Notre approche sur-mesure garantit une valorisation optimale et une transaction sécurisée.",
    points: [
      "Valorisation indépendante et réaliste",
      "Identification des acquéreurs stratégiques",
      "Négociation et structuration de l'opération",
      "Accompagnement jusqu'au closing",
    ],
    caseStudy: {
      title: "Tech Solutions",
      description: "Cession de 75% du capital à Innovation Capital. Valorisation : 35M€.",
      slug: "cession-tech-solutions-2024",
      imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop",
    },
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "acquisition",
    icon: Target,
    title: "Acquisition",
    subtitle: "Accélérez votre croissance",
    description: "Nous accompagnons les entreprises dans leur stratégie de croissance externe, de l'identification des cibles à l'intégration post-acquisition.",
    points: [
      "Définition de la stratégie d'acquisition",
      "Screening et approche des cibles",
      "Due diligence et valorisation",
      "Négociation et closing",
    ],
    caseStudy: {
      title: "Medical+",
      description: "Acquisition de HealthGroup dans le secteur de la santé en région PACA.",
      slug: "acquisition-medical-plus-2024",
      imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop",
    },
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "levee-de-fonds",
    icon: Handshake,
    title: "Levée de fonds",
    subtitle: "Financez votre ambition",
    description: "Nous structurons et négocions vos tours de financement pour accélérer votre développement, en vous mettant en relation avec les investisseurs adaptés à votre projet.",
    points: [
      "Préparation du dossier investisseurs",
      "Identification des fonds adaptés",
      "Roadshow et négociation",
      "Term sheet et closing",
    ],
    caseStudy: {
      title: "GreenTech Energy",
      description: "Levée de 12M€ en Série A auprès d'Eco Ventures pour l'expansion européenne.",
      slug: "levee-greentech-2024",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=500&fit=crop",
    },
    color: "from-amber-500 to-amber-600",
  },
];

export default function ExpertisesPage2() {
  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-[var(--background-secondary)] to-[var(--background)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Nos expertises
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
              Un accompagnement sur-mesure
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Cession, acquisition ou levée de fonds : nous adaptons notre approche 
              à chaque projet pour maximiser sa réussite.
            </p>
          </div>
        </section>

        {/* Expertises */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">
              {expertises.map((expertise, index) => (
                <div
                  key={expertise.id}
                  id={expertise.id}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content */}
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${expertise.color} text-white mb-6`}>
                      <expertise.icon className="w-7 h-7" />
                    </div>

                    <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                      {expertise.title}
                    </h2>
                    <p className="text-lg text-[var(--accent)] mb-4">
                      {expertise.subtitle}
                    </p>
                    <p className="text-[var(--foreground-muted)] leading-relaxed mb-6">
                      {expertise.description}
                    </p>

                    {/* Points */}
                    <ul className="space-y-3 mb-8">
                      {expertise.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                          <span className="text-[var(--foreground)]">{point}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact_2"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#061a40] to-[#19354e] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Discutons de votre projet
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Case Study */}
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <Link
                      href={`/operations_2/${expertise.caseStudy.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
                        <Image
                          src={expertise.caseStudy.imageUrl}
                          alt={expertise.caseStudy.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <span className="text-xs uppercase tracking-wider text-amber-400">
                            Étude de cas
                          </span>
                          <h3 className="text-xl font-bold mt-1 group-hover:text-amber-400 transition-colors">
                            {expertise.caseStudy.title}
                          </h3>
                          <p className="text-sm text-white/80 mt-2">
                            {expertise.caseStudy.description}
                          </p>
                          <div className="flex items-center gap-2 mt-4 text-sm text-amber-400">
                            <span>Voir le détail</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-[#061a40] to-[#19354e]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Un projet en tête ?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Échangeons sur votre projet en toute confidentialité. 
              Premier entretien sans engagement.
            </p>
            <Link
              href="/contact_2"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#061a40] font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Prendre rendez-vous
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer_2 />
    </>
  );
}
