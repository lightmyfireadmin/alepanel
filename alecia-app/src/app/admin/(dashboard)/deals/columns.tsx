"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// This type definition must match the data type in deals-client.tsx
export type Deal = {
  id: string;
  slug: string;
  clientName: string;
  clientLogo?: string | null;
  acquirerName?: string | null;
  acquirerLogo?: string | null;
  sector: string;
  region?: string | null;
  year: number;
  mandateType: string;
  isConfidential: boolean;
  isPriorExperience: boolean;
  context?: string | null;
  intervention?: string | null;
  result?: string | null;
  testimonialText?: string | null;
  testimonialAuthor?: string | null;
  dealSize?: string | null;
};

// Helper for badge colors
const getMandateColor = (type: string) => {
  switch (type) {
    case "Cession": return "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30";
    case "Acquisition": return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30";
    case "Levée de fonds": return "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30";
    default: return "";
  }
};

interface ColumnsProps {
  onEdit: (deal: Deal) => void;
  onDelete: (id: string) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<Deal>[] => [
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium px-4">{row.getValue("clientName")}</div>,
  },
  {
    accessorKey: "acquirerName",
    header: "Acquéreur",
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("acquirerName") || "—"}</div>,
  },
  {
    accessorKey: "sector",
    header: "Secteur",
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Année
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "mandateType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("mandateType") as string;
      return (
        <Badge variant="outline" className={getMandateColor(type)}>
          {type}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const deal = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(deal.id)}>
              Copier l&apos;ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(deal)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(deal.id)} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
