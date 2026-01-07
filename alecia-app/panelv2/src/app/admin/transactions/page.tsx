"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  ExternalLink,
  Building2,
  TrendingUp,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function TransactionsPage() {
  const transactions = useQuery(api.transactions.list);
  const duplicateTransaction = useMutation(api.transactions.duplicate);
  const deleteTransaction = useMutation(api.transactions.remove);

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<Id<"transactions"> | null>(null);

  // Get unique sectors for filter
  const sectors = transactions
    ? [...new Set(transactions.map((t) => t.sector))].sort()
    : [];

  // Filter transactions
  const filtered = transactions?.filter((t) => {
    const matchesSearch =
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.acquirerName?.toLowerCase().includes(search.toLowerCase()) ||
      t.sector.toLowerCase().includes(search.toLowerCase());
    const matchesSector = !sectorFilter || t.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const handleDuplicate = async (id: Id<"transactions">) => {
    try {
      await duplicateTransaction({ id });
      toast.success("Transaction dupliquée");
    } catch {
      toast.error("Erreur lors de la duplication");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTransaction({ id: deleteId });
      toast.success("Transaction supprimée");
      setDeleteId(null);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Stats
  const stats = {
    total: transactions?.length || 0,
    confidential: transactions?.filter((t) => t.isConfidential).length || 0,
    priorExp: transactions?.filter((t) => t.isPriorExperience).length || 0,
    sectors: sectors.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            Gérez le track record M&A affiché sur le site
          </p>
        </div>
        <Link href="/admin/transactions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle transaction
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Secteurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sectors}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confidentielles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confidential}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Exp. antérieures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.priorExp}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {sectorFilter || "Tous les secteurs"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSectorFilter(null)}>
              Tous les secteurs
            </DropdownMenuItem>
            {sectors.map((sector) => (
              <DropdownMenuItem
                key={sector}
                onClick={() => setSectorFilter(sector)}
              >
                {sector}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Acquéreur</TableHead>
              <TableHead>Secteur</TableHead>
              <TableHead>Année</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{transaction.clientName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    {transaction.acquirerName || "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.sector}</Badge>
                </TableCell>
                <TableCell>{transaction.year}</TableCell>
                <TableCell>
                  <Badge variant="outline">{transaction.mandateType}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {transaction.isConfidential && (
                      <Badge variant="destructive" className="text-xs">
                        Confidentiel
                      </Badge>
                    )}
                    {transaction.isPriorExperience && (
                      <Badge variant="secondary" className="text-xs">
                        Exp. ant.
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/transactions/${transaction._id}`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(transaction._id)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Dupliquer
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`/operations/${transaction.slug}`}
                          target="_blank"
                          rel="noopener"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Voir sur le site
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(transaction._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette transaction ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La transaction sera définitivement
              supprimée du track record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
