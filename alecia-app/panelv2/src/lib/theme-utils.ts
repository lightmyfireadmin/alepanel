/**
 * Theme Utility Functions
 * 
 * Dynamic color derivation for:
 * - Gradient generation
 * - Hover states
 * - Text contrast
 * - Color lightening/darkening
 */

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

/**
 * Check if a color is light (for determining text contrast)
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  // Using relative luminance formula
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Get contrasting text color
 * Returns navy (#061A40) for light backgrounds, white for dark
 */
export function getContrastTextColor(bgColor: string): string {
  return isLightColor(bgColor) ? "#061A40" : "#FFFFFF";
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const amount = percent / 100;
  return rgbToHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount
  );
}

/**
 * Darken a color by a percentage
 */
export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const amount = percent / 100;
  return rgbToHex(
    rgb.r * (1 - amount),
    rgb.g * (1 - amount),
    rgb.b * (1 - amount)
  );
}

/**
 * Generate gradient colors from a base color
 * Returns [base, lighter1, lighter2] for smooth gradients
 */
export function generateGradientColors(baseColor: string): [string, string, string] {
  // Handle white fallback
  if (baseColor.toUpperCase() === "#FFFFFF") {
    return ["#FFFFFF", "#FFFFFF", "#FFFFFF"];
  }
  
  return [
    baseColor,
    lighten(baseColor, 15),
    lighten(baseColor, 25),
  ];
}

/**
 * Get hover color
 * Dark theme: buttons are light, hover = darker
 * Light theme: buttons are dark, hover = lighter
 */
export function getHoverColor(baseColor: string, isDarkTheme: boolean): string {
  if (isDarkTheme) {
    // Button is light on dark bg, darken on hover
    return darken(baseColor, 10);
  } else {
    // Button is dark on light bg, lighten on hover
    return lighten(baseColor, 15);
  }
}

/**
 * Get box shadow color with opacity
 */
export function getShadowColor(baseColor: string, opacity: number = 0.25): string {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return `rgba(0, 0, 0, ${opacity})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Generate all derived CSS variables from theme settings
 */
export interface ThemeSettings {
  primaryLight: string;
  secondaryLight: string;
  backgroundLight: string;
  primaryDark: string;
  secondaryDark: string;
  backgroundDark: string;
  headingFont: string;
  bodyFont: string;
}

export function generateCSSVariables(theme: ThemeSettings): {
  light: Record<string, string>;
  dark: Record<string, string>;
  fonts: Record<string, string>;
} {
  // Generate light mode variables
  const [primaryGrad1L, primaryGrad2L, primaryGrad3L] = generateGradientColors(theme.primaryLight);
  const lightTextColor = getContrastTextColor(theme.backgroundLight);
  
  const light: Record<string, string> = {
    "--theme-primary": theme.primaryLight,
    "--theme-primary-grad-1": primaryGrad1L,
    "--theme-primary-grad-2": primaryGrad2L,
    "--theme-primary-grad-3": primaryGrad3L,
    "--theme-primary-hover": getHoverColor(theme.primaryLight, false),
    "--theme-primary-shadow": getShadowColor(theme.primaryLight, 0.25),
    "--theme-secondary": theme.secondaryLight,
    "--theme-secondary-hover": getHoverColor(theme.secondaryLight, false),
    "--theme-background": theme.backgroundLight,
    "--theme-foreground": lightTextColor,
    "--theme-foreground-muted": isLightColor(theme.backgroundLight) ? "#475569" : "#94a3b8",
  };
  
  // Generate dark mode variables
  const [primaryGrad1D, primaryGrad2D, primaryGrad3D] = generateGradientColors(theme.primaryDark);
  const darkTextColor = getContrastTextColor(theme.backgroundDark);
  
  const dark: Record<string, string> = {
    "--theme-primary": theme.primaryDark,
    "--theme-primary-grad-1": primaryGrad1D,
    "--theme-primary-grad-2": primaryGrad2D,
    "--theme-primary-grad-3": primaryGrad3D,
    "--theme-primary-hover": getHoverColor(theme.primaryDark, true),
    "--theme-primary-shadow": getShadowColor(theme.primaryDark, 0.25),
    "--theme-secondary": theme.secondaryDark,
    "--theme-secondary-hover": getHoverColor(theme.secondaryDark, true),
    "--theme-background": theme.backgroundDark,
    "--theme-foreground": darkTextColor,
    "--theme-foreground-muted": isLightColor(theme.backgroundDark) ? "#475569" : "#94a3b8",
  };
  
  // Font variables
  const fonts: Record<string, string> = {
    "--font-heading": `"${theme.headingFont}", Georgia, serif`,
    "--font-body": `"${theme.bodyFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif`,
  };
  
  return { light, dark, fonts };
}

/**
 * Alecia official color palette
 */
export const ALECIA_COLORS = [
  { hex: "#3E6BF7", name: "Bleu" },
  { hex: "#25A18E", name: "Vert" },
  { hex: "#F58A07", name: "Orange" },
  { hex: "#DB222A", name: "Rouge" },
  { hex: "#061A40", name: "Marine" },
  { hex: "#AAB1BE", name: "Gris" },
  { hex: "#E6E8EC", name: "Gris clair" },
  { hex: "#F3F4F5", name: "Blanc cassé" },
  { hex: "#FFFFFF", name: "Blanc" },
  { hex: "#000000", name: "Noir" },
  { hex: "#4A4A4A", name: "Gris foncé" },
  { hex: "#9B9B9B", name: "Gris moyen" },
];

/**
 * Popular Google Font options for the dropdown
 */
export const GOOGLE_FONTS = {
  headings: [
    "Playfair Display",
    "Merriweather",
    "Lora",
    "Libre Baskerville",
    "Cormorant Garamond",
    "EB Garamond",
    "Source Serif Pro",
    "Crimson Text",
    "Prata",
    "Spectral",
  ],
  body: [
    "Outfit",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Poppins",
    "Montserrat",
    "Source Sans Pro",
    "Nunito",
    "Work Sans",
  ],
};
