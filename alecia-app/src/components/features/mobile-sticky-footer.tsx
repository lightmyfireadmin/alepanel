"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface MobileStickyFooterProps {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

export function MobileStickyFooter({
  phone = "+33 1 00 00 00 00",
  email = "contact@alecia.fr",
  whatsapp = "+33600000000",
}: MobileStickyFooterProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const t = useTranslations("mobileCta");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up or near top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide when scrolling down past 100px
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCall = () => {
    window.location.href = `tel:${phone.replace(/\s/g, "")}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsapp.replace(/\+/g, "")}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="glass border-t border-[var(--border)] px-4 py-3">
            <div className="flex items-center justify-around gap-2">
              {/* Call Button */}
              <button
                onClick={handleCall}
                className="flex flex-col items-center gap-1 flex-1 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                aria-label={t("call")}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-medium">{t("call")}</span>
              </button>

              {/* Email Button */}
              <button
                onClick={handleEmail}
                className="flex flex-col items-center gap-1 flex-1 py-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                aria-label={t("email")}
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-medium">{t("email")}</span>
              </button>

              {/* WhatsApp Button */}
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-1 flex-1 py-2 text-[var(--foreground)] hover:text-[#25D366] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
