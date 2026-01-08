
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site alecia.fr - Protection de vos données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <article className="py-16 px-6">
          <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold text-[var(--foreground)] mb-8">
              Politique de confidentialité
            </h1>

            <p className="text-[var(--foreground-muted)] italic">
              Dernière mise à jour : Décembre 2024
            </p>

            <section className="mb-8 mt-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                1. Collecte des données
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Nous collectons les informations que vous nous fournissez directement, notamment via notre formulaire de contact : nom, prénom, adresse e-mail, nom de l&apos;entreprise, et message. Ces informations sont nécessaires pour répondre à vos demandes et vous fournir nos services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                2. Utilisation des données
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Les données collectées sont utilisées pour :
              </p>
              <ul className="text-[var(--foreground-muted)] space-y-2">
                <li>Répondre à vos demandes de contact</li>
                <li>Vous fournir des informations sur nos services</li>
                <li>Améliorer notre site et nos services</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                3. Conservation des données
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Vos données personnelles sont conservées pendant la durée nécessaire à l&apos;accomplissement des finalités mentionnées ci-dessus, et conformément aux obligations légales applicables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                4. Vos droits
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="text-[var(--foreground-muted)] space-y-2">
                <li>Droit d&apos;accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l&apos;effacement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d&apos;opposition</li>
              </ul>
              <p className="text-[var(--foreground-muted)] mt-4">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:reclamations@alecia.fr" className="text-[var(--accent)] hover:underline">reclamations@alecia.fr</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                5. Cookies
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Notre site utilise des cookies techniques nécessaires au fonctionnement du site, ainsi que des cookies analytiques pour comprendre comment nos visiteurs utilisent le site. Vous pouvez à tout moment refuser les cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
                6. Contact
              </h2>
              <p className="text-[var(--foreground-muted)]">
                Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à :
              </p>
              <ul className="text-[var(--foreground-muted)] space-y-2 list-none pl-0">
                <li><strong className="text-[var(--foreground)]">Email :</strong> reclamations@alecia.fr</li>
                <li><strong className="text-[var(--foreground)]">Adresse :</strong> alecia, 38B Bd Victor Hugo, 06000 Nice</li>
              </ul>
            </section>
          </div>
        </article>
      </main>

      
    </>
  );
}
