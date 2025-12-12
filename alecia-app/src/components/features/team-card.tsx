"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

interface TeamCardProps {
  slug: string;
  name: string;
  role: string;
  photo?: string | null;
  linkedinUrl?: string | null;
}

export function TeamCard({
  slug,
  name,
  role,
  photo,
  linkedinUrl,
}: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link href={`/equipe/${slug}`}>
        <div className="card-hover relative bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
          {/* Photo */}
          <div className="aspect-[3/4] relative overflow-hidden bg-[var(--background-tertiary)]">
            {photo ? (
              <Image
                src={photo}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-[var(--foreground-faint)]">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
          </div>

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              {name}
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">{role}</p>
          </div>

          {/* LinkedIn Icon */}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 right-4 p-2 bg-[var(--background)]/80 rounded-full text-[var(--foreground-muted)] hover:text-[var(--accent)] hover:bg-[var(--background)] transition-all opacity-0 group-hover:opacity-100"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
