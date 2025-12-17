import { getAllPosts } from "@/lib/actions/posts";
import NewsClient from "./news-client";

export const dynamic = "force-dynamic";

export default async function NewsAdminPage() {
  const posts = await getAllPosts();

  const mappedPosts = posts.map(post => ({
    id: post.id,
    titleFr: post.titleFr,
    titleEn: post.titleEn,
    slug: post.slug,
    excerpt: post.excerpt,
    contentFr: post.contentFr,
    contentEn: post.contentEn,
    category: post.category,
    coverImage: post.coverImage,
    isPublished: post.isPublished || false,
    publishedAt: post.publishedAt,
  }));

  return <NewsClient initialArticles={mappedPosts} />;
}
