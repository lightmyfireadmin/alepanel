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
import { Plus, Pencil, Trash2, Briefcase, Search, ExternalLink, Star } from "lucide-react";
import { SECTORS, REGIONS } from "@/lib/db/schema";
import { teamMembers, mockDeals } from "@/lib/data";

interface Deal {
  id: string;
  slug: string;
  clientName: string;
  acquirerName: string;
  sector: string;
  region: string;
  year: number;
  mandateType: string;
  isPublished: boolean;
  isFeatured: boolean;
  context: string;
  intervention: string;
  result: string;
  testimonialText: string;
  testimonialAuthor: string;
  referentPartner: string;
  dealSize: string;
}

const INITIAL_DEALS: Deal[] = mockDeals.map((d, i) => ({
  ...d,
  isPublished: true,
  isFeatured: i < 3,
  context: "Contexte de l'opération à compléter...",
  intervention: "Description de notre accompagnement...",
  result: "Résultats obtenus...",
  testimonialText: "",
  testimonialAuthor: "",
  referentPartner: teamMembers[i % teamMembers.length]?.slug || "",
  dealSize: "",
}));

const EMPTY_DEAL: Deal = {
  id: "",
  slug: "",
  clientName: "",
  acquirerName: "",
  sector: "",
  region: "",
  year: new Date().getFullYear(),
  mandateType: "Cession",
  isPublished: false,
  isFeatured: false,
  context: "",
  intervention: "",
  result: "",
  testimonialText: "",
  testimonialAuthor: "",
  referentPartner: "",
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

export default function DealsAdminPage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Deal>(EMPTY_DEAL);

  const filteredDeals = deals.filter((deal) =>
    deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.acquirerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({ ...deal });
    } else {
      setEditingDeal(null);
      setFormData({ ...EMPTY_DEAL, id: Date.now().toString() });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingDeal) {
      setDeals((prev) =>
        prev.map((d) => (d.id === formData.id ? { ...formData } : d))
      );
    } else {
      setDeals((prev) => [...prev, formData]);
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_DEAL);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette opération ?")) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const generateSlug = (client: string, acquirer: string) => {
    return `${client}-${acquirer}`
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
            {deals.filter((d) => d.isPublished).length} opérations publiées sur {deals.length}
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
                  <Label>Acquéreur / Investisseur *</Label>
                  <Input
                    value={formData.acquirerName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        acquirerName: name,
                        slug: formData.slug || generateSlug(formData.clientName, name),
                      });
                    }}
                    placeholder="Dogs Security"
                  />
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
                    value={formData.region}
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

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Année *</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
                    min={2015}
                    max={2030}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Taille du deal</Label>
                  <Select
                    value={formData.dealSize}
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
                <div className="space-y-2">
                  <Label>Associé référent</Label>
                  <Select
                    value={formData.referentPartner}
                    onValueChange={(v) => setFormData({ ...formData, referentPartner: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.slug} value={member.slug}>{member.name}</SelectItem>
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
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    rows={3}
                    placeholder="Décrivez le contexte et les enjeux de l'opération..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notre intervention</Label>
                  <Textarea
                    value={formData.intervention}
                    onChange={(e) => setFormData({ ...formData, intervention: e.target.value })}
                    rows={3}
                    placeholder="Détaillez votre accompagnement et méthodologie..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Résultats obtenus</Label>
                  <Textarea
                    value={formData.result}
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
                    value={formData.testimonialText}
                    onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                    rows={3}
                    placeholder="« L'accompagnement d'alecia a été déterminant... »"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Auteur (fonction)</Label>
                  <Input
                    value={formData.testimonialAuthor}
                    onChange={(e) => setFormData({ ...formData, testimonialAuthor: e.target.value })}
                    placeholder="Dirigeant de la société cédée"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Publier</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Visible sur le site /operations
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Mise en avant</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Afficher sur la homepage
                    </p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="btn-gold" 
                    disabled={!formData.clientName || !formData.acquirerName || !formData.sector || !formData.mandateType}
                  >
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
          <Card key={deal.id} className={`bg-[var(--card)] border-[var(--border)] ${!deal.isPublished ? "opacity-60" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base text-[var(--foreground)]">
                    {deal.clientName}
                    {deal.isFeatured && <Star className="inline w-4 h-4 ml-1 text-[var(--accent)]" />}
                  </CardTitle>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    → {deal.acquirerName}
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
