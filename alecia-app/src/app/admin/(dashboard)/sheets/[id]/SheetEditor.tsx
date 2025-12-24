"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateSheet } from "@/lib/actions/sheets";
import { 
  Save, 
  FileDown, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  Trash2,
  Table as TableIcon
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import ExcelJS from "exceljs";

interface SheetEditorProps {
  id: string;
  initialData: string[][];
}

export function SheetEditor({ id, initialData }: SheetEditorProps) {
  const [data, setData] = useState<string[][]>(initialData || [["", "", ""]]);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { success, error: errorToast } = useToast();

  const handleCellChange = (rowIndex: number, colIdx: number, value: string) => {
    const newData = [...data];
    newData[rowIndex][colIdx] = value;
    setData(newData);
  };

  const addRow = () => {
    const colCount = data[0]?.length || 3;
    setData([...data, Array(colCount).fill("")]);
  };

  const addColumn = () => {
    setData(data.map(row => [...row, ""]));
  };

  const removeRow = (idx: number) => {
    if (data.length <= 1) return;
    setData(data.filter((_, i) => i !== idx));
  };

  const removeColumn = (idx: number) => {
    if (data[0].length <= 1) return;
    setData(data.map(row => row.filter((_, i) => i !== idx)));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateSheet(id, data);
    if (res.success) {
      setLastSaved(new Date());
      success("Enregistré");
    } else {
      errorToast("Erreur de sauvegarde");
    }
    setSaving(false);
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    data.forEach((row) => {
      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `Export_Sheet_${id}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-boxdark">
      <div className="p-3 border-b border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={addRow} className="h-8">
                    <Plus className="w-3 h-3 mr-1" /> Ligne
                </Button>
                <Button variant="outline" size="sm" onClick={addColumn} className="h-8">
                    <Plus className="w-3 h-3 mr-1" /> Colonne
                </Button>
            </div>
            {saving ? (
                <div className="flex items-center gap-2 text-xs text-bodydark2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                </div>
            ) : lastSaved ? (
                <CheckCircle2 className="w-4 h-4 text-success" />
            ) : null}
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-8">
                <FileDown className="w-4 h-4 mr-2" /> Excel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving} className="h-8 bg-[var(--accent)] text-white">
                <Save className="w-4 h-4 mr-2" /> Sauvegarder
            </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <table className="border-collapse w-full text-sm">
          <thead>
            <tr>
              <th className="w-10 border border-stroke dark:border-strokedark bg-gray-100 dark:bg-meta-4/30"></th>
              {data[0]?.map((_, i) => (
                <th key={i} className="border border-stroke dark:border-strokedark bg-gray-100 dark:bg-meta-4/30 p-2 relative group">
                  {String.fromCharCode(65 + i)}
                  <button 
                    onClick={() => removeColumn(i)}
                    className="absolute -top-1 -right-1 hidden group-hover:flex bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="border border-stroke dark:border-strokedark bg-gray-100 dark:bg-meta-4/30 text-center p-2 relative group">
                  {rowIndex + 1}
                  <button 
                    onClick={() => removeRow(rowIndex)}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 hidden group-hover:flex bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <Trash2 className="w-2 h-2" />
                  </button>
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-stroke dark:border-strokedark p-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full p-2 bg-transparent focus:bg-primary/5 focus:outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
