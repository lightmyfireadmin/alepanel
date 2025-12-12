"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ChevronDown, Globe } from "lucide-react";

const navigationItems = [
  { href: "/expertises", label: "Expertises", hasSubmenu: true },
  { href: "/operations", label: "Opérations" },
  { href: "/actualites", label: "Actualités" },
  { href: "/equipe", label: "Équipe" },
  { href: "/nous-rejoindre", label: "Nous rejoindre" },
];

const expertiseSubmenu = [
  { href: "/expertises#cession", label: "Cession & transmission" },
  { href: "/expertises#levee-de-fonds", label: "Levée de fonds" },
  { href: "/expertises#acquisition", label: "Acquisition" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showExpertises, setShowExpertises] = useState(false);
  const [locale, setLocale] = useState<"fr" | "en">("fr");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass" role="banner">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Navigation principale">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg" aria-label="alecia - Accueil">
            <span className="text-2xl font-bold text-[var(--foreground)] tracking-tight">
              alecia
            </span>
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

          {/* Right side: Language & CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={`Changer la langue vers ${locale === "fr" ? "anglais" : "français"}`}
            >
              <Globe className="w-4 h-4" aria-hidden="true" />
              {locale.toUpperCase()}
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
                        className="flex items-center justify-between px-4 py-3 text-lg text-[var(--foreground)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
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
                    onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
                    className="flex items-center gap-2 w-full px-4 py-2 text-[var(--foreground-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-lg"
                    aria-label={`Changer la langue vers ${locale === "fr" ? "anglais" : "français"}`}
                  >
                    <Globe className="w-5 h-5" aria-hidden="true" />
                    {locale === "fr" ? "English" : "Français"}
                  </button>
                  <Button asChild className="btn-gold w-full rounded-lg">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      Nous contacter
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
