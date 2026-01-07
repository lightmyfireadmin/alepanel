"use client";

import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit3 } from "lucide-react";

export function Whiteboard() {
  return (
    <Card className="h-full flex flex-col shadow-none border bg-white dark:bg-zinc-900/50 overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-blue-500" />
            Tableau Blanc
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        <div className="absolute inset-0">
            <Tldraw 
                inferDarkMode 
                persistenceKey="alecia-whiteboard" // Simple local persistence for now
            />
        </div>
      </CardContent>
    </Card>
  );
}
