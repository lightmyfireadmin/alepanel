"use client";

import { Button } from "@/components/ui/button";
import { Navbar, Footer } from "@/components/layout";
import { AnimatedCounter, RegionalMap, ValuationEstimator, HeroBackground, ExpertiseCard } from "@/components/features";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

// Team members - names are not translated
const teamMembers = [
  { name: "Grégory Colin", initials: "GC" },
  { name: "Christophe Berthon", initials: "CB" },
  { name: "Martin Egasse", initials: "ME" },
  { name: "Tristan Cossec", initials: "TC" },
  { name: "Serge de Faÿ", initials: "SF" },
  { name: "Jérôme Berthiau", initials: "JB" },
  { name: "Louise Pini", initials: "LP" },
  { name: "Mickael Furet", initials: "MF" },
];

export default function Home() {
  const t = useTranslations();

  const expertises = [
    {
      id: "cession",
      title: t("expertises.cession.title"),
      description: t("expertises.cession.description"),
      iconType: "cession" as const,
    },
    {
      id: "levee-de-fonds",
      title: t("expertises.fundraising.title"),
      description: t("expertises.fundraising.description"),
      iconType: "fundraising" as const,
    },
    {
      id: "acquisition",
      title: t("expertises.acquisition.title"),
      description: t("expertises.acquisition.description"),
      iconType: "acquisition" as const,
    },
  ];

  const stats = [
    { value: 50, suffix: "+", label: t("stats.operations") },
    { value: 8, label: t("stats.experts") },
    { value: 4, label: t("stats.offices") },
  ];

  return (
    <>
      <Navbar />
      
      <main id="main-content" className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 py-20 pt-32 text-center overflow-hidden">
          {/* Enhanced Background */}
          <HeroBackground showParticles={true} />
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              {t("hero.tagline")}
            </p>
            
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-semibold text-[var(--foreground)] mb-6 leading-tight">
              {t("hero.titlePart1")}{" "}
              <span className="text-gradient-gold">{t("hero.titlePart2")}</span>
            </h1>
            
            <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10">
              {t("hero.subtitle")}
            </p>
            
            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gold text-lg px-8 py-6 rounded-xl"
                asChild
              >
                <Link href="/contact?type=cedant">
                  {t("hero.ctaSeller")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-6 rounded-xl border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--background-secondary)] hover:border-[var(--accent)]"
                asChild
              >
                <Link href="/contact?type=acquereur">
                  {t("hero.ctaBuyer")}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 border-2 border-[var(--border)] rounded-full flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6"
                >
                  <p className="text-5xl md:text-6xl font-bold text-gradient-gold mb-2">
                    <AnimatedCounter 
                      to={stat.value} 
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="text-[var(--foreground-muted)] text-lg">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Plus qu'un simple prestataire Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
                  {t("provider.titlePart1")} <span className="text-gradient-gold">{t("provider.titlePart2")}</span>
                </h2>
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed mb-6">
                  {t("provider.paragraph1")}
                </p>
                <p className="text-[var(--foreground-muted)] text-lg leading-relaxed">
                  {t("provider.paragraph2")}
                </p>
              </motion.div>
              
              {/* Team Avatars Grid */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-4 gap-4"
              >
                {teamMembers.map((member, idx) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="aspect-square rounded-lg overflow-hidden bg-[var(--card)] border border-[var(--border)] group cursor-pointer"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 flex items-center justify-center">
                      <span className="text-xl font-semibold text-[var(--accent)]">
                        {member.initials}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>


        {/* Expertises Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
                {t("expertises.title")}
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg max-w-2xl mx-auto">
                {t("expertises.subtitle")}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {expertises.map((expertise, idx) => (
                <ExpertiseCard
                  key={expertise.id}
                  id={expertise.id}
                  title={expertise.title}
                  description={expertise.description}
                  iconType={expertise.iconType}
                  index={idx}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button variant="outline" size="lg" asChild className="border-[var(--border)] hover:border-[var(--accent)]">
                <Link href="/expertises">
                  {t("expertises.discoverCta")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Regional Presence Section */}
        <section className="py-24 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
                {t("regional.titlePart1")} <span className="text-gradient-gold">{t("regional.titlePart2")}</span> {t("regional.titlePart3")}
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg max-w-2xl mx-auto">
                {t("regional.subtitle")}
              </p>
            </motion.div>
            <RegionalMap />
          </div>
        </section>

        {/* Valuation Estimator Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
                  {t("valuation.titlePart1")} <span className="text-gradient-gold">{t("valuation.titlePart2")}</span> {t("valuation.titlePart3")}
                </h2>
                <p className="text-[var(--foreground-muted)] text-lg mb-6">
                  {t("valuation.description")}
                </p>
                <ul className="space-y-3 text-[var(--foreground-muted)]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                    {t("valuation.benefit1")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                    {t("valuation.benefit2")}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                    {t("valuation.benefit3")}
                  </li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <ValuationEstimator />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
                {t("cta.titlePart1")} <span className="text-gradient-gold">{t("cta.titlePart2")}</span> ?
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg mb-10 max-w-2xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <Button size="lg" className="btn-gold text-lg px-10 py-6 rounded-xl" asChild>
                <Link href="/contact">
                  {t("cta.button")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
