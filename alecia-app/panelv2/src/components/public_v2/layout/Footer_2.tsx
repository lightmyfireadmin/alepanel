import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { MapPin, Mail, Phone } from "lucide-react";

/**
 * Footer_2 - Footer V2 pour la refonte Alecia.fr
 * 
 * Selon cahier des charges :
 * - Adresses des bureaux bien visibles
 * - Contact email
 * - Liens vers les nouvelles rubriques
 */

const footerLinks = {
  services: [
    { href: "/expertises_2#cession", label: "Cession & transmission" },
    { href: "/expertises_2#levee-de-fonds", label: "Levée de fonds" },
    { href: "/expertises_2#acquisition", label: "Acquisition" },
  ],
  company: [
    { href: "/equipe_2", label: "Notre équipe" },
    { href: "/operations_2", label: "Transactions" },
    { href: "/actualites_2", label: "Actualités" },
    { href: "/nous-rejoindre_2", label: "Carrières" },
    { href: "/acces-prive_2", label: "Accès privé" },
  ],
  offices: [
    { 
      region: "Île-de-France", 
      city: "Paris",
      address: "75008 Paris"
    },
    { 
      region: "Provence-Alpes-Côte d'Azur", 
      city: "Aix-en-Provence",
      address: "13100 Aix-en-Provence"
    },
    { 
      region: "Côte d'Azur", 
      city: "Nice",
      address: "06000 Nice"
    },
    { 
      region: "Auvergne-Rhône-Alpes", 
      city: "Lyon",
      address: "69002 Lyon"
    },
  ],
};

export function Footer_2() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link 
              href="/page_2" 
              className="inline-block mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
              aria-label="alecia - Retour à l'accueil"
            >
              <Image
                src="/assets/alecia_logo_blue.svg"
                alt="alecia"
                width={120}
                height={40}
                className="h-10 w-auto dark:hidden"
              />
              <Image
                src="/assets/alecia_logo.svg"
                alt="alecia"
                width={120}
                height={40}
                className="h-10 w-auto hidden dark:block"
              />
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] mb-6 max-w-xs leading-relaxed">
              Conseil en fusion-acquisition pour PME et ETI. 
              Valorisation €5M - €50M.
            </p>
            
            {/* Mention cahier des charges */}
            <div className="p-4 bg-[var(--background-tertiary)] rounded-lg border border-[var(--border)]">
              <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                Pour l'accès aux opportunités actuellement en cours de négociations, 
                veuillez{" "}
                <Link 
                  href="/contact_2" 
                  className="text-[var(--accent)] hover:underline font-medium"
                >
                  prendre contact avec alecia
                </Link>
                .
              </p>
            </div>

            {/* Social Links */}
            <a
              href="https://www.linkedin.com/company/alecia-conseil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
              aria-label="Suivez alecia sur LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>

          {/* Services Column */}
          <nav aria-labelledby="footer-services-heading">
            <h4 id="footer-services-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
              Expertises
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Column */}
          <nav aria-labelledby="footer-company-heading">
            <h4 id="footer-company-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
              Cabinet
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Offices Column */}
          <div aria-labelledby="footer-offices-heading">
            <h4 id="footer-offices-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4 uppercase tracking-wider">
              Nos Bureaux
            </h4>
            <ul className="space-y-4">
              {footerLinks.offices.map((office) => (
                <li key={office.city} className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-[var(--foreground)] font-medium block">
                      {office.city}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">
                      {office.region}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a 
                href="mailto:contact@alecia.fr"
                className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline focus:outline-none focus-visible:underline"
              >
                <Mail className="w-4 h-4" />
                contact@alecia.fr
              </a>
            </div>
          </div>
        </div>

        <Separator className="bg-[var(--border)]" />

        {/* Bottom Footer */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--foreground-muted)]">
            © {currentYear} alecia. Tous droits réservés.
          </p>
          <nav aria-label="Liens légaux" className="flex items-center gap-6 text-xs">
            <Link
              href="/mentions-legales"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none focus-visible:underline"
            >
              Mentions légales
            </Link>
            <Link
              href="/politique-de-confidentialite"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none focus-visible:underline"
            >
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
