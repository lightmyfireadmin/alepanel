import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import { ContactForm } from "@/components/features/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Alecia",
  description: "Prendre contact avec nos équipes.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
           {/* Info Side */}
           <div className="bg-[var(--background-secondary)] p-12 lg:p-24 flex flex-col justify-center">
              <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-bold mb-6">
                Discutons de vos projets
              </h1>
              <p className="text-xl text-[var(--foreground-muted)] mb-12">
                Nos associés sont à votre disposition pour échanger sur vos enjeux de cession, d'acquisition ou de financement.
              </p>
              
              <div className="space-y-8">
                <div>
                   <h3 className="font-semibold text-lg mb-2">Siège Social</h3>
                   <p className="text-[var(--foreground-muted)]">35 Boulevard Haussmann<br/>75009 Paris</p>
                </div>
                <div>
                   <h3 className="font-semibold text-lg mb-2">Contact Direct</h3>
                   <p className="text-[var(--foreground-muted)]">contact@alecia.fr</p>
                   <p className="text-[var(--foreground-muted)]">+33 1 00 00 00 00</p>
                </div>
              </div>
           </div>

           {/* Form Side */}
           <div className="p-12 lg:p-24 flex items-center bg-[var(--background)]">
              <div className="w-full max-w-md mx-auto">
                 <ContactForm />
              </div>
           </div>
        </div>
      </main>

      <Footer_3 />
    </>
  );
}
