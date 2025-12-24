import { getResearchHistory } from "@/lib/actions/research";
import { ResearchDialog } from "@/components/research/ResearchDialog";
import { CrawlerForm } from "@/components/research/CrawlerForm";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Clock, CheckCircle2, XCircle, Loader2, Search, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ResearchPage() {
  const result = await getResearchHistory();
  const history = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Intelligence & Veille</h1>
        <p className="text-[var(--foreground-muted)]">Outils d&apos;analyse de marché et de collecte de données automatisée.</p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>AI Reports</span>
          </TabsTrigger>
          <TabsTrigger value="crawler" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Web Crawler</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Études de marché AI</h2>
                <ResearchDialog />
            </div>
            
            <div className="grid gap-4">
                {history.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl border-stroke dark:border-strokedark opacity-50">
                        <Search className="w-12 h-12 mx-auto mb-4" />
                        <p>Aucune recherche effectuée.</p>
                    </div>
                ) : (
                    history.map((task) => (
                        <Link key={task.id} href={`/admin/research/${task.id}`}>
                            <Card className="hover:bg-[var(--background-secondary)] transition-colors cursor-pointer border border-[var(--border)]">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 p-2 rounded-lg ${
                                            task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            task.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                            {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> :
                                            task.status === 'failed' ? <XCircle className="w-5 h-5" /> :
                                            <Loader2 className="w-5 h-5 animate-spin" />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[var(--foreground)] line-clamp-1">{task.query}</h3>
                                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] mt-1">
                                                <Clock className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(task.createdAt!), { addSuffix: true, locale: fr })}
                                                <span>•</span>
                                                <span>Par {task.createdBy}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-xs font-medium uppercase tracking-wider px-2 py-1 rounded bg-[var(--background)] border border-[var(--border)]">
                                        {task.status}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </TabsContent>

        <TabsContent value="crawler">
            <Card className="border border-[var(--border)] bg-[var(--card)]">
                <CardContent className="p-6">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold">Collecte de données (Scraping)</h2>
                            <p className="text-sm text-[var(--foreground-muted)]">
                                Entrez un domaine pour crawler l&apos;intégralité du site et extraire le contenu en Markdown pour analyse.
                            </p>
                        </div>
                        <CrawlerForm />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
