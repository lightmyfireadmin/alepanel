"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Building2, Users, Search } from "lucide-react";
import { mockSectors } from "@/lib/data";
import { teamMembers } from "@/lib/data";

interface SectorFormData {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  investmentThesisFr: string;
  investmentThesisEn: string;
  iconType: string;
  referentPartner: string;
}

const EMPTY_SECTOR: SectorFormData = {
  id: "",
  slug: "",
  nameFr: "",
  nameEn: "",
  descriptionFr: "",
  descriptionEn: "",
  investmentThesisFr: "",
  investmentThesisEn: "",
  iconType: "",
  referentPartner: "",
};

const ICON_TYPES = [
  { value: "technology", label: "Technologies" },
  { value: "distribution", label: "Distribution" },
  { value: "retail", label: "Retail" },
  { value: "health", label: "Santé" },
  { value: "building", label: "Immobilier" },
  { value: "factory", label: "Industries" },
  { value: "finance", label: "Finance" },
  { value: "food", label: "Agroalimentaire" },
  { value: "energy", label: "Énergie" },
];

export default function SectorsAdminPage() {
  const [sectors, setSectors] = useState(mockSectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<SectorFormData | null>(null);
  const [formData, setFormData] = useState<SectorFormData>(EMPTY_SECTOR);

  const filteredSectors = sectors.filter((sector) =>
    sector.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (sector?: typeof mockSectors[0]) => {
    if (sector) {
      setEditingSector({
        id: sector.id,
        slug: sector.slug,
        nameFr: sector.nameFr,
        nameEn: sector.nameEn || "",
        descriptionFr: sector.descriptionFr || "",
        descriptionEn: sector.descriptionEn || "",
        investmentThesisFr: sector.investmentThesisFr || "",
        investmentThesisEn: sector.investmentThesisEn || "",
        iconType: sector.iconType,
        referentPartner: sector.referentPartner,
      });
      setFormData({
        id: sector.id,
        slug: sector.slug,
        nameFr: sector.nameFr,
        nameEn: sector.nameEn || "",
        descriptionFr: sector.descriptionFr || "",
        descriptionEn: sector.descriptionEn || "",
        investmentThesisFr: sector.investmentThesisFr || "",
        investmentThesisEn: sector.investmentThesisEn || "",
        iconType: sector.iconType,
        referentPartner: sector.referentPartner,
      });
    } else {
      setEditingSector(null);
      setFormData({ ...EMPTY_SECTOR, id: Date.now().toString() });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSector) {
      setSectors((prev) =>
        prev.map((s) => (s.id === formData.id ? { ...s, ...formData } : s))
      );
    } else {
      setSectors((prev) => [...prev, formData]);
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_SECTOR);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce secteur ?")) {
      setSectors((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const getReferentName = (slug: string) => {
    const member = teamMembers.find((m) => m.slug === slug);
    return member?.name || slug;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Gestion des secteurs
          </h1>
          <p className="text-[var(--foreground-muted)]">
            Gérez les secteurs d&apos;activité affichés sur le site
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-gold">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau secteur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--foreground)]">
                {editingSector ? "Modifier le secteur" : "Nouveau secteur"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom (FR) *</Label>
                  <Input
                    value={formData.nameFr}
                    onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                    placeholder="Technologies & logiciels"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nom (EN)</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Technology & Software"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="technologies-logiciels"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icône</Label>
                  <Select
                    value={formData.iconType}
                    onValueChange={(v) => setFormData({ ...formData, iconType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une icône" />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_TYPES.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-2">
                <Label>Description courte (FR)</Label>
                <Textarea
                  value={formData.descriptionFr}
                  onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                  rows={2}
                  placeholder="Accompagnement des éditeurs de logiciels..."
                />
              </div>

              <div className="space-y-2">
                <Label>Description courte (EN)</Label>
                <Textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={2}
                  placeholder="Supporting software publishers..."
                />
              </div>

              {/* Investment Thesis */}
              <div className="space-y-2">
                <Label>Thèse d&apos;investissement (FR)</Label>
                <Textarea
                  value={formData.investmentThesisFr}
                  onChange={(e) => setFormData({ ...formData, investmentThesisFr: e.target.value })}
                  rows={4}
                  placeholder="Le secteur technologique français connaît une consolidation..."
                />
              </div>

              <div className="space-y-2">
                <Label>Thèse d&apos;investissement (EN)</Label>
                <Textarea
                  value={formData.investmentThesisEn}
                  onChange={(e) => setFormData({ ...formData, investmentThesisEn: e.target.value })}
                  rows={4}
                  placeholder="The French technology sector is experiencing..."
                />
              </div>

              {/* Referent Partner */}
              <div className="space-y-2">
                <Label>Associé référent</Label>
                <Select
                  value={formData.referentPartner}
                  onValueChange={(v) => setFormData({ ...formData, referentPartner: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un associé" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.slug} value={member.slug}>
                        {member.name} - {member.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleSave} className="btn-gold" disabled={!formData.nameFr || !formData.slug}>
                  {editingSector ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          placeholder="Rechercher un secteur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sectors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sector) => (
          <Card key={sector.id} className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-[var(--foreground)]">{sector.nameFr}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(sector)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(sector.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                {sector.descriptionFr}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-[var(--foreground-muted)]">
                  {getReferentName(sector.referentPartner)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                /{sector.slug}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSectors.length === 0 && (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          Aucun secteur trouvé
        </div>
      )}
    </div>
  );
}
