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
    { label: "Île-de-France", phone: "+33 1 XX XX XX XX" },
    { label: "Sud Est", phone: "+33 4 XX XX XX XX" },
    { label: "Auvergne Rhône-Alpes", phone: "+33 4 XX XX XX XX" },
    { label: "Grand Ouest", phone: "+33 2 XX XX XX XX" },
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
              <span className="text-2xl font-bold text-[var(--foreground)]">
                alecia
              </span>
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] mb-4 max-w-xs">
              Conseil en fusion-acquisition pour PME et ETI. 
              Valorisation €5M-€50M.
            </p>
            {/* Compliance Badges */}
            <div className="flex items-center gap-4 text-xs text-[var(--foreground-faint)]" role="list" aria-label="Certifications">
              <span className="px-2 py-1 border border-[var(--border)] rounded" role="listitem" title="Autorité des marchés financiers">
                AMF
              </span>
              <span className="px-2 py-1 border border-[var(--border)] rounded" role="listitem" title="Organisme pour le registre des intermédiaires en assurance">
                ORIAS
              </span>
            </div>
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

          {/* Offices Column */}
          <div aria-labelledby="footer-offices-heading">
            <h4 id="footer-offices-heading" className="text-sm font-semibold text-[var(--foreground)] mb-4">
              Bureaux
            </h4>
            <ul className="space-y-3">
              {footerLinks.offices.map((office) => (
                <li key={office.label} className="text-sm">
                  <span className="text-[var(--foreground)] font-medium">{office.label}</span>
                  <br />
                  <a 
                    href={`tel:${office.phone.replace(/\s/g, '')}`}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none focus-visible:underline"
                    aria-label={`Appeler le bureau ${office.label}: ${office.phone}`}
                  >
                    {office.phone}
                  </a>
                </li>
              ))}
            </ul>
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
