"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type RoleType = "Conseil vendeur" | "Conseil acquéreur" | "Conseil levée" | "Cession" | "Acquisition" | "Levée de fonds";

interface RoleBadgeProps {
  roleType: RoleType;
  size?: "default" | "sm" | "lg";
  className?: string;
}

const roleConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  "Conseil vendeur": {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    label: "Conseil vendeur",
  },
  "Cession": {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    label: "Conseil vendeur",
  },
  "Conseil acquéreur": {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: "Conseil acquéreur",
  },
  "Acquisition": {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    label: "Conseil acquéreur",
  },
  "Conseil levée": {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    label: "Levée de fonds",
  },
  "Levée de fonds": {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    label: "Levée de fonds",
  },
};

export function RoleBadge({ roleType, size = "default", className }: RoleBadgeProps) {
  const config = roleConfig[roleType] || {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/30",
    label: roleType,
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        "font-medium",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
