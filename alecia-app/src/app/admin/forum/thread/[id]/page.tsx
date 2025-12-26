import { getThreadWithPosts } from "@/lib/actions/forum";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Lock, Pin } from "lucide-react";
import { ThreadReply } from "@/components/forum/ThreadReply";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const result = await getThreadWithPosts(id);

  if (!result.success || !result.data) {
    return <div>Thread not found.</div>;
  }

  const { thread, posts } = result.data;

  return (
    <div className="space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-4">
            <Link href="/admin/forum" className="hover:underline">Forum</Link>
            <span>/</span>
            <Link href={`/admin/forum/${thread.categorySlug}`} className="hover:underline">{thread.categoryName}</Link>
            <span>/</span>
            <span className="text-[var(--foreground)] truncate max-w-[200px]">{thread.title}</span>
        </div>

        {/* Thread Header */}
        <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" asChild className="mt-1">
                <Link href={`/admin/forum/${thread.categorySlug}`}><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
                    {thread.title}
                    {thread.isPinned && <Pin className="w-4 h-4 text-[var(--accent)] fill-current" />}
                    {thread.isLocked && <Lock className="w-4 h-4 text-red-400" />}
                </h1>
                <p className="text-[var(--foreground-muted)] text-sm">
                    Démarré le {format(new Date(thread.createdAt!), "d MMMM yyyy à HH:mm", { locale: fr })}
                </p>
            </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
            {posts.map((post, index) => (
                <div key={post.id} className="flex gap-4 group">
                    <div className="shrink-0 pt-1">
                        <Avatar className="w-10 h-10 border border-[var(--border)]">
                            <AvatarFallback className="bg-[var(--background-secondary)] text-[var(--foreground)]">
                                {post.authorName?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 bg-[var(--card)] rounded-lg border border-[var(--border)] p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[var(--foreground)]">{post.authorName}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--border)]">
                                    {post.authorRole === 'sudo' ? 'Admin Système' : 'Associé'}
                                </span>
                            </div>
                            <span className="text-xs text-[var(--foreground-muted)]">
                                {format(new Date(post.createdAt!), "d MMM à HH:mm", { locale: fr })}
                            </span>
                        </div>
                        <div 
                            className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            ))}
        </div>

        {/* Reply Box */}
        <div className="ml-14 mt-8">
            {thread.isLocked ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Cette discussion est verrouillée. Vous ne pouvez pas répondre.
                </div>
            ) : (
                <ThreadReply threadId={thread.id} />
            )}
        </div>
    </div>
  );
}
