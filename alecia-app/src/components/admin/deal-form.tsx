"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SECTORS, REGIONS, MANDATE_TYPES } from "@/lib/db/schema";

interface DealFormProps {
  mode: "create" | "edit";
  initialData?: {
    id?: string;
    clientName?: string;
    clientLogo?: string;
    acquirerName?: string;
    acquirerLogo?: string;
    sector?: string;
    region?: string;
    year?: number;
    mandateType?: string;
    description?: string;
    isPriorExperience?: boolean;
  };
}

export function DealForm({ mode, initialData = {} }: DealFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: initialData.clientName || "",
    clientLogo: initialData.clientLogo || "",
    acquirerName: initialData.acquirerName || "",
    acquirerLogo: initialData.acquirerLogo || "",
    sector: initialData.sector || "",
    region: initialData.region || "",
    year: initialData.year || new Date().getFullYear(),
    mandateType: initialData.mandateType || "",
    description: initialData.description || "",
    isPriorExperience: initialData.isPriorExperience || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement actual API call when DB is connected
    console.log("Form submitted:", formData);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
    router.push("/admin/deals");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/deals">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            {mode === "create" ? "Nouvelle opération" : "Modifier l'opération"}
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            {mode === "create"
              ? "Créez une nouvelle opération à afficher sur le site"
              : "Modifiez les détails de l'opération"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Client Info */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Client / Cédant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-[var(--foreground)]">
                  Nom du client *
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) =>
                    setFormData({ ...formData, clientName: e.target.value })
                  }
                  required
                  placeholder="Ex: SAFE GROUPE"
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientLogo" className="text-[var(--foreground)]">
                  Logo du client (URL)
                </Label>
                <Input
                  id="clientLogo"
                  value={formData.clientLogo}
                  onChange={(e) =>
                    setFormData({ ...formData, clientLogo: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Acquirer Info */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Acquéreur / Investisseur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="acquirerName" className="text-[var(--foreground)]">
                  Nom de l&apos;acquéreur
                </Label>
                <Input
                  id="acquirerName"
                  value={formData.acquirerName}
                  onChange={(e) =>
                    setFormData({ ...formData, acquirerName: e.target.value })
                  }
                  placeholder="Ex: Dogs Security"
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acquirerLogo" className="text-[var(--foreground)]">
                  Logo de l&apos;acquéreur (URL)
                </Label>
                <Input
                  id="acquirerLogo"
                  value={formData.acquirerLogo}
                  onChange={(e) =>
                    setFormData({ ...formData, acquirerLogo: e.target.value })
                  }
                  placeholder="https://..."
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Classification */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[var(--foreground)]">Secteur *</Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sector: value })
                  }
                >
                  <SelectTrigger className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--foreground)]">Région</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) =>
                    setFormData({ ...formData, region: value })
                  }
                >
                  <SelectTrigger className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--foreground)]">Année *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: parseInt(e.target.value) })
                    }
                    min={2000}
                    max={new Date().getFullYear()}
                    required
                    className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--foreground)]">Type de mandat *</Label>
                  <Select
                    value={formData.mandateType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, mandateType: value })
                    }
                  >
                    <SelectTrigger className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
                      {MANDATE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[var(--foreground)]">
                  Description de l&apos;opération
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Décrivez l'opération..."
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPriorExperience"
                  checked={formData.isPriorExperience}
                  onChange={(e) =>
                    setFormData({ ...formData, isPriorExperience: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isPriorExperience" className="text-[var(--foreground-muted)]">
                  Opération menée dans le cadre d&apos;expériences antérieures (*)
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" asChild className="border-[var(--border)]">
            <Link href="/admin/deals">Annuler</Link>
          </Button>
          <Button type="submit" disabled={isLoading} className="btn-gold rounded-lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : mode === "create" ? (
              "Créer l'opération"
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
