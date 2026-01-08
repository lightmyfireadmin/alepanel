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
import { useTranslations } from "next-intl";

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

export function BuyerForm() {
  const t = useTranslations("buyerForm");
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
            {t("successTitle")}
          </h3>
          <p className="text-[var(--foreground-muted)]">
            {t("successMessage")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const BUYER_TYPES = [
    { value: "strategic", label: t("buyerTypeStrategic"), desc: t("buyerTypeStrategicDesc") },
    { value: "pe", label: t("buyerTypePE"), desc: t("buyerTypePEDesc") },
    { value: "family-office", label: t("buyerTypeFamilyOffice"), desc: t("buyerTypeFamilyOfficeDesc") },
    { value: "individual", label: t("buyerTypeIndividual"), desc: t("buyerTypeIndividualDesc") },
    { value: "mbi", label: t("buyerTypeMBI"), desc: t("buyerTypeMBIDesc") },
  ];

  const INVESTMENT_CAPACITIES = [
    { value: "1-5M", label: t("capacity1to5") },
    { value: "5-15M", label: t("capacity5to15") },
    { value: "15-30M", label: t("capacity15to30") },
    { value: "30M+", label: t("capacity30plus") },
  ];

  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-[var(--foreground)]">{t("title")}</CardTitle>
          <span className="text-sm text-[var(--foreground-muted)]">{t("step")} {step}/{totalSteps}</span>
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
                  <h4 className="font-semibold text-[var(--foreground)]">{t("buyerProfile")}</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">{t("buyerProfileDesc")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("buyerType")} *</Label>
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
                  <Label htmlFor="companyName">{t("companyName")}</Label>
                  <Input
                    id="companyName"
                    value={data.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder={t("companyPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("investmentCapacity")} *</Label>
                  <Select value={data.investmentCapacity} onValueChange={(v) => updateField("investmentCapacity", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("investmentCapacityPlaceholder")} />
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
                  <h4 className="font-semibold text-[var(--foreground)]">{t("criteria")}</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">{t("criteriaDesc")}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>{t("targetSectors")}</Label>
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
                  <Label>{t("targetRegions")}</Label>
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
                    <Label>{t("revenueRange", { min: data.revenueMin, max: data.revenueMax })}</Label>
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
                    <Label>{t("ebitdaMin", { min: data.ebitdaMin })}</Label>
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
                  <h4 className="font-semibold text-[var(--foreground)]">{t("contactInfo")}</h4>
                  <p className="text-sm text-[var(--foreground-muted)]">{t("contactInfoDesc")}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("firstName")} *</Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("lastName")} *</Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input
                      id="phone"
                      value={data.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">{t("role")}</Label>
                  <Input
                    id="role"
                    value={data.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder={t("rolePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder={t("messagePlaceholder")}
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
            {t("previous")}
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="btn-gold"
            >
              {t("next")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="btn-gold"
            >
              {submitting ? (
                t("submitting")
              ) : (
                <>
                  {t("submit")}
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
