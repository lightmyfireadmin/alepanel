
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Coordinates {
  lat: number;
  lon: number;
}

interface TransportRoute {
  duration: number; // in seconds
  distance: number; // in meters
}

export async function getDrivingTime(
  origin: Coordinates,
  destination: Coordinates
): Promise<TransportRoute | null> {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.warn("NEXT_PUBLIC_MAPBOX_TOKEN is not defined");
    return null;
  }

  // Mapbox expects "longitude,latitude"
  const coords = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${MAPBOX_ACCESS_TOKEN}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error("Mapbox API error:", response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      return {
        duration: data.routes[0].duration,
        distance: data.routes[0].distance,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching driving time:", error);
    return null;
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
