"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ThemeColorPicker } from "@/components/admin/ThemeColorPicker";
import { FontSelector } from "@/components/admin/FontSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, RotateCcw, Sun, Moon, Palette, Type } from "lucide-react";
import { toast } from "sonner";

interface ThemeSettings {
  primaryLight: string;
  secondaryLight: string;
  backgroundLight: string;
  primaryDark: string;
  secondaryDark: string;
  backgroundDark: string;
  headingFont: string;
  bodyFont: string;
}

export default function SettingsPage() {
  const themeQuery = useQuery(api.theme.getThemeSettings);
  const updateTheme = useMutation(api.theme.updateThemeSettings);
  const resetTheme = useMutation(api.theme.resetThemeSettings);

  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize settings from query
  useEffect(() => {
    if (themeQuery && !settings) {
      setSettings(themeQuery);
    }
  }, [themeQuery, settings]);

  // Track changes
  useEffect(() => {
    if (settings && themeQuery) {
      const changed = JSON.stringify(settings) !== JSON.stringify(themeQuery);
      setHasChanges(changed);
    }
  }, [settings, themeQuery]);

  const updateField = <K extends keyof ThemeSettings>(
    field: K,
    value: ThemeSettings[K]
  ) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      await updateTheme({ settings });
      toast.success("Thème enregistré avec succès");
      setHasChanges(false);
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const defaults = await resetTheme({});
      setSettings(defaults);
      toast.success("Thème réinitialisé");
      setHasChanges(false);
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation");
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Paramètres du site
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Personnalisez l'apparence du site marketing
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isResetting}
            className="gap-2"
          >
            {isResetting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Réinitialiser
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="gap-2 btn-gold"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Light Mode Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Mode Clair
          </CardTitle>
          <CardDescription>
            Couleurs utilisées en mode jour
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <ThemeColorPicker
            color={settings.primaryLight}
            onChange={(c) => updateField("primaryLight", c)}
            label="Primaire"
            description="Titres et boutons principaux"
          />
          <ThemeColorPicker
            color={settings.secondaryLight}
            onChange={(c) => updateField("secondaryLight", c)}
            label="Secondaire"
            description="Couleur d'accent"
          />
          <ThemeColorPicker
            color={settings.backgroundLight}
            onChange={(c) => updateField("backgroundLight", c)}
            label="Fond"
            description="Arrière-plan principal"
          />
        </CardContent>
      </Card>

      {/* Dark Mode Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Mode Sombre
          </CardTitle>
          <CardDescription>
            Couleurs utilisées en mode nuit
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <ThemeColorPicker
            color={settings.primaryDark}
            onChange={(c) => updateField("primaryDark", c)}
            label="Primaire"
            description="Titres et boutons principaux"
          />
          <ThemeColorPicker
            color={settings.secondaryDark}
            onChange={(c) => updateField("secondaryDark", c)}
            label="Secondaire"
            description="Couleur d'accent"
          />
          <ThemeColorPicker
            color={settings.backgroundDark}
            onChange={(c) => updateField("backgroundDark", c)}
            label="Fond"
            description="Arrière-plan principal"
          />
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Typographie
          </CardTitle>
          <CardDescription>
            Polices Google Fonts utilisées sur le site
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <FontSelector
            value={settings.headingFont}
            onChange={(f) => updateField("headingFont", f)}
            label="Titres"
            description="Police des éléments h1 à h6"
            type="heading"
          />
          <FontSelector
            value={settings.bodyFont}
            onChange={(f) => updateField("bodyFont", f)}
            label="Paragraphes"
            description="Police du texte courant"
            type="body"
          />
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Aperçu
          </CardTitle>
          <CardDescription>
            Prévisualisation des changements (mode clair)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="p-6 rounded-lg border"
            style={{ backgroundColor: settings.backgroundLight }}
          >
            <h2
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: `"${settings.headingFont}", serif`,
                color: settings.primaryLight,
              }}
            >
              alecia - Conseil M&A
            </h2>
            <p
              className="mb-4"
              style={{
                fontFamily: `"${settings.bodyFont}", sans-serif`,
                color: settings.primaryLight,
              }}
            >
              Votre partenaire de confiance pour les opérations de fusion-acquisition.
            </p>
            <button
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{
                background: `linear-gradient(135deg, ${settings.primaryLight} 0%, ${settings.primaryLight}cc 100%)`,
              }}
            >
              Nous contacter
            </button>
            <span
              className="ml-4 font-semibold"
              style={{ color: settings.secondaryLight }}
            >
              Accent color
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
