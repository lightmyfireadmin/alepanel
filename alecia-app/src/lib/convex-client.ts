/**
 * Convex HTTP Client for Marketing Website
 * Fetches data from the Convex backend for public marketing pages
 */

import { ConvexHttpClient } from "convex/browser";

// Initialize the Convex client
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://hip-iguana-601.convex.cloud";
export const convex = new ConvexHttpClient(convexUrl);

// Types for marketing data
export interface Transaction {
  _id: string;
  _creationTime: number;
  slug: string;
  clientName: string;
  clientLogo?: string;
  acquirerName?: string;
  acquirerLogo?: string;
  sector: string;
  region?: string;
  year: number;
  mandateType: string;
  description?: string;
  isConfidential: boolean;
  isPriorExperience: boolean;
  context?: string;
  intervention?: string;
  result?: string;
  testimonialText?: string;
  testimonialAuthor?: string;
  roleType?: string;
  dealSize?: string;
  keyMetrics?: Record<string, unknown>;
  // V3 Fields
  isCaseStudy?: boolean;
  displayOrder: number;
}

export interface TeamMember {
  _id: string;
  _creationTime: number;
  slug: string;
  name: string;
  role: string;
  photo?: string;
  bioFr?: string;
  bioEn?: string;
  // V3 Fields
  passion?: string;
  quote?: string;
  linkedinUrl?: string;
  email?: string;
  sectorsExpertise: string[];
  transactionSlugs: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface BlogPost {
  _id: string;
  _creationTime: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  status: "draft" | "published" | "archived";
  publishedAt?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface JobOffer {
  _id: string;
  _creationTime: number;
  slug: string;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements?: string | string[];
  contactEmail?: string;
  pdfUrl?: string;
  isPublished: boolean;
  displayOrder: number;
}



export interface TransactionFilters {
  sectors: string[];
  years: number[];
  mandateTypes: string[];
  regions: string[];
}
