"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * MemberDeals_2 - Carrousel des transactions conseillées par un membre
 * 
 * Selon cahier des charges :
 * - Carrousel sur les transactions conseillées par chaque associé
 */

interface DealSummary {
  id: string;
  slug: string;
  clientName: string;
  clientLogo?: string;
  operationType: string;
  year: number;
  sector: string;
  imageUrl?: string;
}

interface MemberDeals_2Props {
  memberName: string;
  deals: DealSummary[];
}

export function MemberDeals_2({ memberName, deals }: MemberDeals_2Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        ref.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (deals.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-12 border-t border-[var(--border)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Transactions conseillées
          </h2>
          <p className="text-[var(--foreground-muted)] mt-1">
            Opérations accompagnées par {memberName}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2 border border-[var(--border)] rounded-full hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Défiler à gauche"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2 border border-[var(--border)] rounded-full hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Défiler à droite"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Deals Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {deals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex-shrink-0 w-72"
            style={{ scrollSnapAlign: "start" }}
          >
            <Link href={`/operations_2/${deal.slug}`} className="group block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)]">
                {deal.imageUrl ? (
                  <Image
                    src={deal.imageUrl}
                    alt={deal.clientName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#061a40] to-[#19354e]" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Year Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[var(--accent)] text-white text-xs font-bold rounded-full">
                  {deal.year}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {/* Logo */}
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3">
                    {deal.clientLogo ? (
                      <Image
                        src={deal.clientLogo}
                        alt={deal.clientName}
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-[#061a40]">
                        {deal.clientName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold group-hover:text-amber-400 transition-colors">
                    {deal.clientName}
                  </p>
                  <p className="text-sm text-white/70">{deal.operationType}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
