"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Briefcase, MapPin, Calendar, Search, Eye, EyeOff } from "lucide-react";

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

  const activeCount = jobs.filter((j) => j.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Offres d&apos;emploi
          </h1>
          <p className="text-[var(--foreground-muted)]">
            {activeCount} offre{activeCount > 1 ? "s" : ""} active{activeCount > 1 ? "s" : ""} publiée{activeCount > 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-gold">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle offre
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--foreground)]">
                {editingJob ? "Modifier l'offre" : "Nouvelle offre d'emploi"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Titre (FR) *</Label>
                  <Input
                    value={formData.titleFr}
                    onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                    placeholder="Analyste M&A Junior"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (EN)</Label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Junior M&A Analyst"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Type de contrat *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Localisation *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(v) => setFormData({ ...formData, location: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Département</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(v) => setFormData({ ...formData, department: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description du poste (FR) *</Label>
                <Textarea
                  value={formData.descriptionFr}
                  onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                  rows={4}
                  placeholder="Décrivez le poste et ses missions principales..."
                />
              </div>

              <div className="space-y-2">
                <Label>Description du poste (EN)</Label>
                <Textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  rows={4}
                  placeholder="Describe the position and main responsibilities..."
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label>Profil recherché (FR)</Label>
                <Textarea
                  value={formData.requirementsFr}
                  onChange={(e) => setFormData({ ...formData, requirementsFr: e.target.value })}
                  rows={4}
                  placeholder="- Formation requise&#10;- Expérience attendue&#10;- Compétences clés"
                />
                <p className="text-xs text-[var(--foreground-muted)]">
                  Utilisez des tirets (-) pour créer une liste
                </p>
              </div>

              <div className="space-y-2">
                <Label>Profil recherché (EN)</Label>
                <Textarea
                  value={formData.requirementsEn}
                  onChange={(e) => setFormData({ ...formData, requirementsEn: e.target.value })}
                  rows={4}
                  placeholder="- Required education&#10;- Expected experience&#10;- Key skills"
                />
              </div>

              {/* Status & Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date de publication</Label>
                  <Input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Offre active</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Visible sur le site /nous-rejoindre
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="btn-gold" 
                  disabled={!formData.titleFr || !formData.type || !formData.location}
                >
                  {editingJob ? "Mettre à jour" : "Créer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          placeholder="Rechercher une offre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} className={`bg-[var(--card)] border-[var(--border)] ${!job.isActive ? "opacity-60" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-[var(--foreground)]">{job.titleFr}</CardTitle>
                    <Badge variant={job.isActive ? "default" : "secondary"} className={job.isActive ? "bg-green-500/10 text-green-500" : ""}>
                      {job.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>
                    <Badge variant="outline">{job.type}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(job.publishedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(job.id)}
                    className="h-8 w-8 p-0"
                    title={job.isActive ? "Désactiver" : "Activer"}
                  >
                    {job.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(job)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                {job.descriptionFr}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          Aucune offre trouvée
        </div>
      )}
    </div>
  );
}
