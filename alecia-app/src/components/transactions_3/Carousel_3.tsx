"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";

// Simplified Deal type for the carousel
interface Deal {
  id: string;
  slug: string;
  clientName: string;
  sector: string;
  year: number;
  mandateType: string;
  acquirerName?: string;
}

interface TransactionsCarouselProps {
  deals: Deal[];
}

export function TransactionsCarousel_3({ deals }: TransactionsCarouselProps) {
  return (
    <section className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Transactions conseillées
            </h2>
            <p className="text-[var(--foreground-muted)] text-lg">
              Découvrez nos opérations récentes et la diversité de nos expertises sectorielles.
            </p>
          </div>
          <Link 
            href="/transactions_3"
            className="hidden md:inline-flex items-center text-[var(--accent)] hover:underline font-medium mt-4 md:mt-0"
          >
            Voir toutes les transactions <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {deals.map((deal) => (
                <CarouselItem key={deal.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                  <Link href={`/transactions_3`} className="group block h-full">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
                      {/* Placeholder generic image since we might not have specific tombstone images yet */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background-tertiary)] group-hover:scale-105 transition-transform duration-500">
                        <span className="text-xs font-medium tracking-wider uppercase text-[var(--accent)] mb-3">
                          {deal.mandateType}
                        </span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-2">
                          {deal.clientName}
                        </h3>
                        {deal.acquirerName && (
                          <p className="text-sm text-[var(--foreground-muted)]">
                            avec {deal.acquirerName}
                          </p>
                        )}
                        <div className="mt-6 inline-flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          Voir le détail <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      </div>
                      
                      {/* Year Badge */}
                      <div className="absolute top-4 right-4 bg-[var(--background)]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium border border-[var(--border)]">
                        {deal.year}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8 md:absolute md:-top-24 md:right-0">
              <CarouselPrevious className="static translate-y-0 text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-white" />
              <CarouselNext className="static translate-y-0 text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--accent)] hover:text-white" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/transactions_3"
            className="inline-flex items-center text-[var(--accent)] hover:underline font-medium"
          >
            Voir toutes les transactions <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
