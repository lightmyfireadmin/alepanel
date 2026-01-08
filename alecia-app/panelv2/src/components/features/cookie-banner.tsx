"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

const COOKIE_CONSENT_KEY = "alecia-cookie-consent";

export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid layout shift on load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Icon and Text */}
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <p className="text-[var(--foreground)] font-medium mb-1">
                    {t("title")}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    {t("description")}{" "}
                    <Link 
                      href="/politique-de-confidentialite" 
                      className="text-[var(--accent)] hover:underline"
                    >
                      {t("privacyPolicy")}
                    </Link>.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDecline}
                  className="border-[var(--border)] text-[var(--foreground-muted)]"
                >
                  {t("decline")}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccept}
                  className="btn-gold"
                >
                  {t("accept")}
                </Button>
              </div>

              {/* Close button (mobile) */}
              <button
                onClick={handleDecline}
                className="absolute top-2 right-2 md:hidden p-2 text-[var(--foreground-muted)]"
                aria-label={t("closeLabel")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
