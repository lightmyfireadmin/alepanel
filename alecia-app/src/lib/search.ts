import { load } from "cheerio";

export interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

export async function searchWeb(query: string, limit = 5): Promise<SearchResult[]> {
  try {
    // Using DuckDuckGo HTML version for easier scraping (no JS required)
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });

    if (!response.ok) {
        console.error(`Search failed: ${response.status} ${response.statusText}`);
        return [];
    }

    const html = await response.text();
    const $ = load(html);
    const results: SearchResult[] = [];

    $(".result").each((i, element) => {
      if (i >= limit) return;

      const title = $(element).find(".result__title").text().trim();
      const link = $(element).find(".result__a").attr("href");
      const snippet = $(element).find(".result__snippet").text().trim();

      if (title && link && !link.includes("duckduckgo.com/y.js")) {
        results.push({ title, link, snippet });
      }
    });

    return results;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}
