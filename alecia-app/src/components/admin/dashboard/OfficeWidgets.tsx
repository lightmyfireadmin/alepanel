"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Sun, CloudRain, Train, Plane } from "lucide-react";

interface OfficeData {
  city: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  transport: {
    nextTrain: { destination: string; time: string; status: string };
    nextFlight: { destination: string; time: string; status: string };
  };
}

const WeatherIcon = ({ icon }: { icon: string }) => {
  if (icon === "sun") return <Sun className="h-6 w-6 text-yellow-500" />;
  if (icon === "cloud-rain") return <CloudRain className="h-6 w-6 text-blue-500" />;
  return <Cloud className="h-6 w-6 text-gray-500" />;
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Train className="h-3 w-3" />
                  <span>{office.transport.nextTrain.destination}</span>
                </div>
                <span className="font-mono">{office.transport.nextTrain.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="h-3 w-3" />
                  <span>{office.transport.nextFlight.destination}</span>
                </div>
                <span className="font-mono">{office.transport.nextFlight.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
