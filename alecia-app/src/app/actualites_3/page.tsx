import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/actions/convex-marketing";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Actualités | Alecia",
  description: "Dernières nouvelles, communiqués de presse et événements.",
};

export default async function ActualitesPage() {
  const posts = await getBlogPosts();

  // Sort by date desc
  const sortedPosts = posts.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
              Actualités
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                <article key={post._id} className="flex flex-col md:flex-row gap-8 items-start bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)] transition-all hover:shadow-lg group">
                    {/* Date Column */}
                    <div className="md:w-32 shrink-0 flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-1 text-[var(--foreground-muted)]">
                        <Calendar className="w-5 h-5 md:hidden" />
                        <span className="font-bold text-2xl md:text-4xl text-[var(--accent)]">
                            {new Date(post.publishedAt || Date.now()).getDate()}
                        </span>
                        <span className="uppercase text-sm font-medium tracking-wider">
                            {new Date(post.publishedAt || Date.now()).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                        <div className="flex gap-2 mb-1">
                            {post.category && (
                                <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                            )}
                        </div>
                        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold group-hover:text-[var(--accent)] transition-colors">
                            {post.title}
                        </h2>
                        <p className="text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                            {post.excerpt}
                        </p>
                        <div className="pt-2">
                            <span className="inline-flex items-center text-sm font-semibold text-[var(--foreground)] group-hover:underline">
                                Lire le communiqué <ArrowRight className="ml-2 w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </article>
                ))
            ) : (
                <div className="text-center py-12 text-[var(--foreground-muted)]">
                    Aucune actualité pour le moment.
                </div>
            )}
          </div>
        </section>
      </main>

      <Footer_3 />
    </>
  );
}
