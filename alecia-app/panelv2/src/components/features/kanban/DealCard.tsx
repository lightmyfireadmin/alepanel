"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Flame, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Id } from "../../../../../convex/_generated/dataModel";

export interface Deal {
  _id: Id<"deals">;
  _creationTime: number;
  title: string;
  amount?: number;
  stage: string;
  companyName?: string;
  companyLogo?: string;
  ownerName?: string;
  ownerAvatar?: string;
}

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Logic for Tags: "Hot" if created recently (e.g. last 7 days) for demo, 
  // or Stalled if older. Real logic would use updatedAt if available.
  const daysSinceCreation = (Date.now() - deal._creationTime) / (1000 * 60 * 60 * 24);
  const isHot = daysSinceCreation < 7; 
  const isStalled = daysSinceCreation > 30;

  const formatAmount = (amount?: number) => {
    if (!amount) return "-";
    if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}k`;
    return `€${amount}`;
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group border-l-4 border-l-transparent hover:border-l-primary">
        <CardHeader className="p-3 pb-0 space-y-0">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground border-slate-200">
               {deal.companyName}
            </Badge>
            {isHot && <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none text-[10px] px-1"><Flame className="w-3 h-3 mr-1" /> Hot</Badge>}
            {isStalled && <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-none text-[10px] px-1"><Clock className="w-3 h-3 mr-1" /> Stalled</Badge>}
          </div>
          <h4 className="font-semibold text-sm mt-2 line-clamp-2 leading-tight">
            {deal.title}
          </h4>
        </CardHeader>
        <CardContent className="p-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                 {deal.companyLogo ? (
                    <img src={deal.companyLogo} alt="Logo" className="w-4 h-4 rounded-sm object-cover" />
                 ) : (
                    <Building2 className="w-3.5 h-3.5" />
                 )}
                 <span className="font-mono text-foreground font-medium">{formatAmount(deal.amount)}</span>
            </div>
        </CardContent>
        <Separator />
        <CardFooter className="p-2 flex justify-between items-center bg-muted/5">
             <div className="flex -space-x-1.5">
                  {/* Fake team faces for density */}
                  <div className="h-5 w-5 rounded-full border-2 border-white bg-slate-200" />
                  <div className="h-5 w-5 rounded-full border-2 border-white bg-slate-300" />
             </div>
             <Avatar className="h-5 w-5 border border-white shadow-sm">
                <AvatarImage src={deal.ownerAvatar} />
                <AvatarFallback className="text-[9px]">{deal.ownerName?.charAt(0)}</AvatarFallback>
             </Avatar>
        </CardFooter>
      </Card>
    </div>
  );
}
