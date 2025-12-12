"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar, Footer } from "@/components/layout";
import { AnimatedCounter, RegionalMap, ValuationEstimator } from "@/components/features";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, TrendingUp, Users } from "lucide-react";

const expertises = [
  {
    id: "cession",
    title: "Cession & transmission",
    description: "La cession de votre entreprise est un moment décisif, qui requiert une préparation et une exécution irréprochables.",
    icon: Building2,
  },
  {
    id: "levee-de-fonds",
    title: "Levée de fonds & financement",
    description: "Que ce soit pour financer votre croissance ou restructurer votre capital, nous vous accompagnons.",
    icon: TrendingUp,
  },
  {
    id: "acquisition",
    title: "Acquisition",
    description: "L'acquisition d'une entreprise est un levier stratégique majeur pour accélérer la croissance.",
    icon: Users,
  },
];

const stats = [
  { value: 50, suffix: "+", label: "Opérations" },
  { value: 8, label: "Associés experts" },
  { value: 4, label: "Bureaux en France" },
];

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main id="main-content" className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-6 py-20 pt-32 text-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/5 via-transparent to-transparent" />
          
          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              Conseil en fusion-acquisition
            </p>
            
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-semibold text-[var(--foreground)] mb-6 leading-tight">
              Vos ambitions,{" "}
              <span className="text-gradient-gold">notre engagement</span>
            </h1>
            
            <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto mb-10">
              Conseil en fusion-acquisition pour PME et ETI. Valorisation €5M-€50M. 
              Cession, acquisition, levée de fonds.
            </p>
            
            {/* Dual CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gold text-lg px-8 py-6 rounded-xl"
                asChild
              >
                <Link href="/contact?type=cedant">
                  Vous êtes cédant
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
                  Vous êtes acquéreur
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
                Nos expertises
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg max-w-2xl mx-auto">
                Vos projets méritent plus qu&apos;une simple expertise. Avec une expérience pointue dans les transactions et opérations financières.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {expertises.map((expertise, idx) => (
                <motion.div
                  key={expertise.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/expertises#${expertise.id}`}>
                    <Card className="card-hover h-full bg-[var(--card)] border-[var(--border)] group cursor-pointer">
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent)]/20 transition-colors">
                          <expertise.icon className="w-6 h-6 text-[var(--accent)]" />
                        </div>
                        <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-xl group-hover:text-[var(--accent)] transition-colors">
                          {expertise.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-[var(--foreground-muted)] text-base">
                          {expertise.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
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
                  Découvrir nos expertises
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
                Un ancrage <span className="text-gradient-gold">régional</span> fort
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg max-w-2xl mx-auto">
                Notre présence multi-régionale et nos parcours entrepreneuriaux nous permettent de comprendre les enjeux et la réalité du quotidien des dirigeants.
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
                  Quelle est la <span className="text-gradient-gold">valeur</span> de votre entreprise ?
                </h2>
                <p className="text-[var(--foreground-muted)] text-lg mb-6">
                  Obtenez une première estimation gratuite basée sur les multiples de votre secteur. Notre outil utilise les données de transactions comparables pour vous donner un ordre de grandeur.
                </p>
                <ul className="space-y-3 text-[var(--foreground-muted)]">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                    Estimation en 30 secondes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                    Basée sur les multiples sectoriels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
                    100% confidentiel
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
                Prêt à concrétiser <span className="text-gradient-gold">votre projet</span> ?
              </h2>
              <p className="text-[var(--foreground-muted)] text-lg mb-10 max-w-2xl mx-auto">
                Contactez l&apos;un de nos associés pour une première discussion confidentielle.
              </p>
              <Button size="lg" className="btn-gold text-lg px-10 py-6 rounded-xl" asChild>
                <Link href="/contact">
                  Prendre contact
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
