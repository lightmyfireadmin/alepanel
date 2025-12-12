"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedIcon, LORDICON_ICONS } from "@/components/ui/AnimatedIcon";
import { ArrowRight } from "lucide-react";

interface ExpertiseCardProps {
  id: string;
  title: string;
  description: string;
  iconType: "cession" | "fundraising" | "acquisition";
  index: number;
}

// Map expertise types to Lordicon icons
const EXPERTISE_ICONS = {
  cession: LORDICON_ICONS.briefcase, // Briefcase for business transfer
  fundraising: LORDICON_ICONS.chart, // Chart for growth/fundraising
  acquisition: LORDICON_ICONS.handshake, // Handshake for deals
} as const;

export function ExpertiseCard({ id, title, description, iconType, index }: ExpertiseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
    >
      <Link href={`/expertises#${id}`}>
        <Card className="group h-full bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          
          <CardHeader className="pb-4">
            {/* Icon container */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent)]/5 flex items-center justify-center mb-5 group-hover:from-[var(--accent)]/20 group-hover:to-[var(--accent)]/10 transition-all duration-300 group-hover:scale-110">
              <AnimatedIcon
                icon={EXPERTISE_ICONS[iconType]}
                trigger="loop-on-hover"
                size={36}
                colors={{
                  primary: "#f59e0b",
                  secondary: "#fbbf24",
                }}
              />
            </div>
            
            <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-xl md:text-2xl group-hover:text-[var(--accent)] transition-colors duration-200 flex items-center gap-2">
              {title}
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[var(--accent)]" />
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <CardDescription className="text-[var(--foreground-muted)] text-base leading-relaxed">
              {description}
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default ExpertiseCard;
