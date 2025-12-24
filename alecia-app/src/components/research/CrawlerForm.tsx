"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { triggerCrawler } from "@/lib/actions/crawler";
import { Loader2, Globe } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function CrawlerForm() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    const res = await triggerCrawler(domain);
    if (res.success) {
      success("Crawl démarré", "Le processus a été lancé en arrière-plan.");
      setDomain("");
    } else {
      errorToast("Erreur", res.error || "Impossible de lancer le crawl.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="domain">Domaine cible (URL)</Label>
        <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
                id="domain"
                placeholder="https://www.exemple.fr"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="pl-10 h-12"
            />
        </div>
      </div>
      <Button type="submit" disabled={loading || !domain} className="w-full h-12 bg-primary text-white">
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Démarrer le Crawling"}
      </Button>
      
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
        <p className="text-xs text-blue-600 dark:text-blue-400">
            <strong>Note :</strong> Le crawl peut prendre plusieurs minutes selon la taille du site. 
            Les fichiers seront disponibles dans l&apos;onglet Fichiers une fois terminés.
        </p>
      </div>
    </form>
  );
}
