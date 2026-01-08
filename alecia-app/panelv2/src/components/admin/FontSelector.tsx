"use client";

import { GOOGLE_FONTS } from "@/lib/theme-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
  label: string;
  description?: string;
  type: "heading" | "body";
}

export function FontSelector({
  value,
  onChange,
  label,
  description,
  type,
}: FontSelectorProps) {
  const fonts = type === "heading" ? GOOGLE_FONTS.headings : GOOGLE_FONTS.body;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      {description && (
        <p className="text-xs text-[var(--foreground-muted)]">{description}</p>
      )}
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choisir une police" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((font) => (
            <SelectItem key={font} value={font}>
              <span style={{ fontFamily: `"${font}", sans-serif` }}>
                {font}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
