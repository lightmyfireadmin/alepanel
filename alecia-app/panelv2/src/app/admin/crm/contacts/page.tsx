"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { DataTable } from "@/components/ui/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EntityDrawer } from "@/components/features/crm/EntityDrawer";
import { useState } from "react";
import { Mail, Phone, Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
import { EmptyContacts } from "@/components/ui/empty-state";

export default function ContactsPage() {
  const contacts = useQuery(api.crm.getContacts);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "fullName",
      header: "Contact",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 rounded-full border">
              {/* Assuming no avatarUrl on contact yet, using fallback */}
              <AvatarFallback className="bg-slate-100 text-slate-600 text-xs font-medium">
                {c.fullName.split(' ').map((n:string) => n[0]).join('').substring(0,2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-foreground">{c.fullName}</span>
              <span className="text-xs text-muted-foreground">{c.role || "No Role"}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "companyName",
      header: "Company",
      cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors cursor-pointer">
                <Building className="w-3.5 h-3.5 text-muted-foreground" />
                {row.original.companyName}
            </div>
        )
      }
    },
    {
        accessorKey: "email",
        header: "Contact Info",
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5 text-xs">
                {row.original.email && (
                    <div className="flex items-center gap-1.5 text-foreground/90">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {row.original.email}
                    </div>
                )}
                {row.original.phone && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {row.original.phone}
                    </div>
                )}
            </div>
        )
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => {
            const tags = row.original.tags || [];
            return (
                <div className="flex gap-1">
                    {tags.length > 0 ? tags.map((t:string) => (
                        <span key={t} className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                            {t}
                        </span>
                    )) : <span className="text-muted-foreground text-xs">-</span>}
                </div>
            )
        }
    }
  ];

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">Directory of key stakeholders and owners.</p>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Nouveau contact
        </Button>
      </div>
      
      {contacts === undefined ? (
        <div className="p-4 bg-card rounded-md border">
          <TableSkeleton rows={6} columns={4} />
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-card rounded-md border">
          <EmptyContacts onAction={() => {}} />
        </div>
      ) : (
        <DataTable 
            columns={columns} 
            data={contacts} 
            onRowClick={(row) => setSelectedContact(row)}
            filterColumn="fullName"
            filterPlaceholder="Search contacts..."
        />
      )}

      <EntityDrawer
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title={selectedContact?.fullName || ""}
        subtitle={selectedContact?.companyName}
        type="contact"
        data={selectedContact}
      />
    </div>
  );
}
