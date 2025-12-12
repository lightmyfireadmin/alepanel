import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  services: [
    { href: "/expertises#cession", label: "Cession & transmission" },
    { href: "/expertises#levee-de-fonds", label: "Levée de fonds" },
    { href: "/expertises#acquisition", label: "Acquisition" },
  ],
  company: [
    { href: "/equipe", label: "Notre équipe" },
    { href: "/operations", label: "Nos opérations" },
    { href: "/actualites", label: "Actualités" },
    { href: "/nous-rejoindre", label: "Nous rejoindre" },
  ],
  offices: [
    { label: "Île-de-France", city: "Paris" },
    { label: "Sud Est", city: "Nice" },
    { label: "Auvergne Rhône-Alpes", city: "Lyon" },
    { label: "Grand Ouest", city: "Nantes" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--background-secondary)] border-t border-[var(--border)]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link 
              href="/" 
              className="inline-block mb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
              aria-label="alecia - Retour à l'accueil"
            >
              <Image
                src="/assets/alecia_logo.svg"
                alt="alecia"
                width={100}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] mb-4 max-w-xs">
              Conseil en fusion-acquisition pour PME et ETI. 
              Valorisation €5M-€50M.
            </p>
            {/* Compliance Badges */}
            <div className="flex items-center gap-4 text-xs text-[var(--foreground-faint)] mb-4" role="list" aria-label="Certifications">
              <span className="px-2 py-1 border border-[var(--border)] rounded" role="listitem" title="Autorité des marchés financiers">
                AMF
              </span>
              <span className="px-2 py-1 border border-[var(--border)] rounded" role="listitem" title="Organisme pour le registre des intermédiaires en assurance">
                ORIAS
              </span>
            </div>
            {/* Social Links */}
            <a
              href="https://www.linkedin.com/company/alecia-conseil"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors"
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
            <h4 id="footer-services-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Services
            </h4>
            <ul className="space-y-2">
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
            <h4 id="footer-company-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Cabinet
            </h4>
            <ul className="space-y-2">
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

          <div aria-labelledby="footer-offices-heading">
            <h4 id="footer-offices-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Bureaux
            </h4>
            <ul className="space-y-2">
              {footerLinks.offices.map((office) => (
                <li key={office.label} className="text-sm">
                  <span className="text-[var(--foreground)] font-medium">{office.label}</span>
                  <span className="text-[var(--foreground-muted)]"> · {office.city}</span>
                </li>
              ))}
            </ul>
            <a 
              href="mailto:contact@alecia.fr"
              className="inline-block mt-4 text-sm text-[var(--accent)] hover:underline focus:outline-none focus-visible:underline"
            >
              contact@alecia.fr
            </a>
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
            <Link
              href="/admin/login"
              className="text-[var(--foreground-faint)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:underline"
              aria-label="Accès administration"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
