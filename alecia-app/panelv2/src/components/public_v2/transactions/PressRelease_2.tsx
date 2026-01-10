"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Briefcase, Building2, Quote, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * PressRelease_2 - Communiqué de presse détaillé
 * 
 * Selon cahier des charges (style by-cap.com) :
 * - Communiqué détaillant l'opération
 * - Sidebar gauche : type d'opération, mois/année, secteur d'activité
 * - Bas de page : équipe alecia intervenue avec photo, nom, poste
 * - Encart avis client
 */

interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  slug?: string;
}

interface ClientTestimonial {
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
}

export interface PressReleaseData {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientLogo?: string;
  counterpartyName?: string;
  counterpartyLogo?: string;
  operationType: string;
  date: string; // e.g., "Janvier 2024"
  year: number;
  sector: string;
  region: string;
  content: string; // HTML content
  imageUrl?: string;
  team: TeamMember[];
  testimonial?: ClientTestimonial;
}

interface PressRelease_2Props {
  data: PressReleaseData;
}

export function PressRelease_2({ data }: PressRelease_2Props) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="py-12">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/operations_2"
          className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux transactions
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar - Left */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-28 space-y-6">
              {/* Operation Type */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-3 text-[var(--foreground-muted)] mb-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Type d'opération</span>
                </div>
                <p className="font-semibold text-[var(--foreground)]">{data.operationType}</p>
              </div>

              {/* Date */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-3 text-[var(--foreground-muted)] mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Date</span>
                </div>
                <p className="font-semibold text-[var(--foreground)]">{data.date}</p>
              </div>

              {/* Sector */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-3 text-[var(--foreground-muted)] mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Secteur</span>
                </div>
                <p className="font-semibold text-[var(--foreground)]">{data.sector}</p>
              </div>

              {/* Region */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                <div className="flex items-center gap-3 text-[var(--foreground-muted)] mb-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Région</span>
                </div>
                <p className="font-semibold text-[var(--foreground)]">{data.region}</p>
              </div>

              {/* Share Button */}
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager
              </Button>
            </div>
          </motion.aside>

          {/* Main Content - Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Header */}
            <header className="mb-8">
              {/* Logos */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-md border border-[var(--border)]">
                  {data.clientLogo ? (
                    <Image
                      src={data.clientLogo}
                      alt={data.clientName}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold text-[#061a40]">
                      {data.clientName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                {data.counterpartyName && (
                  <>
                    <span className="text-2xl text-[var(--foreground-muted)]">×</span>
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-md border border-[var(--border)]">
                      {data.counterpartyLogo ? (
                        <Image
                          src={data.counterpartyLogo}
                          alt={data.counterpartyName}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#061a40]">
                          {data.counterpartyName.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                {data.title}
              </h1>

              {/* Badge */}
              <span className="inline-block px-4 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-semibold rounded-full">
                {data.operationType}
              </span>
            </header>

            {/* Hero Image */}
            {data.imageUrl && (
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <Image
                  src={data.imageUrl}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none text-[var(--foreground)] prose-headings:text-[var(--foreground)] prose-p:text-[var(--foreground-muted)] prose-strong:text-[var(--foreground)] prose-a:text-[var(--accent)]"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />

            {/* Client Testimonial */}
            {data.testimonial && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 p-8 bg-gradient-to-br from-[#061a40] to-[#19354e] rounded-2xl text-white"
              >
                <Quote className="w-10 h-10 text-amber-400 mb-4" />
                <blockquote className="text-lg md:text-xl leading-relaxed mb-6 italic">
                  "{data.testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold">{data.testimonial.authorName}</p>
                  <p className="text-sm text-white/70">
                    {data.testimonial.authorRole}, {data.testimonial.companyName}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Team Section */}
            {data.team.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 pt-12 border-t border-[var(--border)]"
              >
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-8">
                  L'équipe alecia sur cette opération
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {data.team.map((member) => (
                    <Link
                      key={member.id}
                      href={member.slug ? `/equipe_2/${member.slug}` : "#"}
                      className="group flex items-center gap-4 p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all"
                    >
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[var(--background-tertiary)] flex-shrink-0">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-[var(--foreground-muted)]">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                          {member.name}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {member.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </motion.div>
        </div>
      </div>
    </article>
  );
}
