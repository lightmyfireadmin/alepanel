"use server";

/**
 * CRM Server Actions
 * CRUD operations for contacts and companies
 */

import { db } from "@/lib/db";
import { contacts, companies } from "@/lib/db/schema";
import { eq, desc, sql, like, or, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface ContactFormData {
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  companyId?: string | null;
  notes?: string | null;
  tags?: string[] | null;
}

export interface CompanyFormData {
  name: string;
  siren?: string | null;
  address?: string | null;
  sector?: string | null;
  financialData?: {
    revenue?: number;
    ebitda?: number;
    employees?: number;
    year?: number;
  } | null;
  logoUrl?: string | null;
  isEnriched?: boolean;
}

// ============================================================================
// CONTACTS
// ============================================================================

/**
 * Get all contacts (admin only)
 */
export async function getAllContacts() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const allContacts = await db
      .select({
        contact: contacts,
        companyName: companies.name,
      })
      .from(contacts)
      .leftJoin(companies, eq(companies.id, contacts.companyId))
      .orderBy(contacts.name);
    
    return allContacts.map(row => ({
      ...row.contact,
      companyName: row.companyName,
    }));
  } catch (error) {
    console.error("[CRM] Error fetching contacts:", error);
    return [];
  }
}

/**
 * Get contacts by tag
 */
export async function getContactsByTag(tag: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    // Using SQL template for PostgreSQL array contains check
    // This checks if the tag exists in the tags array
    const taggedContacts = await db
      .select({
        contact: contacts,
        companyName: companies.name,
      })
      .from(contacts)
      .leftJoin(companies, eq(companies.id, contacts.companyId))
      .where(sql`${tag}::text = ANY(${contacts.tags})`)
      .orderBy(contacts.name);
    
    return taggedContacts.map(row => ({
      ...row.contact,
      companyName: row.companyName,
    }));
  } catch (error) {
    console.error("[CRM] Error fetching contacts by tag:", error);
    return [];
  }
}

/**
 * Search contacts by name, email, or company
 */
export async function searchContacts(query: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const searchPattern = `%${query}%`;
    
    const results = await db
      .select({
        contact: contacts,
        companyName: companies.name,
      })
      .from(contacts)
      .leftJoin(companies, eq(companies.id, contacts.companyId))
      .where(
        or(
          like(contacts.name, searchPattern),
          like(contacts.email, searchPattern),
          like(companies.name, searchPattern)
        )
      )
      .orderBy(contacts.name)
      .limit(50);
    
    return results.map(row => ({
      ...row.contact,
      companyName: row.companyName,
    }));
  } catch (error) {
    console.error("[CRM] Error searching contacts:", error);
    return [];
  }
}

/**
 * Get a single contact by ID
 */
export async function getContactById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);
    
    return contact || null;
  } catch (error) {
    console.error("[CRM] Error fetching contact:", error);
    return null;
  }
}

/**
 * Create a new contact
 */
export async function createContact(
  data: ContactFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const [inserted] = await db
      .insert(contacts)
      .values(data)
      .returning({ id: contacts.id });
    
    revalidatePath("/admin/crm");
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[CRM] Error creating contact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update an existing contact
 */
export async function updateContact(
  id: string,
  data: Partial<ContactFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db
      .update(contacts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(contacts.id, id));
    
    revalidatePath("/admin/crm");
    
    return { success: true };
  } catch (error) {
    console.error("[CRM] Error updating contact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db.delete(contacts).where(eq(contacts.id, id));
    
    revalidatePath("/admin/crm");
    
    return { success: true };
  } catch (error) {
    console.error("[CRM] Error deleting contact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

// ============================================================================
// COMPANIES
// ============================================================================

/**
 * Get all companies (admin only)
 */
export async function getAllCompanies() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const allCompanies = await db
      .select()
      .from(companies)
      .orderBy(companies.name);
    
    return allCompanies;
  } catch (error) {
    console.error("[CRM] Error fetching companies:", error);
    return [];
  }
}

/**
 * Search companies by name or SIREN
 */
export async function searchCompanies(query: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const searchPattern = `%${query}%`;
    
    const results = await db
      .select()
      .from(companies)
      .where(
        or(
          like(companies.name, searchPattern),
          like(companies.siren, searchPattern)
        )
      )
      .orderBy(companies.name)
      .limit(50);
    
    return results;
  } catch (error) {
    console.error("[CRM] Error searching companies:", error);
    return [];
  }
}

/**
 * Get a single company by ID
 */
export async function getCompanyById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);
    
    return company || null;
  } catch (error) {
    console.error("[CRM] Error fetching company:", error);
    return null;
  }
}

/**
 * Get a company by SIREN
 */
export async function getCompanyBySiren(siren: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.siren, siren))
      .limit(1);
    
    return company || null;
  } catch (error) {
    console.error("[CRM] Error fetching company by SIREN:", error);
    return null;
  }
}

/**
 * Create a new company
 */
export async function createCompany(
  data: CompanyFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const [inserted] = await db
      .insert(companies)
      .values(data)
      .returning({ id: companies.id });
    
    revalidatePath("/admin/crm");
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[CRM] Error creating company:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update an existing company
 */
export async function updateCompany(
  id: string,
  data: Partial<CompanyFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db
      .update(companies)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companies.id, id));
    
    revalidatePath("/admin/crm");
    
    return { success: true };
  } catch (error) {
    console.error("[CRM] Error updating company:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a company
 */
export async function deleteCompany(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db.delete(companies).where(eq(companies.id, id));
    
    revalidatePath("/admin/crm");
    
    return { success: true };
  } catch (error) {
    console.error("[CRM] Error deleting company:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Get contact count for dashboard
 */
export async function getContactCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contacts);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[CRM] Error fetching contact count:", error);
    return 0;
  }
}

/**
 * Get company count for dashboard
 */
export async function getCompanyCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(companies);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[CRM] Error fetching company count:", error);
    return 0;
  }
}
