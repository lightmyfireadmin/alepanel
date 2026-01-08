"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Briefcase,
  Building2,
  FileText,
  Home,
  MessageSquare,
  PenLine,
  PieChart,
  Search,
  Settings,
  ShieldCheck,
  Users,
  TrendingUp,
  ClipboardList,
  Newspaper,
  Image as ImageIcon,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Toggle the command palette with ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    { id: "home", label: "Tableau de bord", icon: <Home className="h-4 w-4" />, action: () => router.push("/"), group: "Navigation" },
    { id: "deals", label: "Pipeline M&A", icon: <Briefcase className="h-4 w-4" />, shortcut: "G D", action: () => router.push("/admin/deals"), group: "Navigation" },
    { id: "crm", label: "Intelligence CRM", icon: <Building2 className="h-4 w-4" />, shortcut: "G C", action: () => router.push("/admin/crm"), group: "Navigation" },
    { id: "reporting", label: "Reporting", icon: <PieChart className="h-4 w-4" />, action: () => router.push("/admin/reporting"), group: "Navigation" },
    
    // Collaboration
    { id: "forum", label: "Forum", icon: <MessageSquare className="h-4 w-4" />, action: () => router.push("/admin/forum"), group: "Collaboration" },
    { id: "research", label: "Recherche", icon: <ClipboardList className="h-4 w-4" />, action: () => router.push("/admin/research"), group: "Collaboration" },
    { id: "signatures", label: "Signatures", icon: <PenLine className="h-4 w-4" />, action: () => router.push("/admin/signatures"), group: "Collaboration" },
    { id: "blog", label: "Blog", icon: <FileText className="h-4 w-4" />, action: () => router.push("/admin/blog"), group: "Collaboration" },
    
    // Marketing
    { id: "transactions", label: "Track Record", icon: <TrendingUp className="h-4 w-4" />, action: () => router.push("/admin/transactions"), group: "Site Web" },
    { id: "team", label: "Équipe", icon: <Users className="h-4 w-4" />, action: () => router.push("/admin/team"), group: "Site Web" },
    { id: "careers", label: "Carrières", icon: <Newspaper className="h-4 w-4" />, action: () => router.push("/admin/careers"), group: "Site Web" },
    { id: "tiles", label: "Galerie", icon: <ImageIcon className="h-4 w-4" />, action: () => router.push("/admin/tiles"), group: "Site Web" },
    
    // System
    { id: "sudo", label: "Sudo Panel", icon: <ShieldCheck className="h-4 w-4" />, action: () => router.push("/sudo"), group: "Système" },
    { id: "settings", label: "Paramètres", icon: <Settings className="h-4 w-4" />, shortcut: "G S", action: () => router.push("/admin/settings"), group: "Système" },
    
    // Theme
    { id: "theme-light", label: "Thème Clair", icon: <Sun className="h-4 w-4" />, action: () => setTheme("light"), group: "Apparence" },
    { id: "theme-dark", label: "Thème Sombre", icon: <Moon className="h-4 w-4" />, action: () => setTheme("dark"), group: "Apparence" },
    { id: "theme-system", label: "Thème Système", icon: <Monitor className="h-4 w-4" />, action: () => setTheme("system"), group: "Apparence" },
  ];

  const groups = [...new Set(commands.map((c) => c.group))];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-[640px]">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Rechercher une commande..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              Aucun résultat trouvé.
            </Command.Empty>
            {groups.map((group) => (
              <Command.Group key={group} heading={group}>
                {commands
                  .filter((c) => c.group === group)
                  .map((command) => (
                    <Command.Item
                      key={command.id}
                      value={command.label}
                      onSelect={() => runCommand(command.action)}
                      className="flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-accent aria-selected:bg-accent"
                    >
                      {command.icon}
                      <span className="flex-1">{command.label}</span>
                      {command.shortcut && (
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                          {command.shortcut}
                        </kbd>
                      )}
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
          <div className="border-t px-3 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↑↓</kbd>
              <span>naviguer</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">↵</kbd>
              <span>sélectionner</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">esc</kbd>
              <span>fermer</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Button to show keyboard shortcut hint
export function CommandPaletteTrigger() {
  return (
    <button
      onClick={() => {
        // Dispatch a keyboard event to trigger the palette
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        });
        document.dispatchEvent(event);
      }}
      className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border bg-muted/30 hover:bg-muted/50"
    >
      <Search className="h-3.5 w-3.5" />
      <span>Rechercher...</span>
      <kbd className="ml-auto text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
    </button>
  );
}
