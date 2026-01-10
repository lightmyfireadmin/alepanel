import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import Link from "next/link";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getJobOffers } from "@/lib/actions/convex-marketing";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Carrières | Alecia",
  description: "Rejoignez une équipe ambitieuse.",
};

export default async function CarrieresPage() {
  const jobs = await getJobOffers();
  const activeJobs = jobs;

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Intro */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
              Carrières
            </h1>
            <p className="text-[var(--foreground-muted)] text-lg mb-8">
              Vous avez l'âme entrepreneuriale et une passion pour la finance ? 
              Rejoignez Alecia et participez à des opérations à fort enjeu.
            </p>
          </div>
        </section>

        {/* Job Offers (Displayed FIRST as requested) */}
        <section className="py-8 px-6 pb-16">
          <div className="max-w-4xl mx-auto">
             <h2 className="text-2xl font-semibold mb-8 border-b border-[var(--border)] pb-4">
                Nos opportunités actuelles
             </h2>
             
             {activeJobs.length > 0 ? (
                 <div className="space-y-4">
                     {activeJobs.map(job => (
                         <div key={job._id} className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[var(--accent)] transition-colors">
                             <div>
                                 <h3 className="font-bold text-xl mb-2">{job.title}</h3>
                                 <div className="flex gap-4 text-sm text-[var(--foreground-muted)]">
                                     <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                     <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                 </div>
                             </div>
                             <Button asChild variant="outline">
                                 <Link href={`/carrieres_3/apply/${job._id}`}>
                                     Postuler
                                 </Link>
                             </Button>
                         </div>
                     ))}
                 </div>
             ) : (
                <div className="text-center py-12 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] border-dashed">
                    <p className="text-[var(--foreground-muted)]">Aucune offre ouverte actuellement.</p>
                </div>
             )}
          </div>
        </section>

        {/* Spontaneous Application CTA */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-4">
              Candidature Spontanée
            </h2>
            <p className="text-[var(--foreground-muted)] mb-8">
              Votre profil ne correspond à aucune offre mais vous pensez pouvoir apporter de la valeur ? 
              Nous sommes toujours à l'écoute des talents.
            </p>
            <Button asChild className="btn-gold rounded-full px-8">
              <Link href="mailto:recrutement@alecia.fr">
                Envoyer mon CV <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer_3 />
    </>
  );
}
