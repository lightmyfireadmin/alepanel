"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Briefcase, MapPin, TrendingUp } from "lucide-react";

/**
 * KPIBand_2 - Bandeau de KPIs animés
 * 
 * Selon cahier des charges :
 * - Expertise multisectorielle
 * - Intervention sur des sociétés valorisées entre 5 et 50 M€
 * - X opérations conseillées
 * - Nombre de bureaux
 */

interface KPI {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const kpis: KPI[] = [
  {
    icon: TrendingUp,
    value: 50,
    prefix: "€",
    suffix: "M+",
    label: "Valorisations conseillées",
  },
  {
    icon: Briefcase,
    value: 80,
    suffix: "+",
    label: "Opérations réalisées",
  },
  {
    icon: Building2,
    value: 15,
    suffix: "+",
    label: "Secteurs d'activité",
  },
  {
    icon: MapPin,
    value: 4,
    label: "Bureaux en France",
  },
];

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const duration = 2000; // ms

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * value);
      
      setCount(currentValue);

      if (progress >= 1) {
        clearInterval(timer);
        setCount(value);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

export function KPIBand_2() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#061a40] to-[#19354e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {kpis.map((kpi, index) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-amber-400 mb-4">
                <kpi.icon className="w-6 h-6" />
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedCounter 
                  value={kpi.value} 
                  prefix={kpi.prefix} 
                  suffix={kpi.suffix} 
                />
              </div>

              {/* Label */}
              <p className="text-sm text-white/70 uppercase tracking-wider">
                {kpi.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Valorisation Range */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-white/60 text-sm">
            Nous intervenons sur des sociétés valorisées entre{" "}
            <span className="text-amber-400 font-semibold">5 et 50 millions d'euros</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
