import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import { TeamGrid_2, TeamMemberData } from "@/components/public_v2/equipe";

/**
 * Équipe Page V2 - Grille de l'équipe
 * 
 * Selon cahier des charges (style albarest-partners.com) :
 * - Reprise des infos de la page actuelle
 * - Grille avec fenêtre détails en surbrillance
 */

// Sample data - would come from Convex in production
const teamMembers: TeamMemberData[] = [
  {
    id: "1",
    slug: "christophe-martin",
    name: "Christophe Martin",
    role: "Associé Fondateur",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    bio: "Plus de 20 ans d'expérience en conseil M&A. Ancien directeur chez une banque d'affaires internationale avant de fonder alecia.",
    passion: "Voile et œnologie",
    quote: "Chaque transaction est une aventure humaine autant que financière.",
    email: "christophe.martin@alecia.fr",
    linkedin: "https://linkedin.com/in/christophemartin",
    expertises: ["Tech & Digital", "Industrie", "Services B2B"],
    transactionsCount: 45,
  },
  {
    id: "2",
    slug: "sophie-dubois",
    name: "Sophie Dubois",
    role: "Associée",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    bio: "Spécialiste des levées de fonds et des opérations cross-border. 15 ans d'expérience en private equity et M&A.",
    passion: "Trail running et photographie",
    quote: "La clé du succès, c'est l'écoute et la préparation.",
    email: "sophie.dubois@alecia.fr",
    linkedin: "https://linkedin.com/in/sophiedubois",
    expertises: ["Levée de fonds", "Tech", "Énergie"],
    transactionsCount: 38,
  },
  {
    id: "3",
    slug: "pierre-laurent",
    name: "Pierre Laurent",
    role: "Associé",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop",
    bio: "Expert en valorisation et structuration d'opérations complexes. Ancien auditeur Big Four.",
    passion: "Golf et histoire",
    quote: "La rigueur est le fondement de toute négociation réussie.",
    email: "pierre.laurent@alecia.fr",
    linkedin: "https://linkedin.com/in/pierrelaurent",
    expertises: ["Santé", "Distribution", "Agroalimentaire"],
    transactionsCount: 32,
  },
  {
    id: "4",
    slug: "marie-lecomte",
    name: "Marie Lecomte",
    role: "Directrice",
    photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
    bio: "Responsable des opérations dans le Sud-Est. Expertise reconnue dans le secteur de la santé et du tourisme.",
    passion: "Plongée sous-marine",
    email: "marie.lecomte@alecia.fr",
    linkedin: "https://linkedin.com/in/marielecomte",
    expertises: ["Santé", "Hôtellerie", "Tourisme"],
    transactionsCount: 22,
  },
  {
    id: "5",
    slug: "thomas-bernard",
    name: "Thomas Bernard",
    role: "Manager",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop",
    bio: "Spécialisé dans les opérations industrielles et les PME familiales.",
    passion: "Cyclisme",
    email: "thomas.bernard@alecia.fr",
    linkedin: "https://linkedin.com/in/thomasbernard",
    expertises: ["Industrie", "BTP", "Transport"],
    transactionsCount: 15,
  },
  {
    id: "6",
    slug: "julie-moreau",
    name: "Julie Moreau",
    role: "Analyste Senior",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    bio: "Expertise en modélisation financière et due diligence.",
    passion: "Yoga et lecture",
    email: "julie.moreau@alecia.fr",
    linkedin: "https://linkedin.com/in/juliemoreau",
    expertises: ["Tech", "Fintech", "SaaS"],
    transactionsCount: 12,
  },
  {
    id: "7",
    slug: "nicolas-petit",
    name: "Nicolas Petit",
    role: "Analyste",
    photoUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop",
    bio: "Diplômé d'HEC, spécialisé dans l'analyse sectorielle et la recherche de cibles.",
    passion: "Tennis",
    email: "nicolas.petit@alecia.fr",
    linkedin: "https://linkedin.com/in/nicolaspetit",
    expertises: ["Distribution", "E-commerce"],
    transactionsCount: 8,
  },
  {
    id: "8",
    slug: "emma-garcia",
    name: "Emma Garcia",
    role: "Analyste",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
    bio: "Double diplôme en finance et droit des affaires. Expertise en documentation juridique.",
    passion: "Piano et voyages",
    email: "emma.garcia@alecia.fr",
    linkedin: "https://linkedin.com/in/emmagarcia",
    expertises: ["Juridique", "Services"],
    transactionsCount: 6,
  },
];

export default function EquipePage2() {
  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Notre équipe
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
              Des experts à vos côtés
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Une équipe d'experts en fusion-acquisition, dédiée à l'accompagnement 
              des dirigeants de PME et ETI dans leurs opérations de capital.
            </p>
          </div>

          {/* Team Grid */}
          <TeamGrid_2 members={teamMembers} />
        </div>
      </main>
      <Footer_2 />
    </>
  );
}
