"use client";

import { Train, Plane, Info } from "lucide-react";

export function TravelWidget() {
  // Calculate tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

  // Format for Skyscanner: YYMMDD
  const yy = dateStr.substring(2, 4);
  const mm = dateStr.substring(5, 7);
  const dd = dateStr.substring(8, 10);
  const skyscannerDateStr = `${yy}${mm}${dd}`;

  const links = [
    {
      label: "Lyon → Paris",
      type: "train",
      icon: Train,
      url: `https://www.sncf-connect.com/billet-train/horaires/lyon/paris/trajet?date=${dateStr}`,
      color: "text-blue-600"
    },
    {
      label: "Nice → Paris",
      type: "plane",
      icon: Plane,
      url: `https://www.skyscanner.fr/transport/vols/nce/pari/${skyscannerDateStr}`,
      color: "text-sky-500"
    },
    {
      label: "Info Trafic",
      type: "info",
      icon: Info,
      url: "https://www.sncf-connect.com/info-trafic",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-sm p-6 shadow-sm h-full">
      <h4 className="text-xl font-bold text-black dark:text-white mb-4 font-[family-name:var(--font-playfair)] flex items-center gap-2">
        <Train className="w-5 h-5" />
        Travel Assistant
      </h4>

      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-meta-4 hover:bg-gray-100 dark:hover:bg-opacity-90 transition-all border border-transparent hover:border-[var(--accent)]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-white dark:bg-boxdark shadow-sm ${link.color}`}>
                <link.icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-black dark:text-white">
                {link.label}
              </span>
            </div>

            <span className="text-xs text-bodydark2 bg-white dark:bg-boxdark px-2 py-1 rounded-full border border-stroke dark:border-strokedark">
              {link.type === 'info' ? 'Live' : 'Demain'} →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
