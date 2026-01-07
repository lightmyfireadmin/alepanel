"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DealCard, Deal } from "@/components/features/kanban/DealCard";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/data-table"; // Reusing the list view component
import { LayoutGrid, List, Plus } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const STAGES = ["Lead", "NDA Signed", "Offer Received", "Due Diligence", "Closing"];

export default function DealsPage() {
  const dealsQuery = useQuery(api.deals.getDeals);
  const moveDeal = useMutation(api.deals.moveDeal);
  
  // Local state for view mode (default to board)
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  // Optimistic state for drag and drop
  const [items, setItems] = useState<Record<string, Deal[]>>({});
  const [activeId, setActiveId] = useState<Id<"deals"> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("deals_view_mode");
    if (saved === "list" || saved === "board") {
        setViewMode(saved);
    }
  }, []);

  useEffect(() => {
    if (dealsQuery) {
        // Group deals by stage
        const groups: Record<string, Deal[]> = {};
        STAGES.forEach(stage => groups[stage] = []);
        dealsQuery.forEach((deal) => {
            if (groups[deal.stage]) {
                groups[deal.stage].push(deal as Deal);
            } else {
                // Handle unknown stages or fallback
                groups["Lead"]?.push(deal as Deal);
            }
        });
        setItems(groups);
    }
  }, [dealsQuery]);

  const toggleView = (mode: "board" | "list") => {
      setViewMode(mode);
      localStorage.setItem("deals_view_mode", mode);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Fix for button clicks vs drag
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as Id<"deals">);
  };

  const handleDragOver = (event: DragOverEvent) => {
      // For simple kanban logic (column to column), mostly handled in DragEnd
      // But for reordering within column we might need this.
      // Keeping it simple: we only care about dropping into a container.
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id as Id<"deals">;
    
    // Reset active
    setActiveId(null);

    if (!over) return;

    // Identify target column
    // The 'over' id could be a droppable container (stage name) OR another sortable item (deal id)
    let newStage = over.id as string;
    
    // If we dropped over an item, find its stage
    if (!STAGES.includes(newStage)) {
        // Find the deal in our items to get its stage
        // This is a bit inefficient search but fine for small lists
        const overDeal = dealsQuery?.find(d => d._id === newStage);
        if (overDeal) {
            newStage = overDeal.stage;
        } else {
            return; // Invalid drop
        }
    }

    // Find current stage
    const currentDeal = dealsQuery?.find(d => d._id === activeId);
    if (!currentDeal) return;

    if (currentDeal.stage !== newStage) {
        // Optimistic update locally
        const previousStage = currentDeal.stage;
        
        // Update Convex
        try {
            await moveDeal({ dealId: activeId, newStage });
            toast.success(`Moved to ${newStage}`);
        } catch (e) {
            toast.error("Failed to move deal");
            // Revert would happen automatically via SWR query re-fetch on error, 
            // but manual revert logic could go here.
        }
    }
  };

  // --- List View Columns ---
  const columns: ColumnDef<any>[] = [
      { accessorKey: "title", header: "Deal Name", cell: ({row}) => <span className="font-semibold">{row.original.title}</span> },
      { accessorKey: "companyName", header: "Company" },
      { accessorKey: "amount", header: "Amount", cell: ({row}) => row.original.amount ? `€${row.original.amount.toLocaleString()}` : "-" },
      { accessorKey: "stage", header: "Stage", cell: ({row}) => <Badge variant="secondary">{row.original.stage}</Badge> },
      { accessorKey: "ownerName", header: "Owner" },
  ];

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Deal Flow</h1>
            <p className="text-muted-foreground">Manage your pipeline from sourcing to closing.</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-muted p-1 rounded-md flex">
                <Button 
                    variant={viewMode === "board" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-7 px-3"
                    onClick={() => toggleView("board")}
                >
                    <LayoutGrid className="w-3.5 h-3.5 mr-2" /> Board
                </Button>
                <Button 
                    variant={viewMode === "list" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="h-7 px-3"
                    onClick={() => toggleView("list")}
                >
                    <List className="w-3.5 h-3.5 mr-2" /> List
                </Button>
            </div>
            <Button size="sm" className="h-9">
                <Plus className="w-4 h-4 mr-2" /> New Deal
            </Button>
        </div>
      </div>

      {viewMode === "list" ? (
          <div className="bg-card rounded-md border p-1">
               <DataTable columns={columns} data={dealsQuery || []} />
          </div>
      ) : (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-4 h-full min-w-[1200px]">
                    {STAGES.map((stage) => {
                        const stageDeals = items[stage] || [];
                        const totalAmount = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
                        
                        return (
                            <div key={stage} className="flex flex-col w-72 bg-muted/20 rounded-lg border border-border/50 h-full">
                                <div className="p-3 border-b border-border/40 bg-muted/30 rounded-t-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-semibold text-sm">{stage}</h3>
                                        <Badge variant="outline" className="bg-background text-[10px] h-5 px-1.5 border-slate-200">
                                            {stageDeals.length}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-mono">
                                        €{(totalAmount / 1000000).toFixed(1)}M Total
                                    </p>
                                </div>
                                
                                <SortableContext 
                                    id={stage} 
                                    items={stageDeals.map(d => d._id)} 
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                        {stageDeals.map((deal) => (
                                            <DealCard key={deal._id} deal={deal} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <DragOverlay>
                 {activeId ? (
                     <div className="w-72 rotate-2 opacity-90 cursor-grabbing">
                        {(() => {
                            const deal = dealsQuery?.find(d => d._id === activeId);
                            return deal ? <DealCard deal={deal as Deal} /> : null;
                        })()}
                     </div>
                 ) : null}
            </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
