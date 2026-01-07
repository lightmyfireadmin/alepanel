"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Edit, Building2, User } from "lucide-react";
import { CompanyEnricher } from "./CompanyEnricher";
import { Id } from "../../../../convex/_generated/dataModel";

interface EntityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type: "company" | "contact";
  data: any; // Flexible data prop
}

export function EntityDrawer({
  isOpen,
  onClose,
  title,
  subtitle,
  type,
  data,
}: EntityDrawerProps) {
  if (!data) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-hidden flex flex-col p-0 border-l">
        <SheetHeader className="px-6 py-4 border-b bg-muted/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    {type === "company" ? <Building2 className="w-4 h-4 text-muted-foreground" /> : <User className="w-4 h-4 text-muted-foreground" />}
                    <Badge variant="outline" className="text-[10px] uppercase">{type}</Badge>
                </div>
                <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground font-mono">
                    {subtitle || (type === "company" ? data.siren : data.email)}
                </SheetDescription>
            </div>
            <div className="flex gap-2">
                {type === "company" && <CompanyEnricher companyId={data._id as Id<"companies">} companyName={data.name} currentData={data} />}
                <Button size="icon" variant="ghost">
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
                {/* Key Metrics / Tags */}
                {type === "company" && data.tags && (
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                )}

                {/* Main Content Tabs */}
                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="w-full justify-start h-9 p-0 bg-transparent border-b rounded-none space-x-6">
                        <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">Details</TabsTrigger>
                        <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">Financials</TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2">Activity</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                             <DetailItem label="Website" value={data.website} isLink />
                             <DetailItem label="Source" value={data.pappersId ? "Pappers" : "Manual"} />
                             <DetailItem label="Address" value={data.address ? `${data.address.city}, ${data.address.country}` : "N/A"} />
                             <DetailItem label="NAF Code" value={data.nafCode} />
                        </div>
                        {data.description && (
                            <div className="space-y-1">
                                <span className="text-xs font-medium text-muted-foreground uppercase">About</span>
                                <p className="text-sm leading-relaxed text-foreground/90">{data.description}</p>
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="financials" className="pt-4">
                        {data.financials ? (
                             <div className="rounded-md border bg-muted/10 overflow-hidden">
                                {Object.entries(data.financials).map(([key, value]) => (
                                    <div key={key} className="flex justify-between p-3 border-b last:border-0 hover:bg-muted/20 text-sm">
                                        <span className="font-medium capitalize text-muted-foreground">{key}</span>
                                        <span className="font-mono tabular-nums">
                                            {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                        </span>
                                    </div>
                                ))}
                             </div>
                        ) : (
                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border border-dashed rounded-md">
                                No financial data available
                            </div>
                        )}
                    </TabsContent>
                    
                    <TabsContent value="activity" className="pt-4">
                         <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border border-dashed rounded-md">
                                Activity log coming soon
                         </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-muted/5">
             <Button className="w-full" variant="outline" onClick={() => window.open(data.website, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Website
             </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({ label, value, isLink }: { label: string, value: any, isLink?: boolean }) {
    if (!value) return null;
    return (
        <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
            <div className="text-sm font-medium truncate">
                {isLink ? (
                    <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {value}
                    </a>
                ) : value}
            </div>
        </div>
    )
}
