import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, User, Building2, FileText, 
  Edit, MoreVertical, History
} from "lucide-react";
import Link from "next/link";
import { getProject } from "@/lib/actions/projects";
import { MermaidTimeline } from "@/components/features/MermaidTimeline";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const result = await getProject(id);

  if (!result.success || !result.data) {
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

  // Cast to include joined relations from server action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = result.data as any;
  
  const daysUntilClose = project.targetCloseDate 
    ? Math.ceil((new Date(project.targetCloseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Generate Mermaid Chart
  const mermaidChart = `
    gantt
        title Timeline - ${project.title}
        dateFormat  YYYY-MM-DD
        section Projet
        Début :active, start, ${project.startDate || (project.createdAt instanceof Date ? project.createdAt.toISOString().split('T')[0] : "2025-01-01")}, 30d
        ${project.events?.map((e: any) => `${e.type} : ${e.date}, 5d`).join('\n') || ""}
        Closing : milestone, ${project.targetCloseDate || "2025-12-24"}, 0d
  `;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/projects"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-[var(--foreground)]">
                {project.title}
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 uppercase">
                {project.status}
              </span>
            </div>
            <p className="text-[var(--foreground-muted)]">
              Projet M&A Alecia
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Modifier
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">
        <div className="space-y-6">
          {/* Timeline Card */}
          <Card className="bg-[var(--card)] border border-[var(--border)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--border)] bg-gray-50 dark:bg-meta-4/10">
              <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Timeline Visuelle (Gantt)
              </CardTitle>
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold uppercase">
                <FileText className="w-3 h-3 mr-2" /> Ajouter Event
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <MermaidTimeline chart={mermaidChart} />
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card className="bg-[var(--card)] border border-[var(--border)]">
            <CardHeader>
              <CardTitle>Infos Dossier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]"><User className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-[var(--foreground-muted)] uppercase font-bold tracking-wider">Client</p>
                            <p className="font-semibold">{project.client?.name || "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]"><Building2 className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-[var(--foreground-muted)] uppercase font-bold tracking-wider">Secteur</p>
                            <p className="font-semibold">{project.client?.sector || "Non spécifié"}</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-meta-4/10 rounded-lg border border-[var(--border)]">
                    <p className="text-sm leading-relaxed">{project.description || "Aucune description fournie pour ce dossier."}</p>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <Card className="bg-[var(--card)] border border-[var(--border)]">
                <CardHeader>
                    <CardTitle className="text-sm uppercase font-bold">Échéances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-bodydark2">Début</span>
                        <span className="text-sm font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-bodydark2">Closing</span>
                        <span className="text-sm font-medium">{project.targetCloseDate ? new Date(project.targetCloseDate).toLocaleDateString() : "À définir"}</span>
                    </div>
                    {daysUntilClose !== null && (
                        <div className={`mt-4 p-3 rounded-lg text-center font-bold text-lg border ${daysUntilClose > 0 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>
                            {daysUntilClose} jours restants
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}