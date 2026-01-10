import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import Link from "next/link";
import { MapPin, Clock, Briefcase, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Carrières Page V2
 * 
 * Selon cahier des charges :
 * - Offres d'emploi AVANT la section "Postuler"
 * - Postuler tout à la fin
 */

interface JobOffer {
  id: string;
  title: string;
  location: string;
  type: string; // CDI, Stage, etc.
  description: string;
  requirements: string[];
  isUrgent?: boolean;
}

// Sample data - would come from Convex in production
const jobOffers: JobOffer[] = [
  {
    id: "1",
    title: "Analyste M&A Junior",
    location: "Paris",
    type: "CDI",
    description: "Vous participerez à l'ensemble des phases des opérations : origination, valorisation, due diligence, négociation et closing.",
    requirements: [
      "Diplôme Grande École de Commerce ou d'Ingénieurs",
      "0-2 ans d'expérience en M&A, audit ou transaction services",
      "Excellentes capacités analytiques et rédactionnelles",
      "Anglais courant",
    ],
  },
  {
    id: "2",
    title: "Analyste M&A Confirmé",
    location: "Lyon",
    type: "CDI",
    description: "Vous interviendrez en autonomie sur des dossiers de cession et d'acquisition de PME, sous la supervision d'un Directeur.",
    requirements: [
      "3-5 ans d'expérience en M&A ou Corporate Finance",
      "Maîtrise de la modélisation financière",
      "Capacité à gérer plusieurs dossiers en parallèle",
      "Sens du relationnel et esprit entrepreneurial",
    ],
    isUrgent: true,
  },
  {
    id: "3",
    title: "Stage Analyste M&A",
    location: "Paris ou Aix-en-Provence",
    type: "Stage 6 mois",
    description: "Stage de fin d'études au sein d'une équipe dynamique, avec une exposition directe aux opérations.",
    requirements: [
      "En cours de Master 2 Finance/Grande École",
      "Première expérience en finance d'entreprise appréciée",
      "Rigueur, curiosité et esprit d'équipe",
      "Maîtrise d'Excel et PowerPoint",
    ],
  },
];

export default function CarrieresPage2() {
  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Carrières
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
              Rejoignez-nous
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Nous recherchons des talents passionnés par le M&A et l'accompagnement 
              des entrepreneurs dans leurs projets stratégiques.
            </p>
          </div>

          {/* Why alecia */}
          <section className="mb-16 p-8 bg-gradient-to-br from-[#061a40] to-[#19354e] rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-6">Pourquoi rejoindre alecia ?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-amber-400 mb-2">Exposition directe</h3>
                <p className="text-white/70 text-sm">
                  Travaillez en direct avec les dirigeants d'entreprise et participez 
                  à toutes les phases des opérations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-amber-400 mb-2">Diversité des secteurs</h3>
                <p className="text-white/70 text-sm">
                  Intervenez sur des dossiers variés : tech, industrie, santé, services... 
                  pour développer une expertise multisectorielle.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-amber-400 mb-2">Évolution rapide</h3>
                <p className="text-white/70 text-sm">
                  Structure à taille humaine avec des perspectives d'évolution rapides 
                  et une formation continue.
                </p>
              </div>
            </div>
          </section>

          {/* Job Offers - AVANT Postuler selon CDC */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
              Nos offres d'emploi
            </h2>
            
            {jobOffers.length > 0 ? (
              <div className="space-y-6">
                {jobOffers.map((job) => (
                  <div
                    key={job.id}
                    className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--accent)]/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {/* Title & Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-[var(--foreground)]">
                            {job.title}
                          </h3>
                          {job.isUrgent && (
                            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                              Urgent
                            </span>
                          )}
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground-muted)] mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[var(--foreground-muted)] mb-4">
                          {job.description}
                        </p>

                        {/* Requirements */}
                        <ul className="space-y-1">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground-muted)]">
                              <span className="text-[var(--accent)]">•</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply Button */}
                      <div className="flex-shrink-0">
                        <a
                          href="#postuler"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#061a40] to-[#19354e] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Postuler
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--background-secondary)] rounded-2xl">
                <p className="text-[var(--foreground-muted)]">
                  Aucune offre disponible pour le moment. N'hésitez pas à envoyer 
                  une candidature spontanée.
                </p>
              </div>
            )}
          </section>

          {/* Postuler - À LA FIN selon CDC */}
          <section id="postuler" className="scroll-mt-32">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                  Postuler
                </h2>
                <p className="text-[var(--foreground-muted)] mb-8">
                  Envoyez-nous votre CV et lettre de motivation. Nous reviendrons 
                  vers vous dans les meilleurs délais.
                </p>
                
                <a
                  href="mailto:recrutement@alecia.fr?subject=Candidature"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#061a40] to-[#19354e] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                  recrutement@alecia.fr
                </a>
                
                <p className="mt-6 text-sm text-[var(--foreground-muted)]">
                  Candidatures spontanées bienvenues pour tous les bureaux : 
                  Paris, Lyon, Aix-en-Provence, Nice.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer_2 />
    </>
  );
}
