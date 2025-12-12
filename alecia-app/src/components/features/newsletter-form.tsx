"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

interface NewsletterFormProps {
  variant?: "inline" | "card";
  className?: string;
}

export function NewsletterForm({ variant = "inline", className = "" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // TODO: Implement actual newsletter subscription API
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validate email format
      if (!email.includes("@") || !email.includes(".")) {
        throw new Error("Email invalide");
      }

      console.log("Newsletter subscription:", email);
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue");
    }
  };

  if (variant === "card") {
    return (
      <div className={`bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div>
            <h3 className="font-semibold text-[var(--foreground)]">Newsletter</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Recevez nos actualités
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-emerald-400"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Inscription confirmée !</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.fr"
                required
                disabled={status === "loading"}
                className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
              />
              {status === "error" && (
                <p className="text-sm text-red-400">{errorMessage}</p>
              )}
              <Button
                type="submit"
                disabled={status === "loading" || !email}
                className="btn-gold w-full rounded-lg"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Inscription...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Inline variant
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-emerald-400 py-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Inscription confirmée !</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              required
              disabled={status === "loading"}
              className="flex-1 bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
            />
            <Button
              type="submit"
              disabled={status === "loading" || !email}
              className="btn-gold rounded-lg whitespace-nowrap"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "S'inscrire"
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p className="text-sm text-red-400 mt-2">{errorMessage}</p>
      )}
    </div>
  );
}
