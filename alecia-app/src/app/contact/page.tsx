import { Navbar, Footer } from "@/components/layout";
import { ContactForm } from "@/components/features";
import Image from "next/image";
import type { Metadata } from "next";
import { MapPin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact | Nous contacter",
  description:
    "Contactez alecia pour toute information sur nos services en fusion-acquisition. Bureaux en Île-de-France, Sud Est, Auvergne Rhône-Alpes et Grand Ouest.",
};

const offices = [
  {
    id: "idf",
    nameKey: "officesIdf" as const,
    city: "Paris",
    image: "/assets/Contact_Alecia/paris_compressed.jpg",
  },
  {
    id: "sudEst1",
    nameKey: "officesSudEst" as const,
    city: "Aix-en-Provence",
    image: "/assets/Contact_Alecia/nice_compressed.jpg",
  },
  {
    id: "sudEst2",
    nameKey: "officesSudEst" as const,
    city: "Nice",
    image: "/assets/Contact_Alecia/nice_compressed.jpg",
  },
  {
    id: "aura",
    nameKey: "officesAura" as const,
    city: "Annecy",
    image: "/assets/Contact_Alecia/lyon_compressed.jpg",
  },
  {
    id: "grandOuest",
    nameKey: "officesGrandOuest" as const,
    city: "Lorient",
    image: "/assets/Contact_Alecia/grand_ouest_compressed.jpg",
  },
];

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              {t("title")}
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ContactForm />

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                    {t("offices")}
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[var(--accent)]" />
                      <a
                        href="mailto:contact@alecia.fr"
                        className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      >
                        contact@alecia.fr
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-4 text-[var(--foreground)]">
                    {t("offices")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {offices.map((office) => (
                      <div
                        key={office.id}
                        className="p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]"
                      >
                        <h3 className="text-[var(--foreground)] font-semibold mb-1">
                          {t(office.nameKey)}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                          <MapPin className="w-4 h-4" />
                          {office.city}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Images */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {offices.map((office) => (
                <div
                  key={office.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                >
                  <Image
                    src={office.image}
                    alt={`Bureau alecia ${office.city}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{t(office.nameKey)}</p>
                    <p className="text-white/70 text-sm">{office.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
