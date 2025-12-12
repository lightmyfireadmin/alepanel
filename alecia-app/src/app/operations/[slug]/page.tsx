import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar, Footer } from "@/components/layout";
import { mockDeals } from "@/lib/data";
import { ArrowLeft, Building2, MapPin, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const deal = mockDeals.find((d) => d.slug === slug);
  
  if (!deal) return { title: "Opération non trouvée" };

  return {
    title: `Opération ${deal.clientName} - ${deal.mandateType} | alecia`,
    description: `Détail de l'opération ${deal.mandateType} pour ${deal.clientName} (${deal.sector}).`,
  };
}

export default async function OperationDetail({ params }: PageProps) {
  const { slug } = await params;
  const deal = mockDeals.find((d) => d.slug === slug);

  if (!deal) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <Button asChild variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-[var(--accent)] text-[var(--foreground-muted)]">
            <Link href="/operations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux opérations
            </Link>
          </Button>

          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 text-[var(--accent)] font-medium mb-4">
                <Tag className="w-4 h-4" />
                <span>{deal.mandateType}</span>
                <span>•</span>
                <span>{deal.year}</span>
              </div>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
                {deal.clientName}
              </h1>
            </div>

            {/* Key Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm">
                  <Building2 className="w-4 h-4" />
                  Secteur
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.sector}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm">
                  <MapPin className="w-4 h-4" />
                  Région
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.region}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm">
                  <Building2 className="w-4 h-4" />
                  Acquéreur/Investisseur
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.acquirerName}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)] text-sm">
                  <Calendar className="w-4 h-4" />
                  Année
                </div>
                <p className="font-medium text-[var(--foreground)]">{deal.year}</p>
              </div>
            </div>

            {/* Content Placeholder */}
            <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--foreground-muted)] pt-8">
              <p>
                Description détaillée de l'opération pour <strong>{deal.clientName}</strong>.
                Alicia a accompagné les actionnaires dans cette opération de {deal.mandateType.toLowerCase()}.
              </p>
              <p>
                Enjeux de l'opération, rôle d'Alecia, résultat...
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
