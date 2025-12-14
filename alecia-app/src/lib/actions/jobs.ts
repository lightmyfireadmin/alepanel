
"use server";

import { db } from "@/lib/db";
import { jobOffers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { cache } from "react";

export const getJobOffers = cache(async () => {
  try {
    const offers = await db
      .select()
      .from(jobOffers)
      .where(eq(jobOffers.isPublished, true))
      .orderBy(desc(jobOffers.createdAt));
      
    return offers;
  } catch (error) {
    console.error("Error fetching job offers:", error);
    return [];
  }
});
