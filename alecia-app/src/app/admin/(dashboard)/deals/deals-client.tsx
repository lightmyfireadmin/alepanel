"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Briefcase, ExternalLink, Loader2 } from "lucide-react";
import { SECTORS, REGIONS, MANDATE_TYPES } from "@/lib/db/schema";
import { createDeal, updateDeal, deleteDeal } from "@/lib/actions/deals";
import { type DealFormData } from "@/lib/validations/forms";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { createColumns, type Deal } from "./columns";
import { useToast } from "@/components/ui/toast";

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

const MANDATE_TYPE_OPTIONS = [
  { value: "Cession", label: "Cession" },
  { value: "Acquisition", label: "Acquisition" },
  { value: "Levée de fonds", label: "Levée de fonds" },
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
  const { toast, success, error: errorToast } = useToast();
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<Deal>(EMPTY_DEAL);
  const [isLoading, setIsLoading] = useState(false);

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

  const confirmDelete = (id: string) => {
    setDealToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Ensure nulls are converted to undefined or empty string as required by DealFormData (Zod)
      // Note: Zod schema uses .optional().or(z.literal("")) for strings
      const dealData: DealFormData = {
        clientName: formData.clientName,
        clientLogo: formData.clientLogo || undefined,
        acquirerName: formData.acquirerName || undefined,
        acquirerLogo: formData.acquirerLogo || undefined,
        sector: formData.sector as typeof SECTORS[number],
        region: (formData.region || undefined) as typeof REGIONS[number] | undefined,
        year: formData.year,
        mandateType: formData.mandateType as typeof MANDATE_TYPES[number],
        isConfidential: formData.isConfidential,
        isPriorExperience: formData.isPriorExperience,
        context: formData.context || undefined,
        intervention: formData.intervention || undefined,
        result: formData.result || undefined,
        testimonialText: formData.testimonialText || undefined,
        testimonialAuthor: formData.testimonialAuthor || undefined,
        dealSize: formData.dealSize || undefined,
      };

      if (editingDeal) {
        const result = await updateDeal(editingDeal.id, dealData);
        if (result.success) {
          // Manually update the local state with the slug if it wasn't returned by updateDeal
          // But updateDeal usually returns success only.
          // We can keep the existing slug.
          const updatedDeal = { ...formData, id: editingDeal.id };
          setDeals((prev) =>
            prev.map((d) => (d.id === editingDeal.id ? updatedDeal : d))
          );
          setIsDialogOpen(false);
          setFormData(EMPTY_DEAL);
          success("Opération mise à jour", "Les modifications ont été enregistrées avec succès.");
          router.refresh();
        } else {
          errorToast("Erreur", result.error || "Une erreur est survenue lors de la mise à jour.");
        }
      } else {
        const result = await createDeal(dealData);
        if (result.success && result.id) {
          // createDeal generates a slug. We might not know it here unless createDeal returns it.
          // Ideally createDeal should return the full object or at least the slug.
          // But we can refresh the page to get the new list.
          // For optimistic UI, we can guess the slug or just leave it empty until refresh.
          const newDeal = { ...formData, id: result.id!, slug: "generating..." };
          setDeals((prev) => [...prev, newDeal]);
          setIsDialogOpen(false);
          setFormData(EMPTY_DEAL);
          success("Opération créée", "La nouvelle opération a été ajoutée avec succès.");
          router.refresh();
        } else {
           errorToast("Erreur", result.error || "Une erreur est survenue lors de la création.");
        }
      }
    } catch (error) {
      console.error("Error saving deal:", error);
      errorToast("Erreur inattendue", "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!dealToDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteDeal(dealToDelete);
      if (result.success) {
        setDeals((prev) => prev.filter((d) => d.id !== dealToDelete));
        success("Opération supprimée", "L'opération a été supprimée avec succès.");
        router.refresh();
      } else {
        errorToast("Erreur", result.error || "Erreur lors de la suppression.");
      }
    } catch (error) {
      console.error("Error deleting deal:", error);
      errorToast("Erreur inattendue", "Impossible de supprimer l'opération.");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
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

  const columns = createColumns({
    onEdit: handleOpenDialog,
    onDelete: confirmDelete,
  });

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
        <Button onClick={() => handleOpenDialog()} className="btn-gold">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle opération
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={deals}
        searchKey="clientName"
        searchPlaceholder="Rechercher par client..."
      />

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                </div>
                <div className="space-y-2">
                  <Label>Logo Acquéreur (URL)</Label>
                  <Input
                    value={formData.acquirerLogo || ""}
                    onChange={(e) => setFormData({ ...formData, acquirerLogo: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Classification */}
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
                      {MANDATE_TYPE_OPTIONS.map((type) => (
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

              {/* Details */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. L&apos;opération sera définitivement supprimée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
