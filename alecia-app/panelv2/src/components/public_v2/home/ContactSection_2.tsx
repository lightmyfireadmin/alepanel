"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * ContactSection_2 - Section Contact pour le Landing Page
 * 
 * Selon cahier des charges :
 * - Adresses des bureaux
 * - Formulaire de contact par email
 * - Suppression de la FAQ (pas de FAQ ici)
 */

const offices = [
  {
    city: "Paris",
    region: "Île-de-France",
    address: "75008 Paris",
  },
  {
    city: "Aix-en-Provence",
    region: "Provence-Alpes-Côte d'Azur",
    address: "13100 Aix-en-Provence",
  },
  {
    city: "Nice",
    region: "Côte d'Azur",
    address: "06000 Nice",
  },
  {
    city: "Lyon",
    region: "Auvergne-Rhône-Alpes",
    address: "69002 Lyon",
  },
];

export function ContactSection_2() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
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
    setFormState({ name: "", email: "", company: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-24 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm uppercase tracking-[0.2em] text-[var(--accent)] font-medium">
              Contact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mt-4 mb-6">
              Échangeons sur votre projet
            </h2>
            <p className="text-lg text-[var(--foreground-muted)] mb-8 leading-relaxed">
              Que vous envisagiez une cession, une acquisition ou une levée de fonds, 
              nous sommes à votre écoute pour étudier votre projet en toute confidentialité.
            </p>

            {/* Email */}
            <a
              href="mailto:contact@alecia.fr"
              className="inline-flex items-center gap-3 text-lg font-medium text-[var(--foreground)] hover:text-[var(--accent)] transition-colors mb-8"
            >
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--accent)]" />
              </div>
              contact@alecia.fr
            </a>

            {/* Offices */}
            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-widest text-[var(--foreground-muted)] mb-4">
                Nos bureaux
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {offices.map((office) => (
                  <div
                    key={office.city}
                    className="flex items-start gap-3 p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]"
                  >
                    <MapPin className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-[var(--foreground)] block">
                        {office.city}
                      </span>
                      <span className="text-sm text-[var(--foreground-muted)]">
                        {office.region}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-lg">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-[var(--foreground-muted)]">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
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
                        Envoyer le message
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
