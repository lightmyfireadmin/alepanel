"use client";

import { useState } from "react";
import Image from "next/image";

interface DealDetailLogoProps {
  name: string;
  logoUrl?: string | null;
  size?: number; // pixel size for width/height
  className?: string;
}

export function DealDetailLogo({ 
  name, 
  logoUrl, 
  size = 64, 
  className = "" 
}: DealDetailLogoProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <div className={`rounded-xl bg-white border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {logoUrl && logoUrl.length > 0 && !logoError ? (
        <Image
          src={logoUrl}
          alt={name}
          width={size}
          height={size}
          className="object-contain"
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="text-3xl font-bold text-[var(--foreground-muted)]">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}
