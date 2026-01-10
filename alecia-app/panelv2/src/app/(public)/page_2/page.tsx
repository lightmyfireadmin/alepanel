import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import {
  HeroVideo_2,
  MetierSection_2,
  TransactionsCarousel_2,
  KPIBand_2,
  ContactSection_2,
} from "@/components/public_v2/home";

/**
 * Landing Page V2 - Refonte Alecia.fr
 * 
 * Selon cahier des charges :
 * - Vidéo plein écran en hero (style 7oceans.com)
 * - Section "Notre métier" avec 3 expertises
 * - Carrousel tombstones (style stratema.com)
 * - Bandeau KPIs
 * - Section contact (sans FAQ)
 */
export default function Page2() {
  return (
    <>
      <Navbar_2 />
      <main>
        {/* Hero Video - Plein écran avec message "Votre ambition, notre engagement" */}
        <HeroVideo_2 />

        {/* Notre Métier - Présentation simplifiée + 3 boîtes expertises */}
        <MetierSection_2 />

        {/* Transactions Carrousel - Tombstones style stratema.com */}
        <TransactionsCarousel_2 />

        {/* KPIs Bandeau - Multisectoriel, 5-50M€, X opérations, X bureaux */}
        <KPIBand_2 />

        {/* Contact - Adresses bureaux + formulaire (sans FAQ) */}
        <ContactSection_2 />
      </main>
      <Footer_2 />
    </>
  );
}
