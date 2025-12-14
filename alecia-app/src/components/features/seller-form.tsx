"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, Building2, User, FileText, Send } from "lucide-react";
import { SECTORS, REGIONS } from "@/lib/db/schema";

interface FormData {
  // Step 1 - Company Info
  companyName: string;
  sector: string;
  region: string;
  revenue: string;
  ebitda: string;
  employees: string;
  
  // Step 2 - Project Info
  motivations: string[];
  timeline: string;
  hasAdvisor: string;
  
  // Step 3 - Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  message: string;
}

const INITIAL_DATA: FormData = {
  companyName: "",
  sector: "",
  region: "",
  revenue: "",
  ebitda: "",
  employees: "",
  motivations: [],
  timeline: "",
  hasAdvisor: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  message: "",
};

const MOTIVATIONS = [
  { value: "retirement", label: "Départ à la retraite" },
  { value: "new-project", label: "Nouveau projet professionnel" },
  { value: "capital", label: "Réalisation patrimoniale" },
  { value: "growth", label: "Croissance externe avec partenaire" },
  { value: "health", label: "Raisons personnelles / santé" },
  { value: "other", label: "Autre" },
];

const TIMELINES = [
  { value: "6months", label: "Moins de 6 mois" },
  { value: "1year", label: "6 à 12 mois" },
  { value: "2years", label: "1 à 2 ans" },
  { value: "exploring", label: "Simple exploration" },
];

export function SellerForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMotivation = (value: string) => {
    setData((prev) => ({
      ...prev,
      motivations: prev.motivations.includes(value)
        ? prev.motivations.filter((m) => m !== value)
        : [...prev.motivations, value],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.companyName && data.sector && data.region;
      case 2:
        return data.motivations.length > 0 && data.timeline;
      case 3:
        return data.firstName && data.lastName && data.email;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In real implementation, this would POST to API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold mb-2 text-[var(--foreground)]">
            Merci pour votre demande
          </h3>
          <p className="text-[var(--foreground-muted)]">
            Un associé vous contactera sous 48h pour un premier échange confidentiel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-[var(--foreground)]">Vous souhaitez céder votre entreprise</CardTitle>
          <span className="text-sm text-[var(--foreground-muted)]">Étape {step}/{totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {/* Step 1 - Company Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Votre entreprise</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">Informations générales</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l&apos;entreprise *</Label>
                  <Input
                    id="companyName"
                    value={data.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Ma Société SAS"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Secteur d&apos;activité *</Label>
                    <Select value={data.sector} onValueChange={(v) => updateField("sector", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((sector) => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Région *</Label>
                    <Select value={data.region} onValueChange={(v) => updateField("region", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        {REGIONS.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="revenue">CA annuel (M€)</Label>
                    <Input
                      id="revenue"
                      value={data.revenue}
                      onChange={(e) => updateField("revenue", e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ebitda">EBITDA (M€)</Label>
                    <Input
                      id="ebitda"
                      value={data.ebitda}
                      onChange={(e) => updateField("ebitda", e.target.value)}
                      placeholder="0.8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Effectif</Label>
                    <Input
                      id="employees"
                      value={data.employees}
                      onChange={(e) => updateField("employees", e.target.value)}
                      placeholder="25"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 - Project Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Votre projet</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">Motivations et calendrier</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Motivations de la cession * (plusieurs choix possibles)</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {MOTIVATIONS.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => toggleMotivation(m.value)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          data.motivations.includes(m.value)
                            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--foreground-muted)]"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Horizon souhaité *</Label>
                  <Select value={data.timeline} onValueChange={(v) => updateField("timeline", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Êtes-vous déjà accompagné ?</Label>
                  <Select value={data.hasAdvisor} onValueChange={(v) => updateField("hasAdvisor", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Non, pas encore</SelectItem>
                      <SelectItem value="yes-lawyer">Oui, par un avocat</SelectItem>
                      <SelectItem value="yes-accountant">Oui, par un expert-comptable</SelectItem>
                      <SelectItem value="yes-bank">Oui, par une banque d&apos;affaires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Contact Info */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Vos coordonnées</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">Pour vous recontacter en toute confidentialité</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Votre fonction</Label>
                  <Input
                    id="role"
                    value={data.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder="Dirigeant, Actionnaire..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message complémentaire</Label>
                  <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="N'hésitez pas à préciser votre situation..."
                    rows={3}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--border)]">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
            className="border-[var(--border)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="btn-gold"
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="btn-gold"
            >
              {submitting ? (
                "Envoi en cours..."
              ) : (
                <>
                  Envoyer ma demande
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
