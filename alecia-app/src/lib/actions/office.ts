"use server";

import { getWeather } from "@/lib/services/weather";
import { getDrivingTime, formatDuration } from "@/lib/services/transport";
import { OfficeData } from "@/types/dashboard";
import { getRealTrainData, getRealFlightData } from "@/lib/services/real-transport";
import { db } from "@/lib/db";
import { userTransportLocations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Locations coordinates
const LOCATIONS = [
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Nice", lat: 43.7102, lon: 7.2620 },
  { name: "Lyon", lat: 45.7640, lon: 4.8357 },
  { name: "Nantes", lat: 47.2184, lon: -1.5536 }
];

export async function getOfficeDashboardData(): Promise<OfficeData[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const results = await Promise.all(LOCATIONS.map(async (loc) => {
    // 1. Fetch Weather
    const weatherResult = await getWeather(loc.name);
    const weather = weatherResult.data || {
      temp: 0,
      description: "Non disponible",
      icon: "cloud",
      humidity: 0,
      windSpeed: 0
    };

    const transportItems: OfficeData["transport"]["items"] = [];

    // 2. Fetch User Custom Locations Driving Time
    if (userId) {
      const userLocations = await db.query.userTransportLocations.findMany({
        where: and(
          eq(userTransportLocations.userId, userId),
          eq(userTransportLocations.officeName, loc.name)
        )
      });

      for (const userLoc of userLocations) {
        const route = await getDrivingTime(
          { lat: parseFloat(userLoc.latitude), lon: parseFloat(userLoc.longitude) },
          { lat: loc.lat, lon: loc.lon } // To the office
        );

        if (route) {
          transportItems.push({
            type: 'car',
            destination: userLoc.label, // "Home", etc.
            time: formatDuration(route.duration),
            status: "Traffic inc."
          });
        }
      }
    }

    // 3. Fetch Inter-office Transport (Train/Plane)
    // For each other office, check connectivity
    for (const otherLoc of LOCATIONS) {
      if (otherLoc.name === loc.name) continue;

      // Get Real Train/Plane data
      // Parallelize for performance
      const [trains, planes] = await Promise.all([
        getRealTrainData(loc.name, otherLoc.name),
        getRealFlightData(loc.name, otherLoc.name)
      ]);

      transportItems.push(...trains);
      transportItems.push(...planes);
    }

    // Also add driving time to other offices if it's sensible?
    // User said: "car will likely be a credible workday choice when the plane isn't"
    // Let's add driving to nearest office if < 4h?
    // For simplicity and to match request "driving times between offices (e.g., to Paris)", let's add driving for all offices that are reasonable.
    // Or just stick to the Train/Plane logic which is "dynamic fetch".
    // I'll add Driving to other offices if distance is reasonable (< 500km?) or just always add it but maybe at the bottom.
    // Actually, let's add driving to the main connected office (Paris <-> Lyon, Nice <-> Monaco?)
    // The previous implementation had Paris <-> Lyon.

    // Let's iterate all other offices and get driving time.
    // To avoid API quota spam, maybe only for specific pairs?
    // "dashboard now displays estimated driving times between offices (e.g., to Paris)"
    // I will add driving time to other offices.

    // Optimization: Only fetch driving for reasonable pairs to save API calls if many users.
    // Paris-Lyon (460km), Paris-Nantes (380km), Lyon-Nice (470km). These are driveable.
    // Paris-Nice (930km) is not.
    // I'll add a check.

    for (const otherLoc of LOCATIONS) {
      if (otherLoc.name === loc.name) continue;

      // Simple distance check (Haversine approximation or just hardcoded pairs)
      // Paris-Nice is too far.
      if ((loc.name === 'Paris' && otherLoc.name === 'Nice') || (loc.name === 'Nice' && otherLoc.name === 'Paris')) continue;
      if ((loc.name === 'Nantes' && otherLoc.name === 'Nice') || (loc.name === 'Nice' && otherLoc.name === 'Nantes')) continue;

      // Calculate driving
       const route = await getDrivingTime(
        { lat: loc.lat, lon: loc.lon },
        { lat: otherLoc.lat, lon: otherLoc.lon }
      );

      if (route) {
         transportItems.push({
            type: 'car',
            destination: otherLoc.name,
            time: formatDuration(route.duration),
            status: "Fluid"
          });
      }
    }

    // Sort items: Custom locations first, then by time?
    // Actually, just let them be.

    return {
      city: loc.name,
      weather: {
        temp: weather.temp,
        condition: weather.description,
        icon: weather.icon
      },
      transport: {
        items: transportItems
      }
    };
  }));

  return results;
}

export async function addUserTransportLocation(data: {
  officeName: string;
  label: string;
  address: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Geocode address
  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!MAPBOX_ACCESS_TOKEN) throw new Error("Mapbox token missing");

  const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(data.address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

  const response = await fetch(endpoint);
  const json = await response.json();

  if (!json.features || json.features.length === 0) {
    throw new Error("Address not found");
  }

  const [lon, lat] = json.features[0].center;

  await db.insert(userTransportLocations).values({
    userId: session.user.id,
    officeName: data.officeName,
    label: data.label,
    address: data.address,
    latitude: lat.toString(),
    longitude: lon.toString()
  });

  revalidatePath("/admin");
}
