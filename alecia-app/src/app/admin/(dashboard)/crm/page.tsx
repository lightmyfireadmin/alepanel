"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, Building2, Users as UsersIcon, 
  Phone, Mail, Tag, MoreVertical, Filter, UserPlus 
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CONTACT_TAGS } from "@/lib/db/schema";
import { CompanyEnrichment } from "@/components/admin";

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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || contact.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.siren.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            CRM
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Gestion des contacts et entreprises
          </p>
        </div>
        <Button className="btn-gold gap-2">
          <Plus className="w-4 h-4" />
          {activeTab === "contacts" ? "Nouveau contact" : "Nouvelle entreprise"}
        </Button>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Tabs & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex gap-2 p-1 bg-[var(--background-secondary)] rounded-lg">
              <button
                onClick={() => setActiveTab("contacts")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "contacts"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <UsersIcon className="w-4 h-4" />
                Contacts
              </button>
              <button
                onClick={() => setActiveTab("companies")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "companies"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Entreprises
              </button>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              
              {activeTab === "contacts" && (
                <div className="relative">
                  <select
                    value={selectedTag || ""}
                    onChange={(e) => setSelectedTag(e.target.value || null)}
                    className="appearance-none pl-10 pr-8 py-2 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="">Tous les tags</option>
                    {CONTACT_TAGS.map((tag) => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
                </div>
              )}
            </div>
          </div>

          {/* Contacts Grid */}
          {activeTab === "contacts" && (
            <>
              {filteredContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContacts.map((contact, idx) => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)] transition-colors cursor-pointer group">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                                {contact.name}
                              </CardTitle>
                              <p className="text-sm text-[var(--foreground-muted)]">
                                {contact.role} • {contact.company}
                              </p>
                            </div>
                            <button className="p-1 rounded hover:bg-[var(--background-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
                            </button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="space-y-1.5 text-sm">
                            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="truncate">{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{contact.phone}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            {contact.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border ${tagColors[tag] || "bg-gray-500/20 text-gray-400"}`}
                              >
                                <Tag className="w-2.5 h-2.5" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-[var(--foreground-muted)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                    Aucun contact trouvé
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] max-w-sm">
                    {searchQuery || selectedTag 
                      ? "Essayez de modifier vos critères de recherche."
                      : "Ajoutez votre premier contact pour commencer."}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Companies Table */}
          {activeTab === "companies" && (
            <>
              {filteredCompanies.length > 0 ? (
                <Card className="bg-[var(--card)] border-[var(--border)]">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[var(--border)]">
                            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Entreprise</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">SIREN</th>
                            <th className="text-left px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">Secteur</th>
                            <th className="text-right px-4 py-3 text-sm font-medium text-[var(--foreground-muted)]">CA</th>
                            <th className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCompanies.map((company, idx) => (
                            <motion.tr
                              key={company.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background-tertiary)] transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-[var(--accent)]" />
                                  </div>
                                  <span className="font-medium text-[var(--foreground)]">{company.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-[var(--foreground-muted)] font-mono">
                                {company.siren}
                              </td>
                              <td className="px-4 py-3 text-sm text-[var(--foreground-muted)]">
                                {company.sector}
                              </td>
                              <td className="px-4 py-3 text-right text-sm text-[var(--foreground)]">
                                {company.revenue 
                                  ? `${(company.revenue / 1000000).toFixed(1)}M€` 
                                  : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <button className="p-1 rounded hover:bg-[var(--background-secondary)]">
                                  <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-[var(--foreground-muted)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                    Aucune entreprise trouvée
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] max-w-sm">
                    {searchQuery 
                      ? "Essayez de modifier vos critères de recherche."
                      : "Utilisez l'enrichissement SIREN pour ajouter une entreprise."}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar - Company Enrichment */}
        <div className="hidden lg:block">
          <CompanyEnrichment className="sticky top-6" />
        </div>
      </div>
    </div>
  );
}

