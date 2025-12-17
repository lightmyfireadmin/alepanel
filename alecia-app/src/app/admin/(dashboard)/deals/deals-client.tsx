"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Briefcase, Search, ExternalLink, Star, Loader2 } from "lucide-react";
import { SECTORS, REGIONS } from "@/lib/db/schema";
import { createDeal, updateDeal, deleteDeal, type DealFormData } from "@/lib/actions/deals";
import { useRouter } from "next/navigation";

// We define a local interface that matches what we expect from the DB + UI needs
// Ideally we import the type from schema, but we need to map nulls to undefined for forms sometimes
interface Deal {
  id: string;
  slug: string;
  clientName: string;
  clientLogo?: string | null;
  acquirerName?: string | null;
  acquirerLogo?: string | null;
  sector: string;
  region?: string | null;
  year: number;
  mandateType: string;
  isConfidential: boolean;
  isPriorExperience: boolean;
  context?: string | null;
  intervention?: string | null;
  result?: string | null;
  testimonialText?: string | null;
  testimonialAuthor?: string | null;
  dealSize?: string | null;
}

interface DealsClientProps {
  initialDeals: Deal[];
}

const EMPTY_DEAL: Deal = {
  id: "",
  slug: "",
  clientName: "",
  clientLogo: "",
  acquirerName: "",
  acquirerLogo: "",
  sector: "",
  region: "",
  year: new Date().getFullYear(),
  mandateType: "Cession",
  isConfidential: false,
  isPriorExperience: false,
  context: "",
  intervention: "",
  result: "",
  testimonialText: "",
  testimonialAuthor: "",
  dealSize: "",
};

const MANDATE_TYPES = [
  { value: "Cession", label: "Cession", color: "bg-emerald-500/20 text-emerald-500" },
  { value: "Acquisition", label: "Acquisition", color: "bg-blue-500/20 text-blue-500" },
  { value: "Levée de fonds", label: "Levée de fonds", color: "bg-purple-500/20 text-purple-500" },
];

const DEAL_SIZES = [
  { value: "", label: "Non communiqué" },
  { value: "1-5M", label: "1 à 5 M€" },
  { value: "5-10M", label: "5 à 10 M€" },
  { value: "10-20M", label: "10 à 20 M€" },
  { value: "20-50M", label: "20 à 50 M€" },
  { value: "50M+", label: "> 50 M€" },
];

