import type { Metadata } from "next";
import { SkipToMain } from "@/components/layout";
import { MobileStickyFooter, CookieBanner } from "@/components/features";
import { Providers } from "@/components/Providers";
import { getMessages, getLocale } from "next-intl/server";
import "./globals.css";

// Using fallback fonts to avoid Google Fonts fetching issues during build
const geistSans = {
  variable: "--font-geist-sans",
};

const geistMono = {
  variable: "--font-geist-mono",
};

const playfair = {
  variable: "--font-playfair",
};

export const metadata: Metadata = {
  title: {
    default: "alecia | Conseil en fusion-acquisition",
    template: "%s | alecia",
  },
  description:
    "Conseil en fusion-acquisition pour PME et ETI. Cession, acquisition, levée de fonds. Valorisation €5M-€50M.",
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
              "description": "Conseil en fusion-acquisition pour PME et ETI. Cession, acquisition, levée de fonds. Valorisation €5M-€50M.",
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
                  "addressLocality": "Lyon",
                  "addressRegion": "Auvergne-Rhône-Alpes",
                  "addressCountry": "FR"
                },
                {
                  "@type": "PostalAddress",
                  "addressLocality": "Nantes",
                  "addressRegion": "Pays de la Loire",
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
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <Providers locale={locale} messages={messages}>
          <SkipToMain />
          {children}
          <MobileStickyFooter />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}

