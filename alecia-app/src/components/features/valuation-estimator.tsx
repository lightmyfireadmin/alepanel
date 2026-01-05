"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calculator, ArrowRight, CheckCircle2, Loader2, TrendingUp } from "lucide-react";
import { SECTORS } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Step = "form" | "calculating" | "result" | "capture";

interface ValuationResult {
  low: number;
  mid: number;
  high: number;
  multiple: number;
}

// Simplified valuation multiples by sector (EBITDA-based)
const sectorMultiples: Record<string, { low: number; mid: number; high: number }> = {
  "Technologies & logiciels": { low: 6, mid: 8, high: 12 },
  "Distribution & services B2B": { low: 4, mid: 5.5, high: 7 },
  "Distribution & services B2C": { low: 3.5, mid: 5, high: 6.5 },
  "Santé": { low: 5, mid: 7, high: 10 },
  "Immobilier & construction": { low: 4, mid: 5.5, high: 7 },
  "Industries": { low: 4, mid: 5, high: 6 },
  "Services financiers & assurance": { low: 5, mid: 7, high: 9 },
  "Agroalimentaire": { low: 4, mid: 5.5, high: 7 },
  "Énergie & environnement": { low: 5, mid: 6.5, high: 8 },
};

export function ValuationEstimator() {
  const t = useTranslations("valuation");
  const tForm = useTranslations("valuationForm");
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    revenue: "",
    ebitda: "",
    sector: "",
    email: "",
    company: "",
  });
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const calculateValuation = () => {
    const ebitda = parseFloat(formData.ebitda) * 1000; // Convert K€ to actual value
    const multiples = sectorMultiples[formData.sector] || { low: 4, mid: 5, high: 6 };

    return {
      low: ebitda * multiples.low,
      mid: ebitda * multiples.mid,
      high: ebitda * multiples.high,
      multiple: multiples.mid,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("calculating");

    // Simulate calculation delay for effect
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const valuation = calculateValuation();
    setResult(valuation);
    setStep("result");
  };

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/valuation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, result }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || tForm("error"));
      }

      console.log("Lead captured:", { ...formData, result });
      setStep("capture");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : tForm("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setStep("form");
    setFormData({ revenue: "", ebitda: "", sector: "", email: "", company: "" });
    setResult(null);
    setErrorMessage("");
  };

  return (
    <Card className="bg-[var(--card)] border-[var(--border)] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[var(--accent)]/10 to-transparent p-0">
        <div className="flex items-center gap-3 p-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <div>
            <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
              {tForm("title")}
            </CardTitle>
            <CardDescription className="text-[var(--foreground-muted)]">
              {tForm("subtitle")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ amount: 0.5, once: true }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--foreground)]">
                    {t("labelTurnover")} (k€)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.revenue}
                    onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    placeholder="Ex: 2000"
                    required
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--foreground)]">
                    {t("labelEbitda")} (k€)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.ebitda}
                    onChange={(e) => setFormData({ ...formData, ebitda: e.target.value })}
                    placeholder="Ex: 500"
                    required
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--foreground)]">{tForm("sectorLabel")}</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => setFormData({ ...formData, sector: value })}
                  required
                >
                  <SelectTrigger className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder={tForm("sectorPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="btn-gold w-full rounded-lg"
                disabled={!formData.revenue || !formData.ebitda || !formData.sector}
              >
                {tForm("calculateButton")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <p className="text-xs text-[var(--foreground-muted)] text-center">
                {tForm("disclaimer")}
              </p>
              
              <p className="text-xs text-[var(--foreground-muted)] text-center italic border-t border-[var(--border)] pt-3">
                Cette estimation est fournie à titre indicatif uniquement et n'a aucune valeur légale. 
                Elle ne constitue pas un avis professionnel et ne saurait engager la responsabilité d'alecia.
              </p>
            </motion.form>
          )}

          {step === "calculating" && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin mb-4" />
              <p className="text-[var(--foreground)]">{tForm("calculating")}</p>
              <p className="text-sm text-[var(--foreground-muted)]">
                {tForm("analyzingMultiples")}
              </p>
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center py-4">
                <p className="text-sm text-[var(--foreground-muted)] mb-2">
                  {tForm("estimatedValuation")}
                </p>
                <p className="text-4xl font-bold text-gradient-gold">
                  {formatCurrency(result.mid)}
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-2">
                  {tForm("range", { low: formatCurrency(result.low), high: formatCurrency(result.high) })}
                </p>
              </div>

              <div className="bg-[var(--background-tertiary)] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {tForm("multipleApplied", { multiple: result.multiple })}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {tForm("basedOn", { sector: formData.sector })}
                </p>
              </div>

              <form onSubmit={handleCapture} className="space-y-4 pt-4 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--foreground)] font-medium">
                  {tForm("receiveAnalysis")}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={tForm("emailPlaceholder")}
                    required
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                  />
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={tForm("companyPlaceholder")}
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>

                {errorMessage && (
                  <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                )}

                <Button type="submit" className="btn-gold w-full rounded-lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {tForm("submitting")}
                    </>
                  ) : (
                    tForm("submitAnalysis")
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {step === "capture" && (
            <motion.div
              key="capture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                {tForm("successTitle")}
              </h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                {tForm("successMessage")}
              </p>
              <Button variant="outline" onClick={reset} className="border-[var(--border)]">
                {tForm("newCalculation")}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
