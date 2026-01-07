"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Paintbrush, RefreshCw } from "lucide-react";

// Helper to convert Hex to HSL (Space separated for Tailwind)
function hexToHsl(hex: string) {
  let c = hex.substring(1).split('');
  if (c.length === 3) {
    c = [c[0], c[0], c[1], c[1], c[2], c[2]];
  }
  const r = parseInt(c.slice(0, 2).join(''), 16) / 255;
  const g = parseInt(c.slice(2, 4).join(''), 16) / 255;
  const b = parseInt(c.slice(4, 6).join(''), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${(h * 360).toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

function ColorPickerInput({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void 
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 h-10 px-3 font-mono text-xs border-muted-foreground/20 hover:border-primary/50 transition-colors"
          >
            <div 
              className="w-4 h-4 rounded-full border shadow-sm shrink-0" 
              style={{ backgroundColor: value }}
            />
            {value}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-32 w-32 p-0 border-0 cursor-pointer"
          />
          <Input 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 h-8 font-mono text-xs text-center"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function ThemeEditor() {
  const settings = useQuery(api.queries.getGlobalSettings);
  const updateSettings = useMutation(api.mutations.updateGlobalSettings);

  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [radius, setRadius] = useState(0.5);
  const [font, setFont] = useState("Inter");

  useEffect(() => {
    if (settings?.theme) {
      if (settings.theme.radius !== undefined && settings.theme.radius !== radius) {
          setRadius(settings.theme.radius);
      }
      if (settings.theme.font && settings.theme.font !== font) {
          setFont(settings.theme.font);
      }
    }
  }, [settings, radius, font]); // dependencies added to ensure correctness, though logic guards loops

  const handleSave = async () => {
    const hslPrimary = hexToHsl(primaryColor);
    
    try {
      await updateSettings({
        theme: {
          primaryColor: hslPrimary,
          radius: radius,
          font: font,
        },
        governance: {
          quorumPercentage: settings?.governance?.quorumPercentage || 50,
        },
      });
      toast.success("Theme updated successfully");
    } catch (error) {
        console.error(error);
      toast.error("Failed to update theme");
    }
  };

  return (
    <Card className="w-full max-w-md border-border/40 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-md">
                <Paintbrush className="w-4 h-4 text-primary" />
            </div>
            <div>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize the interface aesthetics.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <ColorPickerInput 
                label="Primary Brand" 
                value={primaryColor} 
                onChange={setPrimaryColor} 
            />
            {/* Placeholder for Secondary if we add it later */}
             <div className="space-y-2 opacity-50 cursor-not-allowed">
                 <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Secondary</Label>
                 <Button variant="outline" disabled className="w-full justify-start h-10 px-3 border-dashed">
                    Default
                 </Button>
            </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
             <Label htmlFor="radius" className="text-sm font-medium">Border Radius</Label>
             <span className="text-xs font-mono text-muted-foreground">{radius}rem</span>
          </div>
          <Slider
            id="radius"
            min={0}
            max={1}
            step={0.1}
            value={[radius]}
            onValueChange={(vals) => setRadius(vals[0])}
            className="[&>.absolute]:bg-primary"
          />
        </div>
        
        <div className="space-y-2">
           <Label htmlFor="font" className="text-sm font-medium">Typography</Label>
           <SelectFont value={font} onChange={setFont} />
        </div>

        <div className="pt-4">
            <Button onClick={handleSave} className="w-full font-medium" size="lg">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Changes
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SelectFont({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    // Simple mock select for fonts
    return (
        <Input 
             value={value} 
             onChange={(e) => onChange(e.target.value)} 
             className="font-sans"
             placeholder="Inter, sans-serif"
        />
    )
}