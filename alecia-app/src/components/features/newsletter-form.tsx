"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

type FormState = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const t = useTranslations("newsletterForm");
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("error"));
      }

      setFormState("success");
      setEmail("");
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : t("error"));
    }
  };

  if (formState === "success") {
    return (
      <div className="flex items-center gap-3 text-emerald-400">
        <CheckCircle2 className="w-5 h-5" />
        <span>{t("success")}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("emailPlaceholder")}
          required
          disabled={formState === "submitting"}
          className="pl-10 bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
        />
      </div>
      <Button
        type="submit"
        disabled={formState === "submitting"}
        className="btn-gold whitespace-nowrap"
      >
        {formState === "submitting" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
      {formState === "error" && (
        <p className="text-sm text-red-400 mt-2">{errorMessage}</p>
      )}
    </form>
  );
}
