"use client";

import { SmartChart } from "@/components/features/charts/SmartChart";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

export default function ReportingPage() {
  return (
    <div className="space-y-6 h-full flex flex-col p-8">
      <div className="flex justify-between items-end border-b pb-6">
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reporting Financier</h1>
            <p className="text-sm text-muted-foreground mt-1">Analyse des performances et de la valorisation.</p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" size="sm">
                <Calendar className="w-3.5 h-3.5 mr-2" />
                2025
             </Button>
             <Button size="sm" className="bg-black text-white dark:bg-white dark:text-black">
                <Download className="w-3.5 h-3.5 mr-2" />
                Export PDF
             </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SmartChart 
            title="Revenue vs EBITDA" 
            description="Évolution annuelle comparative"
            type="bar"
            config={{
                xAxisKey: "name",
                seriesKeys: [
                    { key: "revenue", color: "#0ea5e9", name: "Chiffre d'Affaires" },
                    { key: "ebitda", color: "#22c55e", name: "EBITDA" }
                ]
            }}
        />
        
        <SmartChart 
            title="Croissance Mensuelle" 
            description="Tendance MRR (Revenu Récurrent)"
            type="line"
            // Using mock data loader inside component for now
            config={{
                xAxisKey: "name",
                seriesKeys: [
                    { key: "revenue", color: "#f97316", name: "MRR" }
                ]
            }}
        />

        <div className="md:col-span-2">
             <SmartChart 
                title="Répartition Sectorielle" 
                description="Portefeuille de deals par industrie"
                type="bar" // Pie chart implementation basic in SmartChart, fallback to bar if issues
                config={{
                    xAxisKey: "name",
                    seriesKeys: [
                        { key: "revenue", color: "#8b5cf6", name: "Volume (K€)" }
                    ]
                }}
            />
        </div>
      </div>
    </div>
  );
}
