"use client";

import { Megaphone, Briefcase, Eye, Coffee, Folder, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  "Megaphone": Megaphone,
  "Briefcase": Briefcase,
  "Eye": Eye,
  "Coffee": Coffee,
};

export function IconMapper({ name, className }: { name: string | null; className?: string }) {
  const Icon = iconMap[name || ""] || Folder;
  return <Icon className={className} />;
}
