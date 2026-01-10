"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroVideo_3() {
  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/assets/handshake-optimized.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="h-full w-full bg-[var(--background-secondary)]" />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 text-center text-white"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Votre ambition, notre engagement
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/90 max-w-2xl mx-auto">
              Banque d&apos;affaires dédiée aux entrepreneurs et dirigeants de PME-ETI
            </p>
          </motion.div>

          {/* 3 Expertise Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
            {[
              {
                title: "Cession & Transmission",
                desc: "Maximiser la valeur de votre entreprise lors de sa cession.",
                href: "/expertises_3#cession",
              },
              {
                title: "Levée de Fonds",
                desc: "Financer votre croissance et vos projets de développement.",
                href: "/expertises_3#levee-de-fonds",
              },
              {
                title: "Croissance Externe",
                desc: "Accélérer votre développement par l'acquisition de cibles stratégiques.",
                href: "/expertises_3#acquisition",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <Link
                  href={item.href}
                  className="block h-full p-8 backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl"
                >
                  <h3 className="text-xl font-semibold text-white mb-3 font-[family-name:var(--font-playfair)]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/80 mb-4 line-clamp-3">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center text-sm font-medium text-[var(--gold)] group-hover:text-white transition-colors">
                    En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
