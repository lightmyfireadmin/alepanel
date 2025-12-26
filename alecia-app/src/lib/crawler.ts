import { load } from "cheerio";
import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// Remove unwanted elements
turndownService.remove(["script", "style", "iframe", "footer", "nav", "noscript"]);

export async function crawlUrl(url: string): Promise<{ title: string; content: string; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AleciaBot/1.0; +https://alecia.fr)",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Clean up HTML before converting
    $("header, footer, nav, script, style, noscript, iframe, .ad, .advertisement, #cookie-banner").remove();

    const title = $("title").text().trim() || url;
    
    // Prefer main content if available
    const mainContent = $("main, article, #content, .content").first().html() || $("body").html() || "";
    
    const markdown = turndownService.turndown(mainContent);

    return { title, content: markdown };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return { title: url, content: "", error: (error as Error).message };
  }
}
