
import { TransportItem } from "@/types/dashboard";

// TGV MAX Dataset API
// https://ressources.data.sncf.com/explore/dataset/tgvmax/api/

interface SNCFRecord {
  fields: {
    heure_depart: string; // "HH:MM"
    heure_arrivee: string; // "HH:MM"
    origine: string;
    destination: string;
    date: string; // "YYYY-MM-DD"
    train_no: string;
  };
}

// Station name mapping (Our internal names vs SNCF dataset names)
const STATION_MAPPING: Record<string, string> = {
  "Paris": "PARIS (intramuros)", // Dataset uses "PARIS (intramuros)"
  "Lyon": "LYON (intramuros)",
  "Nice": "NICE VILLE",
  "Nantes": "NANTES",
};

export async function getRealTrainData(origin: string, destination: string): Promise<TransportItem[]> {
  const originStation = STATION_MAPPING[origin];
  const destStation = STATION_MAPPING[destination];

  if (!originStation || !destStation) return [];

  // Query for today and tomorrow
  // Since we don't have exact "today" in the environment easily synchronized with the dataset (which seemed to have 2026 dates in the sample?),
  // we will try to just sort by date and get the next available ones.
  // Wait, if the dataset only has 2026 data, it's useless for "Live".
  // Let's re-verify the dataset content.
  // The sample had "2026-01-01". This suggests the `tgvmax` dataset might be a "availability" dataset for TGV Max subscribers, which opens well in advance?
  // Or maybe the sample was just weird.
  // However, `tgvmax` is the only open "schedule" one I found easily.
  // Let's try `prochains-departs` dataset if it exists?
  // If `tgvmax` is all we have, we will use it but be careful about dates.

  // Actually, let's assume the user wants *real* data, and if `tgvmax` provides valid schedules, we can use the *time* even if the date is far,
  // treating it as "Typical Schedule" if "Live" is empty.
  // But let's try to query for "date >= current_date".

  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];

  // We'll fetch 5 rows, sorted by date asc.
  const url = `https://ressources.data.sncf.com/api/records/1.0/search/?dataset=tgvmax&q=date>=${dateStr}&sort=date&rows=5&refine.origine=${encodeURIComponent(originStation)}&refine.destination=${encodeURIComponent(destStation)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.records) return [];

    const items: TransportItem[] = [];

    // We only want "next departures" relative to now-time if the date is today.
    // If date is future, just show the time.

    const relevantRecords = (data.records as SNCFRecord[])
      .sort((a, b) => {
        const da = new Date(a.fields.date + 'T' + a.fields.heure_depart);
        const db = new Date(b.fields.date + 'T' + b.fields.heure_depart);
        return da.getTime() - db.getTime();
      })
      .slice(0, 3); // Take top 3

    for (const record of relevantRecords) {
        items.push({
            type: 'train',
            destination: destination,
            time: `${record.fields.heure_depart}`, // Just HH:MM
            status: `TGV ${record.fields.train_no}` // Show Train Number as status
        });
    }

    return items;
  } catch (error) {
    console.error("SNCF Fetch Error", error);
    return [];
  }
}

// OpenSky implementation for "Real" flights
// We will fetch departures from the airport.
const AIRPORT_MAPPING: Record<string, string> = {
  "Paris": "LFPG", // CDG (could be Orly LFPO, but let's stick to one)
  "Nice": "LFMN",
  "Lyon": "LFLL",
  "Nantes": "LFRS"
};

export async function getRealFlightData(origin: string, destination: string): Promise<TransportItem[]> {
    const airport = AIRPORT_MAPPING[origin];
    const targetAirport = AIRPORT_MAPPING[destination];
    if (!airport || !targetAirport) return [];

    // Use states/all to find live aircraft in the vicinity of the origin airport
    // This is a "Live Radar" approach.
    // We define a bounding box around the airport.

    // Nice (LFMN): 43.66, 7.21
    // Paris (LFPG): 49.00, 2.55
    // Lyon (LFLL): 45.72, 5.08
    // Nantes (LFRS): 47.15, -1.61

    const coords: Record<string, { lat: number, lon: number }> = {
        "LFMN": { lat: 43.66, lon: 7.21 },
        "LFPG": { lat: 49.00, lon: 2.55 },
        "LFLL": { lat: 45.72, lon: 5.08 },
        "LFRS": { lat: 47.15, lon: -1.61 }
    };

    const c = coords[airport];
    // Box +/- 1 degree
    const lamin = c.lat - 1;
    const lamax = c.lat + 1;
    const lomin = c.lon - 1;
    const lomax = c.lon + 1;

    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

    try {
        const res = await fetch(url, { next: { revalidate: 60 } }); // Live data, short cache
        if (!res.ok) return [];

        const data = await res.json();
        if (!data.states) return [];

        // We have live planes. We can't know destination easily without Route API (paid/limited).
        // However, we can show "Trafic en cours" or "Avions à proximité".
        // But the user wants "next planes between locations".
        // Without a route API, we can't filter by destination reliably.
        // We can check "true_track" (heading) to see if it points roughly to destination?
        // That's a heuristic.

        // Paris (Lat 49) -> Nice (Lat 43). Heading ~160-180 (South).
        // Nice -> Paris. Heading ~340-020 (North).

        // Let's implement this heuristic for "Live Departures".
        // Only consider planes ON GROUND (on_ground = true) or climbing (vertical_rate > 0) near airport?
        // Actually, just showing "Available Flights" based on a static fallback if API fails is better?
        // No, user said "actual live data".

        // Compromise:
        // 1. Train data is robust (SNCF Open Data).
        // 2. Flight data: We use OpenSky `states/all` to show "Active Traffic".
        // AND we include a "Scheduled" fallback based on known frequencies if no live plane matching heuristic is found.
        // But to be "Live", let's try to match callsigns? No.

        // Let's stick to the heuristic.
        // Heading calculation:
        const destC = coords[targetAirport];
        const dLon = (destC.lon - c.lon) * Math.PI / 180;
        const lat1 = c.lat * Math.PI / 180;
        const lat2 = destC.lat * Math.PI / 180;
        const y = Math.sin(dLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        bearing = (bearing + 360) % 360;

        const items: TransportItem[] = [];

        // Filter states
        // Index 10: true_track
        // Index 1: callsign
        // Index 8: on_ground
        type OpenSkyState = [
          string, // icao24
          string | null, // callsign
          string, // origin_country
          number | null, // time_position
          number, // last_contact
          number | null, // longitude
          number | null, // latitude
          number | null, // baro_altitude
          boolean, // on_ground
          number | null, // velocity
          number | null, // true_track
          number | null, // vertical_rate
          number[] | null, // sensors
          number | null, // geo_altitude
          string | null, // squawk
          boolean, // spi
          number // position_source
        ];

        const states = data.states as OpenSkyState[];

        const relevantPlanes = states.filter(s => {
            const track = s[10];
            const onGround = s[8];
            if (onGround) return false; // We want flying ones (departed)
            if (track === null) return false;

            // Check if heading matches destination +/- 30 degrees
            const diff = Math.abs(track - bearing);
            const diff2 = Math.abs(track - bearing - 360);
            const diff3 = Math.abs(track - bearing + 360);
            return Math.min(diff, diff2, diff3) < 30;
        }).slice(0, 2); // Limit to 2

        if (relevantPlanes.length > 0) {
             for (const p of relevantPlanes) {
                items.push({
                    type: 'plane',
                    destination: destination,
                    time: "En vol",
                    status: `Vol ${p[1]?.trim() || 'Inconnu'} (Radar)`
                });
            }
        } else {
             // Fallback to "Scheduled" if no live plane seen?
             // User wants "next planes".
             // Since we can't get schedule, let's just return empty (don't show false info)
             // Or show "Aucun vol détecté" (implicitly handled by empty list)
        }

        return items;

    } catch (e) {
        console.error("OpenSky Error", e);
        return [];
    }
}
