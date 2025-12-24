"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQClient() {
  const t = useTranslations("homeFaq");
  const [openId, setOpenId] = useState<string | null>(null);

  const faqItems = [
    {
      id: "services",
      question: t("services.question"),
      answer: t("services.answer"),
    },
    {
      id: "differentiation",
      question: t("differentiation.question"),
      answer: t("differentiation.answer"),
    },
    {
      id: "sectors",
      question: t("sectors.question"),
      answer: t("sectors.answer"),
    },
    {
      id: "fees",
      question: t("fees.question"),
      answer: t("fees.answer"),
    },
    {
      id: "meaning",
      question: t("meaning.question"),
      answer: t("meaning.answer"),
    },
  ];

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[var(--background)] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-semibold mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-[var(--border)] rounded-lg bg-[var(--card)] overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[var(--background-secondary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
                aria-expanded={openId === item.id}
              >
                <span className="text-lg font-semibold text-[var(--foreground)] pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--foreground-muted)] transition-transform flex-shrink-0 ${
                    openId === item.id ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>
              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-[var(--foreground-muted)] leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center p-8 bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-[var(--foreground-muted)] mb-6 max-w-xl mx-auto">
            {t("ctaSubtitle")}
          </p>
          <Button size="lg" className="btn-gold text-lg px-10 py-6 rounded-xl" asChild>
            <Link href="/contact">
              Prendre contact
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
