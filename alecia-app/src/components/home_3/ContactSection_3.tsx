"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function ContactSection_3() {
  return (
    <section className="py-24 px-4 bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left: Presentation */}
        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold mb-6">
            Proximité & Engagement
          </h2>
          <p className="text-[var(--foreground-muted)] text-lg mb-6 leading-relaxed">
            Plus qu&apos;un simple prestataire, Alecia se positionne comme un partenaire de confiance à vos côtés. 
            Notre approche sur-mesure combine expertise technique et intelligence émotionnelle pour sécuriser vos transactions.
          </p>
          <div className="space-y-2 mb-8">
            <h3 className="font-semibold text-lg">Nos bureaux</h3>
            <div className="grid grid-cols-2 gap-4 text-[var(--foreground-muted)]">
              <div>Paris (Siège)</div>
              <div>Aix-en-Provence</div>
              <div>Nice</div>
              <div>Lorient</div>
              <div>Annecy</div>
            </div>
          </div>
          <Button asChild className="btn-gold rounded-lg px-8 py-6 text-lg">
            <Link href="/contact_3">
              Nous contacter <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* Right: Map or Visual */}
        <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--background-tertiary)] border border-[var(--border)]">
          {/* Placeholder for Map Image */}
          <div className="absolute inset-0 flex items-center justify-center text-[var(--foreground-muted)]">
             {/* Use existing France map asset if possible, otherwise styled placeholder */}
             <div className="text-center p-8">
                <span className="block text-4xl mb-2">🇫🇷</span>
                <span className="font-[family-name:var(--font-playfair)] text-xl">5 Implantations en France</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
