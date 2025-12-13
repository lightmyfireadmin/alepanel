"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone } from "lucide-react";

interface Office {
  id: string;
  name: string;
  city: string;
  phone: string;
  // Position as percentage of the map container
  position: { left: string; top: string };
}

const offices: Office[] = [
  { 
    id: "idf", 
    name: "Île-de-France", 
    city: "Paris", 
    phone: "contact@alecia.fr", 
    position: { left: "52%", top: "25%" } 
  },
  { 
    id: "sud-est", 
    name: "Sud Est", 
    city: "Nice", 
    phone: "contact@alecia.fr", 
    position: { left: "77%", top: "70%" } 
  },
  { 
    id: "ara", 
    name: "Auvergne Rhône-Alpes", 
    city: "Lyon", 
    phone: "contact@alecia.fr", 
    position: { left: "61%", top: "52%" } 
  },
  { 
    id: "ouest", 
    name: "Grand Ouest", 
    city: "Nantes", 
    phone: "contact@alecia.fr", 
    position: { left: "22%", top: "40%" } 
  },
];

// Accurate France SVG path from Simplemaps (Creative Commons)
// This is a high-fidelity path including mainland France and Corsica
const FRANCE_PATH = `M519.1 43.6l0.9 2.3 0.6 4.3 0.7 1.9 2.2 2.5 0.9 1.5 0.2 1.9-0.3 0.6-1.4 1.5-0.4 0.8 1.2 4.4-0.1 0.6-0.4 1.1-0.1 0.4 0.2 0.4 0.7 0.3 0.3 0.4 0.6 1.2 0.3 0.6 0.4 0.2 0.9 0.2 0.6 0 1.1-0.2 0.6 0.1 0.8 0.4 0.3 0.6 0.2 0.6 0.4 0.8 2.3 2.2 0.4 0.6 0.8 2 0.3 0.6 1.2 1 4.9 2.2 0.3 0.2 1 0.2 0.8-0.6 1.9-3.3 1.1-1.2 1.4-0.9 3.2-1 5-1.6 1.6 0.5 1 1 1 1.9 0.9 1.5 0.8 1.9 0.5 0.6 0.8 0.1 0.9 0.3 0.5 0.9 0.7 2.3-0.9 1.6 0.5 2.8 1.6 5.5 0.1 3.1 0.3 1.1 1 1.3 0.8 0.6 2.7 1.4 1.1 0.3 1.5-0.1 2.7-1 0.9-0.7 0.6-0.6 0.6-0.4 0.9-0.1 0.9 0.3 0.4 0.5-0.1 0.8-0.6 1.1 0.8 0.5 4 0.1 1.4 0.3 1.3 0.6 1.2 1.2 1 1.9 0.6 3.7 0 4.5 0.5 4 2.2 2 0.2-0.6 0.1 0 0.1 0.1 0.3-0.2 0.2-0.3 0.2-0.8 1.2-1.9 0.5-0.6 0.8-0.3 2.7-0.2 2.6 0.3 1.2 0.6 1.1 0.8 1.1 0.5 1.4 0 3.9-1.7 1.4-0.1 1.2 0.6 2 2.3 1.3 0.7 1.3 1.2 1.7 3.6 1.1 0.6 0.5-0.5-0.1-0.7 0-0.6 0.8-0.3 0.6 0.2 0.8 0.5 0.8 0.7 0.4 0.6-0.2 1-0.6 0.7-1.5 1.2-0.6 0.9-0.3 0.8-0.3 1.8-1.2 3.8-0.2 1.8 0.9 0.4 1.2-0.5 0.7-0.1 0.6 0.3 1.1 4.1 0.3 0.9 0.5 0.8-0.1 0.6-1.4 0.8-1.5 1-1.1 1.1-0.5 0.5-0.3 0.7-0.2 1.2 0.3 0.1 0.3 1.5 0.1 1.4-0.5-0.1 3.5 1.9 0.8 0.3 0.9-0.2 3.8-0.5 9.3 2.5 0.5 0.2 1.8-0.4 8.6-4.3 2.6-0.4 0.7-0.4 0.5-1.1 0.5-1.5 0.5-3.1-0.1-0.7-0.2-0.5-0.2-0.5 0.2-1 0.3-0.7 6.6-6.7 1.7-0.8 0.3 1.4 0.7 0.3 1.9-0.4 0.6 0.8-0.1 1.7-0.3 1.9-0.2 1.7-0.6-0.7-0.4 0.1-1.2 2.6 0 0.8 0.1 0.8-0.1 1.1-2.4 5.9-0.2 1.6 0.8 1.3 2.9 1.2 1 1.8 0.1 1.2-0.2 0.9-0.3 0.8-0.3 1.1-0.2 0.5-0.6 0.7-0.1 0.6 0.1 0.4 0.6 1.1 0.2 0.5 0 3.6 0.5 0.7 1.7 0.3 1.3-0.3 2.7-0.9 1.2-0.1 0.1 0 1.1 0.7 2.3 2.2 1.3 0.7 2.2 0.7 0.7 0.7 2.7 3.8 0.9 0.9 1.1 0.9 1.4 0.4 2.8-0.8 1.4 0 1.3 1.2 1.1 1.5 0.5 1.4-0.3 0.4-0.5 0.3-0.2 1.4 0.2 0.8 0.3 0.4 1 0.2 0.4-0.1 0.4-0.5 0.2-0.5 0.2-0.3 0.4 0.1 0.7 0.4 1.9 0.7 0.5 0.4 0.7 0.6 3 5.5 0.2 0.8 0 1-0.2 0.9 0 0.9 0.3 0.8 1.4 0.4 1.6-1 1.5-1.2 1.2-0.5 1.9 0.9 0.6 0.1 0.9-0.1 0.2-0.4 0.1-0.7 0.8-1 1.5-0.8 1.4 0.4 1.3 0.6 1.4 0.3 0.7-0.4 0.8-1 0.7-0.4 0.7 0.1 1.3 0.8 0.7 0.2 2 2.6 1.1 1 1.5 0.8 4 0.9 1.1 1.2 0.9 2.7 1-0.4 5.3-0.3 0.9-0.3 0.6-0.9 0.8-0.3 0.1-0.5 0-0.6 0.3-0.6 0.5-0.2 1.7-0.2-0.4-0.8 3.6-0.4 1.7 0.2 1.7 0.6 0.1 0.1 3 2.2 1.6 0.9 1.3 0.2 0.5 0 0.6-0.1 1.2-0.8 0.5-0.2 0.7 0.1 5.7 2.9 1.1 1 0.3 0.8 0.2 0.8 0 0.5-0.1 0 0.4 0.7 3 3.2 0.2 0.5-0.2 0.8-1.1 0.1-0.4 0.8 0.4 1.1 1.1 1.3 4.1 4 0.1 0.4-0.2 0.9 0.1 0.4 0.3 0.3 0.9 0.3 0.3 0.3 0.5 1.7 0.2 0.4 0 0.2 0.1 0.8 0.2 0.3 0.3 0 0.8-0.6 0.3 0 0.4 1.5-0.4 1.2-0.1 1.2 0.8 1.3 0.7 0.3 2.7 0 2.5 0.9 0.7-0.1 1.1-1.5-0.2-1.5-0.5-1.6 0.4-1.3 0.6-0.1 2.6 0.6 1.8-0.2 0.7 0.1 3.8 2.2 1.4 0-0.1 3.4 0.7 2.6 1.4 1.1 1.9-1.2 0.1-0.5-0.2-0.5-0.1-0.5 0.6-0.6 0.4 0 2.3 1.8 1 0.5 1 0.3 5.3 0.1 1.7 0.7 0.3 0.1 0.4-0.4 0.7-1.3 0.4-0.5 0.5-0.2 1.3-0.1 0.4-0.3 0.4-0.5 0.4-1.4 0.3-0.4 1-0.6 0.3-0.1 1.2-0.3 1.2 0.1 0.2 1 2.7 0.2 1.1 0.4 0.4 1.4-0.4 0.3-0.2 0.2-0.1 0.3 0.9 0.9 1.4 2.3 0.8 1 1.3 0.9 2.8 0.5 1.3 0.7 0.5 0.5 0.6 1.3 0.6 0.5 0.6 0.1 0.2 0 0.8-0.1 0.7-0.4 0.8-0.1 0.6 0.1 1.4 0.5 0.6 0.1 0.7-0.2 1.5-0.8 0.6-0.2 5.2 1.5 3.5-0.4 1.1 0.1 9.8 5.3 6.1 1.2 0.7 0.7 0 0.1-1.3 1.4-1.9 3.7-2.8 7.7-0.8 1.3-0.3 0.4-2.3 1.2-0.6 0-0.1 0.2-0.3 0.3-0.3 0.5-0.1 0.9-0.1 0.5-0.4 0.3-0.5 0.2-1.7 0-0.7 0.3-0.3 0.8-0.1 1.8-0.3 0.7-0.6 0.9-0.9 0.8-0.7 0.5-1.7 2-0.9 0.8-1.1 0.4-0.7 0.5-2.6 4.1-0.5 3 0 3.3 0.7 2 0 0.6-1.5 1.2-0.8 0.8-0.3 0.9-0.1 1.7-0.3 0.9-0.4 0.6-0.5 0.9-0.3 1.1-0.4 2.5-0.1 1.2 0.2 1.1 0.4 1.2 0.3 1.2-0.1 1.3-0.8 1.4-1.2 0.6-1 0.8-0.4 2-0.1 1.9-0.4 1.6-0.7 1.3-3.9 5.5-0.4 1.1-0.1 1.4-0.3 0.7-0.4 0.6-0.5 0.8-0.4 1.4-0.4 1.8 0.2 3.8 2.7 4.8 0.1 2.8-0.6 1.2-1.6 1.7-0.4 1.2 0.1 1.5-0.1 0.5-0.4 0.9-0.2 0.4-0.5 0.4-0.1 0.4-0.1 0.4 0 0.3 0.1 0.2 0 0.4 0.3 1.7-0.2 1-0.8 0.5-0.3 0.4-0.9 3-0.2 1.3 0.8 3.2-0.1 1.5-0.3 0.6-1 1.1-0.3 0.6 0.2 2 0.2 1 0.3 0.4 0.9 0.5 0.8 1.1 1.4 2.8 0.4 0.5 0.4 0.3 0.3 0.5 0.1 0.9-0.1 0.3-0.3 1-2.2 0.8-1.5 0.8-0.3 0.3-2.4 1.9 0.2 0.1 1 0.8 0.2 0 0 0.9-0.2 0.5-0.5 0.2-0.7-0.1-0.3 0.1-0.1 0.3 0.1 0.4 0.5 0.6 0 0.2 0 0.1 0 0.2-0.1 0.3-0.1 0.1-0.9 0.9-0.8-0.1-0.5-0.4-0.3-0.2-1-0.3-0.7 0.2 0 0.6 0.3 0.5 0.2 0.3 0.3 0.4 0.1 0.5-0.2 0.9-0.3 0.4-0.9 1.2-1.1 0.4-0.6 0.3-2.6-0.2-1.7 0-1.6 0.3-2.4 1-0.4 0.1-0.5-0.2-0.2-0.3-0.2-0.3-0.3-0.2-1.8-0.6-1.3-0.8-0.4-1.5 1.2-2.6-1.7 0.2-0.7-0.2-0.1 0-0.9-0.4-1.4-0.3-3.1 0.5-1.6-0.2-0.6-0.5-0.5-0.1-0.6 0.1-0.5 0.5-1.2 0.3 0.2 1 0.6 1.3 0.3 1.1-0.5 0.8-0.9 0.7-1 0.6-1.6 0.4-0.1 1.7-1.6 1-0.9 1.2-0.8 1.4-0.3 1.2 7.4-0.8 1.1-0.5 0.9 0.7 1 0.9 0.6 0.9-0.5 1-0.5 0.4-0.7 0.1-0.6 0.4-0.9 1.3-0.4 0.1-0.5 0.1-1.2 1.2-0.4 1.8 0.3 2.3-4.2 3.1-1.8 1.8-1.2 2-0.1 0.1-4 3.6-1.8 0.7 0.1 1.5-0.9 0.5-0.3 0.2-0.2 0.5-1.5 0.6-0.6 0.6-0.9 1.4 0.8 1.7-1.4 2.1-4.2 3.1-6.6 2.1-3 1.8-0.9 3.1 0.2 0.9 0.8 1.5 0.2 1-0.1 1.3-0.2 0.5-0.1 0.3-0.4 0.8-1 3-0.1 0.4 0.2 0.5 0.3 0.5 0.5 0.5 0 1.5-0.2 0.7-0.7 0.9-0.7 0.5-2 1.1-1.7 1.8-0.6 0.6-4.4 2.4-8.3 7.6-0.9 1.1 0.2 1.2 1.5 1.7-2.2 2.8-2.1 3.7-0.7 0.7-0.3 0.6 0 0.4 0.2 0.5 0.1 0.3 0 0.3 0 0.7 0.2 0.6-0.1 0.6-0.7 0.7 0.2 0.2 3.1 1.8 0.9 1 0.8 1.4 0 1-1.1 2.4-0.9 2.1-0.2 0.7-0.4 2.5 0 1 0 0.8-0.3 0.6-1.3 0.4-0.4 0.1-0.3-0.1-0.5-0.1-0.1-0.1-0.1 0.1-0.2 0-3.7 1.8-1.5 1-0.2 1 0.6 1.3 1.1 1.3-0.2 0.8-0.4 0.9-0.9 1.9z`;

