"use client";

import { useState } from "react";
import { CompanyEnrichment } from "@/components/admin";
import ExcelJS from "exceljs";
import { 
  Search, Building2, 
  Phone, Mail, MoreVertical, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { CreateEntityDialog } from "@/components/admin/crm/CreateEntityDialog";

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string | null;
  tags: string[] | null;
  companyName: string | null;
}

interface Company {
  id: string;
  name: string;
  siren: string | null;
  sector: string | null;
  financialData: {
    revenue?: number;
    ebitda?: number;
    employees?: number;
  } | null;
}

const tagColors: Record<string, string> = {
  "Investisseur": "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "Cédant": "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  "Acquéreur": "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  "Fonds PE": "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
};

export function CRMClient({ initialContacts, initialCompanies }: { initialContacts: Contact[], initialCompanies: Company[] }) {
  const [activeTab, setActiveTab] = useState<"contacts" | "companies">("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const { success } = useToast();

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(activeTab === "contacts" ? "Contacts" : "Companies");
    
    if (activeTab === "contacts") {
        worksheet.columns = [
            { header: "Nom", key: "name", width: 25 },
            { header: "Email", key: "email", width: 30 },
            { header: "Entreprise", key: "companyName", width: 25 },
        ];
        initialContacts.forEach(c => worksheet.addRow(c));
    } else {
        worksheet.columns = [
            { header: "Entreprise", key: "name", width: 30 },
            { header: "SIREN", key: "siren", width: 15 },
            { header: "Secteur", key: "sector", width: 35 },
        ];
        initialCompanies.forEach(c => worksheet.addRow(c));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${activeTab}.xlsx`;
    a.click();
    success("Export terminé", "Le fichier a été téléchargé.");
  };

  const filteredContacts = initialContacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompanies = initialCompanies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex bg-muted p-1 rounded-lg">
                    <button onClick={() => setActiveTab("contacts")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'contacts' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                        Contacts
                    </button>
                    <button onClick={() => setActiveTab("companies")} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'companies' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                        Companies
                    </button>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary placeholder:text-muted-foreground text-foreground"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={handleExportToExcel}>
                        <FileSpreadsheet className="w-4 h-4" />
                    </Button>
                    <CreateEntityDialog />
                </div>
            </div>

            {activeTab === "contacts" ? (
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredContacts.map(contact => (
                        <div key={contact.id} className="bg-card border border-border p-4 rounded-xl hover:border-primary transition-colors group shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-foreground">{contact.name}</h4>
                                    <p className="text-xs text-primary font-medium uppercase tracking-wider">{contact.role || "N/A"} • {contact.companyName || "Indépendant"}</p>
                                </div>
                                <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {contact.email}</div>
                                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {contact.phone}</div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {contact.tags?.map((tag: string) => (
                                    <span key={tag} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${tagColors[tag] || "bg-muted text-muted-foreground border-border"}`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-4 py-3">Entreprise</th>
                                <th className="px-4 py-3">SIREN</th>
                                <th className="px-4 py-3">Secteur</th>
                                <th className="px-4 py-3 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCompanies.map(company => (
                                <tr key={company.id} className="hover:bg-muted/50 transition-colors text-foreground">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Building2 className="w-4 h-4" /></div>
                                            <span className="font-semibold">{company.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{company.siren}</td>
                                    <td className="px-4 py-4 text-xs">{company.sector}</td>
                                    <td className="px-4 py-4 text-right font-medium">
                                        {company.financialData?.revenue ? `${(company.financialData.revenue / 1000000).toFixed(1)}M€` : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        <div className="space-y-6">
            <Card className="p-6 bg-card border border-border shadow-sm">
                <CompanyEnrichment />
            </Card>
        </div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={className}>{children}</div>;
}
