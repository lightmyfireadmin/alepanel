import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import Image from "next/image";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Accès Privé | Alecia",
  description: "Espace sécurisé Data Room.",
};

export default function AccessPrivePage() {
  // Placeholder Data Room URL (can be env var later)
  const DATAROOM_URL = "https://dataroom.alecia.fr"; 

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] flex items-center justify-center -my-20">
        <div className="w-full max-w-md px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--background-secondary)] mb-6 text-[var(--accent)]">
            <Lock className="w-8 h-8" />
          </div>
          
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mb-4">
            Espace Privé
          </h1>
          
          <p className="text-[var(--foreground-muted)] mb-8 leading-relaxed">
            L'accès aux dossiers en cours est strictement réservé aux investisseurs accrédités et protégés par un accord de confidentialité (NDA).
          </p>
          
          <div className="space-y-4">
             <Button asChild className="w-full btn-gold h-12 text-lg">
                <a href={DATAROOM_URL} target="_blank" rel="noopener noreferrer">
                   Accéder à la Data Room
                </a>
             </Button>
             
             <p className="text-xs text-[var(--foreground-muted)] mt-4">
               Vous n'avez pas vos codes ? <Link href="/contact_3" className="underline hover:text-[var(--accent)]">Contactez-nous</Link>.
             </p>
          </div>
        </div>
      </main>

      <Footer_3 />
    </>
  );
}
