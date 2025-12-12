"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface AnimatedIconProps {
  /** Lordicon icon identifier (e.g., "wmlleaez" for handshake) */
  icon: string;
  /** Trigger type for the animation */
  trigger?: "hover" | "click" | "loop" | "loop-on-hover" | "morph" | "boomerang";
  /** Size in pixels */
  size?: number;
  /** Custom colors (primary and secondary) */
  colors?: {
    primary?: string;
    secondary?: string;
  };
  /** Additional CSS classes */
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
}

// Lordicon icon library references
// Browse icons at: https://lordicon.com/icons
export const LORDICON_ICONS = {
  // Business & Finance
  handshake: "rqqkvjxd",
  coin: "qhviklyi", 
  chart: "gqdnbnwt",
  growth: "fttvwdlw",
  money: "pjipkdgy",
  target: "fpmskzsv",
  briefcase: "ynwbvguu",
  
  // Communication
  mail: "rhvddzym",
  phone: "tftaqjwp",
  chat: "fdxqrdfe",
  
  // Navigation & Actions
  arrow: "zmkotitn",
  search: "msoeawqm",
  settings: "hwuyodym",
  
  // Status
  success: "lomfljuq",
  loading: "xjovhxra",
  
  // Documents
  document: "wxnxiano",
  folder: "xfjhovmq",
} as const;

export function AnimatedIcon({
  icon,
  trigger = "hover",
  size = 48,
  colors,
  className = "",
  delay = 0,
}: AnimatedIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  // Determine colors based on theme
  const primaryColor = colors?.primary || (resolvedTheme === "dark" ? "#f59e0b" : "#f59e0b");
  const secondaryColor = colors?.secondary || (resolvedTheme === "dark" ? "#fbbf24" : "#d97706");

  useEffect(() => {
    // Trigger animation after delay if needed
    if (delay > 0 && ref.current) {
      const timeout = setTimeout(() => {
        const lordicon = ref.current?.querySelector("lord-icon");
        if (lordicon) {
          (lordicon as HTMLElement).setAttribute("trigger", trigger);
        }
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay, trigger]);

  return (
    <div ref={ref} className={`inline-flex items-center justify-center ${className}`}>
      {/* @ts-expect-error - lord-icon is a custom web component */}
      <lord-icon
        src={`https://cdn.lordicon.com/${icon}.json`}
        trigger={delay > 0 ? "none" : trigger}
        colors={`primary:${primaryColor},secondary:${secondaryColor}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
}

export default AnimatedIcon;
