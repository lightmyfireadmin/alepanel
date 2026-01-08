"use client";

import { useState, useCallback } from "react";
import { useMicrosoft } from "@/hooks/use-microsoft";
import { OneDrivePicker } from "./OneDrivePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileSpreadsheetIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react";

interface MicrosoftFile {
  id: string;
  name: string;
  webUrl: string;
  size: number;
  lastModified: string;
  type: "file" | "folder";
  mimeType?: string;
  driveId?: string;
  path?: string;
}

interface ExcelWorksheet {
  id: string;
  name: string;
  position: number;
  visibility: string;
}

interface FinancialMetrics {
  revenue?: number;
  ebitda?: number;
  netResult?: number;
  equity?: number;
  netDebt?: number;
  employees?: number;
}

interface ExcelFinanceImporterProps {
  /**
   * Callback when financial data is extracted
   */
  onImport: (metrics: FinancialMetrics, rawData: (string | number | boolean | null)[][]) => void;
  
  /**
   * Optional custom trigger button
   */
  trigger?: React.ReactNode;
  
  /**
   * Additional className for the trigger
   */
  className?: string;
}

// Format number as French currency
function formatEuro(value: number | undefined): string {
  if (value === undefined) return "—";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ExcelFinanceImporter({
  onImport,
  trigger,
  className,
}: ExcelFinanceImporterProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MicrosoftFile | null>(null);
  const [sheets, setSheets] = useState<ExcelWorksheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [range, setRange] = useState("A1:Z100");
  const [previewData, setPreviewData] = useState<(string | number | boolean | null)[][] | null>(null);
  const [parsedMetrics, setParsedMetrics] = useState<FinancialMetrics | null>(null);
  const [step, setStep] = useState<"pick" | "configure" | "preview">("pick");
  
  const {
    getExcelSheets,
    readExcelRange,
    readExcelAutoRange,
    parseFinancialData,
    loading,
    error,
  } = useMicrosoft();

  // Handle file selection
  const handleFileSelect = useCallback(async (file: MicrosoftFile) => {
    setSelectedFile(file);
    setStep("configure");
    
    // Load worksheets
    if (file.driveId) {
      const worksheets = await getExcelSheets(file.driveId, file.id);
      setSheets(worksheets);
      if (worksheets.length > 0) {
        setSelectedSheet(worksheets[0].name);
      }
    }
  }, [getExcelSheets]);

  // Load preview and parse data
  const loadPreview = useCallback(async () => {
    if (!selectedFile?.driveId || !selectedSheet) return;
    
    // Try auto-range first, fallback to manual range
    let data;
    if (range.trim() === "" || range === "auto") {
      data = await readExcelAutoRange(selectedFile.driveId, selectedFile.id, selectedSheet);
    } else {
      data = await readExcelRange(selectedFile.driveId, selectedFile.id, selectedSheet, range);
    }
    
    if (data) {
      setPreviewData(data.values);
      
      // Auto-parse financial metrics
      const metrics = await parseFinancialData(data.values);
      setParsedMetrics(metrics);
      setStep("preview");
    }
  }, [selectedFile, selectedSheet, range, readExcelRange, readExcelAutoRange, parseFinancialData]);

  // Confirm import
  const handleImport = useCallback(() => {
    if (parsedMetrics && previewData) {
      onImport(parsedMetrics, previewData);
      setOpen(false);
      resetState();
    }
  }, [parsedMetrics, previewData, onImport]);

  // Reset state
  const resetState = () => {
    setSelectedFile(null);
    setSheets([]);
    setSelectedSheet("");
    setPreviewData(null);
    setParsedMetrics(null);
    setStep("pick");
  };

  return (
    <>
      {/* File picker trigger - starts the flow */}
      <OneDrivePicker
        onFileSelect={handleFileSelect}
        allowedExtensions={[".xlsx", ".xls"]}
        trigger={
          trigger || (
            <Button variant="outline" className={className}>
              <FileSpreadsheetIcon className="h-4 w-4 mr-2" />
              Importer depuis Excel
            </Button>
          )
        }
        title="Sélectionner un fichier Excel"
      />
      
      {/* Configuration & Preview Dialog */}
      <Dialog open={open || step !== "pick"} onOpenChange={(isOpen) => {
        if (!isOpen) resetState();
        setOpen(isOpen);
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheetIcon className="h-5 w-5 text-green-600" />
              {step === "configure" ? "Configuration de l'import" : "Aperçu des données"}
            </DialogTitle>
            {selectedFile && (
              <DialogDescription>
                Fichier: {selectedFile.name}
              </DialogDescription>
            )}
          </DialogHeader>

          {step === "configure" && (
            <div className="space-y-4">
              {/* Sheet selector */}
              <div className="space-y-2">
                <Label>Feuille de calcul</Label>
                <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une feuille" />
                  </SelectTrigger>
                  <SelectContent>
                    {sheets.map((sheet) => (
                      <SelectItem key={sheet.id} value={sheet.name}>
                        {sheet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Range input */}
              <div className="space-y-2">
                <Label>Plage de cellules</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="ex: A1:D50 ou laissez vide pour détection auto"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setRange("")}
                  >
                    Auto
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour détecter automatiquement la zone de données
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-amber-500" />
                  Détection IA
                </h4>
                <p className="text-sm text-muted-foreground">
                  L&apos;IA va automatiquement détecter les métriques financières clés
                  (CA, EBITDA, Résultat Net, Capitaux Propres, Dette Nette) dans vos données.
                </p>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              {/* Parsed metrics */}
              {parsedMetrics && Object.keys(parsedMetrics).some(k => parsedMetrics[k as keyof FinancialMetrics] !== undefined) && (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircleIcon className="h-4 w-4" />
                    Métriques détectées
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {parsedMetrics.revenue !== undefined && (
                      <div className="bg-white dark:bg-green-900/20 rounded p-2">
                        <p className="text-xs text-muted-foreground">Chiffre d&apos;affaires</p>
                        <p className="font-semibold">{formatEuro(parsedMetrics.revenue)}</p>
                      </div>
                    )}
                    {parsedMetrics.ebitda !== undefined && (
                      <div className="bg-white dark:bg-green-900/20 rounded p-2">
                        <p className="text-xs text-muted-foreground">EBITDA</p>
                        <p className="font-semibold">{formatEuro(parsedMetrics.ebitda)}</p>
                      </div>
                    )}
                    {parsedMetrics.netResult !== undefined && (
                      <div className="bg-white dark:bg-green-900/20 rounded p-2">
                        <p className="text-xs text-muted-foreground">Résultat Net</p>
                        <p className="font-semibold">{formatEuro(parsedMetrics.netResult)}</p>
                      </div>
                    )}
                    {parsedMetrics.equity !== undefined && (
                      <div className="bg-white dark:bg-green-900/20 rounded p-2">
                        <p className="text-xs text-muted-foreground">Capitaux Propres</p>
                        <p className="font-semibold">{formatEuro(parsedMetrics.equity)}</p>
                      </div>
                    )}
                    {parsedMetrics.netDebt !== undefined && (
                      <div className="bg-white dark:bg-green-900/20 rounded p-2">
                        <p className="text-xs text-muted-foreground">Dette Nette</p>
                        <p className="font-semibold">{formatEuro(parsedMetrics.netDebt)}</p>
                      </div>
                    )}
                    {parsedMetrics.employees !== undefined && (
                      <div className="bg-white dark:bg-green-900/20 rounded p-2">
                        <p className="text-xs text-muted-foreground">Effectif</p>
                        <p className="font-semibold">{parsedMetrics.employees}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* If no metrics found */}
              {parsedMetrics && !Object.keys(parsedMetrics).some(k => parsedMetrics[k as keyof FinancialMetrics] !== undefined) && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <AlertCircleIcon className="h-4 w-4" />
                    Aucune métrique détectée automatiquement
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez toujours importer les données brutes et les configurer manuellement.
                  </p>
                </div>
              )}

              {/* Data preview table */}
              <div className="space-y-2">
                <Label>Aperçu des données ({previewData?.length || 0} lignes)</Label>
                <ScrollArea className="h-[250px] border rounded-md">
                  <table className="w-full text-sm">
                    <tbody>
                      {previewData?.slice(0, 20).map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                          {row.slice(0, 8).map((cell, j) => (
                            <td key={j} className="px-2 py-1 border-r whitespace-nowrap">
                              {cell !== null ? String(cell) : ""}
                            </td>
                          ))}
                          {row.length > 8 && (
                            <td className="px-2 py-1 text-muted-foreground">...</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewData && previewData.length > 20 && (
                    <p className="text-xs text-center text-muted-foreground py-2">
                      + {previewData.length - 20} lignes supplémentaires
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm flex items-center gap-2">
              <AlertCircleIcon className="h-4 w-4" />
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={resetState}>
              Annuler
            </Button>
            
            {step === "configure" && (
              <Button onClick={loadPreview} disabled={loading || !selectedSheet}>
                {loading ? (
                  <RefreshCwIcon className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                )}
                Charger les données
              </Button>
            )}
            
            {step === "preview" && (
              <>
                <Button variant="outline" onClick={() => setStep("configure")}>
                  Retour
                </Button>
                <Button onClick={handleImport}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Importer
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
