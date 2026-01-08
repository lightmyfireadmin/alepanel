"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, FileText, Users, Briefcase } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface SearchResult {
  type: "page" | "operation" | "team";
  title: string;
  href: string;
  description?: string;
}

export function CommandPalette() {
  const t = useTranslations("commandPalette");
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Static pages for search
  const staticPages: SearchResult[] = [
    { type: "page", title: t("pages.home"), href: "/", description: t("pages.homeDesc") },
    { type: "page", title: t("pages.expertises"), href: "/expertises", description: t("pages.expertisesDesc") },
    { type: "page", title: t("pages.operations"), href: "/operations", description: t("pages.operationsDesc") },
    { type: "page", title: t("pages.team"), href: "/equipe", description: t("pages.teamDesc") },
    { type: "page", title: t("pages.news"), href: "/actualites", description: t("pages.newsDesc") },
    { type: "page", title: t("pages.contact"), href: "/contact", description: t("pages.contactDesc") },
    { type: "page", title: t("pages.careers"), href: "/nous-rejoindre", description: t("pages.careersDesc") },
  ];

  // Filter results based on query
  const results = query.length > 0
    ? staticPages.filter((page) =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description?.toLowerCase().includes(query.toLowerCase())
      )
    : staticPages;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "operation": return Briefcase;
      case "team": return Users;
      default: return FileText;
    }
  };

  return (
    <>
      {/* Trigger Button (optional, for navbar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--foreground-muted)] bg-[var(--background-tertiary)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)] transition-colors"
        aria-label={t("openSearchLabel")}
      >
        <Search className="w-4 h-4" />
        <span>{t("searchPlaceholder")}</span>
        <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-[var(--background)] border border-[var(--border)] rounded">
          ⌘K
        </kbd>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
            >
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                  <Search className="w-5 h-5 text-[var(--foreground-muted)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="flex-1 bg-transparent text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] outline-none"
                  />
                  <button
                    onClick={close}
                    className="p-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                    aria-label={t("closeLabel")}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {results.length === 0 ? (
                    <p className="px-4 py-8 text-center text-[var(--foreground-muted)]">
                      {t("noResults", { query })}
                    </p>
                  ) : (
                    <ul>
                      {results.map((result) => {
                        const Icon = getIcon(result.type);
                        return (
                          <li key={result.href}>
                            <Link
                              href={result.href}
                              onClick={close}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--background-tertiary)] transition-colors"
                            >
                              <Icon className="w-5 h-5 text-[var(--accent)]" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[var(--foreground)] font-medium truncate">
                                  {result.title}
                                </p>
                                {result.description && (
                                  <p className="text-sm text-[var(--foreground-muted)] truncate">
                                    {result.description}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-[var(--foreground-muted)]" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-4 px-4 py-2 border-t border-[var(--border)] text-xs text-[var(--foreground-muted)]">
                  <span><kbd className="px-1 bg-[var(--background)] rounded">↑↓</kbd> {t("navigate")}</span>
                  <span><kbd className="px-1 bg-[var(--background)] rounded">↵</kbd> {t("open")}</span>
                  <span><kbd className="px-1 bg-[var(--background)] rounded">esc</kbd> {t("close")}</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
