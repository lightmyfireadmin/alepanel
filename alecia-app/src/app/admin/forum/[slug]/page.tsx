import { getThreadsByCategory } from "@/lib/actions/forum";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Pin, Lock } from "lucide-react";
import { NewThreadDialog } from "@/components/forum/NewThreadDialog";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const result = await getThreadsByCategory(slug);

  if (!result.success || !result.data) {
    return <div>Category not found or error loading threads.</div>;
  }

  const { category, threads } = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/forum"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    {category.name}
                    {category.isPrivate && <Lock className="w-4 h-4 text-muted-foreground" />}
                </h1>
                <p className="text-muted-foreground">{category.description}</p>
            </div>
        </div>
        <NewThreadDialog categorySlug={slug} categoryName={category.name} />
      </div>

      {/* Threads List */}
      <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
        {threads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aucune discussion pour le moment.</p>
                <p className="text-sm">Soyez le premier à lancer un sujet !</p>
            </div>
        ) : (
            <div className="divide-y divide-[var(--border)]">
                {threads.map((thread) => (
                    <Link 
                        key={thread.id} 
                        href={`/admin/forum/thread/${thread.id}`}
                        className="flex items-start gap-4 p-4 hover:bg-[var(--background-secondary)] transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {thread.isPinned && <Pin className="w-3 h-3 text-[var(--accent)] fill-current" />}
                                {thread.isLocked && <Lock className="w-3 h-3 text-red-400" />}
                                <h3 className={`font-medium text-base truncate ${thread.isPinned ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                                    {thread.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                                <span>Par {thread.authorName}</span>
                                <span>•</span>
                                <span>{formatDistanceToNow(new Date(thread.lastPostAt!), { addSuffix: true, locale: fr })}</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-xs text-[var(--foreground-muted)] shrink-0">
                            <div className="text-center w-16 hidden sm:block">
                                <span className="block font-semibold text-[var(--foreground)]">{thread.replyCount}</span>
                                <span>réponses</span>
                            </div>
                            <div className="text-center w-16 hidden sm:block">
                                <span className="block font-semibold text-[var(--foreground)]">{thread.viewCount}</span>
                                <span>vues</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
