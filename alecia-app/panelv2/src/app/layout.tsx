import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

// Bierstadt font - specified in cahier des charges
const bierstadt = localFont({
  src: [
    {
      path: "../components/public_v2/bierstadt.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../components/public_v2/bierstadt-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bierstadt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alecia Panel V2",
  description: "M&A Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bierstadt.variable}>
      <body
        className="font-sans antialiased"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


