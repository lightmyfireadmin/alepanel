import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";
import { teamMembers } from "@/lib/data";
import { Linkedin, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);
  
  if (!member) return { title: "Membre non trouvé" };

  return {
    title: `${member.name} - ${member.role} | alecia`,
    description: `Découvrez le profil de ${member.name}, ${member.role} chez alecia.`,
  };
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-[var(--accent)] text-[var(--foreground-muted)]">
            <Link href="/equipe">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l&apos;équipe
            </Link>
          </Button>
          
          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12">
            {/* Sidebar / Photo */}
            <div className="space-y-6">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--background-tertiary)] shadow-lg">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-[var(--foreground-faint)]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
                {member.linkedinUrl && (
                  <Button asChild variant="outline" className="w-full justify-start border-[var(--border)] hover:text-[#0077b5] hover:border-[#0077b5]">
                    <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {/* Email placeholder if we had email in data */}
                <Button asChild className="btn-gold w-full">
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Link>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--foreground)] mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-[var(--accent)] font-medium">
                  {member.role}
                </p>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--foreground-muted)]">
                <p>
                  Ici devrait figurer la bio détaillée de {member.name}. 
                  (Contenu à récupérer depuis le site original ou à rédiger).
                </p>
                <p>
                  Expertise principale : Fusion-Acquisition, Conseil stratégique...
                </p>
                <h3>Parcours</h3>
                <ul>
                  <li>Expérience précédente 1</li>
                  <li>Expérience précédente 2</li>
                  <li>Formation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
