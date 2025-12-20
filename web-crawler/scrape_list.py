import asyncio
import os
from urllib.parse import urlparse
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

# 1. The exact list of URLs you provided
URLS_TO_CRAWL = [
    "https://www.alecia.fr",
    "https://www.alecia.fr/expertises",
    "https://www.alecia.fr/secteurs",
    "https://www.alecia.fr/operations",
    "https://www.alecia.fr/equipe",
    "https://www.alecia.fr/actualites",
    "https://www.alecia.fr/contact",
    "https://www.alecia.fr/nous-rejoindre",
    "https://www.alecia.fr/ceder",
    "https://www.alecia.fr/acquerir",
    "https://www.alecia.fr/mentions-legales",
    "https://www.alecia.fr/politique-de-confidentialite",
    "https://www.alecia.fr/secteurs/technologies-logiciels",
    "https://www.alecia.fr/secteurs/distribution-services-b2b",
    "https://www.alecia.fr/secteurs/distribution-services-b2c",
    "https://www.alecia.fr/secteurs/sante",
    "https://www.alecia.fr/secteurs/immobilier-construction",
    "https://www.alecia.fr/secteurs/industries",
    "https://www.alecia.fr/secteurs/services-financiers-assurance",
    "https://www.alecia.fr/secteurs/agroalimentaire",
    "https://www.alecia.fr/secteurs/energie-environnement",
    "https://www.alecia.fr/operations/hmr-leclerc",
    "https://www.alecia.fr/operations/safe-group",
    "https://www.alecia.fr/operations/signes",
    "https://www.alecia.fr/operations/xrl-consulting",
    "https://www.alecia.fr/operations/kanope",
    "https://www.alecia.fr/operations/keller-williams",
    "https://www.alecia.fr/operations/wyz-group",
    "https://www.alecia.fr/operations/finaxy",
    "https://www.alecia.fr/equipe/gregory-colin",
    "https://www.alecia.fr/equipe/christophe-berthon",
    "https://www.alecia.fr/equipe/martin-egasse",
    "https://www.alecia.fr/equipe/tristan-cossec",
    "https://www.alecia.fr/equipe/serge-de-fay",
    "https://www.alecia.fr/equipe/jerome-berthiau",
    "https://www.alecia.fr/equipe/louise-pini",
    "https://www.alecia.fr/equipe/mickael-furet"
]

OUTPUT_DIR = "crawled_pages"

async def save_markdown(url, markdown_content):
    """Saves the markdown content to a clean filename."""
    if not markdown_content:
        return
    
    # Create a filename from the URL path (e.g. "equipe_gregory-colin.md")
    parsed = urlparse(url)
    path_str = parsed.path.strip("/")
    
    # If it's the homepage, call it index
    if not path_str:
        filename = "index.md"
    else:
        # Replace slashes with underscores for flat file structure
        filename = path_str.replace("/", "_") + ".md"
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"--- \nURL: {url}\n---\n\n")
        f.write(markdown_content)
    print(f"Saved: {filename}")

async def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    browser_config = BrowserConfig(headless=True, verbose=True)
    run_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    print(f"🚀 Starting batch crawl of {len(URLS_TO_CRAWL)} URLs...")

    async with AsyncWebCrawler(config=browser_config) as crawler:
        # Run all URLs in parallel
        results = await crawler.arun_many(
            urls=URLS_TO_CRAWL, 
            config=run_config
        )

        for res in results:
            if res.success:
                await save_markdown(res.url, res.markdown)
            else:
                print(f"❌ Failed: {res.url} - Error: {res.error_message}")

if __name__ == "__main__":
    asyncio.run(main())
