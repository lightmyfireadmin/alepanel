"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface HeroBackgroundProps {
  /** Optional background image URL */
  imageUrl?: string;
  /** Whether to show animated particles */
  showParticles?: boolean;
  /** Overlay gradient intensity (0-1) */
  overlayOpacity?: number;
}

export function HeroBackground({
  imageUrl,
  showParticles = true,
  overlayOpacity = 0.7,
}: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Background Image (if provided) */}
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            className="object-cover"
          />
          {/* Dark overlay for readability */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/80 to-[var(--background)]"
            style={{ opacity: overlayOpacity }}
          />
        </>
      )}

      {/* Gradient background (always shown) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/8 via-transparent to-[var(--background-secondary)]/50" />
      
      {/* Radial gradient highlight */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-3xl" />
      </div>

      {/* Animated particles/shapes */}
      {showParticles && (
        <>
          {/* Floating orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-[var(--accent)]"
              style={{
                width: `${8 + i * 4}px`,
                height: `${8 + i * 4}px`,
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
                opacity: 0.1 + i * 0.03,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.1 + i * 0.03, 0.2 + i * 0.03, 0.1 + i * 0.03],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px),
                               linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Animated lines */}
          <motion.div
            className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scaleX: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/15 to-transparent"
            animate={{
              opacity: [0.15, 0.3, 0.15],
              scaleX: [1, 0.85, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}

      {/* Logo watermark */}
      <div className="absolute bottom-20 right-10 opacity-[0.03]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg 
            viewBox="0 0 84 26" 
            fill="currentColor" 
            className="w-64 h-auto text-[var(--foreground)]"
          >
            <path d="M52.4349 25.1698C50.8335 25.1698 49.3787 24.7976 48.0705 24.0533C46.7849 23.3089 45.7699 22.2939 45.0256 21.0082C44.2813 19.7226 43.9092 18.2903 43.9092 16.7114C43.9092 15.1099 44.2813 13.6776 45.0256 12.4145C45.7699 11.1288 46.7849 10.1138 48.0705 9.36944C49.3787 8.6251 50.8335 8.25293 52.4349 8.25293C53.6979 8.25293 54.8708 8.50104 55.9534 8.99727C57.0586 9.47094 57.9946 10.1589 58.7614 11.0611L56.3255 13.531C55.8519 12.9671 55.2767 12.5498 54.6001 12.2791C53.946 11.9859 53.2243 11.8393 52.4349 11.8393C51.5101 11.8393 50.6869 12.0536 49.9651 12.4821C49.2659 12.8881 48.7133 13.452 48.3073 14.1738C47.9239 14.8956 47.7322 15.7415 47.7322 16.7114C47.7322 17.6587 47.9239 18.5045 48.3073 19.2489C48.7133 19.9707 49.2659 20.5458 49.9651 20.9744C50.6869 21.3804 51.5101 21.5834 52.4349 21.5834C53.2243 21.5834 53.946 21.4481 54.6001 21.1774C55.2767 20.8842 55.8519 20.4556 56.3255 19.8917L58.7614 22.3616C57.9946 23.2638 57.0586 23.963 55.9534 24.4593C54.8708 24.9329 53.6979 25.1698 52.4349 25.1698Z" />
            <path d="M19.4482 25.2492V1.94363L23.1698 0.72168V25.2492H19.4482Z" />
            <path d="M60.834 25.2788V9.39772L64.5555 8.13184V25.2788H60.834Z" />
            <circle cx="8.45801" cy="16.6996" r="6.79" stroke="currentColor" strokeWidth="3.33726" fill="none" />
            <rect x="13.582" y="16.7568" width="3.33717" height="8.51596" />
            <circle cx="75.5391" cy="16.6996" r="6.79" stroke="currentColor" strokeWidth="3.33726" fill="none" />
            <rect x="80.6631" y="16.7568" width="3.33717" height="8.51596" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroBackground;
