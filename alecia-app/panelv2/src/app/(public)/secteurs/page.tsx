
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockSectors } from "@/lib/data";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Cpu, Building2, ShoppingBag, HeartPulse, Home, Factory, PiggyBank, Wheat, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Secteurs | Nos expertises sectorielles",
  description:
    "Découvrez les 9 secteurs d'expertise d'alecia en fusion-acquisition : Technologies, Santé, Industries, Services financiers, Agroalimentaire et plus.",
};

// Icon mapping for sector types
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  technology: Cpu,
  building: Building2,
  shopping: ShoppingBag,
  health: HeartPulse,
  construction: Home,
  industry: Factory,
  finance: PiggyBank,
  food: Wheat,
  energy: Leaf,
};

export default function SecteursPage() {
  return (
    <>
      
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              Expertise sectorielle
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Nos secteurs d&apos;intervention
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Une connaissance approfondie de 9 verticales sectorielles pour accompagner 
              au mieux les dirigeants dans leurs opérations de M&A
            </p>
          </div>
        </section>

        {/* Sectors Grid */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSectors.map((sector) => {
                const IconComponent = iconMap[sector.iconType] || Building2;
                
                return (
                  <Link key={sector.id} href={`/secteurs/${sector.slug}`}>
                    <Card className="card-hover h-full bg-[var(--card)] border-[var(--border)] group">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-[var(--accent)]" />
                        </div>
                        <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-xl group-hover:text-[var(--accent)] transition-colors">
                          {sector.nameFr}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[var(--foreground-muted)] text-sm line-clamp-3 mb-4">
                          {sector.descriptionFr}
                        </p>
                        <div className="flex items-center gap-2 text-[var(--accent)] text-sm font-medium">
                          Découvrir
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-4">
              Vous ne trouvez pas votre secteur ?
            </h2>
            <p className="text-[var(--foreground-muted)] mb-6">
              Notre équipe intervient sur l&apos;ensemble des secteurs économiques. 
              Contactez-nous pour discuter de votre projet.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-lg font-semibold"
            >
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      
    </>
  );
}
