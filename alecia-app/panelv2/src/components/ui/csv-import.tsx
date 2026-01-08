"use client";

import { useState, useCallback, useRef } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface FieldMapping {
  csvColumn: string;
  targetField: string;
  required: boolean;
}

export interface ImportField {
  id: string;
  label: string;
  required: boolean;
  type?: "text" | "number" | "date" | "email";
  validate?: (value: string) => string | null; // Returns error message or null
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface CSVImportProps {
  /** Target fields for mapping */
  fields: ImportField[];
  /** Callback when import is confirmed */
  onImport: (data: Record<string, any>[]) => Promise<void>;
  /** Button label */
  buttonLabel?: string;
  /** Dialog title */
  title?: string;
  /** Max preview rows */
  maxPreviewRows?: number;
}

type ImportStep = "upload" | "mapping" | "preview" | "importing";

export function CSVImport({
  fields,
  onImport,
  buttonLabel = "Importer CSV",
  title = "Importer des données",
  maxPreviewRows = 5,
}: CSVImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ImportStep>("upload");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setStep("upload");
    setCsvData([]);
    setCsvHeaders([]);
    setMappings({});
    setValidationErrors([]);
    setIsImporting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        if (data.length < 2) {
          toast.error("Le fichier est vide ou n'a pas de données");
          return;
        }

        const headers = data[0];
        const rows = data.slice(1).filter(row => row.some(cell => cell.trim() !== ""));

        setCsvHeaders(headers);
        setCsvData(rows);

        // Auto-map fields with matching names
        const autoMappings: Record<string, string> = {};
        fields.forEach(field => {
          const matchingHeader = headers.find(
            h => h.toLowerCase().replace(/[^a-z0-9]/g, "") === 
                 field.id.toLowerCase().replace(/[^a-z0-9]/g, "")
          );
          if (matchingHeader) {
            autoMappings[field.id] = matchingHeader;
          }
        });
        setMappings(autoMappings);

        setStep("mapping");
        toast.success(`${rows.length} lignes détectées`);
      },
      error: (error) => {
        toast.error(`Erreur de lecture: ${error.message}`);
      },
    });
  }, [fields]);

  const handleMappingChange = useCallback((fieldId: string, csvColumn: string) => {
    setMappings(prev => ({
      ...prev,
      [fieldId]: csvColumn === "__none__" ? "" : csvColumn,
    }));
  }, []);

  const validateData = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    csvData.forEach((row, rowIndex) => {
      fields.forEach(field => {
        const csvColumn = mappings[field.id];
        if (!csvColumn) {
          if (field.required) {
            errors.push({
              row: rowIndex + 2, // +2 for header and 0-index
              field: field.label,
              message: "Champ requis non mappé",
            });
          }
          return;
        }

        const columnIndex = csvHeaders.indexOf(csvColumn);
        const value = row[columnIndex]?.trim() || "";

        // Required check
        if (field.required && !value) {
          errors.push({
            row: rowIndex + 2,
            field: field.label,
            message: "Valeur requise manquante",
          });
          return;
        }

        // Type validation
        if (value && field.type === "number" && isNaN(Number(value))) {
          errors.push({
            row: rowIndex + 2,
            field: field.label,
            message: "Nombre invalide",
          });
        }

        if (value && field.type === "email" && !value.includes("@")) {
          errors.push({
            row: rowIndex + 2,
            field: field.label,
            message: "Email invalide",
          });
        }

        // Custom validation
        if (value && field.validate) {
          const error = field.validate(value);
          if (error) {
            errors.push({
              row: rowIndex + 2,
              field: field.label,
              message: error,
            });
          }
        }
      });
    });

    return errors;
  }, [csvData, csvHeaders, fields, mappings]);

  const handlePreview = useCallback(() => {
    const errors = validateData();
    setValidationErrors(errors);
    setStep("preview");
  }, [validateData]);

  const getMappedData = useCallback((): Record<string, any>[] => {
    return csvData.map(row => {
      const mapped: Record<string, any> = {};
      
      fields.forEach(field => {
        const csvColumn = mappings[field.id];
        if (!csvColumn) return;
        
        const columnIndex = csvHeaders.indexOf(csvColumn);
        let value: any = row[columnIndex]?.trim() || "";
        
        // Type conversion
        if (field.type === "number" && value) {
          value = Number(value);
        }
        
        mapped[field.id] = value;
      });
      
      return mapped;
    });
  }, [csvData, csvHeaders, fields, mappings]);

  const handleImport = useCallback(async () => {
    if (validationErrors.length > 0) {
      toast.error("Corrigez les erreurs avant d'importer");
      return;
    }

    setIsImporting(true);
    setStep("importing");

    try {
      const data = getMappedData();
      await onImport(data);
      toast.success(`${data.length} éléments importés avec succès`);
      setIsOpen(false);
      reset();
    } catch (error) {
      toast.error("Erreur lors de l'import");
      setStep("preview");
    } finally {
      setIsImporting(false);
    }
  }, [validationErrors, getMappedData, onImport, reset]);

  const requiredMapped = fields.filter(f => f.required).every(f => mappings[f.id]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) reset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Sélectionnez un fichier CSV à importer"}
            {step === "mapping" && "Associez les colonnes CSV aux champs de destination"}
            {step === "preview" && "Vérifiez les données avant import"}
            {step === "importing" && "Import en cours..."}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 py-2">
          {["upload", "mapping", "preview"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                step === s || ["mapping", "preview"].indexOf(step) > ["mapping", "preview"].indexOf(s as ImportStep)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}>
                {i + 1}
              </div>
              {i < 2 && <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Glissez un fichier CSV ou cliquez pour sélectionner
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="max-w-xs"
              />
            </div>
          )}

          {/* Step 2: Mapping */}
          {step === "mapping" && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {csvData.length} lignes trouvées • {csvHeaders.length} colonnes
              </div>
              
              <div className="grid gap-3">
                {fields.map(field => (
                  <div key={field.id} className="flex items-center gap-3">
                    <div className="w-1/3 flex items-center gap-2">
                      <span className="text-sm font-medium">{field.label}</span>
                      {field.required && (
                        <Badge variant="destructive" className="text-[10px] h-4">
                          Requis
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <Select
                      value={mappings[field.id] || "__none__"}
                      onValueChange={(v) => handleMappingChange(field.id, v)}
                    >
                      <SelectTrigger className="w-2/3">
                        <SelectValue placeholder="Sélectionner une colonne" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">— Non mappé —</SelectItem>
                        {csvHeaders.map(header => (
                          <SelectItem key={header} value={header}>
                            {header}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.length} erreur(s) de validation
                  </div>
                  <ScrollArea className="h-24">
                    <div className="space-y-1 text-xs">
                      {validationErrors.slice(0, 10).map((err, i) => (
                        <div key={i}>
                          Ligne {err.row}: {err.field} - {err.message}
                        </div>
                      ))}
                      {validationErrors.length > 10 && (
                        <div className="text-muted-foreground">
                          ... et {validationErrors.length - 10} autres erreurs
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {validationErrors.length === 0 && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Toutes les données sont valides
                </div>
              )}

              {/* Data Preview */}
              <div className="text-sm font-medium">
                Aperçu ({Math.min(csvData.length, maxPreviewRows)} sur {csvData.length})
              </div>
              <ScrollArea className="h-48 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {fields.filter(f => mappings[f.id]).map(field => (
                        <TableHead key={field.id} className="text-xs">
                          {field.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getMappedData().slice(0, maxPreviewRows).map((row, i) => (
                      <TableRow key={i}>
                        {fields.filter(f => mappings[f.id]).map(field => (
                          <TableCell key={field.id} className="text-xs">
                            {String(row[field.id] || "")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}

          {/* Step 4: Importing */}
          {step === "importing" && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Import en cours...</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step !== "upload" && step !== "importing" && (
            <Button
              variant="ghost"
              onClick={() => setStep(step === "preview" ? "mapping" : "upload")}
            >
              Retour
            </Button>
          )}
          
          {step === "mapping" && (
            <Button onClick={handlePreview} disabled={!requiredMapped}>
              Aperçu
            </Button>
          )}
          
          {step === "preview" && (
            <Button 
              onClick={handleImport} 
              disabled={validationErrors.length > 0 || isImporting}
            >
              Importer {csvData.length} lignes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
