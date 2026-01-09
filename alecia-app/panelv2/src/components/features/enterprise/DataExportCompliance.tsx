"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download, 
  FileArchive,
  Database,
  Shield,
  Calendar,
  Loader2,
  Check,
  AlertTriangle,
  FileJson,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface DataExportComplianceProps {
  className?: string;
}

interface ExportJob {
  id: string;
  type: "full" | "deals" | "contacts" | "documents" | "audit";
  status: "pending" | "processing" | "completed" | "failed";
  format: "json" | "csv" | "xlsx";
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  fileSize?: string;
}

export function DataExportCompliance({ className = "" }: DataExportComplianceProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: "1",
      type: "full",
      status: "completed",
      format: "json",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
      downloadUrl: "#",
      fileSize: "45.2 MB",
    },
    {
      id: "2",
      type: "deals",
      status: "completed",
      format: "csv",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 47),
      downloadUrl: "#",
      fileSize: "12.8 MB",
    },
  ]);

  const [exportConfig, setExportConfig] = useState({
    format: "json",
    includeDeals: true,
    includeContacts: true,
    includeDocuments: true,
    includeAuditLogs: false,
    includeAttachments: false,
    anonymize: false,
    dateRange: "all",
  });

  const startExport = async () => {
    setIsExporting(true);
    setProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 200));
      setProgress(i);
    }

    const newJob: ExportJob = {
      id: Date.now().toString(),
      type: "full",
      status: "completed",
      format: exportConfig.format as "json" | "csv" | "xlsx",
      createdAt: new Date(),
      completedAt: new Date(),
      downloadUrl: "#",
      fileSize: "32.1 MB",
    };

    setExportJobs((prev) => [newJob, ...prev]);
    setIsExporting(false);
    toast.success("Export terminé");
  };

  const deletePersonalData = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer toutes vos données personnelles ? Cette action est irréversible.")) {
      return;
    }
    
    toast.success("Demande de suppression RGPD enregistrée");
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "json":
        return <FileJson className="h-4 w-4" />;
      case "csv":
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <FileArchive className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="h-4 w-4 text-indigo-600" />
          Export & Conformité RGPD
        </CardTitle>
        <CardDescription>
          Exportez vos données et gérez la conformité
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Export Configuration */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold">Configuration de l'export</Label>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Format</Label>
              <Select
                value={exportConfig.format}
                onValueChange={(value) => setExportConfig({ ...exportConfig, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (Archive complète)</SelectItem>
                  <SelectItem value="csv">CSV (Tableaux)</SelectItem>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Période</Label>
              <Select
                value={exportConfig.dateRange}
                onValueChange={(value) => setExportConfig({ ...exportConfig, dateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les données</SelectItem>
                  <SelectItem value="year">Dernière année</SelectItem>
                  <SelectItem value="quarter">Dernier trimestre</SelectItem>
                  <SelectItem value="month">Dernier mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Données à inclure</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {[
                { key: "includeDeals", label: "Dossiers M&A" },
                { key: "includeContacts", label: "Contacts & Entreprises" },
                { key: "includeDocuments", label: "Documents (métadonnées)" },
                { key: "includeAuditLogs", label: "Logs d'audit" },
                { key: "includeAttachments", label: "Pièces jointes (fichiers)" },
                { key: "anonymize", label: "Anonymiser les données" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={(exportConfig as any)[key]}
                    onCheckedChange={(checked) =>
                      setExportConfig({ ...exportConfig, [key]: checked })
                    }
                  />
                  <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-muted-foreground text-center">
                Export en cours... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={startExport}
            disabled={isExporting}
            className="w-full gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Lancer l'export
          </Button>
        </div>

        <Separator />

        {/* Previous Exports */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Exports récents</Label>
          {exportJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getFormatIcon(job.format)}
                <div>
                  <p className="text-sm font-medium capitalize">{job.type}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {job.createdAt.toLocaleDateString("fr-FR")}
                    <span>•</span>
                    <span>{job.fileSize}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    job.status === "completed"
                      ? "text-green-600 bg-green-50"
                      : job.status === "failed"
                      ? "text-red-600 bg-red-50"
                      : "text-amber-600 bg-amber-50"
                  }
                >
                  {job.status === "completed" && <Check className="h-3 w-3 mr-1" />}
                  {job.status === "failed" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {job.status === "completed" ? "Terminé" : job.status}
                </Badge>
                {job.downloadUrl && (
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3 w-3" />
                    Télécharger
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* GDPR Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            <Label className="text-sm font-semibold">Droits RGPD</Label>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
            <p>Conformément au RGPD, vous pouvez :</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Exporter l'intégralité de vos données personnelles</li>
              <li>Demander la rectification de vos informations</li>
              <li>Demander la suppression complète de vos données</li>
            </ul>
          </div>

          <Button
            variant="destructive"
            onClick={deletePersonalData}
            className="w-full gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer mes données (Droit à l'oubli)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
