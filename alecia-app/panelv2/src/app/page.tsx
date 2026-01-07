"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  Briefcase, 
  LayoutDashboard,
  Building2,
  PieChart,
  Settings,
  ShieldCheck,
  Plus,
  Search,
  MessageSquare,
  ClipboardList,
  PenLine,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DraggableDashboard } from "@/components/features/dashboard/DraggableDashboard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#fafafa] dark:bg-[#09090b]">
      {/* Sidebar - High Density Design */}
      <aside className="w-64 border-r bg-white dark:bg-[#09090b] hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
             <span className="text-white dark:text-black font-bold text-lg">A</span>
          </div>
          <span className="font-semibold tracking-tight text-lg">Alecia Panel</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem href="/" icon={LayoutDashboard} label="Tableau de bord" active />
          <NavItem href="/admin/deals" icon={Briefcase} label="Pipeline M&A" />
          <NavItem href="/admin/crm" icon={Building2} label="Intelligence" />
          <NavItem href="/admin/reporting" icon={PieChart} label="Reporting" />
          
          <div className="pt-4 pb-2">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Collaboration</span>
          </div>
          <NavItem href="/admin/forum" icon={MessageSquare} label="Forum" />
          <NavItem href="/admin/research" icon={ClipboardList} label="Recherche" />
          <NavItem href="/admin/signatures" icon={PenLine} label="Signatures" />
          <NavItem href="/admin/blog" icon={FileText} label="Blog" />
          
          <div className="pt-4 pb-2">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Système</span>
          </div>
          <NavItem href="/sudo" icon={ShieldCheck} label="Sudo Panel" />
          <NavItem href="/admin/settings" icon={Settings} label="Paramètres" />
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer transition-colors">
            <Avatar className="size-8 border">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">CB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-medium truncate">Christophe B.</span>
               <span className="text-[10px] text-muted-foreground truncate">Partner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b bg-white dark:bg-[#09090b] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="search" 
                placeholder="Search deals, companies..." 
                className="w-full bg-accent/50 border-none rounded-md pl-9 h-9 text-sm focus-visible:ring-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button size="sm" className="bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">
                <Plus className="size-4 mr-2" />
                New Deal
             </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
            <p className="text-muted-foreground">Monitor your M&A pipeline and team performance.</p>
          </div>

          <DraggableDashboard />
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-accent text-accent-foreground" 
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}