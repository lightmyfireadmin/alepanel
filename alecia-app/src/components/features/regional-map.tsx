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
  { id: "idf", name: "Île-de-France", city: "Paris", phone: "+33 1 XX XX XX XX", coordinates: { x: 285, y: 135 } },
  { id: "sud-est", name: "Sud Est", city: "Nice", phone: "+33 4 XX XX XX XX", coordinates: { x: 370, y: 295 } },
  { id: "ara", name: "Auvergne Rhône-Alpes", city: "Lyon", phone: "+33 4 XX XX XX XX", coordinates: { x: 310, y: 245 } },
  { id: "ouest", name: "Grand Ouest", city: "Nantes", phone: "+33 2 XX XX XX XX", coordinates: { x: 140, y: 185 } },
];

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
        {/* France outline - simplified */}
        <path
          d="M250,30 L320,45 L380,60 L420,90 L440,130 L450,180 L430,220 
             L420,260 L400,290 L380,320 L350,350 L300,380 L250,400 
             L200,390 L150,360 L120,320 L100,280 L80,230 L70,180 
             L90,140 L120,100 L160,70 L200,45 Z"
          fill="var(--background-tertiary)"
          stroke="var(--border)"
          strokeWidth="2"
          className="transition-colors"
        />
        
        {/* Corsica */}
        <path
          d="M420,350 L430,360 L435,390 L425,420 L415,410 L410,380 L415,360 Z"
          fill="var(--background-tertiary)"
          stroke="var(--border)"
          strokeWidth="2"
        />

        {/* Office markers */}
        {offices.map((office) => (
          <g key={office.id}>
            {/* Pulse animation */}
            <motion.circle
              cx={office.coordinates.x}
              cy={office.coordinates.y}
              r="20"
              fill="var(--accent)"
              opacity={0.2}
              animate={{
                r: [20, 30, 20],
                opacity: [0.2, 0.1, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Main marker */}
            <motion.circle
              cx={office.coordinates.x}
              cy={office.coordinates.y}
              r="10"
              fill="var(--accent)"
              stroke="var(--background)"
              strokeWidth="3"
              className="cursor-pointer"
              whileHover={{ scale: 1.3 }}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 shadow-xl z-10"
          style={{
            left: `${(activeOffice.coordinates.x / 500) * 100}%`,
            top: `${(activeOffice.coordinates.y / 450) * 100 - 5}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--accent)]" />
            {activeOffice.name}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)]">{activeOffice.city}</p>
          <p className="text-sm text-[var(--foreground-muted)] flex items-center gap-2 mt-1">
            <Phone className="w-3 h-3" />
            {activeOffice.phone}
          </p>
        </motion.div>
      )}

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {offices.map((office) => (
          <button
            key={office.id}
            onMouseEnter={() => setActiveOffice(office)}
            onMouseLeave={() => setActiveOffice(null)}
            onClick={() => setActiveOffice(office)}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
              activeOffice?.id === office.id
                ? "border-[var(--accent)] bg-[var(--accent)]/10"
                : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent)]/50"
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--foreground)]">{office.name}</p>
              <p className="text-xs text-[var(--foreground-muted)]">{office.city}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
