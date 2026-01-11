import localFont from "next/font/local";
import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/components/Providers";
import { SkipToMain } from "@/components/layout/skip-to-main";
import { PublicWidgets } from "@/components/layout/PublicWidgets";
import { MobileStickyFooter } from "@/components/features/mobile-sticky-footer";
import { CookieBanner } from "@/components/features/cookie-banner";
import "./globals.css";

const bierstadt = localFont({
  src: [
    {
      path: "./fonts/bierstadt.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/bierstadt-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playfair", // Mapping to existing variable to propagate change globally without refactoring all CSS
});

export const metadata: Metadata = {
  title: {
    default: "alecia | Conseil en fusion-acquisition",
    template: "%s | alecia",
  },
  description:
    "Conseil en fusion-acquisition pour PME et ETI. Cession, acquisition, levée de fonds. Valorisation €5M-€100M.",
  keywords: [
    "fusion-acquisition",
    "M&A",
    "cession entreprise",
    "acquisition PME",
    "levée de fonds",
    "banque d'affaires",
    "conseil financier",
  ],
  authors: [{ name: "alecia" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.alecia.fr",
    siteName: "alecia",
    title: "alecia | Conseil en fusion-acquisition",
    description:
      "Conseil en fusion-acquisition pour PME et ETI. Cession, acquisition, levée de fonds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Lordicon animated icons */}
        <script src="https://cdn.lordicon.com/lordicon.js" async />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              "name": "alecia",
              "description": "Conseil en fusion-acquisition pour PME et ETI. Cession, acquisition, levée de fonds. Valorisation €5M-€100M.",
              "url": "https://www.alecia.fr",
              "logo": "https://www.alecia.fr/assets/alecia_logo.svg",
              "areaServed": {
                "@type": "Country",
                "name": "France"
              },
              "serviceType": ["M&A Advisory", "Business Valuation", "Fundraising", "Sell-side Advisory", "Buy-side Advisory"],
              "address": [
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Paris",
                  "addressRegion": "Île-de-France",
                  "addressCountry": "FR"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Nice",
                  "addressRegion": "Provence-Alpes-Côte d'Azur",
                  "addressCountry": "FR"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Annecy",
                  "addressRegion": "Auvergne-Rhône-Alpes",
                  "addressCountry": "FR"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Lorient",
                  "addressRegion": "Bretagne",
                  "addressCountry": "FR"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Aix-en-Provence",
                  "addressRegion": "Provence-Alpes-Côte d'Azur",
                  "addressCountry": "FR"
                }
              ],
              "sameAs": [
                "https://www.linkedin.com/company/alecia-ma"
              ],
              "foundingDate": "2021",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": 8
              }
            })
          }}
        />
      </head>
      <body
        className={`antialiased bg-[var(--background)] text-[var(--foreground)] ${bierstadt.variable}`}
      >
        <Providers locale={locale} messages={messages}>
          <SkipToMain />
          {children}
          <PublicWidgets />
          <MobileStickyFooter />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}

