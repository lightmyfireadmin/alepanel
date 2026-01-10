"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, Handshake, Target } from "lucide-react";

/**
 * MetierSection_2 - Section "Notre Métier"
 * 
 * Selon cahier des charges :
 * - Mix de l'actuel "plus qu'un simple prestataire" et "partenaire de proximité"
 * - Texte simple où on comprend instantanément le métier
 * - 3 boîtes pour les 3 expertises cliquables
 */

const expertises = [
  {
    id: "cession",
    icon: TrendingUp,
    title: "Cession & Transmission",
    description: "Accompagnement complet des dirigeants dans la cession totale ou partielle de leur entreprise, avec une approche sur-mesure.",
    href: "/expertises_2#cession",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "acquisition",
    icon: Target,
    title: "Acquisition",
    description: "Identification et évaluation de cibles stratégiques pour accompagner votre croissance externe.",
    href: "/expertises_2#acquisition",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "levee-de-fonds",
    icon: Handshake,
    title: "Levée de fonds",
    description: "Structuration et négociation de tours de financement pour accélérer votre développement.",
    href: "/expertises_2#levee-de-fonds",
    color: "from-amber-500 to-amber-600",
  },
];

export function MetierSection_2() {
  return (
    <section id="notre-metier" className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
            Notre métier
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
            Plus qu'un prestataire,
            <br />
            <span className="text-gradient-gold">un partenaire de proximité</span>
          </h2>
          <p className="text-lg text-[var(--foreground-muted)] max-w-3xl mx-auto leading-relaxed">
            alecia est une banque d'affaires indépendante spécialisée dans le conseil en fusion-acquisition. 
            Nous accompagnons les entrepreneurs et dirigeants de PME et ETI dans leurs opérations de capital : 
            <strong className="text-[var(--foreground)]"> cessions, acquisitions et levées de fonds</strong>.
          </p>
        </motion.div>

        {/* 3 Expertises Boxes */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {expertises.map((expertise, index) => (
            <motion.div
              key={expertise.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={expertise.href}
                className="group block h-full"
              >
                <div className="relative h-full bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-xl hover:-translate-y-1">
                  {/* Gradient Background on Hover */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${expertise.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} 
                  />
                  
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${expertise.color} text-white mb-6`}>
                    <expertise.icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                    {expertise.title}
                  </h3>
                  <p className="text-[var(--foreground-muted)] leading-relaxed mb-6">
                    {expertise.description}
                  </p>

                  {/* Arrow Link */}
                  <div className="flex items-center text-[var(--accent)] font-medium">
                    <span className="mr-2">En savoir plus</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
