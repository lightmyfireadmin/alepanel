"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { SessionProvider } from "next-auth/react";
import { CookieBanner } from "@/components/features/cookie-banner";
import { ScrollToTop } from "@/components/features/scroll-to-top";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ToastProvider>
            {children}
            <ScrollToTop />
            <CookieBanner />
          </ToastProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

