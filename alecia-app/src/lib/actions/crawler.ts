"use server";

import { exec } from "child_process";
import { auth } from "@/lib/auth";

export async function triggerCrawler(domain: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    // Basic validation
    if (!domain.startsWith("http")) {
        domain = `https://${domain}`;
    }

    // Use absolute path from a known root or just hardcode for this env
    // to avoid Turbopack scanning parent dirs during build
    const crawlerPath = "/Users/utilisateur/Desktop/alepanel/web-crawler";
    const command = `cd ${crawlerPath} && ./venv/bin/python3 scrape_domain.py`;
    
    // We don't await the full completion if it's long, but for small sites it's fine.
    // Or we run it in background.
    exec(command, (error, stdout) => {
        if (error) {
            console.error(`Crawler error: ${error.message}`);
            return;
        }
        console.log(`Crawler finished: ${stdout}`);
    });

    return { success: true, message: "Crawler started in background." };
  } catch {
    return { error: "Failed to trigger crawler" };
  }
}
