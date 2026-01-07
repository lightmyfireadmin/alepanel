"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export function ThemeInjector() {
  const settings = useQuery(api.queries.getGlobalSettings);

  useEffect(() => {
    if (settings?.theme) {
      const root = document.documentElement;
      
      if (settings.theme.primaryColor) {
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