export default function DealsClient({ initialDeals }: DealsClientProps) {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Deal>(EMPTY_DEAL);
  const [isLoading, setIsLoading] = useState(false);

  const filteredDeals = deals.filter((deal) =>
    deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (deal.acquirerName && deal.acquirerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    deal.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({ ...deal });
    } else {
      setEditingDeal(null);
      setFormData({ ...EMPTY_DEAL });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const dealData: DealFormData = {
        slug: formData.slug,
        clientName: formData.clientName,
        clientLogo: formData.clientLogo,
        acquirerName: formData.acquirerName,
        acquirerLogo: formData.acquirerLogo,
        sector: formData.sector,
        region: formData.region,
        year: formData.year,
        mandateType: formData.mandateType,
        isConfidential: formData.isConfidential,
        isPriorExperience: formData.isPriorExperience,
        context: formData.context,
        intervention: formData.intervention,
        result: formData.result,
        testimonialText: formData.testimonialText,
        testimonialAuthor: formData.testimonialAuthor,
        dealSize: formData.dealSize,
      };

      if (editingDeal) {
        const result = await updateDeal(editingDeal.id, dealData);
        if (result.success) {
          setDeals((prev) =>
            prev.map((d) => (d.id === editingDeal.id ? { ...formData, id: editingDeal.id } : d))
          );
          setIsDialogOpen(false);
          setFormData(EMPTY_DEAL);
          router.refresh();
        } else {
          alert("Erreur lors de la mise à jour : " + result.error);
        }
      } else {
        const result = await createDeal(dealData);
        if (result.success && result.id) {
          setDeals((prev) => [...prev, { ...formData, id: result.id! }]);
          setIsDialogOpen(false);
          setFormData(EMPTY_DEAL);
          router.refresh();
        } else {
          alert("Erreur lors de la création : " + result.error);
        }
      }
    } catch (error) {
      console.error("Error saving deal:", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette opération ?")) {
      setIsLoading(true);
      try {
        const result = await deleteDeal(id);
        if (result.success) {
          setDeals((prev) => prev.filter((d) => d.id !== id));
          router.refresh();
        } else {
          alert("Erreur lors de la suppression : " + result.error);
        }
      } catch (error) {
        console.error("Error deleting deal:", error);
        alert("Une erreur est survenue.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const generateSlug = (client: string, acquirer?: string | null) => {
    const base = acquirer ? `${client}-${acquirer}` : client;
    return base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const getMandateColor = (type: string) => {
    return MANDATE_TYPES.find((m) => m.value === type)?.color || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Opérations (Tombstones)
          </h1>
          <p className="text-[var(--foreground-muted)]">
            {deals.length} opérations enregistrées
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-gold">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle opération
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--foreground)]">
                {editingDeal ? "Modifier l'opération" : "Nouvelle opération"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom du client *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        clientName: name,
                        slug: formData.slug || generateSlug(name, formData.acquirerName),
                      });
                    }}
                    placeholder="SAFE GROUPE"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Acquéreur / Investisseur</Label>
                  <Input
                    value={formData.acquirerName || ""}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        acquirerName: name,
                        slug: (!editingDeal && formData.clientName) ? generateSlug(formData.clientName, name) : formData.slug,
                      });
                    }}
                    placeholder="Dogs Security"
                  />
                </div>
              </div>

              {/* Logos */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Logo Client (URL)</Label>
                  <Input
                    value={formData.clientLogo || ""}
                    onChange={(e) => setFormData({ ...formData, clientLogo: e.target.value })}
                    placeholder="https://..."
                  />
                  {formData.clientLogo && (
                    <div className="mt-2 h-12 w-12 relative border rounded bg-white overflow-hidden">
                       <img src={formData.clientLogo} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Logo Acquéreur (URL)</Label>
                  <Input
                    value={formData.acquirerLogo || ""}
                    onChange={(e) => setFormData({ ...formData, acquirerLogo: e.target.value })}
                    placeholder="https://..."
                  />
                   {formData.acquirerLogo && (
                    <div className="mt-2 h-12 w-12 relative border rounded bg-white overflow-hidden">
                       <img src={formData.acquirerLogo} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Type de mandat *</Label>
                  <Select
                    value={formData.mandateType}
                    onValueChange={(v) => setFormData({ ...formData, mandateType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {MANDATE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Secteur *</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(v) => setFormData({ ...formData, sector: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Région</Label>
                  <Select
                    value={formData.region || ""}
                    onValueChange={(v) => setFormData({ ...formData, region: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Année *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    min={2015}
                    max={2030}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Taille du deal</Label>
                  <Select
                    value={formData.dealSize || ""}
                    onValueChange={(v) => setFormData({ ...formData, dealSize: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEAL_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Case Study Fields */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg space-y-4">
                <h4 className="font-medium text-[var(--foreground)]">Étude de cas (optionnel)</h4>
                <div className="space-y-2">
                  <Label>Contexte de l&apos;opération</Label>
                  <Textarea
                    value={formData.context || ""}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    rows={3}
                    placeholder="Décrivez le contexte et les enjeux de l'opération..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notre intervention</Label>
                  <Textarea
                    value={formData.intervention || ""}
                    onChange={(e) => setFormData({ ...formData, intervention: e.target.value })}
                    rows={3}
                    placeholder="Détaillez votre accompagnement et méthodologie..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Résultats obtenus</Label>
                  <Textarea
                    value={formData.result || ""}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    rows={2}
                    placeholder="Résultats concrets de l'opération..."
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg space-y-4">
                <h4 className="font-medium text-[var(--foreground)]">Témoignage client (optionnel)</h4>
                <div className="space-y-2">
                  <Label>Citation</Label>
                  <Textarea
                    value={formData.testimonialText || ""}
                    onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                    rows={3}
                    placeholder="« L'accompagnement d'alecia a été déterminant... »"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Auteur (fonction)</Label>
                  <Input
                    value={formData.testimonialAuthor || ""}
                    onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                    placeholder="Dirigeant de la société cédée"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Expérience antérieure</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Opération menée par un associé avant alecia (*)
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPriorExperience}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPriorExperience: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Confidentiel</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Ne pas afficher les noms complets si nécessaire
                    </p>
                  </div>
                  <Switch
                    checked={formData.isConfidential}
                    onCheckedChange={(checked) => setFormData({ ...formData, isConfidential: checked })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-[var(--border)]">
                <Button variant="outline" asChild>
                  <a href={`/operations/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </a>
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="btn-gold"
                    disabled={!formData.clientName || !formData.sector || !formData.mandateType || isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingDeal ? "Mettre à jour" : "Créer"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          placeholder="Rechercher une opération..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Deals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDeals.map((deal) => (
          <Card key={deal.id} className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base text-[var(--foreground)]">
                    {deal.clientName}
                    {deal.isPriorExperience && <Star className="inline w-4 h-4 ml-1 text-[var(--accent)]" />}
                  </CardTitle>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    → {deal.acquirerName || "N/A"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(deal)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(deal.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getMandateColor(deal.mandateType)}>
                  {deal.mandateType}
                </Badge>
                <span className="text-xs text-[var(--foreground-muted)]">{deal.year}</span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)] truncate">
                {deal.sector}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          Aucune opération trouvée
        </div>
      )}
    </div>
  );
}
