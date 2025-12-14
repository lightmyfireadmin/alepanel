import { Navbar, Footer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllPublishedPosts } from "@/lib/actions/posts";
import { normalizeCoverImage, normalizeSlug } from "@/lib/posts-utils";

export const metadata: Metadata = {
  title: "Actualités | Communiqués et articles",
  description:
    "Suivez les actualités alecia. Communiqués de presse, articles et revues de presse sur le M&A pour PME et ETI.",
};

export default async function ActualitesPage() {
  const posts = await getAllPublishedPosts();
  
  const postsWithData = posts.map(post => {
    return {
      id: post.id,
      slug: normalizeSlug(post.slug),
      title: post.titleFr,
      excerpt: post.excerpt || "",
      coverImage: normalizeCoverImage(post.coverImage),
      category: post.category || "Article",
      publishedAt: post.publishedAt?.toISOString().split('T')[0] || "",
    };
  });
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[var(--accent)] font-medium tracking-widest uppercase mb-4 text-sm">
              Blog
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Les actualités alecia
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Communiqués, articles et revues de presse
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            {postsWithData.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsWithData.map((post) => (
                  <Link key={post.id} href={`/actualites/${post.slug}`}>
                    <Card className="card-hover h-full bg-[var(--card)] border-[var(--border)] overflow-hidden group">
                      {/* Cover Image */}
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <Badge
                          variant="outline"
                          className="w-fit bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30"
                        >
                          {post.category}
                        </Badge>
                        <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-lg mt-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[var(--foreground-muted)] text-sm line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-[var(--accent)] text-sm">
                          Lire l&apos;article
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[var(--foreground-muted)] text-lg">
                  Aucune actualité pour le moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-4">
              Restez informés
            </h2>
            <p className="text-[var(--foreground-muted)] mb-6">
              Inscrivez-vous à notre newsletter pour recevoir nos actualités au fil de l&apos;eau
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="votre@email.fr"
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)]"
              />
              <button type="submit" className="btn-gold px-6 py-3 rounded-lg font-semibold">
                Souscrire
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
