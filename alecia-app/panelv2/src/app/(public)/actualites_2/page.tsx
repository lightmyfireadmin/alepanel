import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";

/**
 * Actualités Page V2
 * 
 * Selon cahier des charges :
 * - Actualités en lien avec alecia (événements, création banque d'affaires, etc.)
 * - Format des pages identiques aux communiqués de presse
 */

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
}

// Sample data - would come from Convex in production
const newsItems: NewsItem[] = [
  {
    id: "1",
    slug: "alecia-ouvre-bureau-lyon",
    title: "alecia ouvre un nouveau bureau à Lyon",
    excerpt: "Pour renforcer notre présence en Auvergne-Rhône-Alpes, nous inaugurons un bureau à Lyon, au cœur du quartier d'affaires de la Part-Dieu.",
    date: "15 janvier 2024",
    category: "Actualité cabinet",
    imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&h=500&fit=crop",
  },
  {
    id: "2",
    slug: "alecia-salon-entrepreneurs",
    title: "alecia au Salon des Entrepreneurs 2024",
    excerpt: "Retrouvez notre équipe au Salon des Entrepreneurs de Paris les 7 et 8 février 2024. Stand C42, Palais des Congrès.",
    date: "5 janvier 2024",
    category: "Événement",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
  },
  {
    id: "3",
    slug: "bilan-2023-record",
    title: "2023 : une année record pour alecia",
    excerpt: "Avec 15 opérations finalisées et une croissance de 40%, alecia poursuit son développement au service des PME et ETI françaises.",
    date: "20 décembre 2023",
    category: "Actualité cabinet",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop",
  },
  {
    id: "4",
    slug: "sophie-dubois-associee",
    title: "Sophie Dubois devient Associée",
    excerpt: "Après 5 ans au sein du cabinet, Sophie Dubois est promue Associée. Elle renforce notre expertise en levées de fonds et opérations cross-border.",
    date: "1 septembre 2023",
    category: "Équipe",
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop",
  },
];

export default function ActualitesPage2() {
  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Actualités
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
              L'actualité d'alecia
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Événements, nominations, ouvertures de bureaux : suivez la vie du cabinet.
            </p>
          </div>

          {/* News Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {newsItems.map((news) => (
              <Link
                key={news.id}
                href={`/actualites_2/${news.slug}`}
                className="group block"
              >
                <article className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[var(--accent)]/30">
                  {/* Image */}
                  {news.imageUrl && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={news.imageUrl}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                        {news.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-[var(--foreground-muted)]">
                        <Calendar className="w-4 h-4" />
                        {news.date}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                      {news.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-[var(--foreground-muted)] line-clamp-2 mb-4">
                      {news.excerpt}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-2 text-[var(--accent)] font-medium">
                      <span>Lire la suite</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer_2 />
    </>
  );
}
