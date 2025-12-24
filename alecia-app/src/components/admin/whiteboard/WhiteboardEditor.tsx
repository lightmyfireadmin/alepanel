"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { saveWhiteboardState } from "@/lib/actions/whiteboard";
import { Loader2, Save } from "lucide-react";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center text-bodydark">Loading Editor...</div> }
);

export function WhiteboardEditor() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!excalidrawAPI) return;

    // Simple prompt for name
    const name = prompt("Enter a name for this whiteboard:", "New Deal Structure");
    if (!name) return;

    setSaving(true);
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const content = { elements, appState };

      const result = await saveWhiteboardState(name, content);

      if (result.success) {
        alert("Saved successfully!");
      } else {
        alert("Failed to save.");
      }
    } catch (error) {
      console.error(error);
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white dark:bg-boxdark p-4 rounded-sm border border-stroke dark:border-strokedark shadow-sm">
        <h2 className="text-lg font-semibold text-black dark:text-white">Canvas</h2>
        <Button onClick={handleSave} disabled={saving} className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save to Documents
        </Button>
      </div>
      <div className="flex-1 border border-stroke dark:border-strokedark rounded-sm overflow-hidden bg-white">
         <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
      </div>
    </div>
  );
}
