import { notFound } from "next/navigation";
import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import { PressRelease_2, PressReleaseData } from "@/components/public_v2/transactions";

/**
 * Transaction Detail Page V2 - Communiqué de presse
 * 
 * Selon cahier des charges :
 * - Communiqué détaillé avec sidebar (type, date, secteur)
 * - Équipe alecia en bas de page
 * - Encart avis client
 */

// Sample data - would come from Convex in production
const transactionsData: Record<string, PressReleaseData> = {
  "cession-tech-solutions-2024": {
    id: "1",
    slug: "cession-tech-solutions-2024",
    title: "Cession majoritaire de Tech Solutions à Innovation Capital",
    clientName: "Tech Solutions",
    counterpartyName: "Innovation Capital",
    operationType: "Cession",
    date: "Mars 2024",
    year: 2024,
    sector: "Tech & Digital",
    region: "Île-de-France",
    content: `
      <p>alecia a accompagné les actionnaires de <strong>Tech Solutions</strong>, éditeur de logiciels SaaS pour la gestion de projet, dans la cession de 75% du capital à <strong>Innovation Capital</strong>, fonds d'investissement spécialisé dans les scale-ups technologiques.</p>
      
      <h3>L'entreprise</h3>
      <p>Fondée en 2015, Tech Solutions est devenue un acteur incontournable du marché français des solutions SaaS de gestion de projet. Avec plus de 500 clients entreprises et une croissance annuelle de 40%, la société a attiré l'attention de nombreux investisseurs.</p>
      
      <h3>L'opération</h3>
      <p>Cette opération de LBO valorise Tech Solutions à 35 millions d'euros. Les fondateurs conservent 25% du capital et restent impliqués dans la gestion opérationnelle de l'entreprise.</p>
      
      <h3>Perspectives</h3>
      <p>L'investissement d'Innovation Capital permettra à Tech Solutions d'accélérer son expansion européenne et de renforcer ses équipes R&D pour développer de nouvelles fonctionnalités basées sur l'intelligence artificielle.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=600&fit=crop",
    team: [
      {
        id: "1",
        name: "Christophe Martin",
        role: "Associé",
        slug: "christophe-martin",
      },
      {
        id: "2",
        name: "Sophie Dubois",
        role: "Directrice",
        slug: "sophie-dubois",
      },
      {
        id: "3",
        name: "Pierre Laurent",
        role: "Analyste Senior",
        slug: "pierre-laurent",
      },
    ],
    testimonial: {
      quote: "L'équipe d'alecia nous a accompagnés avec professionnalisme et engagement tout au long du processus. Leur connaissance du marché tech et leur réseau d'investisseurs ont été déterminants pour le succès de cette opération.",
      authorName: "Jean-Marc Dupont",
      authorRole: "CEO & Co-fondateur",
      companyName: "Tech Solutions",
    },
  },
  "acquisition-medical-plus-2024": {
    id: "2",
    slug: "acquisition-medical-plus-2024",
    title: "Medical+ acquiert HealthGroup dans le Sud-Est",
    clientName: "Medical+",
    counterpartyName: "HealthGroup",
    operationType: "Acquisition",
    date: "Février 2024",
    year: 2024,
    sector: "Santé",
    region: "Provence-Alpes-Côte d'Azur",
    content: `
      <p>alecia a conseillé <strong>Medical+</strong> dans l'acquisition de <strong>HealthGroup</strong>, laboratoire d'analyses médicales implanté dans la région PACA.</p>
      
      <h3>Contexte</h3>
      <p>Dans un marché de la biologie médicale en consolidation, Medical+ a choisi de renforcer sa présence dans le Sud-Est de la France par une stratégie de croissance externe ciblée.</p>
      
      <h3>L'opération</h3>
      <p>Cette acquisition permet à Medical+ d'intégrer 8 sites de prélèvement et d'augmenter son chiffre d'affaires de 15 millions d'euros. L'opération a été finalisée en 6 mois.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=600&fit=crop",
    team: [
      {
        id: "1",
        name: "Christophe Martin",
        role: "Associé",
        slug: "christophe-martin",
      },
      {
        id: "4",
        name: "Marie Lecomte",
        role: "Manager",
        slug: "marie-lecomte",
      },
    ],
  },
  "levee-greentech-2024": {
    id: "3",
    slug: "levee-greentech-2024",
    title: "GreenTech Energy lève 12M€ auprès d'Eco Ventures",
    clientName: "GreenTech Energy",
    counterpartyName: "Eco Ventures",
    operationType: "Levée de fonds",
    date: "Janvier 2024",
    year: 2024,
    sector: "Énergie & Environnement",
    region: "Auvergne-Rhône-Alpes",
    content: `
      <p>alecia a accompagné <strong>GreenTech Energy</strong> dans sa levée de fonds Série A de 12 millions d'euros auprès d'<strong>Eco Ventures</strong>.</p>
      
      <h3>La startup</h3>
      <p>GreenTech Energy développe une solution innovante de stockage d'énergie renouvelable destinée aux collectivités et aux sites industriels. La technologie brevetée permet une optimisation de 30% du rendement énergétique.</p>
      
      <h3>Utilisation des fonds</h3>
      <p>Cette levée de fonds permettra à GreenTech Energy de déployer sa solution dans 5 pays européens et d'accélérer ses efforts de R&D.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&h=600&fit=crop",
    team: [
      {
        id: "2",
        name: "Sophie Dubois",
        role: "Directrice",
        slug: "sophie-dubois",
      },
    ],
    testimonial: {
      quote: "alecia a parfaitement compris notre vision et a su la traduire auprès des investisseurs. Leur accompagnement a été décisif pour structurer notre levée de fonds.",
      authorName: "Claire Bernard",
      authorRole: "CEO",
      companyName: "GreenTech Energy",
    },
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TransactionDetailPage({ params }: Props) {
  const { slug } = await params;
  const transaction = transactionsData[slug];

  if (!transaction) {
    notFound();
  }

  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <PressRelease_2 data={transaction} />
      </main>
      <Footer_2 />
    </>
  );
}

// Generate static paths for known transactions
export async function generateStaticParams() {
  return Object.keys(transactionsData).map((slug) => ({ slug }));
}
