"use client";

import { useState } from "react";
import { Navbar_2, Footer_2 } from "@/components/public_v2/layout";
import { MapPin, Mail, Phone, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * Contact Page V2
 * 
 * Selon cahier des charges :
 * - Adresses des bureaux
 * - Formulaire de contact
 */

const offices = [
  {
    city: "Paris",
    region: "Île-de-France",
    address: "75008 Paris",
    phone: "+33 1 XX XX XX XX",
  },
  {
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    address: "69002 Lyon",
    phone: "+33 4 XX XX XX XX",
  },
  {
    city: "Aix-en-Provence",
    region: "Provence-Alpes-Côte d'Azur",
    address: "13100 Aix-en-Provence",
    phone: "+33 4 XX XX XX XX",
  },
  {
    city: "Nice",
    region: "Côte d'Azur",
    address: "06000 Nice",
    phone: "+33 4 XX XX XX XX",
  },
];

export default function ContactPage2() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: "", email: "", phone: "", company: "", subject: "", message: "" });

    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar_2 />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-4 mb-6">
              Parlons de votre projet
            </h1>
            <p className="text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto">
              Cession, acquisition ou levée de fonds : nous sommes à votre écoute 
              pour étudier votre projet en toute confidentialité.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left: Offices */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">
                Nos bureaux
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {offices.map((office) => (
                  <div
                    key={office.city}
                    className="p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[var(--accent)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[var(--accent)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {office.city}
                        </h3>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          {office.region}
                        </p>
                        <p className="text-sm text-[var(--foreground-muted)] mt-2">
                          {office.address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="p-6 bg-gradient-to-br from-[#061a40] to-[#19354e] rounded-xl text-white">
                <h3 className="font-semibold text-amber-400 mb-4">
                  Contact direct
                </h3>
                <a
                  href="mailto:contact@alecia.fr"
                  className="flex items-center gap-3 text-white hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  contact@alecia.fr
                </a>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
                  Envoyez-nous un message
                </h2>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                      Message envoyé !
                    </h3>
                    <p className="text-[var(--foreground-muted)]">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          placeholder="Jean Dupont"
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          required
                          className="bg-[var(--background)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jean@entreprise.fr"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({ ...formState, email: e.target.value })
                          }
                          required
                          className="bg-[var(--background)]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+33 6 XX XX XX XX"
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState({ ...formState, phone: e.target.value })
                          }
                          className="bg-[var(--background)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Société</Label>
                        <Input
                          id="company"
                          placeholder="Nom de votre entreprise"
                          value={formState.company}
                          onChange={(e) =>
                            setFormState({ ...formState, company: e.target.value })
                          }
                          className="bg-[var(--background)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Objet *</Label>
                      <Input
                        id="subject"
                        placeholder="Projet de cession / acquisition / levée de fonds"
                        value={formState.subject}
                        onChange={(e) =>
                          setFormState({ ...formState, subject: e.target.value })
                        }
                        required
                        className="bg-[var(--background)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Votre message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez brièvement votre projet..."
                        rows={5}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({ ...formState, message: e.target.value })
                        }
                        required
                        className="bg-[var(--background)] resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-gold py-6 text-base"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Envoi en cours...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Envoyer
                        </span>
                      )}
                    </Button>

                    <p className="text-xs text-center text-[var(--foreground-muted)]">
                      En soumettant ce formulaire, vous acceptez notre{" "}
                      <a href="/politique-de-confidentialite" className="underline hover:text-[var(--foreground)]">
                        politique de confidentialité
                      </a>
                      .
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer_2 />
    </>
  );
}
