"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "sonner";
import { UserSync } from "@/components/auth/UserSync";
import { CommandPalette } from "@/components/ui/command-palette";
import { ThemeSettingsProvider } from "@/hooks/useThemeSettings";

// Import both locale messages
import frMessages from "../../messages/fr.json";
import enMessages from "../../messages/en.json";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const messages = {
  fr: frMessages,
  en: enMessages,
};

function getLocaleFromCookie(): "fr" | "en" {
  if (typeof document === "undefined") return "fr";
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
  const locale = match?.[1];
  if (locale === "en" || locale === "fr") return locale;
  return "fr";
}

export function Providers({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocale(getLocaleFromCookie());
    setMounted(true);
  }, []);

  // Listen for cookie changes (when user switches language)
  useEffect(() => {
    const checkLocale = () => {
      const newLocale = getLocaleFromCookie();
      if (newLocale !== locale) {
        setLocale(newLocale);
      }
    };

    // Check periodically for cookie changes
    const interval = setInterval(checkLocale, 1000);
    return () => clearInterval(interval);
  }, [locale]);

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider 
            locale={locale} 
            messages={messages[locale]}
            // Prevent hydration mismatch by using key
            key={mounted ? locale : "fr"}
          >
            <ThemeSettingsProvider>
              <CommandPalette />
              {children}
              <Toaster position="bottom-right" richColors />
            </ThemeSettingsProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
