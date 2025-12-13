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
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, ArrowRight, Check, Target, Building2, User, Send } from "lucide-react";
import { SECTORS, REGIONS } from "@/lib/db/schema";

interface BuyerFormData {
  // Step 1 - Buyer Profile
  buyerType: string;
  companyName: string;
  investmentCapacity: string;
  
  // Step 2 - Criteria
  targetSectors: string[];
  targetRegions: string[];
  revenueMin: number;
  revenueMax: number;
  ebitdaMin: number;
  
  // Step 3 - Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  message: string;
}

const INITIAL_DATA: BuyerFormData = {
  buyerType: "",
  companyName: "",
  investmentCapacity: "",
  targetSectors: [],
  targetRegions: [],
  revenueMin: 2,
  revenueMax: 20,
  ebitdaMin: 0.5,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  message: "",
};

const BUYER_TYPES = [
  { value: "strategic", label: "Industriel / stratégique", desc: "Acquisition pour croissance externe" },
  { value: "pe", label: "Fonds d'investissement", desc: "Private Equity, LBO, Growth" },
  { value: "family-office", label: "Family Office", desc: "Investissement patrimonial" },
  { value: "individual", label: "Repreneur individuel", desc: "Entrepreneur / Manager" },
  { value: "mbi", label: "Management Buy-In", desc: "Cadre dirigeant en recherche" },
];

const INVESTMENT_CAPACITIES = [
  { value: "1-5M", label: "1 à 5 M€" },
  { value: "5-15M", label: "5 à 15 M€" },
  { value: "15-30M", label: "15 à 30 M€" },
  { value: "30M+", label: "Plus de 30 M€" },
];

export function BuyerForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BuyerFormData>(INITIAL_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const updateField = <K extends keyof BuyerFormData>(field: K, value: BuyerFormData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: "targetSectors" | "targetRegions", value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.buyerType && data.investmentCapacity;
      case 2:
        return data.targetSectors.length > 0;
      case 3:
        return data.firstName && data.lastName && data.email;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
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
            Inscription confirmée
          </h3>
          <p className="text-[var(--foreground-muted)]">
            Vous recevrez nos opportunités correspondant à vos critères dès leur mise en marché.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-[var(--foreground)]">Vous recherchez des opportunités d&apos;investissement</CardTitle>
          <span className="text-sm text-[var(--foreground-muted)]">Étape {step}/{totalSteps}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {/* Step 1 - Buyer Profile */}
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
                  <h4 className="font-semibold text-[var(--foreground)]">Votre profil acquéreur</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">Type d&apos;investisseur et capacité</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Type d&apos;acquéreur *</Label>
                  <div className="grid gap-2">
                    {BUYER_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateField("buyerType", type.value)}
                        className={`p-4 rounded-lg border text-left transition-colors ${
                          data.buyerType === type.value
                            ? "border-[var(--accent)] bg-[var(--accent)]/10"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50"
                        }`}
                      >
                        <p className="font-medium text-[var(--foreground)]">{type.label}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">{type.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Société / Fonds (optionnel)</Label>
                  <Input
                    id="companyName"
                    value={data.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Nom de votre structure"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Capacité d&apos;investissement (valeur d&apos;entreprise) *</Label>
                  <Select value={data.investmentCapacity} onValueChange={(v) => updateField("investmentCapacity", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une fourchette" />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_CAPACITIES.map((cap) => (
                        <SelectItem key={cap.value} value={cap.value}>{cap.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2 - Criteria */}
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
                  <Target className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--foreground)]">Vos critères</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">Affinez votre recherche</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Secteurs ciblés * (plusieurs choix possibles)</Label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {SECTORS.slice(0, 10).map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => toggleArray("targetSectors", sector)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                          data.targetSectors.includes(sector)
                            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--foreground-muted)]"
                        }`}
                      >
                        {sector}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Régions ciblées (optionnel)</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {REGIONS.slice(0, 8).map((region) => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleArray("targetRegions", region)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                          data.targetRegions.includes(region)
                            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--foreground-muted)]"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chiffre d&apos;affaires cible: {data.revenueMin}M€ - {data.revenueMax}M€</Label>
                    <Slider
                      value={[data.revenueMin, data.revenueMax]}
                      onValueChange={(values: number[]) => {
                        updateField("revenueMin", values[0]);
                        updateField("revenueMax", values[1]);
                      }}
                      min={1}
                      max={50}
                      step={1}
                      className="py-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>EBITDA minimum: {data.ebitdaMin}M€</Label>
                    <Slider
                      value={[data.ebitdaMin]}
                      onValueChange={(values: number[]) => updateField("ebitdaMin", values[0])}
                      min={0}
                      max={10}
                      step={0.5}
                      className="py-4"
                    />
                  </div>
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
                  <p className="text-sm text-[var(--foreground-muted)]">Pour recevoir les opportunités</p>
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
                    placeholder="Directeur d'investissement, CEO..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message complémentaire</Label>
                  <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Précisez vos critères ou contraintes particuliers..."
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
                  S&apos;inscrire
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
