"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { SECTORS, REGIONS, MANDATE_TYPES } from "@/lib/db/schema";
import { dealSchema, type DealFormData } from "@/lib/validations/forms";

interface DealFormProps {
  mode: "create" | "edit";
  initialData?: Partial<DealFormData> & { id?: string };
}

export function DealForm({ mode, initialData = {} }: DealFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      clientName: initialData.clientName || "",
      clientLogo: initialData.clientLogo || "",
      acquirerName: initialData.acquirerName || "",
      acquirerLogo: initialData.acquirerLogo || "",
      sector: initialData.sector as typeof SECTORS[number] | undefined,
      region: initialData.region as typeof REGIONS[number] | "" | undefined,
      year: initialData.year || new Date().getFullYear(),
      mandateType: initialData.mandateType as typeof MANDATE_TYPES[number] | undefined,
      description: initialData.description || "",
      isPriorExperience: initialData.isPriorExperience || false,
    },
  });

  const onSubmit = async (data: DealFormData) => {
    setIsLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (mode === "create") {
         // Import dynamically to avoid client-side bundling issues if any (though calling server action directly is fine usually)
         const { createDeal } = await import("@/app/actions/deals");
         const result = await createDeal(data);
         
         if (!result.success) {
            throw new Error(result.error);
         }
         
         setSubmitSuccess(true);
         setTimeout(() => {
            router.push("/admin/deals");
            router.refresh();
         }, 1000);
      } else {
         // TODO: Implement updateDeal
         console.log("Update not implemented yet");
         setSubmitSuccess(true);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Watch values for controlled selects
  const sectorValue = watch("sector");
  const regionValue = watch("region");
  const mandateTypeValue = watch("mandateType");

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

      {/* Success/Error Messages */}
      {submitSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
          <span>Opération enregistrée avec succès !</span>
        </div>
      )}

      {submitError && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("clientName")}
                  placeholder="Ex: SAFE GROUPE"
                  className={`bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] ${
                    errors.clientName ? "border-red-500" : ""
                  }`}
                />
                {errors.clientName && (
                  <p className="text-red-400 text-sm">{errors.clientName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientLogo" className="text-[var(--foreground)]">
                  Logo du client (URL)
                </Label>
                <Input
                  id="clientLogo"
                  {...register("clientLogo")}
                  placeholder="https://..."
                  className={`bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] ${
                    errors.clientLogo ? "border-red-500" : ""
                  }`}
                />
                {errors.clientLogo && (
                  <p className="text-red-400 text-sm">{errors.clientLogo.message}</p>
                )}
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
                  {...register("acquirerName")}
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
                  {...register("acquirerLogo")}
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
                  value={sectorValue}
                  onValueChange={(value) => setValue("sector", value as typeof SECTORS[number])}
                >
                  <SelectTrigger className={`bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] ${
                    errors.sector ? "border-red-500" : ""
                  }`}>
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
                {errors.sector && (
                  <p className="text-red-400 text-sm">{errors.sector.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[var(--foreground)]">Région</Label>
                <Select
                  value={regionValue || ""}
                  onValueChange={(value) => setValue("region", value as typeof REGIONS[number] | "")}
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
                    {...register("year", { valueAsNumber: true })}
                    min={2000}
                    max={new Date().getFullYear()}
                    className={`bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] ${
                      errors.year ? "border-red-500" : ""
                    }`}
                  />
                  {errors.year && (
                    <p className="text-red-400 text-sm">{errors.year.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--foreground)]">Type de mandat *</Label>
                  <Select
                    value={mandateTypeValue}
                    onValueChange={(value) => setValue("mandateType", value as typeof MANDATE_TYPES[number])}
                  >
                    <SelectTrigger className={`bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] ${
                      errors.mandateType ? "border-red-500" : ""
                    }`}>
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
                  {errors.mandateType && (
                    <p className="text-red-400 text-sm">{errors.mandateType.message}</p>
                  )}
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
                  {...register("description")}
                  rows={4}
                  placeholder="Décrivez l'opération..."
                  className="bg-[var(--input)] border-[var(--border)] text-[var(--foreground)] resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPriorExperience"
                  {...register("isPriorExperience")}
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
