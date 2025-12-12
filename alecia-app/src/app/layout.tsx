import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { SkipToMain } from "@/components/layout";
import { Providers } from "@/components/Providers";
import { getMessages, getLocale } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <Providers locale={locale} messages={messages}>
          <SkipToMain />
          {children}
        </Providers>
      </body>
    </html>
  );
}

