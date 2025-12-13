"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Palette, Phone, BarChart3, Scale, Puzzle, Save, Check } from "lucide-react";
import { DEFAULT_SETTINGS, SiteSettingsConfig } from "@/lib/db/settings-schema";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettingsConfig>({ ...DEFAULT_SETTINGS });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateSetting = <K extends keyof SiteSettingsConfig>(key: K, value: SiteSettingsConfig[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // In a real implementation, this would save to the database
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Paramètres du site
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Configurez les paramètres qui s&apos;appliquent à l&apos;ensemble du site vitrine
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="btn-gold">
          {saving ? (
            <>Enregistrement...</>
          ) : saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Enregistré
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-[var(--background-secondary)]">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            Légal
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Puzzle className="w-4 h-4" />
            Intégrations
          </TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle>Identité visuelle</CardTitle>
              <CardDescription>Personnalisez l&apos;apparence de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
                  <Input
                    id="companyName"
                    value={settings["branding.companyName"]}
                    onChange={(e) => updateSetting("branding.companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={settings["branding.tagline"]}
                    onChange={(e) => updateSetting("branding.tagline", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings["branding.primaryColor"]}
                      onChange={(e) => updateSetting("branding.primaryColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings["branding.primaryColor"]}
                      onChange={(e) => updateSetting("branding.primaryColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Couleur accent (or)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={settings["branding.accentColor"]}
                      onChange={(e) => updateSetting("branding.accentColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings["branding.accentColor"]}
                      onChange={(e) => updateSetting("branding.accentColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              <CardDescription>Coordonnées affichées sur le site et utilisées pour les CTAs mobiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de contact</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings["contact.email"]}
                    onChange={(e) => updateSetting("contact.email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={settings["contact.phone"]}
                    onChange={(e) => updateSetting("contact.phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (format international)</Label>
                <Input
                  id="whatsapp"
                  value={settings["contact.whatsapp"]}
                  onChange={(e) => updateSetting("contact.whatsapp", e.target.value)}
                  placeholder="+33600000000"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle>Statistiques affichées</CardTitle>
              <CardDescription>Chiffres clés affichés sur la page d&apos;accueil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="operations">Nombre d&apos;opérations</Label>
                  <Input
                    id="operations"
                    type="number"
                    value={settings["stats.operations"]}
                    onChange={(e) => updateSetting("stats.operations", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cumulativeValue">Valeur cumulée (M€)</Label>
                  <Input
                    id="cumulativeValue"
                    type="number"
                    value={settings["stats.cumulativeValue"]}
                    onChange={(e) => updateSetting("stats.cumulativeValue", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Années d&apos;expérience cumulée</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    value={settings["stats.yearsExperience"]}
                    onChange={(e) => updateSetting("stats.yearsExperience", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="satisfiedClients">Clients accompagnés</Label>
                  <Input
                    id="satisfiedClients"
                    type="number"
                    value={settings["stats.satisfiedClients"]}
                    onChange={(e) => updateSetting("stats.satisfiedClients", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Tab */}
        <TabsContent value="legal">
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle>Informations légales</CardTitle>
              <CardDescription>Données réglementaires pour les mentions légales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={settings["legal.siret"]}
                    onChange={(e) => updateSetting("legal.siret", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tva">N° TVA intracommunautaire</Label>
                  <Input
                    id="tva"
                    value={settings["legal.tva"]}
                    onChange={(e) => updateSetting("legal.tva", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rcs">RCS</Label>
                  <Input
                    id="rcs"
                    value={settings["legal.rcs"]}
                    onChange={(e) => updateSetting("legal.rcs", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capital">Capital social</Label>
                  <Input
                    id="capital"
                    value={settings["legal.capital"]}
                    onChange={(e) => updateSetting("legal.capital", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="orias">N° ORIAS (si applicable)</Label>
                  <Input
                    id="orias"
                    value={settings["legal.orias"]}
                    onChange={(e) => updateSetting("legal.orias", e.target.value)}
                    placeholder="Laissez vide si non applicable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amf">N° AMF (si applicable)</Label>
                  <Input
                    id="amf"
                    value={settings["legal.amf"]}
                    onChange={(e) => updateSetting("legal.amf", e.target.value)}
                    placeholder="Laissez vide si non applicable"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dpoEmail">Email DPO (RGPD)</Label>
                <Input
                  id="dpoEmail"
                  type="email"
                  value={settings["legal.dpoEmail"]}
                  onChange={(e) => updateSetting("legal.dpoEmail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* CRM */}
            <Card className="bg-[var(--card)] border-[var(--border)]">
              <CardHeader>
                <CardTitle>CRM</CardTitle>
                <CardDescription>Connectez votre CRM pour synchroniser les leads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Type de CRM</Label>
                  <Select
                    value={settings["integrations.crmType"]}
                    onValueChange={(value) => updateSetting("integrations.crmType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un CRM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {settings["integrations.crmType"] && (
                  <div className="space-y-2">
                    <Label htmlFor="crmApiKey">Clé API</Label>
                    <Input
                      id="crmApiKey"
                      type="password"
                      value={settings["integrations.crmApiKey"]}
                      onChange={(e) => updateSetting("integrations.crmApiKey", e.target.value)}
                      placeholder="Entrez votre clé API"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-[var(--card)] border-[var(--border)]">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Configurez le suivi des visiteurs (RGPD-compliant)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Solution analytics</Label>
                  <Select
                    value={settings["integrations.analyticsType"]}
                    onValueChange={(value) => updateSetting("integrations.analyticsType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une solution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      <SelectItem value="matomo">Matomo (recommandé RGPD)</SelectItem>
                      <SelectItem value="ga4">Google Analytics 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {settings["integrations.analyticsType"] === "matomo" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="matomoUrl">URL Matomo</Label>
                      <Input
                        id="matomoUrl"
                        value={settings["integrations.matomoUrl"]}
                        onChange={(e) => updateSetting("integrations.matomoUrl", e.target.value)}
                        placeholder="https://analytics.example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="analyticsId">Site ID</Label>
                      <Input
                        id="analyticsId"
                        value={settings["integrations.analyticsId"]}
                        onChange={(e) => updateSetting("integrations.analyticsId", e.target.value)}
                        placeholder="1"
                      />
                    </div>
                  </>
                )}
                {settings["integrations.analyticsType"] === "ga4" && (
                  <div className="space-y-2">
                    <Label htmlFor="analyticsId">Measurement ID</Label>
                    <Input
                      id="analyticsId"
                      value={settings["integrations.analyticsId"]}
                      onChange={(e) => updateSetting("integrations.analyticsId", e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-[var(--card)] border-[var(--border)]">
              <CardHeader>
                <CardTitle>Fonctionnalités</CardTitle>
                <CardDescription>Activez ou désactivez des fonctionnalités du site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Outil de valorisation</p>
                    <p className="text-sm text-[var(--foreground-muted)]">Afficher l&apos;estimateur de valeur sur la homepage</p>
                  </div>
                  <Switch
                    checked={settings["features.showValuationTool"]}
                    onCheckedChange={(checked) => updateSetting("features.showValuationTool", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Newsletter</p>
                    <p className="text-sm text-[var(--foreground-muted)]">Activer les inscriptions newsletter</p>
                  </div>
                  <Switch
                    checked={settings["features.enableNewsletter"]}
                    onCheckedChange={(checked) => updateSetting("features.enableNewsletter", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Portail investisseur</p>
                    <p className="text-sm text-[var(--foreground-muted)]">Activer l&apos;espace investisseurs (bientôt disponible)</p>
                  </div>
                  <Switch
                    checked={settings["features.showInvestorPortal"]}
                    onCheckedChange={(checked) => updateSetting("features.showInvestorPortal", checked)}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
