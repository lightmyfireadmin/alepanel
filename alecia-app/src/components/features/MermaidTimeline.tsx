"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: true,
  theme: "base",
  themeVariables: {
    primaryColor: "#D4AF37",
    primaryTextColor: "#fff",
    primaryBorderColor: "#D4AF37",
    lineColor: "#D4AF37",
    secondaryColor: "#001f3f",
    tertiaryColor: "#fff",
  },
});

export function MermaidTimeline({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid flex justify-center bg-white dark:bg-boxdark p-4 rounded-xl border border-stroke dark:border-strokedark overflow-x-auto" ref={ref}>
      {chart}
    </div>
  );
}
