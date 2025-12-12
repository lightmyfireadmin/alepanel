"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { CookieBanner } from "@/components/features/cookie-banner";
import { ScrollToTop } from "@/components/features/scroll-to-top";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ToastProvider>
          {children}
          <ScrollToTop />
          <CookieBanner />
        </ToastProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

