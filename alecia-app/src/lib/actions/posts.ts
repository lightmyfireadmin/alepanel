"use server";

/**
 * Posts/News Server Actions
 * CRUD operations for news articles and blog posts
 */

import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq, desc, sql, and, inArray, or } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { normalizeSlug } from "@/lib/posts-utils";

const ACTUALITES_PREFIX = "actualites/";

export interface PostFormData {
  slug: string;
  titleFr: string;
  titleEn?: string | null;
  contentFr: string;
  contentEn?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: string | null;
  publishedAt?: Date | null;
  isPublished?: boolean;
}

/**
 * Get all published posts (for public display)
 */
export async function getAllPublishedPosts() {
  try {
    const publishedPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.publishedAt));
    
    return publishedPosts;
  } catch (error) {
    console.error("[Posts] Error fetching published posts:", error);
    return [];
  }
}

/**
 * Get all posts (admin - includes drafts)
 */
export async function getAllPosts() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt));
    
    return allPosts;
  } catch (error) {
    console.error("[Posts] Error fetching posts:", error);
    return [];
  }
}

/**
 * Get a single post by slug
  */
export async function getPostBySlug(slug: string) {
  try {
    const normalized = normalizeSlug(slug);
    const candidates = [normalized, slug];
    if (normalized) {
      candidates.push(`${ACTUALITES_PREFIX}${normalized}`);
    }
    const uniqueCandidates: string[] = [];
    for (const candidate of candidates) {
      if (candidate && !uniqueCandidates.includes(candidate)) {
        uniqueCandidates.push(candidate);
      }
    }

    if (uniqueCandidates.length === 0) {
      return null;
    }

    const results = await db
      .select()
      .from(posts)
      .where(inArray(posts.slug, uniqueCandidates));

    if (results[0]) {
      return results[0];
    }

    // Fallback: case-insensitive match for slugs with unexpected casing
    // Only a few variants are checked; add a lowercase index if dataset grows
    if (uniqueCandidates.length > 0) {
      const lowerCandidates = uniqueCandidates.map((candidate) =>
        candidate.toLowerCase()
      );

      const [ciMatch] = await db
        .select()
        .from(posts)
        .where(or(...lowerCandidates.map((candidate) => sql`lower(${posts.slug}) = ${candidate}`)))
        .limit(1);

      if (ciMatch) {
        return ciMatch;
      }
    }

    return null;
  } catch (error) {
    console.error("[Posts] Error fetching post:", error);
    return null;
  }
}

/**
 * Get a post by ID (admin only)
 */
export async function getPostById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    
    return post || null;
  } catch (error) {
    console.error("[Posts] Error fetching post:", error);
    return null;
  }
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(category: string) {
  try {
    const categoryPosts = await db
      .select()
      .from(posts)
      .where(and(
        eq(posts.category, category),
        eq(posts.isPublished, true)
      ))
      .orderBy(desc(posts.publishedAt));
    
    return categoryPosts;
  } catch (error) {
    console.error("[Posts] Error fetching posts by category:", error);
    return [];
  }
}

/**
 * Create a new post
 */
export async function createPost(
  data: PostFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const [inserted] = await db
      .insert(posts)
      .values(data)
      .returning({ id: posts.id });
    
    revalidatePath("/actualites");
    revalidatePath("/admin/news");
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[Posts] Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: string,
  data: Partial<PostFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db
      .update(posts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(posts.id, id));
    
    revalidatePath("/actualites");
    revalidatePath("/admin/news");
    
    return { success: true };
  } catch (error) {
    console.error("[Posts] Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db.delete(posts).where(eq(posts.id, id));
    
    revalidatePath("/actualites");
    revalidatePath("/admin/news");
    
    return { success: true };
  } catch (error) {
    console.error("[Posts] Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Publish/unpublish a post
 */
export async function togglePostPublish(
  id: string,
  isPublished: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const updateData: { isPublished: boolean; publishedAt?: Date | null; updatedAt: Date } = {
      isPublished,
      updatedAt: new Date(),
    };
    
    // Set publishedAt when publishing for the first time
    if (isPublished) {
      const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
      if (post && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    
    await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, id));
    
    revalidatePath("/actualites");
    revalidatePath("/admin/news");
    
    return { success: true };
  } catch (error) {
    console.error("[Posts] Error toggling publish:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la modification",
    };
  }
}

/**
 * Get post count for dashboard
 */
export async function getPostCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Posts] Error fetching count:", error);
    return 0;
  }
}

/**
 * Get published post count for dashboard
 */
export async function getPublishedPostCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(posts)
      .where(eq(posts.isPublished, true));
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Posts] Error fetching published count:", error);
    return 0;
  }
}

/**
 * Get recent posts for dashboard
 */
export async function getRecentPosts(limit: number = 5) {
  try {
    const recentPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit);
    
    return recentPosts;
  } catch (error) {
    console.error("[Posts] Error fetching recent posts:", error);
    return [];
  }
}
