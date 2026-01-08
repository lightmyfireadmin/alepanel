import { Navbar, Footer } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site alecia.fr - Conseil en fusion-acquisition pour PME et ETI.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <article className="py-16 px-6">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--foreground)] mb-8">
              Mentions légales
            </h1>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                1. Éditeur du site
              </h2>
              <ul className="text-[var(--foreground-muted)] space-y-2 list-none pl-0">
                <li><strong className="text-[var(--foreground)]">Nom du site :</strong> alecia</li>
                <li><strong className="text-[var(--foreground)]">URL :</strong> www.alecia.fr</li>
                <li><strong className="text-[var(--foreground)]">Éditeur :</strong> alecia, SAS au capital de 1 000 €, enregistrée au RCS de Nice sous le n°980 823 231, ayant son siège social chez Pactams Paradigm, 38B Bd Victor Hugo, 06000 Nice</li>
                <li><strong className="text-[var(--foreground)]">Adresse e-mail :</strong> contact@alecia.fr</li>
                <li><strong className="text-[var(--foreground)]">Directeur de la publication :</strong> Christophe Berthon</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                2. Hébergement du site
              </h2>
              <ul className="text-[var(--foreground-muted)] space-y-2 list-none pl-0">
                <li><strong className="text-[var(--foreground)]">Hébergeur :</strong> Vercel Inc.</li>
                <li><strong className="text-[var(--foreground)]">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong className="text-[var(--foreground)]">Site web :</strong> https://vercel.com</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                3. Propriété intellectuelle
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Le contenu (textes, images, logos, graphismes, etc.) présent sur le site alecia.fr est protégé par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification ou adaptation de tout ou partie des éléments du site est strictement interdite, sauf autorisation préalable écrite du titulaire des droits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                4. Données personnelles
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Conformément aux dispositions du Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité des données vous concernant. Pour exercer ces droits, contactez Christophe Berthon par e-mail à reclamations@alecia.fr.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                5. Cookies
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Le site alecia.fr utilise des cookies pour améliorer l&apos;expérience de navigation et collecter des statistiques anonymes de fréquentation. Vous pouvez refuser ou modifier les paramètres de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                6. Droit applicable
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, et après l&apos;échec de toute tentative de recherche d&apos;une solution amiable, les tribunaux français seront seuls compétents pour juger ce litige.
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
