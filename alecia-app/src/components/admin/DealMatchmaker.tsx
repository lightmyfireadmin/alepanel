"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Tag, Building2, Star } from "lucide-react";
import { motion } from "framer-motion";

// Mock suggested investors based on tag matching
interface Investor {
  id: string;
  name: string;
  company: string;
  tags: string[];
  matchScore: number;
}

interface DealMatchmakerProps {
  dealTags?: string[];
  className?: string;
}

// Simulated tag matching algorithm
const MOCK_INVESTORS: Investor[] = [
  {
    id: "1",
    name: "Philippe Dubois",
    company: "Cap Invest Partners",
    tags: ["Fonds PE", "Technologies & logiciels", "Investisseur"],
    matchScore: 95,
  },
  {
    id: "2",
    name: "Marie-Claire Laurent",
    company: "Family Office Méditerranée",
    tags: ["Family Office", "Santé", "Investisseur"],
    matchScore: 82,
  },
  {
    id: "3",
    name: "Jean-Pierre Martin",
    company: "Banque Régionale du Nord",
    tags: ["Banque", "Industries", "Investisseur"],
    matchScore: 75,
  },
  {
    id: "4",
    name: "Sophie Bernard",
    company: "NextGen Ventures",
    tags: ["Fonds PE", "Technologies & logiciels", "Investisseur"],
    matchScore: 68,
  },
];

const tagColors: Record<string, string> = {
  "Fonds PE": "bg-purple-500/20 text-purple-400",
  "Family Office": "bg-pink-500/20 text-pink-400",
  "Banque": "bg-cyan-500/20 text-cyan-400",
  "Investisseur": "bg-emerald-500/20 text-emerald-400",
};

export function DealMatchmaker({ dealTags = ["Technologies & logiciels"], className }: DealMatchmakerProps) {
  // In real app, filter based on tag overlap with dealTags
  const suggestedInvestors = MOCK_INVESTORS.sort((a, b) => b.matchScore - a.matchScore);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-[var(--foreground-muted)]";
  };

  return (
    <Card className={`bg-[var(--card)] border-[var(--border)] ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-[var(--foreground)]">
          <Star className="w-5 h-5 text-[var(--accent)]" />
          Investisseurs suggérés
        </CardTitle>
        <span className="text-xs text-[var(--foreground-muted)]">
          Basé sur: {dealTags.join(", ")}
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedInvestors.map((investor, idx) => (
          <motion.div
            key={investor.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] transition-colors"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-semibold">
              {investor.name.split(" ").map((n) => n[0]).join("")}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[var(--foreground)] truncate">
                {investor.name}
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{investor.company}</span>
              </div>
            </div>

            {/* Match Score */}
            <div className="text-right shrink-0">
              <p className={`text-lg font-bold ${getScoreColor(investor.matchScore)}`}>
                {investor.matchScore}%
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">match</p>
            </div>
          </motion.div>
        ))}

        {/* Tags Legend */}
        <div className="pt-3 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--foreground-muted)] mb-2">Tags correspondants</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedInvestors
              .flatMap((i) => i.tags)
              .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
              .slice(0, 5)
              .map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${tagColors[tag] || "bg-gray-500/20 text-gray-400"}`}
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Action */}
        <Button className="w-full btn-gold gap-2">
          <UserPlus className="w-4 h-4" />
          Ajouter au deal
        </Button>
      </CardContent>
    </Card>
  );
}
