"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { Plus, Pencil, Trash2, Briefcase, MapPin, Calendar, Search, Eye, EyeOff } from "lucide-react";
import { getAllJobOffers, createJobOffer, updateJobOffer, deleteJobOffer, toggleJobOfferPublished } from "@/lib/actions/jobs";
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
  slug: string;
  title: string;
  description: string | null;
  requirements: string[] | null;
  location: string;
  type: string;
  contactEmail: string | null;
  pdfUrl: string | null;
  isPublished: boolean | null;
  displayOrder: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const EMPTY_JOB = {
  title: "",
  description: "",
  requirements: [] as string[],
  location: "Paris",
  type: "CDI",
  contactEmail: "recrutement@alecia.fr",
  pdfUrl: "",
  isPublished: true,
  displayOrder: 0,
};

const JOB_TYPES = ["CDI", "CDD", "Stage", "Alternance", "Stage/alternance"];
const LOCATIONS = ["Paris", "Lyon", "Nice", "Nantes", "Remote"];

export default function CareersAdminPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);
  const [formData, setFormData] = useState(EMPTY_JOB);
  const [loading, setLoading] = useState(true);
  const [requirementsText, setRequirementsText] = useState("");

  // Fetch job offers on mount
  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      const offers = await getAllJobOffers();
      setJobs(offers);
      setLoading(false);
    }
    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (job?: JobOffer) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        description: job.description || "",
        requirements: job.requirements || [],
        location: job.location,
        type: job.type,
        contactEmail: job.contactEmail || "recrutement@alecia.fr",
        pdfUrl: job.pdfUrl || "",
        isPublished: job.isPublished !== false,
        displayOrder: job.displayOrder || 0,
      });
      setRequirementsText((job.requirements || []).join("\n"));
    } else {
      setEditingJob(null);
      setFormData(EMPTY_JOB);
      setRequirementsText("");
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) return;

    // Parse requirements from text
    const requirements = requirementsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const data = {
      ...formData,
      requirements,
    };

    if (editingJob) {
      const result = await updateJobOffer(editingJob.id, data);
      if (result.success) {
        // Refresh the list
        const offers = await getAllJobOffers();
        setJobs(offers);
      }
    } else {
      const result = await createJobOffer(data);
      if (result.success) {
        // Refresh the list
        const offers = await getAllJobOffers();
        setJobs(offers);
      }
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_JOB);
    setRequirementsText("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette offre ?")) {
      const result = await deleteJobOffer(id);
      if (result.success) {
        // Refresh the list
        const offers = await getAllJobOffers();
        setJobs(offers);
      }
    }
  };

  const toggleActive = async (id: string) => {
    const result = await toggleJobOfferPublished(id);
    if (result.success) {
      // Refresh the list
      const offers = await getAllJobOffers();
      setJobs(offers);
    }
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
                      <Label className="text-black dark:text-white">Title *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        placeholder="e.g., Analyste M&A Junior"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Type *</Label>
                      <Select
                            value={formData.type}
                            onValueChange={(v) => setFormData({ ...formData, type: v })}
                        >
                            <SelectTrigger className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white">
                            <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                            {JOB_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                  </div>
               </div>

               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Location *</Label>
                      <Select
                            value={formData.location}
                            onValueChange={(v) => setFormData({ ...formData, location: v })}
                        >
                            <SelectTrigger className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white">
                            <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                            {LOCATIONS.map((loc) => (
                                <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                  </div>
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Contact Email</Label>
                      <Input
                        value={formData.contactEmail || ""}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        placeholder="recrutement@alecia.fr"
                        type="email"
                      />
                  </div>
               </div>

                <div className="space-y-2">
                    <Label className="text-black dark:text-white">Description</Label>
                    <Textarea
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        placeholder="Detailed job description..."
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-black dark:text-white">Requirements (one per line)</Label>
                    <Textarea
                        value={requirementsText}
                        onChange={(e) => setRequirementsText(e.target.value)}
                        rows={6}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        placeholder="Master Grande École de commerce ou d'ingénieur&#10;Stage en banque d'affaires&#10;Excel avancé"
                    />
                </div>

                <div className="flex items-center gap-4 py-2">
                    <Label className="text-black dark:text-white">Published</Label>
                    <Switch
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
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
                        disabled={!formData.title}
                    >
                        Save
                    </button>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12 text-bodydark2">
          Loading job offers...
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className={`rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark ${job.isPublished === false ? "opacity-60" : ""}`}>
                 <div className="flex justify-between items-start mb-2">
                     <div>
                         <div className="flex items-center gap-2">
                             <h4 className="text-lg font-semibold text-black dark:text-white">{job.title}</h4>
                             <span className={`inline-flex rounded-full bg-opacity-10 py-0.5 px-2.5 text-xs font-medium ${job.isPublished !== false ? "bg-success text-success" : "bg-warning text-warning"}`}>
                                 {job.isPublished !== false ? "Published" : "Draft"}
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
                                 {job.createdAt ? new Date(job.createdAt).toLocaleDateString("fr-FR") : "N/A"}
                             </span>
                         </div>
                     </div>
                     <div className="flex gap-1">
                         <button onClick={() => toggleActive(job.id)} className="p-1 text-bodydark2 hover:text-primary">
                             {job.isPublished !== false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                     {job.description || "No description"}
                 </p>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && !loading && (
            <div className="text-center py-12 text-bodydark2">
              No offers found.
            </div>
          )}
        </>
      )}
    </>
  );
}
