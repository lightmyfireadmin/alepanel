/**
 * Weather Service - Database-First Caching Strategy
 * 
 * Golden Rule: Never make an external API call if the data exists in the database.
 * Caching Policy: Max 2 API calls per day per location (every 6 hours).
 */

import { db } from "@/lib/db";
import { weatherCache } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// 6 hours = 2 calls per day max
const CACHE_VALIDITY_MS = 6 * 60 * 60 * 1000;

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity?: number;
  windSpeed?: number;
}

export interface WeatherResult {
  data: WeatherData | null;
  isStale: boolean;
  error?: string;
}

/**
 * Get weather for a French city with database-first caching.
 * 
 * Flow:
 * 1. Check database for existing cache
 * 2. If valid (< 6 hours old) → return immediately (NO API CALL)
 * 3. If expired → call OpenWeather API and update cache
 * 4. If missing → call API and create cache entry
 */
export async function getWeather(city: string): Promise<WeatherResult> {
  const locationKey = `${city},FR`;
  
  try {
    // Step 1: Check cache first (DATABASE-FIRST)
    const cached = await db
      .select()
      .from(weatherCache)
      .where(eq(weatherCache.locationKey, locationKey))
      .limit(1);
    
    if (cached.length > 0 && cached[0].data) {
      const age = Date.now() - new Date(cached[0].fetchedAt!).getTime();
      
      if (age < CACHE_VALIDITY_MS) {
        // ✅ Valid cache - NO API CALL
        console.log(`[Weather] Cache hit for ${city} (age: ${Math.round(age / 60000)}min)`);
        return { 
          data: cached[0].data as WeatherData, 
          isStale: false 
        };
      }
      
      // Cache exists but is stale - we'll refresh it
      console.log(`[Weather] Cache expired for ${city}, refreshing...`);
    }
    
    // Step 2: Cache miss or expired - call external API
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.warn("[Weather] OPENWEATHER_API_KEY not configured");
      // Return stale data if available
      if (cached.length > 0 && cached[0].data) {
        return { data: cached[0].data as WeatherData, isStale: true };
      }
      return { data: null, isStale: false, error: "API key not configured" };
    }
    
    // Call OpenWeather API - ONLY "Current Weather Data" endpoint (as per requirements)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},FR&appid=${apiKey}&units=metric&lang=fr`,
      { next: { revalidate: 0 } } // Never use Next.js cache for API calls
    );
    
    if (!response.ok) {
      console.error(`[Weather] API error: ${response.status}`);
      // Return stale data if available
      if (cached.length > 0 && cached[0].data) {
        return { data: cached[0].data as WeatherData, isStale: true };
      }
      return { data: null, isStale: false, error: `API error: ${response.status}` };
    }
    
    const raw = await response.json();
    
    const data: WeatherData = {
      temp: Math.round(raw.main.temp),
      description: raw.weather[0].description,
      icon: raw.weather[0].icon,
      humidity: raw.main.humidity,
      windSpeed: raw.wind?.speed,
    };
    
    // Step 3: Store/Update cache (upsert)
    await db
      .insert(weatherCache)
      .values({ 
        locationKey, 
        data, 
        fetchedAt: new Date() 
      })
      .onConflictDoUpdate({
        target: weatherCache.locationKey,
        set: { 
          data, 
          fetchedAt: new Date() 
        },
      });
    
    console.log(`[Weather] API called and cached for ${city}`);
    return { data, isStale: false };
    
  } catch (error) {
    console.error("[Weather] Error:", error);
    return { 
      data: null, 
      isStale: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

/**
 * Get weather for multiple cities in parallel.
 */
export async function getWeatherForCities(cities: string[]): Promise<Record<string, WeatherResult>> {
  const results = await Promise.all(
    cities.map(async (city) => {
      const result = await getWeather(city);
      return { city, result };
    })
  );

  return results.reduce((acc, { city, result }) => {
    acc[city] = result;
    return acc;
  }, {} as Record<string, WeatherResult>);
}

/**
 * Get weather icon URL from OpenWeather icon code
 */
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
