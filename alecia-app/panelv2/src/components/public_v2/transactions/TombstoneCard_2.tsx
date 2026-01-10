"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * TombstoneCard_2 - Carte tombstone carrée avec flip animation
 * 
 * Selon cahier des charges (style cambonpartners.com) :
 * - Format carré avec photo en fond
 * - Logo client et contrepartie
 * - 1-2 phrases courtes
 * - Pastille année (site uniquement, pas LinkedIn)
 * - Au clic : flip pour type d'opération + résumé
 * - Bouton "En savoir plus" vers communiqué
 */

export interface TombstoneData {
  id: string;
  slug: string;
  clientName: string;
  clientLogo?: string;
  counterpartyName?: string;
  counterpartyLogo?: string;
  shortDescription: string;
  fullDescription?: string;
  year: number;
  sector: string;
  region: string;
  operationType: "Cession" | "Acquisition" | "Levée de fonds" | "Autre";
  imageUrl?: string;
  hasDetailPage?: boolean;
}

interface TombstoneCard_2Props {
  transaction: TombstoneData;
  showYearBadge?: boolean;
}

export function TombstoneCard_2({ 
  transaction, 
  showYearBadge = true 
}: TombstoneCard_2Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const operationTypeColors: Record<string, string> = {
    "Cession": "bg-blue-500",
    "Acquisition": "bg-emerald-500",
    "Levée de fonds": "bg-amber-500",
    "Autre": "bg-gray-500",
  };

  return (
    <div 
      className="relative aspect-square cursor-pointer perspective-1000"
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Front Face */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Background Image */}
          {transaction.imageUrl ? (
            <Image
              src={transaction.imageUrl}
              alt={transaction.clientName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#061a40] to-[#19354e]" />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Year Badge (site only) */}
          {showYearBadge && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-[var(--accent)] text-white text-sm font-bold rounded-full shadow-lg">
              {transaction.year}
            </div>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Logos */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                {transaction.clientLogo ? (
                  <Image
                    src={transaction.clientLogo}
                    alt={transaction.clientName}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-sm font-bold text-[#061a40]">
                    {transaction.clientName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              {transaction.counterpartyName && (
                <>
                  <span className="text-white/50 text-lg">→</span>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                    {transaction.counterpartyLogo ? (
                      <Image
                        src={transaction.counterpartyLogo}
                        alt={transaction.counterpartyName}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#061a40]">
                        {transaction.counterpartyName.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-white/90 leading-relaxed line-clamp-2">
              {transaction.shortDescription}
            </p>

            {/* Flip hint */}
            <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
              <span>Cliquer pour plus d'infos</span>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 rounded-2xl overflow-hidden shadow-lg border border-[var(--border)] bg-[var(--card)] backface-hidden"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="flex flex-col h-full p-6">
            {/* Operation Type Badge */}
            <div className="mb-4">
              <span className={`inline-block px-4 py-1.5 ${operationTypeColors[transaction.operationType]} text-white text-sm font-semibold rounded-full`}>
                {transaction.operationType}
              </span>
            </div>

            {/* Client Name */}
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
              {transaction.clientName}
              {transaction.counterpartyName && (
                <span className="text-[var(--foreground-muted)] font-normal">
                  {" "}× {transaction.counterpartyName}
                </span>
              )}
            </h3>

            {/* Full Description */}
            <p className="text-[var(--foreground-muted)] text-sm leading-relaxed flex-1">
              {transaction.fullDescription || transaction.shortDescription}
            </p>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-[var(--background-secondary)] rounded text-[var(--foreground-muted)]">
                {transaction.sector}
              </span>
              <span className="px-2 py-1 bg-[var(--background-secondary)] rounded text-[var(--foreground-muted)]">
                {transaction.region}
              </span>
              <span className="px-2 py-1 bg-[var(--background-secondary)] rounded text-[var(--foreground-muted)]">
                {transaction.year}
              </span>
            </div>

            {/* CTA */}
            {transaction.hasDetailPage !== false && (
              <Link
                href={`/operations_2/${transaction.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#061a40] to-[#19354e] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            {/* Flip back hint */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="mt-3 text-xs text-center text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              ← Retourner la carte
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
