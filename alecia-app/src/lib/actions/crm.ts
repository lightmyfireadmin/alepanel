"use server";

import { db } from "@/lib/db";
import { contacts, companies, type NewContact, type NewCompany } from "@/lib/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getContacts(query?: string) {
  try {
    const allContacts = await db.select({
        id: contacts.id,
        name: contacts.name,
        email: contacts.email,
        phone: contacts.phone,
        role: contacts.role,
        tags: contacts.tags,
        companyName: companies.name
    })
    .from(contacts)
    .leftJoin(companies, eq(contacts.companyId, companies.id))
    .where(query ? or(ilike(contacts.name, `%${query}%`), ilike(contacts.email, `%${query}%`)) : undefined)
    .orderBy(desc(contacts.createdAt));

    return { success: true, data: allContacts };
  } catch {
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function getCompanies(query?: string) {
    try {
        const allCompanies = await db.select()
            .from(companies)
            .where(query ? ilike(companies.name, `%${query}%`) : undefined)
            .orderBy(desc(companies.createdAt));
        return { success: true, data: allCompanies };
    } catch {
        return { success: false, error: "Failed to fetch companies" };
    }
}

export async function createContact(data: NewContact) {
    try {
        const [contact] = await db.insert(contacts).values(data).returning();
        revalidatePath("/admin/crm");
        return { success: true, data: contact };
    } catch {
        return { error: "Failed to create contact" };
    }
}

export async function createCompany(data: NewCompany) {
    try {
        const [company] = await db.insert(companies).values(data).returning();
        revalidatePath("/admin/crm");
        return { success: true, data: company };
    } catch {
        return { success: false, error: "Failed to create company" };
    }
}