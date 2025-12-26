"use server";

import { db } from "@/lib/db";
import { projects, leads, researchTasks, forumThreads } from "@/lib/db/schema";
import { count, eq, desc } from "drizzle-orm";

export async function getDashboardMetrics() {
  try {
    // 1. Active Deals (Projects that are not 'Closed' - assuming 'Closed' is a status)
    // For simplicity, we count all projects for now, or filters by status if possible
    const [projectsCount] = await db.select({ count: count() }).from(projects);
    
    // 2. New Leads (All leads for now, ideally filtered by date)
    const [leadsCount] = await db.select({ count: count() }).from(leads);

    // 3. Active Research (Research tasks pending)
    const [researchCount] = await db.select({ count: count() }).from(researchTasks).where(eq(researchTasks.status, "pending"));

    // 4. Pipeline Value - Placeholder as 'projects' table doesn't have a value field yet
    // We could sum 'deals' values but those are closed. 
    // We will return a static formatted string for now but based on project count * average size if we wanted to be fancy.
    const pipelineValue = "€" + (projectsCount.count * 2.5).toFixed(1) + "M"; // Mock calc: 2.5M per deal

    return {
      activeDeals: projectsCount.count,
      pipelineValue: pipelineValue,
      newLeads: leadsCount.count,
      activeResearch: researchCount.count
    };
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return {
      activeDeals: 0,
      pipelineValue: "€0.0M",
      newLeads: 0,
      activeResearch: 0
    };
  }
}
