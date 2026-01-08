import { Navbar, Footer } from "@/components/layout";
import { teamMembers } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = teamMembers.find(m => m.slug === slug);
  
  if (!member) {
    return { title: "Membre non trouvé | Alecia" };
  }

  return {
    title: `${member.name} - ${member.role} | Alecia`,
    description: `${member.name}, ${member.role} chez Alecia. Découvrez son parcours et son expertise en fusion-acquisition.`,
  };
}

export async function generateStaticParams() {
  return teamMembers.map((member) => ({
    slug: member.slug,
  }));
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params;
  const member = teamMembers.find(m => m.slug === slug);

  if (!member) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-[var(--accent)] text-[var(--foreground-muted)]">
            <Link href="/equipe">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l&apos;équipe
            </Link>
          </Button>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Photo */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--card)]">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5">
                  <span className="text-6xl font-semibold text-[var(--accent)]">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--foreground)] mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-[var(--accent)] font-medium">
                  {member.role}
                </p>
              </div>

              {member.bio && (
                <div className="prose prose-lg dark:prose-invert">
                  <p className="text-[var(--foreground-muted)] leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              )}

              {member.linkedinUrl && (
                <Button asChild variant="outline" className="gap-2">
                  <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    Voir le profil LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
