import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Building2,
  FileText,
  FolderOpen,
  Inbox,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          <div className="h-8 w-8 text-muted-foreground">{icon}</div>
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios

export function EmptyDeals({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Briefcase className="h-8 w-8" />}
      title="Aucun dossier en cours"
      description="Commencez par créer votre premier dossier M&A pour gérer vos opportunités."
      action={onAction ? { label: "Créer un dossier", onClick: onAction } : undefined}
    />
  );
}

export function EmptyCompanies({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Building2 className="h-8 w-8" />}
      title="Aucune société trouvée"
      description="Ajoutez des sociétés à votre CRM pour suivre vos prospects et contacts."
      action={onAction ? { label: "Ajouter une société", onClick: onAction } : undefined}
    />
  );
}

export function EmptyContacts({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8" />}
      title="Aucun contact"
      description="Les contacts vous permettent de suivre les relations avec les décideurs."
      action={onAction ? { label: "Ajouter un contact", onClick: onAction } : undefined}
    />
  );
}

export function EmptyThreads({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<MessageSquare className="h-8 w-8" />}
      title="Aucune discussion"
      description="Créez un nouveau sujet pour démarrer une discussion avec votre équipe."
      action={onAction ? { label: "Nouvelle discussion", onClick: onAction } : undefined}
    />
  );
}

export function EmptyDocuments({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8" />}
      title="Aucun document"
      description="Importez ou créez des documents pour les partager avec votre équipe."
      action={onAction ? { label: "Ajouter un document", onClick: onAction } : undefined}
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8" />}
      title="Aucun résultat"
      description="Essayez de modifier vos critères de recherche ou vérifiez l'orthographe."
    />
  );
}

export function EmptyFolder() {
  return (
    <EmptyState
      icon={<FolderOpen className="h-8 w-8" />}
      title="Dossier vide"
      description="Ce dossier ne contient aucun fichier pour le moment."
    />
  );
}

export function EmptyInbox() {
  return (
    <EmptyState
      icon={<Inbox className="h-8 w-8" />}
      title="Rien à afficher"
      description="Toutes les notifications ont été traitées."
    />
  );
}
