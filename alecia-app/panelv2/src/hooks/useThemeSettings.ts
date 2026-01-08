"use client";

import { useQuery } from "convex/react";
import { useEffect, useState, useCallback } from "react";
import { api } from "../../convex/_generated/api";
import { generateCSSVariables, type ThemeSettings } from "@/lib/theme-utils";

const THEME_CACHE_KEY = "alecia_theme_settings";
const THEME_CACHE_VERSION = "v1";

/**
 * Hook to manage theme settings with Convex sync and local caching
 */
export function useThemeSettings() {
  const themeQuery = useQuery(api.theme.getThemeSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from cache first for instant display
  useEffect(() => {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    if (cached) {
      try {
        const { version, settings } = JSON.parse(cached);
        if (version === THEME_CACHE_VERSION && settings) {
          applyTheme(settings);
        }
      } catch {
        // Invalid cache, will be overwritten
      }
    }
  }, []);

  // Update when Convex data arrives
  useEffect(() => {
    if (themeQuery) {
      applyTheme(themeQuery);
      // Cache the settings
      localStorage.setItem(
        THEME_CACHE_KEY,
        JSON.stringify({
          version: THEME_CACHE_VERSION,
          settings: themeQuery,
        })
      );
      setIsLoaded(true);
    }
  }, [themeQuery]);

  return { settings: themeQuery, isLoaded };
}

/**
 * Apply theme settings as CSS variables to the document
 */
function applyTheme(settings: ThemeSettings) {
  const { light, dark, fonts } = generateCSSVariables(settings);
  const root = document.documentElement;

  // Apply font variables (always)
  Object.entries(fonts).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Load Google Fonts dynamically
  loadGoogleFont(settings.headingFont);
  loadGoogleFont(settings.bodyFont);

  // Apply light mode variables to :root
  Object.entries(light).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Apply dark mode variables via a style element
  updateDarkModeStyles(dark);
}

/**
 * Load a Google Font dynamically
 */
function loadGoogleFont(fontFamily: string) {
  const fontId = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
  
  // Don't load if already loaded
  if (document.getElementById(fontId)) return;
  
  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

/**
 * Update dark mode CSS variables via a style element
 */
function updateDarkModeStyles(darkVars: Record<string, string>) {
  const styleId = "theme-dark-mode-vars";
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  const cssVars = Object.entries(darkVars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  styleEl.textContent = `.dark {\n${cssVars}\n}`;
}

/**
 * Higher-order component provider for theme
 */
export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  useThemeSettings();
  return <>{children}</>;
}
