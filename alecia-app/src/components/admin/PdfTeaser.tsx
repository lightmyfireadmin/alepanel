"use client";

import { useState } from "react";
import { Document, Page, Text, View, StyleSheet, PDFViewer, pdf } from "@react-pdf/renderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#0a0a0a",
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#d4a853",
    borderBottomStyle: "solid",
    paddingBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#d4a853",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#d4a853",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  text: {
    fontSize: 11,
    color: "#e0e0e0",
    lineHeight: 1.6,
  },
  highlight: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  stat: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: "#888",
  },
  statValue: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "bold",
  },
  confidential: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    borderTopWidth: 1,
    borderTopColor: "#333",
    borderTopStyle: "solid",
    paddingTop: 15,
  },
  dealTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  dealSector: {
    fontSize: 12,
    color: "#d4a853",
    marginBottom: 20,
  },
});

interface DealTeaserData {
  title: string;
  sector: string;
  description: string;
  highlights: string[];
  financials?: {
    revenue?: string;
    ebitda?: string;
    employees?: string;
  };
}

// PDF Document Component
function TeaserDocument({ data }: { data: DealTeaserData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>alecia</Text>
          <Text style={styles.subtitle}>Conseil en fusion-acquisition</Text>
        </View>

        {/* Deal Title */}
        <View style={styles.section}>
          <Text style={styles.dealTitle}>{data.title}</Text>
          <Text style={styles.dealSector}>{data.sector}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opportunité</Text>
          <Text style={styles.text}>{data.description}</Text>
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Points clés</Text>
          {data.highlights.map((highlight, idx) => (
            <Text key={idx} style={styles.text}>• {highlight}</Text>
          ))}
        </View>

        {/* Financials */}
        {data.financials && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Données financières</Text>
            <View style={styles.highlight}>
              {data.financials.revenue && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Chiffre d&apos;affaires</Text>
                  <Text style={styles.statValue}>{data.financials.revenue}</Text>
                </View>
              )}
              {data.financials.ebitda && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>EBITDA</Text>
                  <Text style={styles.statValue}>{data.financials.ebitda}</Text>
                </View>
              )}
              {data.financials.employees && (
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Effectif</Text>
                  <Text style={styles.statValue}>{data.financials.employees}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Confidential Footer */}
        <Text style={styles.confidential}>
          Document strictement confidentiel - Usage exclusivement réservé au destinataire
        </Text>
      </Page>
    </Document>
  );
}

interface PdfTeaserProps {
  projectId: string;
  projectTitle: string;
  sector?: string;
  description?: string;
}

export function PdfTeaser({ projectId: _projectId, projectTitle, sector, description }: PdfTeaserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data for the teaser
  const teaserData: DealTeaserData = {
    title: projectTitle,
    sector: sector || "Technologies & logiciels",
    description: description || "Entreprise leader sur son marché avec une base clients solide et des perspectives de croissance significatives. L'équipe de management est expérimentée et motivée pour accompagner la transition.",
    highlights: [
      "Position de leader sur un segment de marché porteur",
      "Base clients récurrente et diversifiée",
      "Équipe de management stable et engagée",
      "Potentiel de développement géographique",
    ],
    financials: {
      revenue: "12 M€",
      ebitda: "1.8 M€",
      employees: "45 collaborateurs",
    },
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(<TeaserDocument data={teaserData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Teaser_${projectTitle.replace(/\s+/g, "_")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-[var(--border)]">
          <FileText className="w-4 h-4" />
          Générer Teaser
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] bg-[var(--card)] border-[var(--border)]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-[var(--foreground)]">
            Aperçu du Teaser PDF
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={isGenerating}
              className="btn-gold gap-2"
            >
              <Download className="w-4 h-4" />
              {isGenerating ? "Génération..." : "Télécharger"}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 rounded-lg overflow-hidden bg-[var(--background-tertiary)]">
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            <TeaserDocument data={teaserData} />
          </PDFViewer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
