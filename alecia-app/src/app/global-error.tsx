"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-[#b69d62] mb-4">Erreur</h1>
          <h2 className="text-xl font-semibold text-white mb-4">
            Une erreur s&apos;est produite
          </h2>
          <p className="text-gray-400 mb-8">
            {error.message || "Une erreur inattendue s'est produite."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
              className="border-gray-700"
            >
              Retour à l&apos;accueil
            </Button>
            <Button
              onClick={reset}
              className="bg-[#b69d62] hover:bg-[#9f8854] text-white"
            >
              Réessayer
            </Button>
          </div>
          {error.digest && (
            <p className="mt-6 text-xs text-gray-600">
              Code erreur: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
