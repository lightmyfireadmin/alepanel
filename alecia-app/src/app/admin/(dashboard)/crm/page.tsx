"use client";

import { useState } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { CompanyEnrichment } from "@/components/admin";
import ExcelJS from "exceljs";
import { 
  Search, Building2,
  Phone, Mail, MoreVertical, FileSpreadsheet
} from "lucide-react";

// Mock contacts data
const mockContacts = [
  { id: "1", name: "Jean Dupont", email: "jean.dupont@techcorp.fr", phone: "+33 6 12 34 56 78", role: "CEO", company: "TechCorp SAS", tags: ["Cédant"] },
  { id: "2", name: "Marie Laurent", email: "m.laurent@medisante.fr", phone: "+33 6 98 76 54 32", role: "DG", company: "MediSanté", tags: ["Cédant", "Investisseur"] },
  { id: "3", name: "Pierre Martin", email: "p.martin@capinvest.com", phone: "+33 1 40 50 60 70", role: "Partner", company: "Cap Invest", tags: ["Investisseur", "Fonds PE"] },
  { id: "4", name: "Sophie Bernard", email: "sophie@startupai.io", phone: "+33 6 11 22 33 44", role: "Fondatrice", company: "StartupAI", tags: ["Cédant"] },
];

// Mock companies data
const mockCompanies = [
  { id: "1", name: "TechCorp SAS", siren: "123456789", sector: "Technologies & logiciels", revenue: 12000000 },
  { id: "2", name: "MediSanté", siren: "987654321", sector: "Santé", revenue: 8500000 },
  { id: "3", name: "Cap Invest", siren: "456789123", sector: "Services financiers & assurance", revenue: null },
  { id: "4", name: "StartupAI", siren: "789123456", sector: "Technologies & logiciels", revenue: 2000000 },
];

const tagColors: Record<string, string> = {
  "Investisseur": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Cédant": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Acquéreur": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Fonds PE": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Family Office": "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Banque": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Conseil juridique": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Conseil fiscal": "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function CRMPage() {
  const [activeTab, setActiveTab] = useState<"contacts" | "companies">("contacts");
  const [searchQuery, setSearchQuery] = useState("");

  // Export to Excel function
  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Alecia";
    workbook.created = new Date();

    if (activeTab === "contacts") {
      // Export contacts
      const worksheet = workbook.addWorksheet("Contacts");
      
      // Add header row
      worksheet.columns = [
        { header: "Nom", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Téléphone", key: "phone", width: 20 },
        { header: "Fonction", key: "role", width: 20 },
        { header: "Entreprise", key: "company", width: 25 },
        { header: "Tags", key: "tags", width: 30 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD4AF37" }, // Gold color
      };

      // Add data rows
      filteredContacts.forEach((contact) => {
        worksheet.addRow({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          role: contact.role,
          company: contact.company,
          tags: contact.tags.join(", "),
        });
      });
    } else {
      // Export companies
      const worksheet = workbook.addWorksheet("Entreprises");
      
      // Add header row
      worksheet.columns = [
        { header: "Entreprise", key: "name", width: 30 },
        { header: "SIREN", key: "siren", width: 15 },
        { header: "Secteur", key: "sector", width: 35 },
        { header: "CA (€)", key: "revenue", width: 15 },
      ];

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD4AF37" }, // Gold color
      };

      // Add data rows
      filteredCompanies.forEach((company) => {
        worksheet.addRow({
          name: company.name,
          siren: company.siren,
          sector: company.sector,
          revenue: company.revenue || "",
        });
      });
    }

    // Generate Excel file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alecia-${activeTab}-${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.siren.includes(searchQuery)
  );

  return (
    <>
      <Breadcrumb pageName="CRM" />

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
             <div className="flex gap-2">
                 <button
                    onClick={() => setActiveTab("contacts")}
                    className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'contacts' ? 'bg-primary text-white' : 'bg-white dark:bg-boxdark text-black dark:text-white'}`}
                 >
                    Contacts
                 </button>
                 <button
                    onClick={() => setActiveTab("companies")}
                    className={`px-4 py-2 rounded text-sm font-medium ${activeTab === 'companies' ? 'bg-primary text-white' : 'bg-white dark:bg-boxdark text-black dark:text-white'}`}
                 >
                    Companies
                 </button>
             </div>

             <div className="flex gap-2 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded border border-stroke bg-white py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bodydark2" />
                 </div>
                  <button onClick={handleExportToExcel} className="p-2 bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded text-primary hover:bg-gray">
                     <FileSpreadsheet className="w-5 h-5" />
                  </button>
             </div>
          </div>

          {/* Contacts View */}
          {activeTab === "contacts" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                         <h4 className="text-lg font-semibold text-black dark:text-white">{contact.name}</h4>
                         <p className="text-sm text-bodydark2">{contact.role} at {contact.company}</p>
                      </div>
                      <button className="text-bodydark2 hover:text-primary">
                         <MoreVertical className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="space-y-1 mb-3">
                       <div className="flex items-center gap-2 text-sm text-bodydark2">
                           <Mail className="w-4 h-4" /> {contact.email}
                       </div>
                       <div className="flex items-center gap-2 text-sm text-bodydark2">
                           <Phone className="w-4 h-4" /> {contact.phone}
                       </div>
                   </div>
                   <div className="flex flex-wrap gap-2">
                       {contact.tags.map(tag => (
                           <span key={tag} className={`px-2 py-0.5 rounded text-xs border ${tagColors[tag] || "bg-gray-2 text-bodydark2"}`}>
                               {tag}
                           </span>
                       ))}
                   </div>
                </div>
              ))}
            </div>
          )}

           {/* Companies View */}
           {activeTab === "companies" && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                 <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                       <thead>
                          <tr className="bg-gray-2 text-left dark:bg-meta-4">
                             <th className="py-4 px-4 font-medium text-black dark:text-white">Company</th>
                             <th className="py-4 px-4 font-medium text-black dark:text-white">SIREN</th>
                             <th className="py-4 px-4 font-medium text-black dark:text-white">Sector</th>
                             <th className="py-4 px-4 font-medium text-black dark:text-white text-right">Revenue</th>
                             <th className="py-4 px-4 font-medium text-black dark:text-white"></th>
                          </tr>
                       </thead>
                       <tbody>
                          {filteredCompanies.map((company) => (
                              <tr key={company.id} className="border-b border-[#eee] dark:border-strokedark last:border-0">
                                  <td className="py-5 px-4">
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                                              <Building2 className="w-4 h-4" />
                                          </div>
                                          <span className="font-medium text-black dark:text-white">{company.name}</span>
                                      </div>
                                  </td>
                                  <td className="py-5 px-4 text-sm font-mono text-bodydark2">{company.siren}</td>
                                  <td className="py-5 px-4 text-sm text-bodydark2">{company.sector}</td>
                                  <td className="py-5 px-4 text-sm text-black dark:text-white text-right">
                                      {company.revenue ? `${(company.revenue / 1000000).toFixed(1)}M€` : "-"}
                                  </td>
                                  <td className="py-5 px-4">
                                       <button className="text-bodydark2 hover:text-primary">
                                         <MoreVertical className="w-4 h-4" />
                                       </button>
                                  </td>
                              </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

        </div>

         {/* Sidebar - Company Enrichment */}
        <div className="hidden lg:block">
           {/* Wrapping CompanyEnrichment in a card style if needed, assuming component handles its own basic style but aligning it with layout */}
           <div className="sticky top-24">
              <CompanyEnrichment />
           </div>
        </div>
      </div>
    </>
  );
}
