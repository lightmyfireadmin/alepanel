import asyncio
import os
from urllib.parse import urlparse
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode

# CONFIGURATION
DOMAIN = "https://www.alecia.markets/"
OUTPUT_DIR = "crawled_pages"

async def save_markdown(url, markdown_content):
    """Saves the markdown content to a file named after the URL path."""
    if not markdown_content:
        return
    
    # Create a valid filename from the URL
    parsed = urlparse(url)
    filename = parsed.path.strip("/").replace("/", "_") or "index"
    if not filename.endswith(".md"):
        filename += ".md"
    
    filepath = os.path.join(OUTPUT_DIR, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"--- \nURL: {url}\n---\n\n")
        f.write(markdown_content)
    print(f"Saved: {filepath}")

async def main():
    # 1. Setup
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    browser_config = BrowserConfig(headless=True, verbose=True)
    # We use BYPASS cache to ensure we get fresh data
    run_config = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)

    print(f"🚀 Starting crawl for {DOMAIN}...")

    async with AsyncWebCrawler(config=browser_config) as crawler:
        # 2. Crawl the Homepage to find all internal links
        result = await crawler.arun(url=DOMAIN, config=run_config)
        
        if not result.success:
            print("❌ Failed to crawl homepage.")
            return

        # Save homepage immediately
        await save_markdown(DOMAIN, result.markdown)

        # 3. Extract and Filter Internal Links
        internal_links = {link['href'] for link in result.links.get('internal', [])}
        
        # Filter to ensure we only keep links belonging to the domain
        urls_to_crawl = [u for u in internal_links if u.startswith(DOMAIN) and u != DOMAIN]
        
        print(f"Found {len(urls_to_crawl)} internal links to crawl.")

        # 4. Crawl all found links in parallel
        if urls_to_crawl:
            results = await crawler.arun_many(
                urls=urls_to_crawl, 
                config=run_config
            )

            # 5. Save all results
            for res in results:
                if res.success:
                    await save_markdown(res.url, res.markdown)
                else:
                    print(f"❌ Failed: {res.url}")

if __name__ == "__main__":
    asyncio.run(main())
