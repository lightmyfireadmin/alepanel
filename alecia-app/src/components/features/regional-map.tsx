"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone } from "lucide-react";

interface Office {
  id: string;
  name: string;
  city: string;
  phone: string;
  coordinates: { x: number; y: number };
}

const offices: Office[] = [
  { id: "idf", name: "Île-de-France", city: "Paris", phone: "Nous contacter", coordinates: { x: 280, y: 120 } },
  { id: "sud-est", name: "Sud Est", city: "Nice", phone: "Nous contacter", coordinates: { x: 380, y: 320 } },
  { id: "ara", name: "Auvergne Rhône-Alpes", city: "Lyon", phone: "Nous contacter", coordinates: { x: 320, y: 260 } },
  { id: "ouest", name: "Grand Ouest", city: "Nantes", phone: "Nous contacter", coordinates: { x: 130, y: 200 } },
];

// Accurate France mainland outline (simplified but geographically correct)
const FRANCE_PATH = `
  M 270,20 
  C 290,18 310,25 330,30 
  L 355,35 C 380,42 400,55 415,70 
  L 430,85 C 445,100 455,120 460,140 
  L 462,165 C 460,190 450,215 435,235 
  L 420,255 C 405,275 390,295 375,315 
  L 355,340 C 340,360 320,378 295,390 
  L 265,400 C 240,408 215,412 190,408 
  L 165,400 C 140,390 118,375 100,355 
  L 85,335 C 70,310 60,285 55,258 
  L 52,230 C 50,200 55,170 65,145 
  L 75,120 C 90,95 110,75 135,58 
  L 165,42 C 190,30 220,22 250,20 
  Z
`;

// Corsica outline
const CORSICA_PATH = `
  M 420,360 
  C 428,365 432,375 434,390 
  L 432,410 C 428,425 420,435 410,428 
  L 405,415 C 402,400 405,385 412,370 
  Z
`;

export function RegionalMap() {
  const [activeOffice, setActiveOffice] = useState<Office | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* SVG Map of France */}
      <svg
        viewBox="0 0 500 450"
        className="w-full h-auto"
        style={{ maxHeight: "450px" }}
      >
        {/* Gradient definition for subtle depth */}
        <defs>
          <linearGradient id="franceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--background-tertiary)" />
            <stop offset="100%" stopColor="var(--background-secondary)" />
          </linearGradient>
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* France mainland outline */}
        <motion.path
          d={FRANCE_PATH}
          fill="url(#franceGradient)"
          stroke="var(--border)"
          strokeWidth="2"
          filter="url(#mapShadow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Corsica */}
        <motion.path
          d={CORSICA_PATH}
          fill="url(#franceGradient)"
          stroke="var(--border)"
          strokeWidth="1.5"
          filter="url(#mapShadow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Office markers */}
        {offices.map((office, index) => (
          <g key={office.id}>
            {/* Outer pulse ring */}
            <motion.circle
              cx={office.coordinates.x}
              cy={office.coordinates.y}
              r="18"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              opacity={0.4}
              animate={{
                r: [18, 28, 18],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            />
            {/* Inner glow */}
            <motion.circle
              cx={office.coordinates.x}
              cy={office.coordinates.y}
              r="14"
              fill="var(--accent)"
              opacity={0.2}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15 + 0.5, duration: 0.4 }}
            />
            {/* Main marker */}
            <motion.circle
              cx={office.coordinates.x}
              cy={office.coordinates.y}
              r="8"
              fill="var(--accent)"
              stroke="var(--background)"
              strokeWidth="3"
              className="cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.4 }}
              whileTap={{ scale: 0.9 }}
              onMouseEnter={() => setActiveOffice(office)}
              onMouseLeave={() => setActiveOffice(null)}
              onClick={() => setActiveOffice(office)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {activeOffice && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 shadow-2xl z-10 min-w-[180px]"
          style={{
            left: `${(activeOffice.coordinates.x / 500) * 100}%`,
            top: `${(activeOffice.coordinates.y / 450) * 100 - 8}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--card)] border-r border-b border-[var(--border)] rotate-45" />
          <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--accent)]" />
            {activeOffice.name}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] ml-6">{activeOffice.city}</p>
          <p className="text-sm text-[var(--foreground-muted)] flex items-center gap-2 mt-2">
            <Phone className="w-3 h-3" />
            {activeOffice.phone}
          </p>
        </motion.div>
      )}

      {/* Legend cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {offices.map((office) => (
          <motion.button
            key={office.id}
            onMouseEnter={() => setActiveOffice(office)}
            onMouseLeave={() => setActiveOffice(null)}
            onClick={() => setActiveOffice(office)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
              activeOffice?.id === office.id
                ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg"
                : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent)]/50 hover:shadow-md"
            }`}
          >
            <div className={`w-3 h-3 rounded-full transition-transform ${
              activeOffice?.id === office.id ? "scale-125" : ""
            }`} style={{ backgroundColor: "var(--accent)" }} />
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--foreground)]">{office.name}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{office.city}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
