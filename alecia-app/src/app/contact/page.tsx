import { Navbar, Footer } from "@/components/layout";
import { ContactForm } from "@/components/features";
import Image from "next/image";
import type { Metadata } from "next";
import { MapPin, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | Nous contacter",
  description:
    "Contactez alecia pour toute information sur nos services en fusion-acquisition. Bureaux en Île-de-France, Sud Est, Auvergne Rhône-Alpes et Grand Ouest.",
};

const offices = [
  {
    name: "Île-de-France",
    city: "Paris",
    image: "https://cdn.prod.website-files.com/65cc8a57baba85b21d14d806/6671f1a584be578e430426a2_Paris%20-%20compressed.jpg",
  },
  {
    name: "Sud Est",
    city: "Nice",
    image: "https://cdn.prod.website-files.com/65cc8a57baba85b21d14d806/6671f1a6435ea537433f7da0_Nice%20-%20compressed.jpg",
  },
  {
    name: "Auvergne Rhône-Alpes",
    city: "Lyon",
    image: "https://cdn.prod.website-files.com/65cc8a57baba85b21d14d806/6671f067bb37caba791399b4_lyon%20-%20compressed.jpg",
  },
  {
    name: "Grand Ouest",
    city: "Nantes",
    image: "https://cdn.prod.website-files.com/65cc8a57baba85b21d14d806/6671f1a7bc2a5f426546faa2_Grand%20Ouest%20-%20compressed.jpg",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Contactez-nous
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Vous êtes dirigeant, actionnaire ou investisseur ?
              <br />
              Contactez-nous pour toute information sur nos services.
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
                    Informations
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
                    Nos bureaux
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {offices.map((office) => (
                      <div
                        key={office.name}
                        className="p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]"
                      >
                        <h3 className="text-[var(--foreground)] font-semibold mb-1">
                          {office.name}
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
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-8 text-center text-[var(--foreground)]">
              Découvrez notre ancrage multi-régional
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {offices.map((office) => (
                <div
                  key={office.name}
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
                    <p className="text-white font-semibold">{office.name}</p>
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
