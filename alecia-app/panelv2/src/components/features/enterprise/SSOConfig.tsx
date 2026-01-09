"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  KeyRound, 
  Building2,
  Lock,
  Check,
  AlertCircle,
  RefreshCw,
  Loader2,
  ExternalLink,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface SSOConfigProps {
  className?: string;
}

interface SSOProvider {
  id: string;
  name: string;
  type: "saml" | "oidc";
  status: "active" | "inactive" | "error";
  domain?: string;
}

export function SSOConfig({ className = "" }: SSOConfigProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [providers, setProviders] = useState<SSOProvider[]>([
    {
      id: "1",
      name: "Azure AD",
      type: "saml",
      status: "inactive",
      domain: "",
    },
    {
      id: "2",
      name: "Okta",
      type: "oidc",
      status: "inactive",
      domain: "",
    },
    {
      id: "3",
      name: "Google Workspace",
      type: "oidc",
      status: "inactive",
      domain: "",
    },
  ]);

  const [config, setConfig] = useState({
    enforceSso: false,
    allowPasswordFallback: true,
    autoProvision: true,
    defaultRole: "viewer",
    allowedDomains: "",
    metadataUrl: "",
    clientId: "",
    clientSecret: "",
  });

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const testConnection = async (providerId: string) => {
    setIsLoading(true);
    
    // Simulate test
    await new Promise((r) => setTimeout(r, 2000));
    
    setIsLoading(false);
    toast.success("Connexion SSO testée avec succès");
  };

  const saveConfig = async () => {
    setIsLoading(true);
    
    await new Promise((r) => setTimeout(r, 1000));
    
    setIsLoading(false);
    toast.success("Configuration SSO enregistrée");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-purple-600" />
          Configuration SSO Entreprise
        </CardTitle>
        <CardDescription>
          Authentification unique (SAML 2.0 / OIDC)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Providers List */}
        <div className="space-y-3">
          <Label>Fournisseurs d'identité</Label>
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{provider.name}</p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {provider.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    provider.status === "active"
                      ? "text-green-600 bg-green-50"
                      : provider.status === "error"
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500"
                  }
                >
                  {provider.status === "active" && <Check className="h-3 w-3 mr-1" />}
                  {provider.status === "error" && <AlertCircle className="h-3 w-3 mr-1" />}
                  {provider.status === "active" ? "Actif" : provider.status === "error" ? "Erreur" : "Inactif"}
                </Badge>
                <Switch
                  checked={provider.status === "active"}
                  onCheckedChange={() => toggleProvider(provider.id)}
                />
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* SAML/OIDC Config */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Configuration SAML/OIDC</Label>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="metadataUrl">URL Metadata SAML</Label>
              <Input
                id="metadataUrl"
                value={config.metadataUrl}
                onChange={(e) => setConfig({ ...config, metadataUrl: e.target.value })}
                placeholder="https://idp.example.com/metadata"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allowedDomains">Domaines autorisés</Label>
              <Input
                id="allowedDomains"
                value={config.allowedDomains}
                onChange={(e) => setConfig({ ...config, allowedDomains: e.target.value })}
                placeholder="@example.com, @corp.example.com"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID (OIDC)</Label>
              <Input
                id="clientId"
                value={config.clientId}
                onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                placeholder="client_id"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={config.clientSecret}
                onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                placeholder="••••••••••••"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Settings */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Paramètres de sécurité</Label>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Forcer l'authentification SSO</Label>
              <p className="text-xs text-muted-foreground">
                Les utilisateurs ne peuvent se connecter que via SSO
              </p>
            </div>
            <Switch
              checked={config.enforceSso}
              onCheckedChange={(checked) => setConfig({ ...config, enforceSso: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Autoriser le fallback mot de passe</Label>
              <p className="text-xs text-muted-foreground">
                Permet la connexion email/mot de passe si SSO indisponible
              </p>
            </div>
            <Switch
              checked={config.allowPasswordFallback}
              onCheckedChange={(checked) => setConfig({ ...config, allowPasswordFallback: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Provisionnement automatique</Label>
              <p className="text-xs text-muted-foreground">
                Crée automatiquement les utilisateurs à la première connexion
              </p>
            </div>
            <Switch
              checked={config.autoProvision}
              onCheckedChange={(checked) => setConfig({ ...config, autoProvision: checked })}
            />
          </div>
        </div>

        {/* Callback URL Info */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4" />
            URLs de callback
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">ACS URL (SAML):</span>
              <code className="bg-background px-2 py-0.5 rounded text-xs">
                https://alecia.markets/api/auth/saml/callback
              </code>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Redirect URI (OIDC):</span>
              <code className="bg-background px-2 py-0.5 rounded text-xs">
                https://alecia.markets/api/auth/oidc/callback
              </code>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => testConnection("1")}
            disabled={isLoading}
            className="flex-1 gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Tester
          </Button>
          <Button
            onClick={saveConfig}
            disabled={isLoading}
            className="flex-1 gap-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
