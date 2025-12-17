"use client";

import { useState } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { Plus, Pencil, Trash2, Briefcase, MapPin, Calendar, Search, Eye, EyeOff } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobOffer {
  id: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  requirementsFr: string;
  requirementsEn: string;
  location: string;
  type: string;
  department: string;
  isActive: boolean;
  publishedAt: string;
}

const INITIAL_JOBS: JobOffer[] = [
  {
    id: "1",
    titleFr: "Analyste M&A Junior",
    titleEn: "Junior M&A Analyst",
    descriptionFr: "Rejoignez notre équipe dynamique en tant qu'analyste M&A junior. Vous participerez à des opérations de cession et d'acquisition de PME et ETI françaises.",
    descriptionEn: "Join our dynamic team as a junior M&A analyst. You will participate in sell-side and buy-side transactions for French SMEs.",
    requirementsFr: "- Master Grande École de commerce ou d'ingénieur\n- Stage en banque d'affaires ou audit Big4\n- Excel avancé et modélisation financière\n- Anglais courant",
    requirementsEn: "- Master's from top business or engineering school\n- Internship in investment banking or Big4 audit\n- Advanced Excel and financial modeling\n- Fluent English",
    location: "Paris",
    type: "CDI",
    department: "M&A Advisory",
    isActive: true,
    publishedAt: "2024-12-01",
  },
  {
    id: "2",
    titleFr: "Associate M&A",
    titleEn: "M&A Associate",
    descriptionFr: "Nous recherchons un(e) Associate expérimenté(e) pour piloter des mandats de bout en bout et encadrer les analystes junior.",
    descriptionEn: "We are looking for an experienced Associate to lead transactions end-to-end and mentor junior analysts.",
    requirementsFr: "- 3-5 ans d'expérience en M&A mid-cap\n- Track record de deals closés\n- Leadership et autonomie\n- Réseau acquéreurs développé",
    requirementsEn: "- 3-5 years of mid-cap M&A experience\n- Track record of closed deals\n- Leadership and autonomy\n- Established buyer network",
    location: "Lyon",
    type: "CDI",
    department: "M&A Advisory",
    isActive: true,
    publishedAt: "2024-11-15",
  },
];

const EMPTY_JOB: JobOffer = {
  id: "",
  titleFr: "",
  titleEn: "",
  descriptionFr: "",
  descriptionEn: "",
  requirementsFr: "",
  requirementsEn: "",
  location: "",
  type: "CDI",
  department: "",
  isActive: true,
  publishedAt: new Date().toISOString().split("T")[0],
};

const JOB_TYPES = ["CDI", "CDD", "Stage", "Alternance"];
const LOCATIONS = ["Paris", "Lyon", "Nice", "Nantes", "Remote"];
const DEPARTMENTS = ["M&A Advisory", "Levée de fonds", "Direction", "Support"];

export default function CareersAdminPage() {
  const [jobs, setJobs] = useState<JobOffer[]>(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);
  const [formData, setFormData] = useState<JobOffer>(EMPTY_JOB);

  const filteredJobs = jobs.filter((job) =>
    job.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (job?: JobOffer) => {
    if (job) {
      setEditingJob(job);
      setFormData({ ...job });
    } else {
      setEditingJob(null);
      setFormData({ ...EMPTY_JOB, id: Date.now().toString() });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingJob) {
      setJobs((prev) =>
        prev.map((j) => (j.id === formData.id ? { ...formData } : j))
      );
    } else {
      setJobs((prev) => [...prev, formData]);
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_JOB);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cette offre ?")) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isActive: !j.isActive } : j))
    );
  };

  return (
    <>
      <Breadcrumb pageName="Careers" />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-5">
         <div className="relative w-full md:w-1/3">
             <input
                 type="text"
                 placeholder="Search job offers..."
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
                Add Offer
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-boxdark border-stroke dark:border-strokedark text-black dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">
                {editingJob ? "Edit Offer" : "New Offer"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
               {/* Form */}
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Title (FR) *</Label>
                      <Input
                        value={formData.titleFr}
                        onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Department</Label>
                      <Select
                            value={formData.department}
                            onValueChange={(v) => setFormData({ ...formData, department: v })}
                        >
                            <SelectTrigger className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                  </div>
               </div>

                <div className="space-y-2">
                    <Label className="text-black dark:text-white">Description (FR)</Label>
                    <Textarea
                        value={formData.descriptionFr}
                        onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                        rows={4}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
                </div>

                <div className="flex items-center gap-4 py-2">
                    <Label className="text-black dark:text-white">Active</Label>
                    <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                </div>

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
                        disabled={!formData.titleFr}
                    >
                        Save
                    </button>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className={`rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark ${!job.isActive ? "opacity-60" : ""}`}>
             <div className="flex justify-between items-start mb-2">
                 <div>
                     <div className="flex items-center gap-2">
                         <h4 className="text-lg font-semibold text-black dark:text-white">{job.titleFr}</h4>
                         <span className={`inline-flex rounded-full bg-opacity-10 py-0.5 px-2.5 text-xs font-medium ${job.isActive ? "bg-success text-success" : "bg-warning text-warning"}`}>
                             {job.isActive ? "Active" : "Inactive"}
                         </span>
                     </div>
                     <div className="flex items-center gap-4 text-sm text-bodydark2 mt-1">
                         <span className="flex items-center gap-1">
                             <MapPin className="w-3 h-3" />
                             {job.location}
                         </span>
                         <span className="flex items-center gap-1">
                             <Briefcase className="w-3 h-3" />
                             {job.type}
                         </span>
                         <span className="flex items-center gap-1">
                             <Calendar className="w-3 h-3" />
                             {new Date(job.publishedAt).toLocaleDateString("fr-FR")}
                         </span>
                     </div>
                 </div>
                 <div className="flex gap-1">
                     <button onClick={() => toggleActive(job.id)} className="p-1 text-bodydark2 hover:text-primary">
                         {job.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                     </button>
                     <button onClick={() => handleOpenDialog(job)} className="p-1 text-bodydark2 hover:text-primary">
                         <Pencil className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDelete(job.id)} className="p-1 text-bodydark2 hover:text-danger">
                         <Trash2 className="w-4 h-4" />
                     </button>
                 </div>
             </div>

             <p className="text-sm text-bodydark2 mt-3 line-clamp-2">
                 {job.descriptionFr}
             </p>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-bodydark2">
          No offers found.
        </div>
      )}
    </>
  );
}
