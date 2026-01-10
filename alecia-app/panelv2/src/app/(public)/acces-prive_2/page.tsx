import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import Image from "next/image";
import Link from "next/link";
import { Lock, ExternalLink, ArrowRight } from "lucide-react";

/**
 * Accès Privé Page V2
 * 
 * Selon cahier des charges :
 * - Photo page de couverture LinkedIn
 * - Lien pour se connecter à la data room (fourni par prestataire)
 */

export default function AccesPrivePage2() {
  // Data room URL - would come from environment variable or CMS
  const dataRoomUrl = process.env.NEXT_PUBLIC_DATAROOM_URL || "#";
  
  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6">
              Accès privé
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">
              Espace réservé aux investisseurs et acquéreurs qualifiés pour accéder 
              aux opportunités en cours de négociation.
            </p>
          </div>

          {/* LinkedIn Cover Style Card */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xl mb-12">
            {/* Cover Image (LinkedIn style) */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#061a40] to-[#19354e]">
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop"
                  alt="alecia"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Profile Section */}
            <div className="relative px-6 md:px-8 pb-8">
              {/* Logo */}
              <div className="absolute -top-12 left-6 md:left-8 w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4 border-4 border-[var(--background)]">
                <Image
                  src="/assets/alecia_logo_blue.svg"
                  alt="alecia"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>

              {/* Content */}
              <div className="pt-16">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  alecia
                </h2>
                <p className="text-[var(--foreground-muted)] mb-6">
                  Conseil en fusion-acquisition • Paris, Lyon, Aix, Nice
                </p>

                {/* Data Room Access */}
                <div className="p-6 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">
                    Accès Data Room
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] mb-4">
                    Connectez-vous à notre plateforme sécurisée pour consulter 
                    les dossiers d'investissement.
                  </p>
                  
                  {dataRoomUrl !== "#" ? (
                    <a
                      href={dataRoomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#061a40] to-[#19354e] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Accéder à la Data Room
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        Le lien vers la data room sera bientôt disponible. 
                        Contactez-nous pour obtenir vos accès.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center p-8 bg-[var(--background-secondary)] rounded-2xl border border-[var(--border)]">
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
              Vous n'avez pas encore d'accès ?
            </h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              Prenez contact avec nous pour obtenir vos identifiants et accéder 
              aux opportunités en cours de négociation.
            </p>
            <Link
              href="/contact_2"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#061a40] to-[#19354e] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Contacter alecia
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer_2 />
    </>
  );
}
