"use client";

import { useState } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { Plus, Pencil, Trash2, Building2, Users, Search, MoreVertical } from "lucide-react";
import { mockSectors } from "@/lib/data";
import { teamMembers } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SectorFormData {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descriptionFr: string;
  descriptionEn: string;
  investmentThesisFr: string;
  investmentThesisEn: string;
  iconType: string;
  referentPartner: string;
}

const EMPTY_SECTOR: SectorFormData = {
  id: "",
  slug: "",
  nameFr: "",
  nameEn: "",
  descriptionFr: "",
  descriptionEn: "",
  investmentThesisFr: "",
  investmentThesisEn: "",
  iconType: "",
  referentPartner: "",
};

const ICON_TYPES = [
  { value: "technology", label: "Technologies" },
  { value: "distribution", label: "Distribution" },
  { value: "retail", label: "Retail" },
  { value: "health", label: "Santé" },
  { value: "building", label: "Immobilier" },
  { value: "factory", label: "Industries" },
  { value: "finance", label: "Finance" },
  { value: "food", label: "Agroalimentaire" },
  { value: "energy", label: "Énergie" },
];

export default function SectorsAdminPage() {
  const [sectors, setSectors] = useState(mockSectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<SectorFormData | null>(null);
  const [formData, setFormData] = useState<SectorFormData>(EMPTY_SECTOR);

  const filteredSectors = sectors.filter((sector) =>
    sector.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (sector?: typeof mockSectors[0]) => {
    if (sector) {
      setEditingSector({
        id: sector.id,
        slug: sector.slug,
        nameFr: sector.nameFr,
        nameEn: sector.nameEn || "",
        descriptionFr: sector.descriptionFr || "",
        descriptionEn: sector.descriptionEn || "",
        investmentThesisFr: sector.investmentThesisFr || "",
        investmentThesisEn: sector.investmentThesisEn || "",
        iconType: sector.iconType,
        referentPartner: sector.referentPartner,
      });
      setFormData({
        id: sector.id,
        slug: sector.slug,
        nameFr: sector.nameFr,
        nameEn: sector.nameEn || "",
        descriptionFr: sector.descriptionFr || "",
        descriptionEn: sector.descriptionEn || "",
        investmentThesisFr: sector.investmentThesisFr || "",
        investmentThesisEn: sector.investmentThesisEn || "",
        iconType: sector.iconType,
        referentPartner: sector.referentPartner,
      });
    } else {
      setEditingSector(null);
      setFormData({ ...EMPTY_SECTOR, id: Date.now().toString() });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSector) {
      setSectors((prev) =>
        prev.map((s) => (s.id === formData.id ? { ...s, ...formData } : s))
      );
    } else {
      setSectors((prev) => [...prev, formData]);
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_SECTOR);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer ce secteur ?")) {
      setSectors((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const getReferentName = (slug: string) => {
    const member = teamMembers.find((m) => m.slug === slug);
    return member?.name || slug;
  };

  return (
    <>
      <Breadcrumb pageName="Sectors" />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-5">
         <div className="relative w-full md:w-1/3">
             <input
                 type="text"
                 placeholder="Search sectors..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full rounded-md border border-stroke bg-transparent py-2.5 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
             />
             <Search className="absolute right-4 top-3 text-bodydark2 w-5 h-5" />
         </div>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button onClick={() => handleOpenDialog()} className="rounded-md bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Sector
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-boxdark border-stroke dark:border-strokedark text-black dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">
                {editingSector ? "Edit Sector" : "New Sector"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
               {/* Form */}
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Name (FR) *</Label>
                      <Input
                        value={formData.nameFr}
                        onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Slug *</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                  </div>
               </div>

                <div className="space-y-2">
                    <Label className="text-black dark:text-white">Description (FR)</Label>
                    <Textarea
                        value={formData.descriptionFr}
                        onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                        rows={3}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                </div>

                {/* Additional fields would go here */}

                <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-strokedark">
                    <button
                        onClick={() => setIsDialogOpen(false)}
                        className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                        disabled={!formData.nameFr}
                    >
                        Save
                    </button>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sector) => (
          <div key={sector.id} className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark hover:border-primary dark:hover:border-primary transition-colors">
             <div className="flex justify-between items-start mb-3">
                 <h4 className="text-lg font-semibold text-black dark:text-white">{sector.nameFr}</h4>
                 <div className="flex gap-1">
                     <button onClick={() => handleOpenDialog(sector)} className="text-bodydark2 hover:text-primary p-1">
                         <Pencil className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDelete(sector.id)} className="text-bodydark2 hover:text-danger p-1">
                         <Trash2 className="w-4 h-4" />
                     </button>
                 </div>
             </div>

             <p className="text-sm text-bodydark2 mb-4 line-clamp-3">
                 {sector.descriptionFr}
             </p>

             <div className="flex items-center gap-2 text-sm text-bodydark2 border-t border-stroke dark:border-strokedark pt-3">
                 <Users className="w-4 h-4 text-primary" />
                 <span>{getReferentName(sector.referentPartner)}</span>
             </div>
          </div>
        ))}
      </div>

      {filteredSectors.length === 0 && (
        <div className="text-center py-12 text-bodydark2">
          No sectors found.
        </div>
      )}
    </>
  );
}
