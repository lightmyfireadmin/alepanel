"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Phone, Mail, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("contactWidget");

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3"
          >
            {/* AI Assistant Option */}
            <Button
              variant="outline"
              size="lg"
              className="bg-[var(--card)] border-[var(--border)] shadow-lg gap-3 justify-start pr-6 hover:border-[var(--accent)]"
              onClick={() => {
                  // Placeholder for AI Chat
                  alert("AI Assistant Coming Soon!");
              }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-full text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-medium">{t("chatAI")}</span>
            </Button>

            {/* Phone Option */}
            <Button
              variant="outline"
              size="lg"
              className="bg-[var(--card)] border-[var(--border)] shadow-lg gap-3 justify-start pr-6 hover:border-[var(--accent)]"
              asChild
            >
              <a href="tel:+33123456789">
                <div className="bg-green-500 p-2 rounded-full text-white">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium">{t("callUs")}</span>
              </a>
            </Button>

            {/* Email Option */}
            <Button
              variant="outline"
              size="lg"
              className="bg-[var(--card)] border-[var(--border)] shadow-lg gap-3 justify-start pr-6 hover:border-[var(--accent)]"
              asChild
            >
              <Link href="/contact">
                <div className="bg-[var(--accent)] p-2 rounded-full text-white">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium">{t("emailUs")}</span>
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleOpen}
        size="lg"
        className="h-14 w-14 rounded-full btn-gold shadow-xl flex items-center justify-center relative"
        aria-label={isOpen ? t("close") : t("openContact")}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-[var(--background)]" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageSquare className="w-6 h-6 text-[var(--background)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse effect when closed */}
        {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[var(--accent)] opacity-20 animate-ping pointer-events-none" />
        )}
      </Button>
    </div>
  );
}
