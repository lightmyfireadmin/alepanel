"use client";

import { useState } from "react";
import { SketchPicker, ColorResult } from "react-color";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ALECIA_PRESET_COLORS = [
  "#3E6BF7",
  "#25A18E",
  "#F58A07",
  "#DB222A",
  "#061A40",
  "#AAB1BE",
  "#E6E8EC",
  "#F3F4F5",
  "#FFFFFF",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
];

interface ThemeColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  description?: string;
}

export function ThemeColorPicker({
  color,
  onChange,
  label,
  description,
}: ThemeColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(color);

  const handleOpen = () => {
    setTempColor(color);
    setIsOpen(true);
  };

  const handleSave = () => {
    onChange(tempColor);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempColor(color);
    setIsOpen(false);
  };

  const handleChange = (newColor: ColorResult) => {
    setTempColor(newColor.hex.toUpperCase());
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      {description && (
        <p className="text-xs text-[var(--foreground-muted)]">{description}</p>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            onClick={handleOpen}
            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] hover:bg-[var(--background-tertiary)] transition-colors w-full"
          >
            <div
              className="w-10 h-10 rounded-md border border-[var(--border)] shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-sm text-[var(--foreground)]">
              {color.toUpperCase()}
            </span>
          </button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-4 py-4">
            <SketchPicker
              color={tempColor}
              onChange={handleChange}
              disableAlpha={false}
              presetColors={ALECIA_PRESET_COLORS}
              width={220}
            />
            
            <div className="flex items-center gap-2 w-full justify-end pt-2 border-t border-[var(--border)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="gap-1"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="gap-1 btn-gold"
              >
                <Check className="w-4 h-4" />
                Appliquer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
