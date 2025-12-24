"use server";

import { db } from "@/lib/db";
import { forumCategories, forumThreads, forumPosts, users } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// CATEGORIES
export async function getForumCategories() {
  try {
    const categories = await db.select().from(forumCategories).orderBy(forumCategories.order);
    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch forum categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// THREADS
export async function getThreadsByCategory(categorySlug: string) {
  try {
    // 1. Get Category ID
    const category = await db.query.forumCategories.findFirst({
        where: eq(forumCategories.slug, categorySlug)
    });

    if (!category) return { success: false, error: "Category not found" };

    // 2. Get Threads with Author info
    const threads = await db.select({
        id: forumThreads.id,
        title: forumThreads.title,
        isPinned: forumThreads.isPinned,
        isLocked: forumThreads.isLocked,
        lastPostAt: forumThreads.lastPostAt,
        replyCount: forumThreads.replyCount,
        viewCount: forumThreads.viewCount,
        createdAt: forumThreads.createdAt,
        authorName: users.name,
        authorEmail: users.email // For avatar fallback
    })
    .from(forumThreads)
    .leftJoin(users, eq(forumThreads.authorId, users.id))
    .where(eq(forumThreads.categoryId, category.id))
    .orderBy(desc(forumThreads.isPinned), desc(forumThreads.lastPostAt));

    return { success: true, data: { category, threads } };
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    return { success: false, error: "Failed to fetch threads" };
  }
}

export async function createThread(categorySlug: string, title: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const category = await db.query.forumCategories.findFirst({
            where: eq(forumCategories.slug, categorySlug)
        });
    
        if (!category) return { success: false, error: "Category not found" };

        // Transaction: Create Thread -> Create First Post
        const [newThread] = await db.insert(forumThreads).values({
            categoryId: category.id,
            authorId: session.user.id,
            title,
        }).returning();

        await db.insert(forumPosts).values({
            threadId: newThread.id,
            authorId: session.user.id,
            content
        });

        revalidatePath(`/admin/forum/${categorySlug}`);
        return { success: true, threadId: newThread.id };

    } catch (error) {
        console.error("Failed to create thread:", error);
        return { success: false, error: "Failed to create thread" };
    }
}

// POSTS
export async function getThreadWithPosts(threadId: string) {
    try {
        // 1. Get Thread details
        const thread = await db.select({
            id: forumThreads.id,
            title: forumThreads.title,
            isPinned: forumThreads.isPinned,
            isLocked: forumThreads.isLocked,
            createdAt: forumThreads.createdAt,
            categoryId: forumThreads.categoryId,
            categoryName: forumCategories.name,
            categorySlug: forumCategories.slug
        })
        .from(forumThreads)
        .leftJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
        .where(eq(forumThreads.id, threadId))
        .then(res => res[0]);

        if (!thread) return { success: false, error: "Thread not found" };

        // 2. Increment View Count (Fire & Forget)
        db.update(forumThreads)
          .set({ viewCount: sql`${forumThreads.viewCount} + 1` })
          .where(eq(forumThreads.id, threadId))
          .execute();

        // 3. Get Posts
        const threadPosts = await db.select({
            id: forumPosts.id,
            content: forumPosts.content,
            createdAt: forumPosts.createdAt,
            authorName: users.name,
            authorRole: users.role,
            authorEmail: users.email
        })
        .from(forumPosts)
        .leftJoin(users, eq(forumPosts.authorId, users.id))
        .where(eq(forumPosts.threadId, threadId))
        .orderBy(forumPosts.createdAt); // Oldest first (Chronological)

        return { success: true, data: { thread, posts: threadPosts } };

    } catch (error) {
        console.error("Failed to fetch thread posts:", error);
        return { success: false, error: "Failed to fetch thread" };
    }
}

export async function createPost(threadId: string, content: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        await db.insert(forumPosts).values({
            threadId,
            authorId: session.user.id,
            content
        });

        // Update thread stats
        await db.update(forumThreads)
            .set({ 
                lastPostAt: new Date(),
                replyCount: sql`${forumThreads.replyCount} + 1`
            })
            .where(eq(forumThreads.id, threadId));

        revalidatePath(`/admin/forum/thread/${threadId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Failed to create post" };
    }
}

// DASHBOARD
export async function getRecentThreads(limit = 5) {
    try {
        const threads = await db.select({
            id: forumThreads.id,
            title: forumThreads.title,
            lastPostAt: forumThreads.lastPostAt,
            authorName: users.name,
            categorySlug: forumCategories.slug,
            categoryName: forumCategories.name
        })
        .from(forumThreads)
        .leftJoin(users, eq(forumThreads.authorId, users.id))
        .leftJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
        .orderBy(desc(forumThreads.lastPostAt))
        .limit(limit);

        return { success: true, data: threads };
    } catch (error) {
        console.error("Failed to fetch recent threads:", error);
        return { success: false, error: "Failed to fetch recent threads" };
    }
}

export async function searchForum(query: string) {
    try {
        const results = await db.select({
            id: forumThreads.id,
            title: forumThreads.title,
            categoryName: forumCategories.name,
            authorName: users.name,
            createdAt: forumThreads.createdAt
        })
        .from(forumThreads)
        .leftJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
        .leftJoin(users, eq(forumThreads.authorId, users.id))
        .where(
            sql`(${forumThreads.title} ILIKE ${`%${query}%`})`
        )
        .limit(20);

        return { success: true, data: results };
    } catch (error) {
        console.error("Forum search failed:", error);
        return { success: false, error: "Search failed" };
    }
}
