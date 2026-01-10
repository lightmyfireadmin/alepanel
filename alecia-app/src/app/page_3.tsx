import { Footer_3 } from "@/components/layout_3/Footer_3";
import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { HeroVideo_3 } from "@/components/home_3/HeroVideo_3";
import { TransactionsCarousel_3 } from "@/components/transactions_3/Carousel_3";
import { KPIBand_3 } from "@/components/home_3/KPIBand_3";
import { ContactSection_3 } from "@/components/home_3/ContactSection_3";
import { getTransactions } from "@/lib/actions/convex-marketing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alecia | Banque d'affaires et Conseil M&A",
  description: "Conseil en fusion-acquisition pour PME et ETI. Cession, acquisition, levée de fonds. Une approche sur-mesure pour votre réussite.",
};

export default async function Home() {
  // Fetch transactions for the carousel
  // We'll use the existing action and map data to match simpler interface
  const transactionsData = await getTransactions({ limit: 10 });
  const recentDeals = transactionsData.map(t => ({
    id: t._id,
    slug: t.slug,
    clientName: t.clientName,
    sector: t.sector,
    year: t.year,
    mandateType: t.mandateType,
    acquirerName: t.acquirerName
  }));

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)]">
        <HeroVideo_3 />
        
        <KPIBand_3 />
        
        <TransactionsCarousel_3 deals={recentDeals} />
        
        <ContactSection_3 />
      </main>

      <Footer_3 />
    </>
  );
}
