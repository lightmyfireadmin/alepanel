import { getWeatherForCities } from "@/lib/services/weather";
import { Cloud, CloudRain, CloudLightning, Snowflake, Sun, CloudFog } from "lucide-react";

// Helper to map weather to Lucide icon
const WeatherIcon = ({ iconCode, className }: { iconCode: string, className?: string }) => {
  // OpenWeather icon codes: https://openweathermap.org/weather-conditions
  // 01d/n: clear sky
  // 02d/n, 03d/n, 04d/n: clouds
  // 09d/n, 10d/n: rain
  // 11d/n: thunderstorm
  // 13d/n: snow
  // 50d/n: mist
  const code = iconCode.substring(0, 2);

  switch (code) {
    case "01": return <Sun className={className} />;
    case "02":
    case "03":
    case "04": return <Cloud className={className} />;
    case "09":
    case "10": return <CloudRain className={className} />;
    case "11": return <CloudLightning className={className} />;
    case "13": return <Snowflake className={className} />;
    case "50": return <CloudFog className={className} />;
    default: return <Sun className={className} />;
  }
};

export async function WeatherWidget() {
  const cities = ["Paris", "Lyon", "Cannes"];
  const weatherData = await getWeatherForCities(cities);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {cities.map((city) => {
        const result = weatherData[city];
        const data = result?.data;
        const error = result?.error;

        return (
          <div key={city} className="bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-sm p-4 flex items-center justify-between shadow-sm">
            <div>
              <h4 className="text-lg font-bold text-black dark:text-white font-[family-name:var(--font-playfair)]">
                {city}
              </h4>
              {data ? (
                <div className="flex flex-col">
                  <span className="text-2xl font-medium text-[var(--accent)]">
                    {data.temp}°C
                  </span>
                  <span className="text-xs text-bodydark capitalize">
                    {data.description}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-red-400 mt-1 block">
                   {error === "API key not configured" ? "Clé API manquante" : "Indisponible"}
                </span>
              )}
            </div>

            <div className="text-[var(--accent)]">
               {data ? (
                 <WeatherIcon iconCode={data.icon} className="w-10 h-10" />
               ) : (
                 <Cloud className="w-10 h-10 opacity-20" />
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
