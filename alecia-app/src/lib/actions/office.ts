"use server";

import { getWeather } from "@/lib/services/weather";
import { getDrivingTime, formatDuration } from "@/lib/services/transport";
import { OfficeData } from "@/components/admin/dashboard/OfficeWidgets";

// Locations coordinates
const LOCATIONS = [
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Nice", lat: 43.7102, lon: 7.2620 },
  { name: "Lyon", lat: 45.7640, lon: 4.8357 },
  { name: "Nantes", lat: 47.2184, lon: -1.5536 }
];

export async function getOfficeDashboardData(): Promise<OfficeData[]> {
  // Paris coordinates for destination calculations
  const parisCoords = { lat: 48.8566, lon: 2.3522 };
  const lyonCoords = { lat: 45.7640, lon: 4.8357 };

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

    // 2. Fetch Transport (Driving Time)
    // If location is Paris, calculate time to Lyon. Else to Paris.
    const destinationName = loc.name === "Paris" ? "Lyon" : "Paris";
    const destinationCoords = loc.name === "Paris" ? lyonCoords : parisCoords;

    // We only calculate if we are not at the destination (redundant check but good for logic clarity)
    let drivingTimeStr = "--";

    if (loc.name !== destinationName) {
      const route = await getDrivingTime(
        { lat: loc.lat, lon: loc.lon },
        destinationCoords
      );

      if (route) {
        drivingTimeStr = formatDuration(route.duration);
      }
    }

    // Construct Transport Items
    const transportItems: OfficeData["transport"]["items"] = [];

    // Add Driving info if available
    if (drivingTimeStr !== "--") {
      transportItems.push({
        type: "car",
        destination: destinationName,
        time: drivingTimeStr,
        status: "Fluid" // Mapbox traffic v5 implies standard driving time. For traffic, we'd need more complex logic.
      });
    }

    // Add placeholder for train/flight if needed, or leave it cleaner with just driving.
    // The previous mock had train and flight.
    // Since we don't have real data for train/flight, we won't add them to avoid fake info.
    // However, to fill the UI, maybe we can add a generic link or static info?
    // "Actual data" requirement means we shouldn't fake it.
    // So we'll stick to what we have.

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
