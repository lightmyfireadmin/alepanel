"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const SECTORS = [
  "Industries",
  "Distribution & services B2C",
  "Software & Tech",
  "Santé",
  "Services B2B",
  "Immobilier",
  "Finance",
  "Autre",
];

const MANDATE_TYPES = [
  "Sell-side",
  "Buy-side",
  "Levée de fonds",
  "Conseil stratégique",
];

export default function TransactionEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const id = isNew ? null : (params.id as Id<"transactions">);

  const transaction = useQuery(
    api.transactions.getById,
    id ? { id } : "skip"
  );
  const createTransaction = useMutation(api.transactions.create);
  const updateTransaction = useMutation(api.transactions.update);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: "",
    clientName: "",
    clientLogo: "",
    acquirerName: "",
    acquirerLogo: "",
    sector: "Industries",
    region: "",
    year: new Date().getFullYear(),
    mandateType: "Sell-side",
    description: "",
    isConfidential: false,
    isPriorExperience: false,
    context: "",
    intervention: "",
    result: "",
    testimonialText: "",
    testimonialAuthor: "",
    roleType: "",
    dealSize: "",
  });

  // Load existing data
  useEffect(() => {
    if (transaction) {
      setForm({
        slug: transaction.slug || "",
        clientName: transaction.clientName || "",
        clientLogo: transaction.clientLogo || "",
        acquirerName: transaction.acquirerName || "",
        acquirerLogo: transaction.acquirerLogo || "",
        sector: transaction.sector || "Industries",
        region: transaction.region || "",
        year: transaction.year || new Date().getFullYear(),
        mandateType: transaction.mandateType || "Sell-side",
        description: transaction.description || "",
        isConfidential: transaction.isConfidential || false,
        isPriorExperience: transaction.isPriorExperience || false,
        context: transaction.context || "",
        intervention: transaction.intervention || "",
        result: transaction.result || "",
        testimonialText: transaction.testimonialText || "",
        testimonialAuthor: transaction.testimonialAuthor || "",
        roleType: transaction.roleType || "",
        dealSize: transaction.dealSize || "",
      });
    }
  }, [transaction]);

  // Auto-generate slug from client name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isNew) {
        await createTransaction({
          ...form,
          clientLogo: form.clientLogo || undefined,
          acquirerLogo: form.acquirerLogo || undefined,
          region: form.region || undefined,
          description: form.description || undefined,
          context: form.context || undefined,
          intervention: form.intervention || undefined,
          result: form.result || undefined,
          testimonialText: form.testimonialText || undefined,
          testimonialAuthor: form.testimonialAuthor || undefined,
          roleType: form.roleType || undefined,
          dealSize: form.dealSize || undefined,
        });
        toast.success("Transaction créée");
      } else if (id) {
        await updateTransaction({
          id,
          ...form,
          clientLogo: form.clientLogo || undefined,
          acquirerLogo: form.acquirerLogo || undefined,
          region: form.region || undefined,
          description: form.description || undefined,
          context: form.context || undefined,
          intervention: form.intervention || undefined,
          result: form.result || undefined,
          testimonialText: form.testimonialText || undefined,
          testimonialAuthor: form.testimonialAuthor || undefined,
          roleType: form.roleType || undefined,
          dealSize: form.dealSize || undefined,
        });
        toast.success("Transaction mise à jour");
      }
      router.push("/admin/transactions");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  if (!isNew && !transaction) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/transactions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            {isNew ? "Nouvelle transaction" : "Modifier la transaction"}
          </h1>
          <p className="text-muted-foreground">
            {isNew
              ? "Ajoutez une nouvelle transaction au track record"
              : `Modifiez ${transaction?.clientName}`}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={form.clientName}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      clientName: e.target.value,
                      slug: form.slug || generateSlug(e.target.value),
                    });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acquirerName">Acquéreur</Label>
                <Input
                  id="acquirerName"
                  value={form.acquirerName}
                  onChange={(e) =>
                    setForm({ ...form, acquirerName: e.target.value })
                  }
                  placeholder="Confidentiel si vide"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Année *</Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Secteur *</Label>
                <Select
                  value={form.sector}
                  onValueChange={(v) => setForm({ ...form, sector: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mandateType">Type de mandat *</Label>
                <Select
                  value={form.mandateType}
                  onValueChange={(v) => setForm({ ...form, mandateType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MANDATE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <Input
                id="region"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                placeholder="Ex: Île-de-France, PACA..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Logos */}
        <Card>
          <CardHeader>
            <CardTitle>Logos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientLogo">Logo client (URL)</Label>
                <Input
                  id="clientLogo"
                  value={form.clientLogo}
                  onChange={(e) =>
                    setForm({ ...form, clientLogo: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acquirerLogo">Logo acquéreur (URL)</Label>
                <Input
                  id="acquirerLogo"
                  value={form.acquirerLogo}
                  onChange={(e) =>
                    setForm({ ...form, acquirerLogo: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description courte</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Contexte</Label>
              <Textarea
                id="context"
                value={form.context}
                onChange={(e) => setForm({ ...form, context: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="intervention">Notre intervention</Label>
              <Textarea
                id="intervention"
                value={form.intervention}
                onChange={(e) =>
                  setForm({ ...form, intervention: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="result">Résultat</Label>
              <Textarea
                id="result"
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card>
          <CardHeader>
            <CardTitle>Témoignage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testimonialText">Citation</Label>
              <Textarea
                id="testimonialText"
                value={form.testimonialText}
                onChange={(e) =>
                  setForm({ ...form, testimonialText: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testimonialAuthor">Auteur</Label>
              <Input
                id="testimonialAuthor"
                value={form.testimonialAuthor}
                onChange={(e) =>
                  setForm({ ...form, testimonialAuthor: e.target.value })
                }
                placeholder="Prénom Nom, Fonction"
              />
            </div>
          </CardContent>
        </Card>

        {/* Flags */}
        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Confidentiel</Label>
                <p className="text-sm text-muted-foreground">
                  Masquer les détails sensibles sur le site
                </p>
              </div>
              <Switch
                checked={form.isConfidential}
                onCheckedChange={(v) => setForm({ ...form, isConfidential: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Expérience antérieure</Label>
                <p className="text-sm text-muted-foreground">
                  Transaction réalisée avant la création d&apos;alecia
                </p>
              </div>
              <Switch
                checked={form.isPriorExperience}
                onCheckedChange={(v) =>
                  setForm({ ...form, isPriorExperience: v })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dealSize">Taille de la transaction</Label>
                <Input
                  id="dealSize"
                  value={form.dealSize}
                  onChange={(e) =>
                    setForm({ ...form, dealSize: e.target.value })
                  }
                  placeholder="Ex: 5-10M€"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleType">Type de rôle</Label>
                <Input
                  id="roleType"
                  value={form.roleType}
                  onChange={(e) =>
                    setForm({ ...form, roleType: e.target.value })
                  }
                  placeholder="Ex: Lead advisor"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/transactions">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isNew ? "Créer" : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
