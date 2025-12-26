"use server";

// Mocking the external API calls for Weather and Transport
// In a real app, this would use fetch() to OpenWeatherMap and SNCF/AirFrance APIs
// and cache the result in the 'weatherCache' table.

const LOCATIONS = [
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Nice", lat: 43.7102, lon: 7.2620 },
  { name: "Lyon", lat: 45.7640, lon: 4.8357 },
  { name: "Nantes", lat: 47.2184, lon: -1.5536 }
];

export async function getOfficeDashboardData() {
  // Simulate fetching data (cached strategy would check DB first)
  
  return LOCATIONS.map(loc => ({
    city: loc.name,
    weather: {
      temp: Math.floor(Math.random() * (25 - 10) + 10), // Mock 10-25°C
      condition: ["Ensoleillé", "Nuageux", "Averses"][Math.floor(Math.random() * 3)],
      icon: ["sun", "cloud", "cloud-rain"][Math.floor(Math.random() * 3)]
    },
    transport: {
      nextTrain: {
        destination: loc.name === "Paris" ? "Lyon" : "Paris",
        time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        status: "À l'heure"
      },
      nextFlight: {
        destination: "New York", // International hub
        time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        status: "Embarquement"
      }
    }
  }));
}
