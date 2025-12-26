"use server";

import { db } from "@/lib/db";
import { researchTasks, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { groq } from "@/lib/groq";
import { mistral } from "@/lib/mistral";

export async function getResearchHistory() {
  try {
    const history = await db.select({
        id: researchTasks.id,
        query: researchTasks.query,
        status: researchTasks.status,
        createdAt: researchTasks.createdAt,
        createdBy: users.name
    })
    .from(researchTasks)
    .leftJoin(users, eq(researchTasks.createdBy, users.id))
    .orderBy(desc(researchTasks.createdAt));

    return { success: true, data: history };
  } catch (error) {
    console.error("Failed to fetch research history:", error);
    return { success: false, error: "Failed to fetch history" };
  }
}

export async function getResearchTask(id: string) {
    try {
        const task = await db.query.researchTasks.findFirst({
            where: eq(researchTasks.id, id)
        });
        return { success: true, data: task };
    } catch (error) {
        return { success: false, error: "Task not found" };
    }
}

export async function startResearch(query: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // 1. Create Task Entry
        const [task] = await db.insert(researchTasks).values({
            query,
            status: "processing",
            createdBy: session.user.id,
            resultSummary: "Initializing AI Agents...",
        }).returning();

        // 2. Trigger AI Logic (Non-blocking ideally, but for MVP we await or use background job patterns)
        // Since Vercel Server Actions have timeouts, we should ideally use Inngest or similar. 
        // For this "Business OS" prototype, we will run it directly but keep it concise or expect shorter queries.
        
        performResearch(task.id, query);

        revalidatePath("/admin/research");
        return { success: true, taskId: task.id };
    } catch (error) {
        return { success: false, error: "Failed to start research" };
    }
}

import { searchWeb } from "@/lib/search";
import { crawlUrl } from "@/lib/crawler";

// Internal function to handle the AI chain
async function performResearch(taskId: string, query: string) {
    try {
        // Step A: Groq for Strategy & Search Queries (Fast)
        if (!groq) throw new Error("Groq not configured");
        
        const strategyCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a Senior M&A Analyst. Outline a 3-step research plan for the following request. Then, provide 3 specific search queries to find the data. Format the queries at the end as 'SEARCH: <query>'." },
                { role: "user", content: query }
            ],
            model: "llama3-70b-8192",
        });
        const strategyResponse = strategyCompletion.choices[0]?.message?.content || "No strategy generated.";
        
        // Extract search queries
        const searchQueries = strategyResponse
            .split("\n")
            .filter(line => line.includes("SEARCH:"))
            .map(line => line.replace("SEARCH:", "").trim())
            .slice(0, 2); // Limit to top 2 queries

        // Update DB with progress
        await db.update(researchTasks)
            .set({ resultSummary: `## Research Strategy\n${strategyResponse}\n\nRunning Deep Analysis & Scraping...` })
            .where(eq(researchTasks.id, taskId));

        // Step B: Scraping (The "Super Optimised Framework")
        let scrapedContext = "";
        if (searchQueries.length > 0) {
            for (const searchQuery of searchQueries) {
                const results = await searchWeb(searchQuery, 2); // Top 2 results per query
                for (const result of results) {
                    const crawl = await crawlUrl(result.link);
                    if (!crawl.error && crawl.content.length > 100) {
                        scrapedContext += `\n\n### Source: ${result.title} (${result.link})\n${crawl.content.slice(0, 2000)}\n...[truncated]`;
                    }
                }
            }
        }

        // Step C: Mistral for Deep Dive (Quality)
        if (!mistral) throw new Error("Mistral not configured");

        const analysisCompletion = await mistral.chat.complete({
            model: "mistral-large-latest",
            messages: [
                { role: "system", content: "You are an Expert Market Researcher for French SMBs/ETIs. Provide a detailed, professional market analysis based on the user request, the strategy, and the REAL-TIME SCRAPED DATA provided below. Format in Markdown with headers, bullet points, and a 'Key Players' section." },
                { role: "user", content: `Request: ${query}\n\nStrategy:\n${strategyResponse}\n\nSCRAPED DATA:${scrapedContext || "No external data found."}` }
            ]
        });
        
                const analysis = (analysisCompletion as { choices: { message: { content: string | null | undefined } }[] }).choices?.[0]?.message?.content || "Analysis failed.";
        
        
        
                // Final Update
        
                await db.update(researchTasks)
        
                    .set({
        
                        status: "completed",
        
                        resultSummary: `## 🎯 Strategy\n${strategyResponse}\n\n## 🌐 Sources Scraped\n${searchQueries.join(", ")}\n\n---\n\n## 📊 Market Analysis\n${analysis}` 
        
                    })
        
                    .where(eq(researchTasks.id, taskId));
        
        
        
                revalidatePath(`/admin/research/${taskId}`);
        
                
        
            } catch (error) {
        
                console.error("AI processing failed:", error);
        
                await db.update(researchTasks)
        
                    .set({ 
        
                        status: "failed", 
        
                        resultSummary: `An error occurred during AI processing: ${error instanceof Error ? error.message : String(error)}` 
        
                    })
        
                    .where(eq(researchTasks.id, taskId));
        
            }
        
        }
        
        
        
        export async function generateSWOT(taskId: string) {
        
            try {
        
                const task = await db.query.researchTasks.findFirst({
        
                    where: eq(researchTasks.id, taskId)
        
                });
        
        
        
                if (!task || !task.resultSummary) return { error: "Task not found" };
        
        
        
                if (!mistral) throw new Error("Mistral not configured");
        
        
        
                const swotCompletion = await mistral.chat.complete({
        
                    model: "mistral-small-latest",
        
                    messages: [
        
                        { role: "system", content: "You are an M&A Expert. Extract a SWOT analysis from the following market study. Format as a clean Markdown table." },
        
                        { role: "user", content: task.resultSummary }
        
                    ]
        
                });
        
        
        
                const swot = (swotCompletion as { choices: { message: { content: string | null | undefined } }[] }).choices?.[0]?.message?.content || "SWOT generation failed.";
        
        
        
                // Append to existing summary
        
                await db.update(researchTasks)
        
                    .set({ 
        
                        resultSummary: `${task.resultSummary}\n\n---\n\n## 📋 SWOT Analysis\n${swot}` 
        
                    })
        
                    .where(eq(researchTasks.id, taskId));
        
        
        
                revalidatePath(`/admin/research/${taskId}`);
        
                return { success: true };
        
            } catch {
        
                return { error: "Failed to generate SWOT" };
        
            }
        
        }