/**
 * Regional map component using accurate France SVG
 * Fills use currentColor for automatic theme adaptation
 */
export function RegionalMap() {
  const [activeOffice, setActiveOffice] = useState<Office | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTooltipStyle = useCallback((office: Office) => {
    return {
      left: office.position.left,
      top: `calc(${office.position.top} - 90px)`,
      transform: "translateX(-50%)",
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Map Container */}
      <div className="relative w-full aspect-[1000/960] max-h-[500px]">
        {/* Accurate France SVG from Simplemaps */}
        <svg
          viewBox="0 0 1000 960"
          className="w-full h-full text-[var(--foreground-faint)]"
          preserveAspectRatio="xMidYMid meet"
          aria-label="Carte de France avec les bureaux alecia"
          role="img"
        >
          <defs>
            {/* Drop shadow for depth */}
            <filter id="franceShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="var(--foreground)" floodOpacity="0.08" />
            </filter>
            
            {/* Glow filter for markers */}
            <filter id="markerGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* France map - uses currentColor for theme adaptation */}
          <motion.path
            d={FRANCE_PATH}
            fill="currentColor"
            stroke="var(--border)"
            strokeWidth="0.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#franceShadow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>

        {/* Office Markers */}
        {mounted && offices.map((office, index) => (
          <div
            key={office.id}
            className="absolute z-10"
            style={{
              left: office.position.left,
              top: office.position.top,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute rounded-full border-2 border-[var(--accent)]"
              style={{
                width: "40px",
                height: "40px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.4, 0.08, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.25,
              }}
            />
            
            {/* Inner glow */}
            <motion.div
              className="absolute rounded-full bg-[var(--accent)]"
              style={{
                width: "30px",
                height: "30px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 0.2,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.12 + 0.5, duration: 0.35 }}
            />
            
            {/* Main marker */}
            <motion.button
              className="relative z-10 w-5 h-5 rounded-full bg-[var(--accent)] cursor-pointer shadow-lg"
              style={{
                boxShadow: "0 0 0 3px var(--background), 0 0 15px rgba(245, 158, 11, 0.5)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: index * 0.12 + 0.3, 
                type: "spring", 
                stiffness: 350,
                damping: 15 
              }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setActiveOffice(office)}
              onMouseLeave={() => setActiveOffice(null)}
              onClick={() => setActiveOffice(activeOffice?.id === office.id ? null : office)}
              aria-label={`Bureau ${office.name} - ${office.city}`}
            />
          </div>
        ))}

        {/* Tooltip */}
        <AnimatePresence>
          {activeOffice && (
            <motion.div
              key={activeOffice.id}
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-xl z-30 w-[200px] pointer-events-none"
              style={getTooltipStyle(activeOffice)}
            >
              {/* Arrow */}
              <div 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--card)] border-r border-b border-[var(--border)] rotate-45" 
              />
              
              <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
                <span>{activeOffice.name}</span>
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] ml-6 mt-0.5">{activeOffice.city}</p>
              <p className="text-sm text-[var(--foreground-muted)] flex items-center gap-2 mt-2 ml-6">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                {activeOffice.phone}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {offices.map((office) => (
          <motion.button
            key={office.id}
            onMouseEnter={() => setActiveOffice(office)}
            onMouseLeave={() => setActiveOffice(null)}
            onClick={() => setActiveOffice(activeOffice?.id === office.id ? null : office)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
              activeOffice?.id === office.id
                ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/10"
                : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent)]/50 hover:shadow-md"
            }`}
          >
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                activeOffice?.id === office.id ? "scale-125" : ""
              }`} 
              style={{ backgroundColor: "var(--accent)" }} 
            />
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--foreground)] leading-tight">{office.name}</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{office.city}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
