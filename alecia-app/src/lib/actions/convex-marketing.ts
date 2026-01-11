"use server";

/**
 * Convex Marketing Data Fetchers
 * Fetches marketing content from Convex for public pages
 * Uses direct HTTP calls to Convex API
 */

import type { 
  Transaction, 
  TeamMember, 
  BlogPost, 
  JobOffer, 
  TransactionFilters 
} from "@/lib/convex-client";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://hip-iguana-601.convex.cloud";

/**
 * Generic Convex query helper
 */
async function convexQuery<T>(functionPath: string, args: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${CONVEX_URL}/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path: functionPath,
      args,
    }),
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Convex query failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.value;
}

// ============================================
// TRANSACTIONS
// ============================================

/**
 * Get all transactions (for public display)
 */
export async function getTransactions(filters?: {
  sector?: string;
  year?: number;
  mandateType?: string;
  isCaseStudy?: boolean;
  limit?: number;
}): Promise<Transaction[]> {
  try {
    return await convexQuery<Transaction[]>("marketing:getTransactions", {
      sector: filters?.sector && filters.sector !== 'all' ? filters.sector : undefined,
      year: filters?.year,
      mandateType: filters?.mandateType && filters.mandateType !== 'all' ? filters.mandateType : undefined,
      isCaseStudy: filters?.isCaseStudy,
      limit: filters?.limit,
    });
  } catch (error) {
    console.error("[Convex] Error fetching transactions:", error);
    return [];
  }
}

/**
 * Get a single transaction by slug
 */
export async function getTransactionBySlug(slug: string): Promise<Transaction | null> {
  try {
    return await convexQuery<Transaction | null>("marketing:getTransactionBySlug", { slug });
  } catch (error) {
    console.error("[Convex] Error fetching transaction:", error);
    return null;
  }
}

/**
 * Get filter options for transactions
 */
export async function getTransactionFilters(): Promise<TransactionFilters> {
  try {
    return await convexQuery<TransactionFilters>("marketing:getTransactionFilters", {});
  } catch (error) {
    console.error("[Convex] Error fetching filters:", error);
    return { sectors: [], years: [], mandateTypes: [], regions: [] };
  }
}

// ============================================
// TEAM MEMBERS
// ============================================

/**
 * Get all active team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return await convexQuery<TeamMember[]>("marketing:getTeamMembers", { activeOnly: true });
  } catch (error) {
    console.error("[Convex] Error fetching team:", error);
    return [];
  }
}

/**
 * Get a team member by slug
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    return await convexQuery<TeamMember | null>("marketing:getTeamMemberBySlug", { slug });
  } catch (error) {
    console.error("[Convex] Error fetching team member:", error);
    return null;
  }
}

// ============================================
// BLOG POSTS
// ============================================

/**
 * Get all published blog posts
 */
export async function getBlogPosts(options?: {
  category?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  try {
    return await convexQuery<BlogPost[]>("marketing:getBlogPosts", {
      status: "published",
      category: options?.category,
      limit: options?.limit,
    });
  } catch (error) {
    console.error("[Convex] Error fetching posts:", error);
    return [];
  }
}

/**
 * Get a blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    return await convexQuery<BlogPost | null>("marketing:getBlogPostBySlug", { slug });
  } catch (error) {
    console.error("[Convex] Error fetching post:", error);
    return null;
  }
}

/**
 * Get blog categories
 */
export async function getBlogCategories(): Promise<string[]> {
  try {
    return await convexQuery<string[]>("marketing:getBlogCategories", {});
  } catch (error) {
    console.error("[Convex] Error fetching categories:", error);
    return [];
  }
}

// ============================================
// JOB OFFERS
// ============================================

/**
 * Get published job offers
 */
export async function getJobOffers(): Promise<JobOffer[]> {
  try {
    return await convexQuery<JobOffer[]>("marketing:getJobOffers", { publishedOnly: true });
  } catch (error) {
    console.error("[Convex] Error fetching jobs:", error);
    return [];
  }
}

/**
 * Get a job offer by slug
 */
export async function getJobOfferBySlug(slug: string): Promise<JobOffer | null> {
  try {
    return await convexQuery<JobOffer | null>("marketing:getJobOfferBySlug", { slug });
  } catch (error) {
    console.error("[Convex] Error fetching job:", error);
    return null;
  }
}
