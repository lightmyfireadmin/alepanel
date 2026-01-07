"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Presentation, Loader2, Download } from "lucide-react";
import pptxgen from "pptxgenjs";
import { toast } from "sonner";

export function DeckGenerator({ dealData }: { dealData: any }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDeck = async () => {
    setIsGenerating(true);
    try {
      // 1. Init
      const pres = new pptxgen();
      
      // 2. Layout & Theme
      pres.layout = "LAYOUT_16x9";
      pres.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };

      // 3. Slide 1: Cover
      const slide1 = pres.addSlide();
      slide1.background = { color: "111827" }; // Dark Slate
      slide1.addText("CONFIDENTIAL TEASER", { x: 0.5, y: 0.5, fontSize: 14, color: "9CA3AF" });
      slide1.addText(dealData.title || "Project Name", { x: 0.5, y: 2.5, fontSize: 36, color: "FFFFFF", bold: true });
      slide1.addText(`Sector: ${dealData.companyName || "TBD"}`, { x: 0.5, y: 3.5, fontSize: 18, color: "D1D5DB" });
      slide1.addText("Alecia Partners", { x: 0.5, y: 6.5, fontSize: 12, color: "6B7280" });

      // 4. Slide 2: Investment Highlights
      const slide2 = pres.addSlide();
      slide2.addText("Investment Highlights", { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: "111827" });
      slide2.addShape(pres.ShapeType.line, { x:0.5, y:1.0, w:12, h:0, line:{color:'E5E7EB', width:2} });
      
      const highlights = [
          "Strong Market Position in Niche Sector",
          `Consistent Growth (Revenue: €${(dealData.amount / 1000000).toFixed(1)}M)`,
          "Experienced Management Team",
          "Proprietary Technology Stack"
      ];
      
      slide2.addText(highlights.join("\n\n"), { 
          x: 0.5, y: 1.5, w: 9, h: 4, 
          fontSize: 18, color: "374151", bullet: true 
      });

      // 5. Slide 3: Financials (Chart)
      const slide3 = pres.addSlide();
      slide3.addText("Financial Overview", { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: "111827" });
      
      const dataChartArea = [
        {
          name: "Revenue",
          labels: ["2023", "2024", "2025 (F)"],
          values: [4.2, 5.1, 6.8],
        },
        {
          name: "EBITDA",
          labels: ["2023", "2024", "2025 (F)"],
          values: [0.8, 1.2, 1.9],
        }
      ];

      slide3.addChart(pres.ChartType.bar, dataChartArea, { x: 1, y: 1.5, w: 8, h: 4.5 });

      // 6. Save
      await pres.writeFile({ fileName: `Teaser_${dealData.title}.pptx` });
      toast.success("Teaser généré !");

    } catch (e) {
      console.error(e);
      toast.error("Erreur de génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Presentation className="w-4 h-4" />
            Générateur de Deck
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-4">
            Créez un Teaser standardisé basé sur les données du deal.
        </p>
        <Button onClick={generateDeck} disabled={isGenerating} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Télécharger PPTX
        </Button>
      </CardContent>
    </Card>
  );
}
