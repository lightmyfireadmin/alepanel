"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateContent, ContentType } from "@/app/actions/marketing";
import { Loader2, Copy, Check, Sparkles } from "lucide-react";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<ContentType | "visuals">("article");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [model, setModel] = useState<"mistral" | "groq">("mistral");

  const handleGenerate = () => {
    if (!prompt) return;

    // "visuals" is a placeholder for now as we don't have image generation yet in the actions
    if (activeTab === "visuals") {
        setResult("La génération d'images sera bientôt disponible.");
        return;
    }

    startTransition(async () => {
      const response = await generateContent({
        prompt,
        type: activeTab as ContentType,
        context,
        model
      });
      if (response.success && response.content) {
        setResult(response.content);
      } else {
        setResult("Erreur lors de la génération. Veuillez vérifier les clés API et réessayer.");
      }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">Marketing Studio</h1>
        <p className="text-[var(--foreground-muted)]">
          Créez du contenu engageant avec l&apos;aide de l&apos;IA (Mistral & Groq).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Modèle IA</Label>
                        <Select value={model} onValueChange={(v: "mistral" | "groq") => setModel(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mistral">Mistral AI (Recommandé FR)</SelectItem>
                                <SelectItem value="groq">Groq (Ultra-rapide)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Outils</CardTitle>
                    <CardDescription>Choisissez le type de contenu à générer</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs orientation="vertical" value={activeTab} onValueChange={(v) => { setActiveTab(v as ContentType | "visuals"); setResult(""); }} className="w-full">
                    <TabsList className="flex flex-col h-auto items-start bg-transparent space-y-1 p-0">
                      <TabsTrigger value="article" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Articles de Blog</TabsTrigger>
                      <TabsTrigger value="email" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Emails & Newsletters</TabsTrigger>
                      <TabsTrigger value="linkedin" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Posts LinkedIn</TabsTrigger>
                      <TabsTrigger value="advice" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Conseils & Stratégie</TabsTrigger>
                      <TabsTrigger value="translation" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Traductions</TabsTrigger>
                      <TabsTrigger value="carrousel" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Contenu Carrousel</TabsTrigger>
                      <TabsTrigger value="visuals" className="w-full justify-start px-3 py-2 data-[state=active]:bg-[var(--accent)] data-[state=active]:text-white">Visuels (Bientôt)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                Générateur
              </CardTitle>
              <CardDescription>
                {activeTab === 'article' && "Rédigez des articles complets pour votre blog."}
                {activeTab === 'email' && "Créez des emails professionnels ou des newsletters."}
                {activeTab === 'linkedin' && "Générez des posts optimisés pour l'engagement."}
                {activeTab === 'advice' && "Obtenez des conseils stratégiques ou des analyses."}
                {activeTab === 'translation' && "Traduisez vos textes avec précision."}
                {activeTab === 'carrousel' && "Structurez le contenu pour vos présentations ou carrousels."}
                {activeTab === 'visuals' && "Génération d'images (bientôt disponible)."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Sujet / Instructions</Label>
                <Textarea
                  id="prompt"
                  placeholder="De quoi voulez-vous parler ?"
                  className="min-h-[100px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">Contexte (Optionnel)</Label>
                <Textarea
                  id="context"
                  placeholder="Informations supplémentaires, ton, cible..."
                  className="min-h-[60px]"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isPending || !prompt || activeTab === 'visuals'}
                className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer le contenu
                  </>
                )}
              </Button>

              {result && (
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Résultat</Label>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="p-4 bg-[var(--background-tertiary)] rounded-md whitespace-pre-wrap border border-[var(--border)] min-h-[200px] text-sm leading-relaxed">
                    {result}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
