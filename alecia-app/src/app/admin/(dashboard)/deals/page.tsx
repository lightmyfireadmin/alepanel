import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Opérations",
};

// Mock data - Replace with DB queries
const deals = [
  {
    id: "1",
    clientName: "SAFE GROUPE",
    acquirerName: "Dogs Security",
    sector: "Distribution & services B2B",
    year: 2024,
    mandateType: "Acquisition",
  },
  {
    id: "2",
    clientName: "Signes",
    acquirerName: "La/Ba Architectes",
    sector: "Distribution & services B2C",
    year: 2024,
    mandateType: "Cession",
  },
  {
    id: "3",
    clientName: "XRL Consulting",
    acquirerName: "BPCE",
    sector: "Distribution & services B2B",
    year: 2023,
    mandateType: "Levée de fonds",
  },
  {
    id: "4",
    clientName: "Kanopé",
    acquirerName: "Metagram",
    sector: "Services financiers & assurance",
    year: 2023,
    mandateType: "Cession",
  },
  {
    id: "5",
    clientName: "HMR",
    acquirerName: "Leclerc",
    sector: "Distribution & services B2C",
    year: 2022,
    mandateType: "Cession",
  },
];

const mandateColors: Record<string, string> = {
  Cession: "bg-emerald-500/20 text-emerald-400",
  Acquisition: "bg-blue-500/20 text-blue-400",
  "Levée de fonds": "bg-purple-500/20 text-purple-400",
};

export default function AdminDealsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            Opérations
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Gérez les opérations affichées sur le site
          </p>
        </div>
        <Button asChild className="btn-gold rounded-lg">
          <Link href="/admin/deals/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle opération
          </Link>
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">
            {deals.length} opérations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border)]">
                <TableHead className="text-[var(--foreground-muted)]">Client</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Acquéreur</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Secteur</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Année</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Type</TableHead>
                <TableHead className="text-[var(--foreground-muted)] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => (
                <TableRow key={deal.id} className="border-[var(--border)]">
                  <TableCell className="font-medium text-[var(--foreground)]">
                    {deal.clientName}
                  </TableCell>
                  <TableCell className="text-[var(--foreground-muted)]">
                    {deal.acquirerName}
                  </TableCell>
                  <TableCell className="text-[var(--foreground-muted)]">
                    {deal.sector}
                  </TableCell>
                  <TableCell className="text-[var(--foreground-muted)]">
                    {deal.year}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={mandateColors[deal.mandateType] || ""}
                    >
                      {deal.mandateType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      >
                        <Link href={`/admin/deals/${deal.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[var(--foreground-muted)] hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
