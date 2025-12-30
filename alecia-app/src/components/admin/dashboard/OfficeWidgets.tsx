"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Train, Plane, Car, CloudFog, CloudLightning, CloudSnow, CloudDrizzle } from "lucide-react";
import Image from "next/image";

export interface TransportItem {
  type: 'car' | 'train' | 'plane';
  destination: string;
  time: string;
  status?: string;
}

export interface OfficeData {
  city: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  transport: {
    items: TransportItem[];
  };
}

const WeatherIcon = ({ icon }: { icon: string }) => {
  // Map OpenWeather icon codes to Lucide icons
  // https://openweathermap.org/weather-conditions

  if (icon.startsWith('01')) return <Sun className="h-6 w-6 text-yellow-500" />;
  if (icon.startsWith('02')) return <Cloud className="h-6 w-6 text-yellow-500" />; // Few clouds
  if (icon.startsWith('03') || icon.startsWith('04')) return <Cloud className="h-6 w-6 text-gray-400" />;
  if (icon.startsWith('09')) return <CloudDrizzle className="h-6 w-6 text-blue-400" />;
  if (icon.startsWith('10')) return <CloudRain className="h-6 w-6 text-blue-500" />;
  if (icon.startsWith('11')) return <CloudLightning className="h-6 w-6 text-purple-500" />;
  if (icon.startsWith('13')) return <CloudSnow className="h-6 w-6 text-blue-200" />;
  if (icon.startsWith('50')) return <CloudFog className="h-6 w-6 text-gray-300" />;

  // Fallback for custom or unknown codes
  if (icon === "sun") return <Sun className="h-6 w-6 text-yellow-500" />;
  if (icon === "cloud-rain") return <CloudRain className="h-6 w-6 text-blue-500" />;

  // Try to use OpenWeather image if code format matches
  if (icon.length === 3) {
      return (
          <div className="relative h-8 w-8 -my-1">
              <Image
                  src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                  alt="Weather icon"
                  fill
                  className="object-contain"
              />
          </div>
      );
  }

  return <Cloud className="h-6 w-6 text-gray-500" />;
};

const TransportIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'car': return <Car className="h-3 w-3" />;
    case 'train': return <Train className="h-3 w-3" />;
    case 'plane': return <Plane className="h-3 w-3" />;
    default: return <Car className="h-3 w-3" />;
  }
};

export function OfficeWidgets({ data }: { data: OfficeData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {data.map((office) => (
        <Card key={office.city} className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center text-sm font-medium">
              <span>{office.city}</span>
              <WeatherIcon icon={office.weather.icon} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-4">{office.weather.temp}°C</div>
            <div className="space-y-3 text-xs text-muted-foreground">
              {office.transport.items.length > 0 ? (
                office.transport.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TransportIcon type={item.type} />
                      <span>{item.destination}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono font-medium">{item.time}</span>
                      {item.status && <span className="text-[10px] opacity-70">{item.status}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-muted-foreground italic">Aucune info trafic</div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
