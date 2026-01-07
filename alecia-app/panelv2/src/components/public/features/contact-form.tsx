"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });

  const t = useTranslations("contact.form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      // const response = await fetch("/api/contact", ...);

      setFormState("success");
      setFormData({ firstName: "", lastName: "", email: "", company: "", message: "" });
    } catch (error) {
      setFormState("error");
      setErrorMessage(t("error"));
    }
  };

  if (formState === "success") {
    return (
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
            {t("success")}
          </h3>
          <p className="text-[var(--foreground-muted)] mb-6">
            {t("successMessage")}
          </p>
          <Button 
            variant="outline" 
            onClick={() => setFormState("idle")}
            className="border-[var(--border)]"
          >
            {t("submit")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader>
        <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
          {t("title") || "Envoyez-nous un message"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[var(--foreground)]">
                {t("firstName")} *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Jean"
                required
                disabled={formState === "submitting"}
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[var(--foreground)]">
                {t("lastName")} *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Dupont"
                required
                disabled={formState === "submitting"}
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[var(--foreground)]">
              {t("email")} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jean.dupont@entreprise.fr"
              required
              disabled={formState === "submitting"}
              className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company" className="text-[var(--foreground)]">
              {t("company")}
            </Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder={t("companyPlaceholder")}
              disabled={formState === "submitting"}
              className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-[var(--foreground)]">
              {t("message")} *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Décrivez votre projet..."
              rows={5}
              required
              disabled={formState === "submitting"}
              className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] resize-none"
            />
          </div>

          {formState === "error" && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}

          <Button 
            type="submit" 
            className="btn-gold w-full rounded-lg"
            disabled={formState === "submitting"}
          >
            {formState === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              t("submit")
            )}
          </Button>
          <p className="text-xs text-[var(--foreground-muted)] text-center">
            En soumettant ce formulaire, vous acceptez notre{" "}
            <a href="/politique-de-confidentialite" className="underline">
              politique de confidentialité
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
