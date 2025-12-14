import { Navbar, Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import { getPostBySlug } from "@/lib/actions/posts";
import type { Metadata } from "next";
import { normalizeCoverImage, normalizeSlug } from "@/lib/posts-utils";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(normalizeSlug(params.slug));

  if (!post) {
    return {
      title: "Article non trouvé | Alecia",
    };
  }

  return {
    title: `${post.titleFr} | Alecia`,
    description: post.excerpt || post.contentFr.substring(0, 160),
    openGraph: {
      images: post.coverImage ? [normalizeCoverImage(post.coverImage)] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(normalizeSlug(params.slug));

  if (!post || !post.isPublished) {
    notFound();
  }
  const coverImage = normalizeCoverImage(post.coverImage);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24 pb-24">
        {/* Hero Section */}
        <section className="relative h-[400px] w-full mb-12">
          <div className="absolute inset-0 bg-black/40 z-10" />
          {coverImage && (
            <Image
              src={coverImage}
              alt={post.titleFr}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full text-center text-white">
              <Badge 
                className="mb-6 bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-none px-4 py-1 text-sm uppercase tracking-wider"
              >
                {post.category || "Article"}
              </Badge>
              <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {post.titleFr}
              </h1>
              <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-200">
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.publishedAt.toISOString()}>
                      {new Intl.DateTimeFormat("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(post.publishedAt)}
                    </time>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Temps de lecture : 5 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-6">
          <Link 
            href="/actualites"
            className="inline-flex items-center gap-2 text-[var(--foreground-muted)] hover:text-[var(--accent)] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour aux actualités
          </Link>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="text-xl md:text-2xl text-[var(--foreground-muted)] font-medium leading-relaxed mb-12 border-l-4 border-[var(--accent)] pl-6 italic">
              {post.excerpt}
            </div>
            
            <div className="whitespace-pre-wrap font-sans text-[var(--foreground)] leading-relaxed space-y-6">
              {post.contentFr.split('\n\n').map((paragraph, index) => {
                // Header detection for basic markdown-like support
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold font-[family-name:var(--font-playfair)] mt-12 mb-6 text-[var(--foreground)]">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-8 mb-4 text-[var(--foreground)]">{paragraph.replace('### ', '')}</h3>;
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
