"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "cmdk";
import { 
  Calculator, 
  Calendar, 
  CreditCard, 
  Settings, 
  Smile, 
  User, 
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Search,
  MessageSquare,
  PenTool,
  Sheet,
  ScrollText,
  TrendingUp,
  Globe
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-2xl bg-[var(--card)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden">
            <CommandInput 
                placeholder="Type a command or search..." 
                className="w-full px-4 py-3 text-lg bg-transparent border-b border-[var(--border)] outline-none text-[var(--foreground)] placeholder-[var(--foreground-muted)]"
            />
            <CommandList className="max-h-[60vh] overflow-y-auto p-2">
                <CommandEmpty className="py-6 text-center text-[var(--foreground-muted)]">No results found.</CommandEmpty>
                
                <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/deals"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <Briefcase className="w-4 h-4" />
                    <span>Manage Deals</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/crm"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <Users className="w-4 h-4" />
                    <span>CRM & Contacts</span>
                </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2 h-px bg-[var(--border)]" />

                <CommandGroup heading="Communication">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/forum"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <MessageSquare className="w-4 h-4" />
                    <span>Internal Forum</span>
                </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Collaboration">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/whiteboard"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <PenTool className="w-4 h-4" />
                    <span>New Whiteboard</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/sheets"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <Sheet className="w-4 h-4" />
                    <span>Spreadsheets</span>
                </CommandItem>
                 <CommandItem onSelect={() => runCommand(() => router.push("/admin/documents"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <ScrollText className="w-4 h-4" />
                    <span>Documents & Signatures</span>
                </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Intelligence">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/research"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <Globe className="w-4 h-4" />
                    <span>Market Research (AI)</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/marketing"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <TrendingUp className="w-4 h-4" />
                    <span>Marketing & Analytics</span>
                </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2 h-px bg-[var(--border)]" />

                <CommandGroup heading="System">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/sudo"))} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]">
                    <Calculator className="w-4 h-4" />
                    <span>Sudo Panel</span>
                </CommandItem>
                </CommandGroup>
            </CommandList>
        </div>
      </div>
    </CommandDialog>
  );
}
