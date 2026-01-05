"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";

interface Office {
  id: string;
  name: string;
  city: string;
  phone: string;
  // Position as percentage of the map image dimensions
  x: number;
  y: number;
  // Group ID for offices that should be grouped together (e.g., same region)
  groupId?: string;
}

// City positions as percentages of the France map PNG
const offices: Office[] = [
  { 
    id: "idf", 
    name: "Île-de-France", 
    city: "Paris", 
    phone: "contact@alecia.fr", 
    x: 55,
    y: 25
  },
  { 
    id: "ouest", 
    name: "Grand Ouest", 
    city: "Lorient", 
    phone: "contact@alecia.fr", 
    x: 25,
    y: 45
  },
  { 
    id: "ara", 
    name: "Auvergne Rhône-Alpes", 
    city: "Annecy", 
    phone: "contact@alecia.fr", 
    x: 73,
    y: 50
  },
  { 
    id: "sud-est-aix", 
    name: "Sud Est", 
    city: "Aix-en-Provence", 
    phone: "contact@alecia.fr", 
    x: 77,
    y: 78,
    groupId: "sud-est"
  },
  { 
    id: "sud-est-nice", 
    name: "Sud Est", 
    city: "Nice", 
    phone: "contact@alecia.fr", 
    x: 92,
    y: 84,
    groupId: "sud-est"
  },
];

// Get unique office groups for legend
const getUniqueOfficeGroups = () => {
  const seen = new Map<string, Office>();
  offices.forEach(office => {
    const key = office.groupId || office.id;
    if (!seen.has(key)) {
      seen.set(key, office);
    }
  });
  return Array.from(seen.values());
};

/**
 * Regional map component using France PNG image
 */
export function RegionalMap() {
  const [activeOffice, setActiveOffice] = useState<Office | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Check if an office should be highlighted (either directly or via group)
  const isOfficeActive = (office: Office) => {
    if (!activeOffice) return false;
    if (activeOffice.id === office.id) return true;
    // Also highlight if they share the same groupId
    if (activeOffice.groupId && office.groupId === activeOffice.groupId) return true;
    return false;
  };

  const uniqueGroups = getUniqueOfficeGroups();

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Map Container */}
      <div 
        className="relative w-full mx-auto"
        style={{ maxWidth: "450px" }}
      >
        {/* France Map Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full"
        >
          <Image
            src="/assets/france-map.png"
            alt="Carte de France"
            width={450}
            height={500}
            className="w-full h-auto"
            priority
          />
          
          {/* Markers */}
          {mounted && offices.map((office, index) => (
            <div
              key={office.id}
              className="absolute"
              style={{
                left: `${office.x}%`,
                top: `${office.y}%`,
              }}
            >
              {/* Marker container - uses negative margin to center on the point */}
              <div 
                className="relative"
                style={{
                  width: "40px",
                  height: "40px",
                  marginLeft: "-20px",
                  marginTop: "-20px",
                }}
              >
                {/* Pulse ring - absolutely centered */}
                <motion.div
                  className="absolute rounded-full border-2 border-[var(--accent)]"
                  style={{ 
                    width: "36px", 
                    height: "36px",
                    left: "50%",
                    top: "50%",
                    marginLeft: "-18px",
                    marginTop: "-18px",
                  }}
                  animate={{
                    scale: isOfficeActive(office) ? [1.2, 1.6, 1.2] : [1, 1.4, 1],
                    opacity: isOfficeActive(office) ? [0.8, 0.2, 0.8] : [0.5, 0.1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                />
                
                {/* Inner glow - absolutely centered */}
                <motion.div
                  className="absolute rounded-full bg-[var(--accent)]"
                  style={{ 
                    width: "28px", 
                    height: "28px", 
                    opacity: isOfficeActive(office) ? 0.4 : 0.25,
                    left: "50%",
                    top: "50%",
                    marginLeft: "-14px",
                    marginTop: "-14px",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                />
                
                {/* Main marker button - absolutely centered */}
                <motion.button
                  className="absolute z-10 w-4 h-4 rounded-full bg-[var(--accent)] cursor-pointer"
                  style={{
                    boxShadow: "0 0 0 2px var(--background), 0 0 10px rgba(245, 158, 11, 0.5)",
                    left: "50%",
                    top: "50%",
                    marginLeft: "-8px",
                    marginTop: "-8px",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: isOfficeActive(office) ? 1.3 : 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.2, 
                    type: "spring", 
                    stiffness: 400,
                    damping: 15 
                  }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setActiveOffice(office)}
                  onMouseLeave={() => setActiveOffice(null)}
                  onClick={() => setActiveOffice(activeOffice?.id === office.id ? null : office)}
                  aria-label={`Bureau ${office.name} - ${office.city}`}
                />

                {/* Tooltip - positioned ABOVE the dot, horizontally centered */}
                <AnimatePresence>
                  {activeOffice?.id === office.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, x: "-50%" }}
                      animate={{ opacity: 1, y: 0, x: "-50%" }}
                      exit={{ opacity: 0, y: 5, x: "-50%" }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute z-50 whitespace-nowrap pointer-events-none"
                      style={{
                        // Position above the dot: center of container is at 20px, dot is 8px radius
                        // So tooltip bottom (including arrow) should be at ~12px from center to provide slight gap
                        bottom: "calc(50% + 15px)",
                        left: "50%",
                      }}
                    >
                      <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-xl">
                        <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-1.5 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
                          <span>{office.name}</span>
                        </h3>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5 pl-5">
                          {office.city}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] flex items-center gap-1.5 mt-1.5">
                          <Phone className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0" />
                          <span>{office.phone}</span>
                        </p>
                        
                        {/* Arrow pointing down to the dot */}
                        <div 
                          className="absolute bg-[var(--card)] border-r border-b border-[var(--border)]"
                          style={{
                            width: "10px",
                            height: "10px",
                            bottom: "-6px",
                            left: "50%",
                            transform: "translateX(-50%) rotate(45deg)",
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Legend cards */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {uniqueGroups.map((office) => {
          const groupKey = office.groupId || office.id;
          const isActive = activeOffice && (
            activeOffice.id === office.id || 
            (activeOffice.groupId && activeOffice.groupId === office.groupId)
          );
          
          return (
            <motion.button
              key={groupKey}
              onMouseEnter={() => setActiveOffice(office)}
              onMouseLeave={() => setActiveOffice(null)}
              onClick={() => setActiveOffice(isActive ? null : office)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                isActive
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-lg shadow-[var(--accent)]/10"
                  : "border-[var(--border)] bg-[var(--background-secondary)] hover:border-[var(--accent)]/50 hover:shadow-md"
              }`}
            >
              <div 
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-200 ${
                  isActive ? "scale-125" : ""
                }`} 
                style={{ backgroundColor: "var(--accent)" }} 
              />
              <div className="text-left">
                <p className="text-sm font-medium text-[var(--foreground)] leading-tight">{office.name}</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                  {office.groupId === "sud-est" ? "Aix-en-Provence & Nice" : office.city}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
