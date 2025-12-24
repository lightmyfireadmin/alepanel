"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ChevronDown, Globe, Sun, Moon } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExpertises, setShowExpertises] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  const t = useTranslations("nav");
  const locale = useLocale();

  // Navigation items with translations
  const navigationItems = [
    { href: "/expertises", label: t("expertises"), hasSubmenu: true },
    { href: "/secteurs", label: t("secteurs") },
    { href: "/operations", label: t("operations") },
    { href: "/actualites", label: t("news") },
    { href: "/equipe", label: t("team") },
    { href: "/faq", label: t("faq") },
    { href: "/nous-rejoindre", label: t("careers") },
  ];

  const expertiseSubmenu = [
    { href: "/expertises#cession", label: t("cession") },
    { href: "/expertises#levee-de-fonds", label: t("fundraising") },
    { href: "/expertises#acquisition", label: t("acquisition") },
  ];

  // Prevent hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const switchLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    // Set cookie and reload to apply new locale
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg" aria-label="alecia - Accueil">
            {/* Light mode: blue logo, Dark mode: white logo */}
            <Image
              src="/assets/alecia_logo_blue.svg"
              alt="alecia"
              width={100}
              height={32}
              className="h-8 w-auto dark:hidden"
            />
            <Image
              src="/assets/alecia_logo.svg"
              alt="alecia"
              width={100}
              height={32}
              className="h-8 w-auto hidden dark:block"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1" role="menubar">
            {navigationItems.map((item) => (
              <div
                key={item.href}
                className="relative"
                role="none"
                onMouseEnter={() => item.hasSubmenu && setShowExpertises(true)}
                onMouseLeave={() => item.hasSubmenu && setShowExpertises(false)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                  role="menuitem"
                  aria-haspopup={item.hasSubmenu ? "true" : undefined}
                  aria-expanded={item.hasSubmenu ? showExpertises : undefined}
                >
                  {item.label}
                  {item.hasSubmenu && (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </Link>

                {/* Mega Menu for Expertises */}
                {item.hasSubmenu && (
                  <AnimatePresence>
                    {showExpertises && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden"
                        role="menu"
                        aria-label="Sous-menu Expertises"
                      >
                        {expertiseSubmenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)]"
                            role="menuitem"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>

          {/* Right side: Theme Toggle, Language & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={mounted && resolvedTheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            >
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {locale === "fr" ? "EN" : "FR"}
            </button>

            {/* CTA Button */}
            <Button asChild className="btn-gold rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button 
                className="p-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-6 h-6" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-[var(--background)] border-[var(--border)]"
            >
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
              <div className="flex flex-col h-full py-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-between mb-8 px-2">
                  <span className="text-2xl font-bold text-[var(--foreground)]">
                    alecia
                  </span>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 space-y-1" aria-label="Navigation mobile">
                  {navigationItems.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 text-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg ${
                          pathname === item.href || pathname.startsWith(item.href + "/")
                            ? "text-[var(--accent)] bg-[var(--accent)]/10"
                            : "text-[var(--foreground)] hover:text-[var(--accent)]"
                        }`}
                      >
                        {item.label}
                        {item.hasSubmenu && <ChevronDown className="w-5 h-5" aria-hidden="true" />}
                      </Link>
                      {item.hasSubmenu && (
                        <div className="pl-8 space-y-1">
                          {expertiseSubmenu.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Footer */}
                <div className="space-y-4 pt-6 border-t border-[var(--border)]">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 w-full px-4 py-2 text-[var(--foreground-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                    aria-label={mounted && resolvedTheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
                  >
                    {mounted && resolvedTheme === "dark" ? (
                      <Sun className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Moon className="w-5 h-5" aria-hidden="true" />
                    )}
                    {mounted && resolvedTheme === "dark" ? "Mode clair" : "Mode sombre"}
                  </button>
                  <button
                    onClick={switchLocale}
                    className="flex items-center gap-2 w-full px-4 py-2 text-[var(--foreground-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                    aria-label={locale === "fr" ? "Switch to English" : "Passer en français"}
                  >
                    <Globe className="w-5 h-5" aria-hidden="true" />
                    {locale === "fr" ? "English" : "Français"}
                  </button>
                  <Button asChild className="btn-gold w-full rounded-lg">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      {t("contact")}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
