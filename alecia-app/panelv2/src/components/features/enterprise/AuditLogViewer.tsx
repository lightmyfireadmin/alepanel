"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Shield, 
  Search,
  Download,
  Filter,
  User,
  FileText,
  Settings,
  AlertTriangle,
  LogIn,
  LogOut,
  Eye,
  Edit,
  Trash2,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AuditLogViewerProps {
  className?: string;
}

interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: "login" | "logout" | "view" | "create" | "update" | "delete" | "export" | "settings";
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  severity: "info" | "warning" | "critical";
}

// Mock audit logs
const mockAuditLogs: AuditEntry[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    userId: "u1",
    userName: "Jean Dupont",
    action: "update",
    resource: "Deal",
    resourceId: "deal-123",
    details: "Changement de phase: NDA → Due Diligence",
    ipAddress: "192.168.1.100",
    severity: "info",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    userId: "u2",
    userName: "Marie Martin",
    action: "export",
    resource: "Deals",
    details: "Export CSV de 45 dossiers",
    ipAddress: "192.168.1.101",
    severity: "warning",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    userId: "u1",
    userName: "Jean Dupont",
    action: "delete",
    resource: "Document",
    resourceId: "doc-456",
    details: "Suppression de 'NDA_v2.pdf'",
    ipAddress: "192.168.1.100",
    severity: "critical",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    userId: "u3",
    userName: "Pierre Bernard",
    action: "login",
    resource: "Auth",
    details: "Connexion réussie via SSO",
    ipAddress: "10.0.0.55",
    severity: "info",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    userId: "u2",
    userName: "Marie Martin",
    action: "settings",
    resource: "GlobalSettings",
    details: "Modification des paramètres de thème",
    ipAddress: "192.168.1.101",
    severity: "warning",
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    userId: "u1",
    userName: "Jean Dupont",
    action: "create",
    resource: "Deal",
    resourceId: "deal-789",
    details: "Création du dossier 'Acquisition MedTech'",
    ipAddress: "192.168.1.100",
    severity: "info",
  },
];

const ACTION_ICONS: Record<AuditEntry["action"], React.ReactNode> = {
  login: <LogIn className="h-4 w-4" />,
  logout: <LogOut className="h-4 w-4" />,
  view: <Eye className="h-4 w-4" />,
  create: <FileText className="h-4 w-4" />,
  update: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  export: <Download className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
};

const ACTION_LABELS: Record<AuditEntry["action"], string> = {
  login: "Connexion",
  logout: "Déconnexion",
  view: "Consultation",
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  export: "Export",
  settings: "Paramètres",
};

const SEVERITY_COLORS: Record<AuditEntry["severity"], string> = {
  info: "text-blue-600 bg-blue-50",
  warning: "text-amber-600 bg-amber-50",
  critical: "text-red-600 bg-red-50",
};

export function AuditLogViewer({ className = "" }: AuditLogViewerProps) {
  const [logs] = useState<AuditEntry[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesAction && matchesSeverity;
  });

  const exportLogs = () => {
    const csv = [
      ["Date", "Utilisateur", "Action", "Ressource", "Détails", "IP", "Sévérité"].join(","),
      ...filteredLogs.map((log) =>
        [
          format(log.timestamp, "dd/MM/yyyy HH:mm:ss"),
          log.userName,
          ACTION_LABELS[log.action],
          log.resource,
          `"${log.details || ""}"`,
          log.ipAddress,
          log.severity,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              Journal d'Audit
            </CardTitle>
            <CardDescription>
              Historique des actions utilisateurs
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={exportLogs} className="gap-1">
            <Download className="h-3 w-3" />
            Exporter
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes actions</SelectItem>
              <SelectItem value="login">Connexion</SelectItem>
              <SelectItem value="create">Création</SelectItem>
              <SelectItem value="update">Modification</SelectItem>
              <SelectItem value="delete">Suppression</SelectItem>
              <SelectItem value="export">Export</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sévérité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Alerte</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">
              {logs.filter((l) => l.severity === "info").length}
            </p>
            <p className="text-xs text-blue-600">Info</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600">
              {logs.filter((l) => l.severity === "warning").length}
            </p>
            <p className="text-xs text-amber-600">Alertes</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-600">
              {logs.filter((l) => l.severity === "critical").length}
            </p>
            <p className="text-xs text-red-600">Critiques</p>
          </div>
        </div>

        {/* Log Table */}
        <ScrollArea className="h-[350px] border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Date</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Détails</TableHead>
                <TableHead className="w-[80px]">Sévérité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {format(log.timestamp, "dd/MM HH:mm", { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{log.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {ACTION_ICONS[log.action]}
                      {ACTION_LABELS[log.action]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{log.resource}</span>
                      {log.details && (
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={SEVERITY_COLORS[log.severity]}>
                      {log.severity === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {log.severity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="text-xs text-muted-foreground text-center">
          {filteredLogs.length} entrée(s) affichée(s) sur {logs.length}
        </div>
      </CardContent>
    </Card>
  );
}
