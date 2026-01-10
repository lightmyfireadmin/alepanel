"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

/**
 * TransactionsCarousel_2 - Carrousel de tombstones
 * 
 * Selon cahier des charges (style stratema.com) :
 * - Carrousel avec flèche à droite
 * - Tombstones présentés, liés à la page transactions
 */

interface Transaction {
  id: string;
  slug: string;
  clientName: string;
  clientLogo?: string;
  counterpartyName?: string;
  counterpartyLogo?: string;
  description: string;
  year: number;
  sector: string;
  operationType: string;
  imageUrl?: string;
}

// Sample data - would come from Convex in production
const sampleTransactions: Transaction[] = [
  {
    id: "1",
    slug: "cession-tech-solutions",
    clientName: "Tech Solutions",
    clientLogo: "/assets/logos/placeholder-logo.svg",
    counterpartyName: "Innovation Capital",
    counterpartyLogo: "/assets/logos/placeholder-logo.svg",
    description: "Cession majoritaire d'un éditeur de logiciels SaaS à un fonds d'investissement.",
    year: 2024,
    sector: "Tech & Digital",
    operationType: "Cession",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    slug: "acquisition-medical-plus",
    clientName: "Medical+",
    clientLogo: "/assets/logos/placeholder-logo.svg",
    counterpartyName: "HealthGroup",
    counterpartyLogo: "/assets/logos/placeholder-logo.svg",
    description: "Accompagnement à l'acquisition d'un laboratoire d'analyses dans le Sud-Est.",
    year: 2024,
    sector: "Santé",
    operationType: "Acquisition",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    slug: "levee-greentech",
    clientName: "GreenTech Energy",
    clientLogo: "/assets/logos/placeholder-logo.svg",
    counterpartyName: "Eco Ventures",
    counterpartyLogo: "/assets/logos/placeholder-logo.svg",
    description: "Levée de fonds Série A pour accélérer le déploiement d'une solution d'énergie renouvelable.",
    year: 2023,
    sector: "Énergie & Environnement",
    operationType: "Levée de fonds",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    slug: "cession-industrie-metal",
    clientName: "Métal Industries",
    clientLogo: "/assets/logos/placeholder-logo.svg",
    counterpartyName: "Industrial Partners",
    counterpartyLogo: "/assets/logos/placeholder-logo.svg",
    description: "Cession totale d'un groupe industriel spécialisé dans la transformation métallique.",
    year: 2023,
    sector: "Industrie",
    operationType: "Cession",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop"
  },
  {
    id: "5",
    slug: "acquisition-retail-group",
    clientName: "Retail Group",
    clientLogo: "/assets/logos/placeholder-logo.svg",
    counterpartyName: "Commerce Holdings",
    counterpartyLogo: "/assets/logos/placeholder-logo.svg",
    description: "Build-up stratégique avec l'acquisition de 3 enseignes dans la distribution spécialisée.",
    year: 2023,
    sector: "Distribution",
    operationType: "Acquisition",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
  },
];

export function TransactionsCarousel_2() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const maxIndex = Math.max(0, sampleTransactions.length - visibleItems);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-24 bg-[var(--background-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Track Record
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mt-4">
              Transactions conseillées
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 border border-[var(--border)] rounded-full text-[var(--foreground)] hover:bg-[var(--background-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Transaction précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className="p-3 border border-[var(--border)] rounded-full text-[var(--foreground)] hover:bg-[var(--background-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Transaction suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/operations_2"
              className="hidden md:flex items-center gap-2 text-[var(--accent)] font-medium hover:underline"
            >
              Tout voir
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="relative overflow-hidden" ref={containerRef}>
          <motion.div
            className="flex gap-6"
            animate={{ x: `-${currentIndex * (100 / visibleItems)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {sampleTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / visibleItems}% - ${(visibleItems - 1) * 24 / visibleItems}px)` }}
              >
                <Link href={`/operations_2/${transaction.slug}`} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300">
                    {/* Background Image */}
                    {transaction.imageUrl && (
                      <Image
                        src={transaction.imageUrl}
                        alt={transaction.clientName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--accent)] text-white text-sm font-semibold rounded-full">
                      {transaction.year}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {/* Logos */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                          {transaction.clientLogo ? (
                            <Image
                              src={transaction.clientLogo}
                              alt={transaction.clientName}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-800">
                              {transaction.clientName.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                        {transaction.counterpartyName && (
                          <>
                            <span className="text-white/50">→</span>
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                              {transaction.counterpartyLogo ? (
                                <Image
                                  src={transaction.counterpartyLogo}
                                  alt={transaction.counterpartyName}
                                  width={32}
                                  height={32}
                                  className="object-contain"
                                />
                              ) : (
                                <span className="text-xs font-bold text-gray-800">
                                  {transaction.counterpartyName.slice(0, 2).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Text */}
                      <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
                        {transaction.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden text-center">
          <Link
            href="/operations_2"
            className="inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:underline"
          >
            Voir toutes les transactions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
