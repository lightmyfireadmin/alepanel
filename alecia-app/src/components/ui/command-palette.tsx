"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "cmdk";
import { 
  Calculator, 
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  PenTool,
  Sheet,
  ScrollText,
  TrendingUp,
  Globe,
  Settings
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
        <div className="w-full max-w-2xl bg-white dark:bg-boxdark rounded-xl shadow-2xl border border-stroke dark:border-strokedark overflow-hidden">
            <CommandInput 
                placeholder="Tapez une commande ou recherchez..." 
                className="w-full px-4 py-4 text-base bg-transparent border-b border-stroke dark:border-strokedark outline-none text-black dark:text-white placeholder-bodydark2"
            />
            <CommandList className="max-h-[60vh] overflow-y-auto p-2">
                <CommandEmpty className="py-6 text-center text-bodydark2">Aucun résultat trouvé.</CommandEmpty>
                
                <CommandGroup heading="Suggestions" className="text-xs font-bold text-bodydark2 uppercase p-2">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    <span>Tableau de bord</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/deals"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <span>Gérer les Transactions</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/crm"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <Users className="w-4 h-4 text-primary" />
                    <span>CRM & Contacts</span>
                </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2 h-px bg-stroke dark:bg-strokedark" />

                <CommandGroup heading="Communication" className="text-xs font-bold text-bodydark2 uppercase p-2">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/forum"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <span>Forum Interne</span>
                </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Collaboration" className="text-xs font-bold text-bodydark2 uppercase p-2">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/whiteboard"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <PenTool className="w-4 h-4 text-primary" />
                    <span>Tableau Blanc</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/sheets"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <Sheet className="w-4 h-4 text-primary" />
                    <span>Feuilles de Calcul</span>
                </CommandItem>
                 <CommandItem onSelect={() => runCommand(() => router.push("/admin/documents"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <ScrollText className="w-4 h-4 text-primary" />
                    <span>Documents & Signatures</span>
                </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Intelligence" className="text-xs font-bold text-bodydark2 uppercase p-2">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/research"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>Études de Marché (AI)</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/marketing"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>Marketing & Analytics</span>
                </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2 h-px bg-stroke dark:bg-strokedark" />

                <CommandGroup heading="Système" className="text-xs font-bold text-bodydark2 uppercase p-2">
                <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <Settings className="w-4 h-4 text-primary" />
                    <span>Paramètres</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/sudo"))} className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer hover:bg-primary/10 text-black dark:text-white group">
                    <Calculator className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Accès Sudo</span>
                </CommandItem>
                </CommandGroup>
            </CommandList>
        </div>
      </div>
    </CommandDialog>
  );
}