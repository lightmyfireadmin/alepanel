import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";

import { teamMembersEnhanced, mockDeals, mockSectors } from "@/lib/data";
import { Linkedin, ArrowLeft, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const member = teamMembersEnhanced.find((m) => m.slug === slug);
  
  if (!member) return { title: "Membre non trouvé" };

  return {
    title: `${member.name} - ${member.role} | alecia`,
    description: `Découvrez le profil de ${member.name}, ${member.role} chez alecia. Expertise en fusion-acquisition pour PME et ETI.`,
  };
}

export async function generateStaticParams() {
  return teamMembersEnhanced.map((member) => ({
    slug: member.slug,
  }));
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = teamMembersEnhanced.find((m) => m.slug === slug);

  if (!member) {
    notFound();
  }

  // Get sectors this member is expert in
  const memberSectors = mockSectors.filter((s) => 
    member.sectorsExpertise?.includes(s.slug)
  );

  // Get deals associated with this member
  const memberDeals = mockDeals.filter((d) => 
    member.transactions?.includes(d.slug)
  );

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
                <Button asChild className="btn-gold w-full">
                  <Link href="/contact">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter
                  </Link>
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <div>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--foreground)] mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-[var(--accent)] font-medium">
                  {member.role}
                </p>
              </div>

              {/* Bio */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                  {member.bioFr}
                </p>
              </div>

              {/* Sector Expertise */}
              {memberSectors.length > 0 && (
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold mb-4 text-[var(--foreground)]">
                    Expertises sectorielles
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {memberSectors.map((sector) => (
                      <Link key={sector.id} href={`/secteurs/${sector.slug}`}>
                        <Badge 
                          variant="outline" 
                          className="bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30 hover:bg-[var(--accent)]/20 transition-colors px-3 py-1"
                        >
                          {sector.nameFr}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Associated Transactions */}
              {memberDeals.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--foreground)]">
                      Opérations associées
                    </h2>
                    <Link 
                      href="/operations"
                      className="text-[var(--accent)] hover:underline text-sm flex items-center gap-1"
                    >
                      Toutes les opérations
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid gap-4">
                    {memberDeals.slice(0, 3).map((deal) => (
                      <Link 
                        key={deal.id} 
                        href={`/operations/${deal.slug}`}
                        className="flex items-center justify-between p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[var(--background-tertiary)] flex items-center justify-center">
                            <span className="text-sm font-bold text-[var(--foreground-muted)]">
                              {deal.clientName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                              {deal.clientName}
                            </p>
                            <p className="text-sm text-[var(--foreground-muted)]">
                              {deal.mandateType} • {deal.year}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
