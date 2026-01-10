"use client";

import { motion } from "framer-motion";

const kpis = [
  { label: "Opérations conseillées", value: "150+" },
  { label: "Valorisation moyenne", value: "5-100 M€" },
  { label: "Années d'expérience", value: "20+" },
  { label: "Bureaux en France", value: "5" },
];

export function KPIBand_3() {
  return (
    <section className="bg-[var(--accent)] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="px-4 pt-8 md:pt-0"
            >
              <div className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold mb-2">
                {kpi.value}
              </div>
              <div className="text-sm md:text-base text-white/90 font-medium uppercase tracking-wide">
                {kpi.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
