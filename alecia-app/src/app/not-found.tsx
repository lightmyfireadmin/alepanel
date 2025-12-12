"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("notFound");

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-8xl font-bold text-gradient-gold mb-4">404</h1>
        
        {/* Message */}
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--foreground)] mb-4">
          {t("title")}
        </h2>
        <p className="text-[var(--foreground-muted)] mb-8">
          {t("description")}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="border-[var(--border)]" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backButton")}
          </Button>
          <Button asChild className="btn-gold">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
