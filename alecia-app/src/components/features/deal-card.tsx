"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DealCardProps {
  slug: string;
  clientName: string;
  clientLogo?: string | null;
  acquirerName?: string | null;
  acquirerLogo?: string | null;
  sector: string;
  year: number;
  mandateType: string;
  region?: string | null;
  isPriorExperience?: boolean | null;
}

const mandateColors: Record<string, string> = {
  Cession: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Acquisition: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Levée de fonds": "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export function DealCard({
  slug,
  clientName,
  clientLogo,
  acquirerName,
  acquirerLogo,
  sector,
  year,
  mandateType,
  region,
  isPriorExperience = false,
}: DealCardProps) {
  const [clientLogoError, setClientLogoError] = useState(false);
  const [acquirerLogoError, setAcquirerLogoError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.5, once: true }}
      transition={{ duration: 0.4 }}
      className="group h-full"
    >
      <Link href={`/operations/${slug}`} className="block h-full">
        <div className="card-hover group relative bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden p-6 h-full flex flex-col">
          {/* Year Badge */}
          <div className="absolute top-4 right-4 text-sm text-[var(--foreground-muted)]">
            {year}
            {isPriorExperience && <span className="ml-1 text-[var(--accent)]">*</span>}
          </div>

          {/* Logos Section */}
          <div className="flex items-center gap-4 mb-6">
            {/* Client Logo */}
            <div className="w-16 h-16 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
              {clientLogo && clientLogo.length > 0 && !clientLogoError ? (
                <Image
                  src={clientLogo}
                  alt={clientName}
                  width={48}
                  height={48}
                  className="object-contain"
                  onError={() => setClientLogoError(true)}
                />
              ) : (
                <span className="text-lg font-bold text-[var(--foreground-muted)]">
                  {clientName.charAt(0)}
                </span>
              )}
            </div>

            {/* Arrow */}
            {acquirerName && (
              <>
                <div className="text-[var(--foreground-faint)]">→</div>
                {/* Acquirer Logo */}
                <div className="w-16 h-16 rounded-lg bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                  {acquirerLogo && acquirerLogo.length > 0 && !acquirerLogoError ? (
                    <Image
                      src={acquirerLogo}
                      alt={acquirerName}
                      width={48}
                      height={48}
                      className="object-contain"
                      onError={() => setAcquirerLogoError(true)}
                    />
                  ) : (
                    <span className="text-lg font-bold text-[var(--foreground-muted)]">
                      {acquirerName.charAt(0)}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Deal Info */}
          <div className="mb-4 flex-grow">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1 group-hover:text-[var(--accent)] transition-colors">
              {clientName}
            </h3>
            {acquirerName && (
              <p className="text-sm text-[var(--foreground-muted)]">
                → {acquirerName}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            <Badge
              variant="outline"
              className={mandateColors[mandateType] || "bg-gray-500/20 text-gray-400"}
            >
              {mandateType}
            </Badge>
            <Badge
              variant="outline"
              className="bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border-[var(--border)]"
            >
              {sector}
            </Badge>
            {region && (
              <Badge
                variant="outline"
                className="bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border-[var(--border)]"
              >
                {region}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
