import { notFound } from "next/navigation";
import { FileText, Lock, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock document lookup - in real app, query database by access_token
const MOCK_SHARED_DOCS: Record<string, { name: string; url: string; mimeType: string; expiresAt: string }> = {
  "abc123": {
    name: "Teaser_TechCorp_2025.pdf",
    url: "/documents/teaser.pdf",
    mimeType: "application/pdf",
    expiresAt: "2025-02-15",
  },
  "def456": {
    name: "Business_Plan_Confidentiel.pdf",
    url: "/documents/bp.pdf",
    mimeType: "application/pdf",
    expiresAt: "2025-01-31",
  },
};

interface SharedDocumentPageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedDocumentPage({ params }: SharedDocumentPageProps) {
  const { token } = await params;
  
  // Lookup document by token
  const document = MOCK_SHARED_DOCS[token];
  
  if (!document) {
    notFound();
  }

  const isExpired = new Date(document.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-[var(--card)] border-[var(--border)]">
        <CardContent className="pt-6 text-center">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
              alecia
            </h1>
            <p className="text-sm text-[var(--foreground-muted)]">
              Document partagé
            </p>
          </div>

          {isExpired ? (
            /* Expired State */
            <div className="py-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Lien expiré
              </h2>
              <p className="text-sm text-[var(--foreground-muted)]">
                Ce lien de partage a expiré le{" "}
                {new Date(document.expiresAt).toLocaleDateString("fr-FR")}.
              </p>
              <p className="text-sm text-[var(--foreground-muted)] mt-2">
                Veuillez contacter votre interlocuteur chez alecia pour obtenir un nouveau lien.
              </p>
            </div>
          ) : (
            /* Valid Document */
            <>
              <div className="py-6">
                <div className="w-16 h-16 mx-auto rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-1">
                  {document.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-[var(--foreground-muted)]">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Expire le {new Date(document.expiresAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full btn-gold gap-2" asChild>
                  <a href={document.url} download>
                    <Download className="w-4 h-4" />
                    Télécharger le document
                  </a>
                </Button>
                
                {document.mimeType === "application/pdf" && (
                  <Button variant="outline" className="w-full border-[var(--border)]" asChild>
                    <a href={document.url} target="_blank" rel="noopener noreferrer">
                      Ouvrir dans le navigateur
                    </a>
                  </Button>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--foreground-muted)]">
                  Ce document est confidentiel et destiné uniquement au destinataire autorisé. 
                  Toute reproduction ou distribution non autorisée est interdite.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
