/**
 * Unsplash API client for fetching images
 * Rate limit: 50 requests per hour
 * 
 * Application ID: 842899
 * Access Key: 3E3H335kRUGoPAoXL-DgMBqGUWC0ugqC_X1nan5XNPo
 */

const UNSPLASH_ACCESS_KEY = "3E3H335kRUGoPAoXL-DgMBqGUWC0ugqC_X1nan5XNPo";
const UNSPLASH_API_URL = "https://api.unsplash.com";

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

// Simple in-memory cache to respect rate limits
const cache = new Map<string, { data: UnsplashPhoto[]; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * Search for photos on Unsplash
 * @param query - Search query (e.g., "business meeting", "corporate office")
 * @param perPage - Number of results (max 30)
 */
export async function searchPhotos(
  query: string,
  perPage: number = 10
): Promise<UnsplashPhoto[]> {
  const cacheKey = `search:${query}:${perPage}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    cache.set(cacheKey, { data: data.results, timestamp: Date.now() });
    
    return data.results;
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    return [];
  }
}

/**
 * Get a random photo from Unsplash
 * @param query - Optional topic query
 */
export async function getRandomPhoto(query?: string): Promise<UnsplashPhoto | null> {
  const cacheKey = `random:${query || "general"}`;
  const cached = cache.get(cacheKey);
  
  if (cached && cached.data.length > 0 && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data[0];
  }

  try {
    const url = query
      ? `${UNSPLASH_API_URL}/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`
      : `${UNSPLASH_API_URL}/photos/random?orientation=landscape`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const photo: UnsplashPhoto = await response.json();
    cache.set(cacheKey, { data: [photo], timestamp: Date.now() });
    
    return photo;
  } catch (error) {
    console.error("Error fetching random photo from Unsplash:", error);
    return null;
  }
}

/**
 * Trigger download count for Unsplash attribution
 * Call this when displaying an image to comply with Unsplash guidelines
 */
export async function triggerDownload(downloadLocation: string): Promise<void> {
  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
  } catch {
    // Silent fail - this is just for analytics
  }
}

/**
 * Get photo credit string for attribution
 */
export function getPhotoCredit(photo: UnsplashPhoto): string {
  return `Photo by ${photo.user.name} on Unsplash`;
}

/**
 * Pre-defined queries for M&A / business imagery
 */
export const BUSINESS_QUERIES = {
  hero: "corporate meeting handshake",
  office: "modern office building",
  team: "business team collaboration",
  finance: "financial charts analysis",
  deal: "business negotiation",
  skyline: "city skyline sunset",
} as const;
