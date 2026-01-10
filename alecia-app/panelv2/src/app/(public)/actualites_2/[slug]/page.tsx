import { notFound } from "next/navigation";
import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * News Detail Page V2
 * Format identique aux communiqués de presse
 */

interface NewsData {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  content: string;
  imageUrl?: string;
}

const newsData: Record<string, NewsData> = {
  "alecia-ouvre-bureau-lyon": {
    id: "1",
    slug: "alecia-ouvre-bureau-lyon",
    title: "alecia ouvre un nouveau bureau à Lyon",
    date: "15 janvier 2024",
    category: "Actualité cabinet",
    content: `
      <p><strong>alecia</strong> poursuit son développement régional avec l'ouverture d'un nouveau 
      bureau à Lyon, au cœur du quartier d'affaires de la Part-Dieu.</p>
      
      <h3>Une présence renforcée en Auvergne-Rhône-Alpes</h3>
      <p>Cette implantation stratégique nous permet d'accompagner au plus près les entrepreneurs 
      de la région Auvergne-Rhône-Alpes dans leurs projets de cession, acquisition et levée de fonds.</p>
      
      <p>Lyon, deuxième métropole économique française, concentre un tissu dense de PME et ETI 
      dans des secteurs stratégiques : industrie, santé, tech et services.</p>
      
      <h3>Une équipe dédiée</h3>
      <p>Notre bureau lyonnais sera dirigé par Thomas Bernard, Manager chez alecia depuis 3 ans, 
      spécialisé dans les opérations industrielles.</p>
      
      <p>Cette ouverture porte à 4 le nombre de bureaux alecia en France : Paris, Aix-en-Provence, 
      Nice et désormais Lyon.</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=1200&h=600&fit=crop",
  },
  "alecia-salon-entrepreneurs": {
    id: "2",
    slug: "alecia-salon-entrepreneurs",
    title: "alecia au Salon des Entrepreneurs 2024",
    date: "5 janvier 2024",
    category: "Événement",
    content: `
      <p>Retrouvez l'équipe <strong>alecia</strong> au Salon des Entrepreneurs de Paris, 
      les 7 et 8 février 2024, Palais des Congrès de Paris.</p>
      
      <h3>Stand C42</h3>
      <p>Venez échanger avec nos experts sur vos projets de cession, acquisition ou levée de fonds. 
      Nous serons présents pendant les deux jours du salon pour répondre à vos questions.</p>
      
      <h3>Conférence</h3>
      <p>Christophe Martin, Associé Fondateur, interviendra le 7 février à 14h sur le thème : 
      "Céder son entreprise : les clés d'une transmission réussie".</p>
    `,
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = newsData[slug];

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Back Link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/actualites_2"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                <Calendar className="w-4 h-4" />
                {article.date}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)]">
              {article.title}
            </h1>
          </header>

          {/* Image */}
          {article.imageUrl && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-[var(--foreground)] prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground-muted)] prose-strong:text-[var(--foreground)] prose-a:text-[var(--accent)]"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share */}
          <div className="mt-12 pt-8 border-t border-[var(--border)] flex justify-center">
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Partager cet article
            </Button>
          </div>
        </article>
      </main>
      <Footer_2 />
    </>
  );
}

export async function generateStaticParams() {
  return Object.keys(newsData).map((slug) => ({ slug }));
}
