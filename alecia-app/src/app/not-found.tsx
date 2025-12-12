import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <h1 className="text-8xl font-bold text-gradient-gold mb-4">404</h1>
        
        {/* Message */}
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[var(--foreground)] mb-4">
          Page introuvable
        </h2>
        <p className="text-[var(--foreground-muted)] mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-[var(--border)]">
            <Link href="javascript:history.back()">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
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
