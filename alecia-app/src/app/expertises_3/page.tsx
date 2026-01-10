import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Handshake, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expertises | Alecia",
  description: "Cession, Acquisition, Levée de fonds. Nos expertises M&A.",
};

export default function ExpertisesPage() {
  const expertises = [
    {
      id: "cession",
      icon: Handshake,
      title: "Cession & Transmission",
      desc: "Nous accompagnons les dirigeants dans la cession de leur entreprise (totale ou partielle) en maximisant la valorisation et en sécurisant la transaction.",
      details: [
        "Audit de cessibilité & Valorisation",
        "Rédaction du Mémorandum d'Information",
        "Identification des acquéreurs (France & International)",
        "Négociation des offres & closing"
      ],
      caseStudy: {
        title: "Cession Industrielle",
        client: "Groupe industriel familial",
        result: "Cession à un fonds d'investissement",
        image: "/assets/expertises/cession-case.jpg" // Placeholder path
      }
    },
    {
      id: "levee-de-fonds",
      icon: TrendingUp,
      title: "Levée de Fonds",
      desc: "Accélérer votre croissance nécessite des capitaux. Nous structurons votre levée de fonds auprès de VCs, Family Offices et fonds de dette.",
      details: [
        "Modélisation financière (Business Plan)",
        "Pitch Deck & Equity Story",
        "Roadshow investisseurs",
        "Négociation du Pacte d'Actionnaires"
      ],
      caseStudy: {
        title: "Scale-up SaaS",
        client: "Éditeur logiciel B2B",
        result: "Levée de 5 M€ (Série A)",
        image: "/assets/expertises/fundraising-case.jpg" // Placeholder path
      }
    },
    {
      id: "acquisition",
      icon: Building2,
      title: "Croissance Externe",
      desc: "Nous définissons avec vous une stratégie d'acquisition ciblée pour consolider vos parts de marché ou acquérir de nouvelles compétences.",
      details: [
        "Screening & Approche directe",
        "Analyse des synergies",
        "Valorisation & Offre indicative (LOI)",
        "Pilotage des Due Diligences"
      ],
      caseStudy: {
        title: "Build-up Stratégique",
        client: "ETI Services",
        result: "Acquisition d'un concurrent régional",
        image: "/assets/expertises/acquisition-case.jpg" // Placeholder path
      }
    }
  ];

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
              Nos Expertises
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Une approche globale du conseil financier pour accompagner chaque étape de la vie de votre entreprise.
            </p>
          </div>
        </section>

        {/* Expertises List */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
          {expertises.map((exp, index) => (
            <section 
              key={exp.id} 
              id={exp.id} 
              className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <exp.icon className="w-8 h-8" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Expertise</span>
                </div>
                
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold">
                  {exp.title}
                </h2>
                
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                  {exp.desc}
                </p>
                
                <ul className="space-y-3 mt-4">
                  {exp.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--foreground)]">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <Link 
                    href="/contact_3" 
                    className="inline-flex items-center text-[var(--accent)] font-medium hover:underline"
                  >
                    Nous parler de votre projet <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Visual / Case Study Card */}
              <div className="flex-1 w-full">
                <div className="relative group overflow-hidden rounded-2xl bg-[var(--background-secondary)] border border-[var(--border)] shadow-lg aspect-[4/3]">
                  {/* Decorative Gradient Background since we don't have real images yet */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${
                    index === 0 ? 'from-emerald-500/10 to-teal-500/5' : 
                    index === 1 ? 'from-purple-500/10 to-indigo-500/5' : 
                    'from-blue-500/10 to-cyan-500/5'
                  }`} />
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="bg-[var(--background)]/90 backdrop-blur p-6 rounded-xl border border-[var(--border)] group-hover:translate-y-[-8px] transition-transform duration-300">
                      <div className="text-xs font-semibold text-[var(--accent)] mb-2 uppercase tracking-wide">
                        Étude de cas
                      </div>
                      <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-1">
                        {exp.caseStudy.title}
                      </h3>
                      <p className="text-sm text-[var(--foreground-muted)] mb-2">
                        Client : {exp.caseStudy.client}
                      </p>
                      <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                        <span className="font-medium">{exp.caseStudy.result}</span>
                        <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer_3 />
    </>
  );
}
