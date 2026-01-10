"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface FlipCardProps {
  slug: string;
  clientName: string;
  clientLogo?: string | null;
  acquirerName?: string | null;
  acquirerLogo?: string | null;
  sector: string;
  year: number;
  mandateType: string;
  region?: string | null;
}

export function FlipCard_3({
  slug,
  clientName,
  clientLogo,
  acquirerName,
  acquirerLogo,
  sector,
  year,
  mandateType,
  region,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-80 w-full perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative h-full w-full transition-all duration-500 transform-style-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 h-full w-full backface-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-md overflow-hidden">
           {/* Background Image or Gradient */}
           <div className="absolute inset-0 bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background-tertiary)] flex flex-col items-center justify-center p-6 text-center">
              
              {/* Client Logo First */}
              <div className="mb-6 h-24 w-24 flex items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                 {clientLogo ? (
                   <Image 
                     src={clientLogo} 
                     alt={clientName} 
                     width={80} 
                     height={80} 
                     className="object-contain max-h-full max-w-full"
                   />
                 ) : (
                   <span className="text-2xl font-bold text-gray-400">{clientName.charAt(0)}</span>
                 )}
              </div>

              <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[var(--foreground)] mb-2">
                {clientName}
              </h3>
              
              <div className="absolute top-4 right-4">
                 <Badge variant="outline">{year}</Badge>
              </div>
           </div>
           
           {/* Hint to flip */}
           <div className="absolute bottom-4 right-4 text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
              Click to flip ↻
           </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 h-full w-full backface-hidden rounded-xl bg-[var(--accent)] text-white shadow-xl overflow-hidden p-6 flex flex-col justify-between items-center text-center"
          style={{ transform: "rotateY(180deg)" }}
        >
           <div className="flex flex-col gap-2 mt-4">
             <span className="text-sm font-medium uppercase tracking-wider text-white/80">Opération</span>
             <h4 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">{mandateType}</h4>
           </div>

           <div className="space-y-4">
             <p className="text-white/90">
               {acquirerName ? `Cession à ${acquirerName}` : `Opération de ${mandateType.toLowerCase()}`}
             </p>
             <div className="flex flex-wrap gap-2 justify-center">
               <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">{sector}</Badge>
               {region && <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">{region}</Badge>}
             </div>
           </div>

           <Link 
             href={`/transactions_3/detail/${slug}`} // Assuming we might make a detail page or just link to press release if available. For now standard link.
             className="inline-block px-6 py-2 bg-white text-[var(--accent)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
             onClick={(e) => e.stopPropagation()}
           >
             En savoir plus
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
