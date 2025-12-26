"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateContent, ContentType, generateImage } from "@/app/actions/marketing";
import { Loader2, Copy, Check, Sparkles, Image as ImageIcon, Save, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { createPad } from "@/lib/actions/pads";
import { useToast } from "@/components/ui/toast";
import { Progress } from "@/components/ui/progress";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<ContentType | "visuals">("article");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 500);
    } else {
      setTimeout(() => setProgress(100), 0);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const handleGenerate = () => {
    if (!prompt) return;

    if (activeTab === "visuals") {
        if (!apiKey) {
            error("Clé API requise", "Veuillez entrer une clé API OpenAI valide pour générer des images.");
            return;
        }

        setProgress(0);
        setGeneratedImage("");
        startTransition(async () => {
            const response = await generateImage(prompt, apiKey);
            if (response.success && response.imageUrl) {
                setGeneratedImage(response.imageUrl);
            } else {
                error("Erreur", response.error || "Impossible de générer l'image.");
            }
        });
        return;
    }

    setProgress(0);
    startTransition(async () => {
      const response = await generateContent({
        prompt,
        type: activeTab as ContentType,
        context,
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

  const handleSave = async () => {
    if (activeTab === "visuals") {
        if (!generatedImage) return;
        setSaving(true);
        // Create a markdown pad with the image
        const title = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
        const content = `![Generated Image](${generatedImage})\n\nPrompt: ${prompt}`;
        
        const res = await createPad(`IMG: ${title}`, content);
        if (res.success) {
            success("Image sauvegardée", "Le lien a été enregistré dans Documents.");
        } else {
            error("Erreur", "Impossible de sauvegarder le document.");
        }
        setSaving(false);
        return;
    }

    if (!result) return;
    setSaving(true);
    // Truncate prompt for title if too long
    const title = prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt;
    const res = await createPad(`IA: ${title}`, result);
    if (res.success) {
      success("Document sauvegardé", "Le contenu a été enregistré dans Documents.");
    } else {
      error("Erreur", "Impossible de sauvegarder le document.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">Marketing Studio</h1>
        <p className="text-muted-foreground">
          Créez du contenu engageant avec l&apos;aide de l&apos;IA (Auto-optimisé).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Outils</CardTitle>
                    <CardDescription>Choisissez le type de contenu à générer</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs orientation="vertical" value={activeTab} onValueChange={(v) => { setActiveTab(v as ContentType | "visuals"); setResult(""); setGeneratedImage(""); }} className="w-full">
                    <TabsList className="flex flex-col h-auto items-start bg-transparent space-y-1 p-0 w-full">
                      {/* Standard Tabs */}
                      <TabsTrigger value="article" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Articles de Blog</TabsTrigger>
                      <TabsTrigger value="email" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Emails & Newsletters</TabsTrigger>
                      <TabsTrigger value="linkedin" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Posts LinkedIn</TabsTrigger>
                      <TabsTrigger value="advice" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Conseils & Stratégie</TabsTrigger>
                      <TabsTrigger value="translation" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Traductions</TabsTrigger>
                      <TabsTrigger value="carrousel" className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contenu Carrousel</TabsTrigger>
                      
                      {/* Visuals Tab */}
                      <TabsTrigger value="visuals" className="w-full justify-between px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <span>Visuels</span>
                        <Badge variant="outline" className="ml-2 text-[10px] h-5 px-1.5 bg-background text-foreground border-border">Nouveau</Badge>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Générateur
              </CardTitle>
              <CardDescription>
                {activeTab === 'article' && "Rédigez des articles complets pour votre blog."}
                {activeTab === 'email' && "Créez des emails professionnels ou des newsletters."}
                {activeTab === 'linkedin' && "Générez des posts optimisés pour l&apos;engagement."}
                {activeTab === 'advice' && "Obtenez des conseils stratégiques ou des analyses."}
                {activeTab === 'translation' && "Traduisez vos textes avec précision."}
                {activeTab === 'carrousel' && "Structurez le contenu pour vos présentations ou carrousels."}
                {activeTab === 'visuals' && "Générez des images uniques avec DALL-E 3."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              
                <div className="space-y-4">
                    {/* API Key Input for Visuals */}
                    {activeTab === 'visuals' && (
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 space-y-2">
                            <Label htmlFor="apiKey" className="flex items-center gap-2 text-primary font-bold">
                                <Key className="w-4 h-4" /> Clé API OpenAI (DALL-E)
                            </Label>
                            <Input 
                                id="apiKey" 
                                type="password" 
                                placeholder="sk-..."
                                value={apiKey} 
                                onChange={(e) => setApiKey(e.target.value)}
                                className="bg-background"
                            />
                            <p className="text-xs text-muted-foreground">Votre clé n&apos;est pas stockée et est utilisée uniquement pour cette session.</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="prompt">Sujet / Instructions</Label>
                        <Textarea
                        id="prompt"
                        placeholder={activeTab === 'visuals' ? "Décrivez l'image que vous souhaitez générer..." : "De quoi voulez-vous parler ?"}
                        className="min-h-[100px]"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>

                    {activeTab !== 'visuals' && (
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
                    )}

                    <div className="space-y-2">
                        <Button
                            onClick={handleGenerate}
                            disabled={isPending || !prompt}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Génération en cours...
                            </>
                            ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {activeTab === 'visuals' ? "Générer l'image" : "Générer le contenu"}
                            </>
                            )}
                        </Button>
                        {isPending && <Progress value={progress} className="h-1 w-full" />}
                    </div>

                    {/* RESULTS DISPLAY */}
                    
                    {/* Text Result */}
                    {result && activeTab !== 'visuals' && (
                        <div className="mt-6 space-y-2 fade-in">
                            <Tabs defaultValue="preview" className="w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <TabsList>
                                        <TabsTrigger value="preview">Aperçu</TabsTrigger>
                                        <TabsTrigger value="raw">Markdown</TabsTrigger>
                                    </TabsList>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                            Sauvegarder
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <TabsContent value="preview" className="p-4 bg-card rounded-md border border-border min-h-[200px] prose dark:prose-invert max-w-none">
                                    <ReactMarkdown>{result}</ReactMarkdown>
                                </TabsContent>
                                <TabsContent value="raw">
                                    <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap border border-border min-h-[200px] text-sm leading-relaxed text-foreground font-mono">
                                        {result}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}

                    {/* Image Result */}
                    {generatedImage && activeTab === 'visuals' && (
                        <div className="mt-6 space-y-4 fade-in">
                            <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={generatedImage} alt="Generated AI" className="max-w-full h-auto max-h-[500px] rounded-lg shadow-lg" />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleSave} disabled={saving}>
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    Sauvegarder dans Documents
                                </Button>
                                <Button asChild>
                                    <a href={generatedImage} target="_blank" rel="noopener noreferrer" download="generated-image.png">
                                        <ImageIcon className="mr-2 h-4 w-4" /> Télécharger
                                    </a>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}