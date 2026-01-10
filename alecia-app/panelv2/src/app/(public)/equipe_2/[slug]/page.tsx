import { notFound } from "next/navigation";
import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import { MemberDeals_2, TeamMemberData } from "@/components/public_v2/equipe";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Linkedin, Mail, Quote, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Team Member Detail Page V2
 * 
 * Selon cahier des charges :
 * - Détails en surbrillance + passion
 * - Citation
 * - Carrousel des opérations conseillées
 */

// Sample data - would come from Convex in production
const teamMembersData: Record<string, TeamMemberData & { 
  fullBio: string;
  deals: Array<{
    id: string;
    slug: string;
    clientName: string;
    clientLogo?: string;
    operationType: string;
    year: number;
    sector: string;
    imageUrl?: string;
  }>;
}> = {
  "christophe-martin": {
    id: "1",
    slug: "christophe-martin",
    name: "Christophe Martin",
    role: "Associé Fondateur",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
    bio: "Plus de 20 ans d'expérience en conseil M&A.",
    fullBio: `Christophe Martin a fondé alecia en 2015 après une carrière de plus de 20 ans dans le conseil en fusion-acquisition. 

Ancien directeur d'une banque d'affaires internationale, il a accompagné plus de 100 opérations de cession, acquisition et levée de fonds pour des PME et ETI françaises.

Sa vision : offrir aux entrepreneurs un accompagnement de proximité, avec l'expertise d'une grande banque d'affaires mais la réactivité et l'engagement d'une structure à taille humaine.

Diplômé d'HEC Paris et titulaire d'un MBA de l'INSEAD, Christophe intervient principalement sur les secteurs Tech, Industrie et Services B2B.`,
    passion: "Voile et œnologie",
    quote: "Chaque transaction est une aventure humaine autant que financière. Notre rôle est d'accompagner les dirigeants dans une étape souvent unique de leur vie professionnelle.",
    email: "christophe.martin@alecia.fr",
    linkedin: "https://linkedin.com/in/christophemartin",
    expertises: ["Tech & Digital", "Industrie", "Services B2B", "Private Equity"],
    transactionsCount: 45,
    deals: [
      {
        id: "1",
        slug: "cession-tech-solutions-2024",
        clientName: "Tech Solutions",
        operationType: "Cession",
        year: 2024,
        sector: "Tech & Digital",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
      },
      {
        id: "2",
        slug: "acquisition-medical-plus-2024",
        clientName: "Medical+",
        operationType: "Acquisition",
        year: 2024,
        sector: "Santé",
        imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop",
      },
      {
        id: "4",
        slug: "cession-metal-industries-2023",
        clientName: "Métal Industries",
        operationType: "Cession",
        year: 2023,
        sector: "Industrie",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop",
      },
    ],
  },
  "sophie-dubois": {
    id: "2",
    slug: "sophie-dubois",
    name: "Sophie Dubois",
    role: "Associée",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    bio: "Spécialiste des levées de fonds et des opérations cross-border.",
    fullBio: `Sophie Dubois a rejoint alecia en 2018 en tant qu'Associée, après 15 ans d'expérience en private equity et M&A.

Spécialiste des levées de fonds et des opérations cross-border, elle accompagne particulièrement les entreprises du secteur Tech et Énergie dans leurs projets de croissance.

Avant alecia, Sophie a travaillé chez un fonds d'investissement paneuropéen où elle a réalisé plus de 20 investissements dans des scale-ups technologiques.

Diplômée de l'ESSEC et titulaire d'un Master en Finance de la London Business School.`,
    passion: "Trail running et photographie",
    quote: "La clé du succès, c'est l'écoute et la préparation. Comprendre les motivations profondes de chaque partie permet de trouver les solutions qui créent de la valeur pour tous.",
    email: "sophie.dubois@alecia.fr",
    linkedin: "https://linkedin.com/in/sophiedubois",
    expertises: ["Levée de fonds", "Tech", "Énergie", "Cross-border"],
    transactionsCount: 38,
    deals: [
      {
        id: "3",
        slug: "levee-greentech-2024",
        clientName: "GreenTech Energy",
        operationType: "Levée de fonds",
        year: 2024,
        sector: "Énergie",
        imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop",
      },
      {
        id: "7",
        slug: "levee-fintech-2023",
        clientName: "PayFlow",
        operationType: "Levée de fonds",
        year: 2023,
        sector: "Fintech",
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      },
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TeamMemberDetailPage({ params }: Props) {
  const { slug } = await params;
  const member = teamMembersData[slug];

  if (!member) {
    notFound();
  }

  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/equipe_2"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'équipe
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Photo */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--background-secondary)] shadow-xl">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#061a40] to-[#19354e] flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/30">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex gap-3 mt-6">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/30 transition-colors"
                    >
                      <Linkedin className="w-4 h-4 text-[#0077b5]" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/30 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[var(--accent)]" />
                      <span className="text-sm">Email</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-[var(--foreground)] mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-[var(--accent)]">{member.role}</p>
              </header>

              {/* Stats */}
              <div className="flex gap-6 mb-8 p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--foreground)]">
                      {member.transactionsCount}+
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">Transactions</p>
                  </div>
                </div>
              </div>

              {/* Quote */}
              {member.quote && (
                <div className="mb-8 p-6 bg-gradient-to-br from-[#061a40] to-[#19354e] rounded-2xl text-white">
                  <Quote className="w-8 h-8 text-amber-400 mb-4" />
                  <blockquote className="text-lg leading-relaxed italic">
                    "{member.quote}"
                  </blockquote>
                </div>
              )}

              {/* Bio */}
              <div className="prose prose-lg max-w-none mb-8">
                {member.fullBio.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-[var(--foreground-muted)] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Passion */}
              {member.passion && (
                <div className="mb-8 p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                  <span className="text-xs uppercase tracking-wider text-[var(--accent)] font-medium">
                    Passion
                  </span>
                  <p className="mt-1 text-[var(--foreground)]">{member.passion}</p>
                </div>
              )}

              {/* Expertises */}
              {member.expertises && member.expertises.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm uppercase tracking-wider text-[var(--foreground-muted)] mb-4">
                    Secteurs d'expertise
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.expertises.map((exp) => (
                      <span
                        key={exp}
                        className="px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] rounded-full text-sm text-[var(--foreground)]"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Deals Carousel */}
              {member.deals && member.deals.length > 0 && (
                <MemberDeals_2 
                  memberName={member.name.split(" ")[0]} 
                  deals={member.deals} 
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer_2 />
    </>
  );
}

// Generate static paths for known team members
export async function generateStaticParams() {
  return Object.keys(teamMembersData).map((slug) => ({ slug }));
}
