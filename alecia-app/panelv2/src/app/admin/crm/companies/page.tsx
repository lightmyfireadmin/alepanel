"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EntityDrawer } from "@/components/features/crm/EntityDrawer";
import { PipedriveSync } from "@/components/features/crm/PipedriveSync";
import { useState } from "react";
import { Database, Globe, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompaniesPage() {
  const companies = useQuery(api.crm.getCompanies);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "company",
      header: "Société",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-md border">
              <AvatarImage src={c.logoUrl} />
              <AvatarFallback className="rounded-md bg-primary/5 text-primary text-xs font-bold">
                {c.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">{c.name}</span>
              <span className="text-xs text-muted-foreground font-mono">{c.website}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "financials",
      header: "Financiers",
      cell: ({ row }) => {
        const f = row.original.financials;
        if (!f) return <span className="text-xs text-muted-foreground">-</span>;
        
        // Formatter helper
        const formatK = (n: number) => {
            if (n >= 1000000) return `€${(n / 1000000).toFixed(1)}M`;
            if (n >= 1000) return `€${(n / 1000).toFixed(0)}k`;
            return `€${n}`;
        };

        return (
          <div className="flex flex-col text-xs">
            {f.revenue && <span className="font-medium text-foreground">{formatK(f.revenue)} CA</span>}
            {f.ebitda && <span className="text-muted-foreground">{formatK(f.ebitda)} EBE</span>}
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Secteur / Région",
      cell: ({ row }) => {
        // Mock tags logic if fields not explicit in schema yet, or map from NAF
        const tags = [];
        if (row.original.nafCode) tags.push(row.original.nafCode);
        if (row.original.address?.city) tags.push(row.original.address.city);
        
        return (
            <div className="flex flex-wrap gap-1">
                {tags.slice(0, 2).map((t: string) => (
                    <Badge key={t} variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-slate-200 text-slate-600 bg-slate-50">
                        {t}
                    </Badge>
                ))}
            </div>
        )
      }
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const isPappers = !!row.original.pappersId;
        const isPipedrive = !!row.original.pipedriveId;
        if (isPipedrive) return (
            <div className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded w-fit">
                <Database className="w-3 h-3" /> Pipedrive
            </div>
        );
        if (isPappers) return (
            <div className="flex items-center gap-1 text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
                <Database className="w-3 h-3" /> Pappers
            </div>
        );
        return (
             <div className="flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                <Globe className="w-3 h-3" /> Manual
            </div>
        );
      }
    }
  ];

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Sociétés</h1>
            <p className="text-muted-foreground">Gérez votre pipeline de sourcing et portefeuille.</p>
        </div>
        <div className="flex gap-2">
          <PipedriveSync />
          <Button size="sm" className="gap-1">
            <Plus className="w-4 h-4" />
            Nouvelle société
          </Button>
        </div>
      </div>
      
      {companies === undefined ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-muted-foreground" /></div>
      ) : (
        <DataTable 
            columns={columns} 
            data={companies} 
            onRowClick={(row) => setSelectedCompany(row)}
            filterColumn="name"
        />
      )}

      <EntityDrawer
        isOpen={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        title={selectedCompany?.name || ""}
        subtitle={selectedCompany?.website}
        type="company"
        data={selectedCompany}
      />
    </div>
  );
}
