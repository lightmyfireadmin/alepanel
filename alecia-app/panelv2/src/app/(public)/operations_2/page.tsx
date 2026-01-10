import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import { TransactionsGrid_2, TombstoneData } from "@/components/public_v2/transactions";

/**
 * Transactions Page V2 - Liste des opérations
 * 
 * Selon cahier des charges :
 * - Classement par région / type / secteur avec filtres
 * - 3 tombstones par ligne
 * - Format carré avec flip animation
 */

// Sample data - would come from Convex in production
const sampleTransactions: TombstoneData[] = [
  {
    id: "1",
    slug: "cession-tech-solutions-2024",
    clientName: "Tech Solutions",
    counterpartyName: "Innovation Capital",
    shortDescription: "Cession majoritaire d'un éditeur de logiciels SaaS à un fonds d'investissement.",
    fullDescription: "Accompagnement des actionnaires dans la cession de 75% du capital à Innovation Capital, fonds spécialisé dans les scale-ups technologiques. L'opération valorise la société à 35M€.",
    year: 2024,
    sector: "Tech & Digital",
    region: "Île-de-France",
    operationType: "Cession",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=800&fit=crop",
  },
  {
    id: "2",
    slug: "acquisition-medical-plus-2024",
    clientName: "Medical+",
    counterpartyName: "HealthGroup",
    shortDescription: "Accompagnement à l'acquisition d'un laboratoire d'analyses dans le Sud-Est.",
    fullDescription: "Build-up stratégique pour Medical+ avec l'acquisition du laboratoire HealthGroup, renforçant sa présence dans la région PACA.",
    year: 2024,
    sector: "Santé",
    region: "Provence-Alpes-Côte d'Azur",
    operationType: "Acquisition",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=800&fit=crop",
  },
  {
    id: "3",
    slug: "levee-greentech-2024",
    clientName: "GreenTech Energy",
    counterpartyName: "Eco Ventures",
    shortDescription: "Levée de fonds Série A pour accélérer le déploiement d'une solution d'énergie renouvelable.",
    fullDescription: "Accompagnement dans la structuration et la négociation d'une levée de fonds de 12M€ auprès d'Eco Ventures pour financer l'expansion européenne.",
    year: 2024,
    sector: "Énergie & Environnement",
    region: "Auvergne-Rhône-Alpes",
    operationType: "Levée de fonds",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=800&fit=crop",
  },
  {
    id: "4",
    slug: "cession-metal-industries-2023",
    clientName: "Métal Industries",
    counterpartyName: "Industrial Partners",
    shortDescription: "Cession totale d'un groupe industriel spécialisé dans la transformation métallique.",
    fullDescription: "Cession 100% du capital à Industrial Partners, ETI européenne du secteur métallurgique. Valorisation de 28M€.",
    year: 2023,
    sector: "Industrie",
    region: "Grand Est",
    operationType: "Cession",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=800&fit=crop",
  },
  {
    id: "5",
    slug: "acquisition-retail-group-2023",
    clientName: "Retail Group",
    counterpartyName: "Commerce Holdings",
    shortDescription: "Build-up stratégique avec l'acquisition de 3 enseignes dans la distribution spécialisée.",
    fullDescription: "Accompagnement de Retail Group dans une stratégie de croissance externe avec l'acquisition de 3 enseignes régionales.",
    year: 2023,
    sector: "Distribution",
    region: "Bretagne",
    operationType: "Acquisition",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop",
  },
  {
    id: "6",
    slug: "cession-agri-tech-2023",
    clientName: "AgriTech Pro",
    counterpartyName: "Farming Future",
    shortDescription: "Cession majoritaire d'une startup agritech spécialisée dans l'agriculture de précision.",
    fullDescription: "Accompagnement des fondateurs dans la cession de 60% du capital à Farming Future, acteur européen de l'agritech.",
    year: 2023,
    sector: "Agriculture & Agritech",
    region: "Nouvelle-Aquitaine",
    operationType: "Cession",
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=800&fit=crop",
  },
  {
    id: "7",
    slug: "levee-fintech-2023",
    clientName: "PayFlow",
    counterpartyName: "Fintech Ventures",
    shortDescription: "Levée de fonds Série B pour une fintech spécialisée dans les paiements B2B.",
    fullDescription: "Structuration d'une levée de 25M€ pour accélérer le développement international de PayFlow.",
    year: 2023,
    sector: "Fintech",
    region: "Île-de-France",
    operationType: "Levée de fonds",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=800&fit=crop",
  },
  {
    id: "8",
    slug: "cession-hotel-group-2022",
    clientName: "Hôtels du Sud",
    counterpartyName: "Hospitality Partners",
    shortDescription: "Cession d'un groupe hôtelier régional comprenant 5 établissements.",
    fullDescription: "Accompagnement de la famille fondatrice dans la cession de l'ensemble du groupe à Hospitality Partners.",
    year: 2022,
    sector: "Hôtellerie & Tourisme",
    region: "Provence-Alpes-Côte d'Azur",
    operationType: "Cession",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=800&fit=crop",
  },
  {
    id: "9",
    slug: "acquisition-logistique-2022",
    clientName: "LogiPro",
    counterpartyName: "TransEurope",
    shortDescription: "Acquisition stratégique dans le secteur de la logistique du dernier kilomètre.",
    fullDescription: "Accompagnement de LogiPro dans l'acquisition de TransEurope pour renforcer sa présence sur le segment du e-commerce.",
    year: 2022,
    sector: "Transport & Logistique",
    region: "Hauts-de-France",
    operationType: "Acquisition",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=800&fit=crop",
  },
];

export default function OperationsPage2() {
  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Track Record
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
              Nos transactions
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Découvrez les opérations que nous avons accompagnées : cessions, acquisitions 
              et levées de fonds pour des PME et ETI de tous secteurs.
            </p>
          </div>

          {/* Transactions Grid with Filters */}
          <TransactionsGrid_2 transactions={sampleTransactions} />
        </div>
      </main>
      <Footer_2 />
    </>
  );
}
