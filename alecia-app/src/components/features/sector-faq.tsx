"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function SectorFaq() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: t("sectorMultiples"),
      answer: t("sectorMultiplesAnswer")
    },
    {
      question: t("transactionDuration"),
      answer: t("transactionDurationAnswer")
    },
    {
      question: t("acquisitionSupport"),
      answer: t("acquisitionSupportAnswer")
    }
  ];

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <div 
          key={index} 
          className="group bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="flex items-center justify-between w-full p-4 text-left cursor-pointer"
          >
            <span className="font-medium text-[var(--foreground)] pr-4">
              {item.question}
            </span>
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-[var(--foreground-muted)] transition-transform duration-300 flex-shrink-0",
                openIndex === index ? "rotate-180" : ""
              )} 
            />
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-4 pb-4 text-[var(--foreground-muted)]">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
