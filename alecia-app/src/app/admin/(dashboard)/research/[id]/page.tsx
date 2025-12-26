import { getResearchTask } from "@/lib/actions/research";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ResearchActions } from "@/components/research/ResearchActions";

export default async function ResearchResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const result = await getResearchTask(id);

  if (!result.success || !result.data) {
    return <div>Recherche introuvable.</div>;
  }

  const task = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/research"><ArrowLeft className="w-5 h-5" /></Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-[var(--foreground)] line-clamp-1">{task.query}</h1>
                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mt-1">
                        <Clock className="w-3 h-3" />
                        <span>Lancé {formatDistanceToNow(new Date(task.createdAt!), { addSuffix: true, locale: fr })}</span>
                    </div>
                </div>
            </div>
            <ResearchActions taskId={task.id} isCompleted={task.status === 'completed'} />
        </div>
        <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                task.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                'bg-blue-500/10 text-blue-500 border-blue-500/20'
            }`}>
                {task.status}
            </span>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 md:p-8 shadow-sm min-h-[400px]">
        {task.status === 'processing' ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--accent)]" />
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-medium">Analyse en cours...</h3>
                    <p className="text-[var(--foreground-muted)] max-w-md">
                        Nos agents IA (Groq & Mistral) analysent le marché. 
                        Cela peut prendre jusqu&apos;à 30 secondes.
                    </p>
                    {task.resultSummary && (
                        <div className="mt-4 p-4 bg-[var(--background-secondary)] rounded-lg text-sm font-mono text-left max-w-lg mx-auto whitespace-pre-wrap opacity-80">
                            {task.resultSummary}
                        </div>
                    )}
                </div>
            </div>
        ) : task.resultSummary ? (
            <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{task.resultSummary}</ReactMarkdown>
            </article>
        ) : (
            <div className="text-center py-20">
                <p>Aucun résultat disponible.</p>
            </div>
        )}
      </div>
    </div>
  );
}
