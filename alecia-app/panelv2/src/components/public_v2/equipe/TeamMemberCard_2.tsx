"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, ArrowRight, X } from "lucide-react";

/**
 * TeamMemberCard_2 - Carte membre équipe avec overlay détails
 * 
 * Selon cahier des charges (style albarest-partners.com) :
 * - Grille photos avec fenêtre détails en surbrillance
 * - Infos + passion sur chaque profil
 */

export interface TeamMemberData {
  id: string;
  slug: string;
  name: string;
  role: string;
  photoUrl?: string;
  bio?: string;
  passion?: string;
  quote?: string;
  email?: string;
  linkedin?: string;
  expertises?: string[];
  transactionsCount?: number;
}

interface TeamMemberCard_2Props {
  member: TeamMemberData;
  showDetailOnHover?: boolean;
}

export function TeamMemberCard_2({ 
  member,
  showDetailOnHover = true
}: TeamMemberCard_2Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/equipe_2/${member.slug}`} className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)] shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:border-[var(--accent)]/30">
          {/* Photo */}
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#061a40] to-[#19354e] flex items-center justify-center">
              <span className="text-4xl font-bold text-white/30">
                {member.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Base Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:text-amber-400 transition-colors">
              {member.name}
            </h3>
            <p className="text-white/70 text-sm">{member.role}</p>
          </div>

          {/* Hover Overlay with Details */}
          <AnimatePresence>
            {showDetailOnHover && isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-gradient-to-t from-[#061a40]/95 via-[#061a40]/80 to-[#061a40]/60 flex flex-col justify-end p-6"
              >
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-1 text-amber-400">
                    {member.name}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">{member.role}</p>

                  {/* Bio excerpt */}
                  {member.bio && (
                    <p className="text-sm text-white/80 line-clamp-3 mb-4">
                      {member.bio}
                    </p>
                  )}

                  {/* Passion */}
                  {member.passion && (
                    <div className="mb-4">
                      <span className="text-xs uppercase tracking-wider text-amber-400">Passion</span>
                      <p className="text-sm text-white/70 mt-1">{member.passion}</p>
                    </div>
                  )}

                  {/* Expertises */}
                  {member.expertises && member.expertises.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertises.slice(0, 3).map((exp) => (
                        <span 
                          key={exp}
                          className="px-2 py-1 bg-white/10 rounded text-xs text-white/80"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        aria-label={`Email de ${member.name}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* View Profile CTA */}
                  <div className="mt-4 flex items-center text-amber-400 text-sm font-medium">
                    <span>Voir le profil</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    </div>
  );
}
