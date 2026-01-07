"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect } from "react";

export function ThemeInjector() {
  const settings = useQuery(api.queries.getGlobalSettings);

  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      
      // Inject CSS variables
      // Note: We need to convert hex to HSL or Oklch if using Tailwind's advanced opacity modifiers,
      // but for V4 and simplicity, we can try direct color values if defined in globals as raw colors
      // OR we update specific variables expected by the system.
      // Looking at globals.css, --primary is defined as `222.2 47.4% 11.2%` (HSL spaceless).
      
      // For this MVP, we will assume the primaryColor is stored as a CSS value string 
      // OR we implement a hex-to-hsl converter if the input is a color picker (Hex).
      // Let's assume the user input (ThemeEditor) handles the format or we do a simple setProperty.
      
      if (settings.theme.primaryColor) {
         // This assumes the stored value matches the variable format (HSL space separated)
         // If the color picker gives HEX, we need a converter. 
         // For now, let's inject it as --primary-color-override if we want to be safe, 
         // but to override shadcn --primary, we need strict HSL.
         
         // If the input is simple Hex, we might break shadcn's opacity utility (bg-primary/50).
         // We will simply set it and see.
         root.style.setProperty("--primary", settings.theme.primaryColor);
      }
      
      if (settings.theme.radius) {
        root.style.setProperty("--radius", `${settings.theme.radius}rem`);
      }

       if (settings.theme.font) {
        root.style.setProperty("--font-sans", settings.theme.font);
      }
    }
  }, [settings]);

  return null; // Logic only, no UI
}
