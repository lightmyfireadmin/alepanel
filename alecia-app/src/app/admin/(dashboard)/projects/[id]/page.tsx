"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Calendar, User, Building2, FileText, 
  Edit, MoreVertical, Clock
} from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import { ProjectTimeline } from "@/components/features";
import { DealMatchmaker, PdfTeaser } from "@/components/admin";
import { PROJECT_STATUSES } from "@/lib/db/schema";

// Mock project data
const MOCK_PROJECTS: Record<string, {
  id: string;
  title: string;
  status: string;
  description: string;
  clientName: string;
  clientCompany: string;
  startDate: string;
  targetCloseDate: string;
  sector: string;
}> = {
  "1": {
    id: "1",
    title: "Cession TechCorp",
    status: "Lead",
    description: "Cession majoritaire d'une entreprise de logiciels B2B spécialisée dans les solutions de gestion pour PME. Équipe de 45 collaborateurs avec une base clients récurrente.",
    clientName: "Jean Dupont",
    clientCompany: "TechCorp SAS",
    startDate: "2025-01-15",
    targetCloseDate: "2025-06-30",
    sector: "Technologies & logiciels",
  },
  "2": {
    id: "2",
    title: "Acquisition MediSanté",
    status: "Due Diligence",
    description: "Accompagnement d'un groupe de cliniques dans l'acquisition d'une entreprise de dispositifs médicaux. Due diligence financière et juridique en cours.",
    clientName: "Marie Laurent",
    clientCompany: "MediSanté",
    startDate: "2024-11-01",
    targetCloseDate: "2025-02-28",
    sector: "Santé",
  },
  "3": {
    id: "3",
    title: "LBO Industries Nord",
    status: "Due Diligence",
    description: "Montage d'un LBO pour une PME industrielle du Nord. Recherche de financement mezzanine et structuration du deal.",
    clientName: "Pierre Martin",
    clientCompany: "Industries Nord",
    startDate: "2024-10-15",
    targetCloseDate: "2025-04-01",
    sector: "Industries",
  },
  "4": {
    id: "4",
    title: "Levée de fonds StartupAI",
    status: "Closing",
    description: "Levée de fonds Série A pour une startup spécialisée dans l'intelligence artificielle. Term sheet signé, closing en cours.",
    clientName: "Sophie Bernard",
    clientCompany: "StartupAI",
    startDate: "2024-09-01",
    targetCloseDate: "2025-01-31",
    sector: "Technologies & logiciels",
  },
};

const statusColors: Record<string, string> = {
  Lead: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  "Due Diligence": "bg-amber-500/10 border-amber-500/30 text-amber-400",
  Closing: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  Closed: "bg-gray-500/10 border-gray-500/30 text-gray-400",
};

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const project = MOCK_PROJECTS[id];

  // Calculate days until close - must be called unconditionally
  const daysUntilClose = useMemo(() => {
    if (!project) return 0;
    const now = new Date();
    const closeDate = new Date(project.targetCloseDate);
    return Math.ceil((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }, [project]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">
          Projet non trouvé
        </h2>
        <Link href="/admin/projects" className="text-[var(--accent)] hover:underline">
          Retour aux projets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href="/admin/projects"
            className="p-2 rounded-lg hover:bg-[var(--background-tertiary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
                {project.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[project.status]}`}>
                {project.status}
              </span>
            </div>
            <p className="text-[var(--foreground-muted)]">
              {project.sector}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <PdfTeaser 
            projectId={project.id}
            projectTitle={project.title}
            sector={project.sector}
            description={project.description}
          />
          <Button variant="outline" className="gap-2 border-[var(--border)]">
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button variant="ghost" className="p-2">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        {/* Left Column - Project Details & Timeline */}
        <div className="space-y-6">
          {/* Project Info Card */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader>
              <CardTitle className="text-[var(--foreground)]">Détails du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[var(--foreground-muted)] leading-relaxed">
                {project.description}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Client</p>
                    <p className="font-medium text-[var(--foreground)]">{project.clientName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Entreprise</p>
                    <p className="font-medium text-[var(--foreground)]">{project.clientCompany}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Début</p>
                    <p className="font-medium text-[var(--foreground)]">
                      {new Date(project.startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--foreground-muted)]">Closing prévu</p>
                    <p className="font-medium text-[var(--foreground)]">
                      {new Date(project.targetCloseDate).toLocaleDateString("fr-FR")}
                      <span className={`ml-2 text-sm ${daysUntilClose > 30 ? "text-emerald-400" : daysUntilClose > 7 ? "text-amber-400" : "text-red-400"}`}>
                        ({daysUntilClose}j)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="pt-4 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--foreground-muted)] mb-3">Changer le statut</p>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_STATUSES.map((status) => (
                    <button
                      key={status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        status === project.status
                          ? statusColors[status]
                          : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card className="bg-[var(--card)] border-[var(--border)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[var(--foreground)]">Timeline</CardTitle>
              <Button variant="outline" size="sm" className="gap-2 border-[var(--border)]">
                <FileText className="w-4 h-4" />
                Ajouter un événement
              </Button>
            </CardHeader>
            <CardContent>
              <ProjectTimeline events={[]} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Deal Matchmaker */}
        <div className="space-y-6">
          <DealMatchmaker 
            dealTags={[project.sector]} 
            className="sticky top-6"
          />
        </div>
      </div>
    </div>
  );
}
