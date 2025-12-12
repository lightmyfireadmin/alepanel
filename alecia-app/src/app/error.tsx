"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
          Oops, quelque chose s&apos;est mal passé
        </h2>
        
        <p className="text-[var(--foreground-muted)] mb-8">
          Nous avons rencontré une erreur inattendue. Veuillez réessayer ou retourner à la page d&apos;accueil.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="border-[var(--border)]"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
          <Button asChild className="btn-gold">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Link>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-[var(--foreground-faint)]">
            Référence: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
