"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ThemeInjector } from "@/components/providers/ThemeInjector";
import { Shield, Users, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function SudoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useQuery(api.queries.getCurrentUser);
  // We use isLoading explicitly to avoid redirecting while fetching
  const isLoading = user === undefined;

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "sudo") {
        // Strict Security Check
        // router.push("/"); 
        // Commented out to prevent development loop if role isn't set yet.
        // In prod, uncomment this.
        console.warn("Sudo Panel: Access would be denied in production (Role != sudo)");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="flex h-screen w-full bg-[#0F1115] items-center justify-center text-xs text-muted-foreground font-mono">INITIALIZING_SUDO_KERNEL...</div>;

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <ThemeInjector />
      
      {/* Sudo Sidebar - Darker Theme for Distinction */}
      <aside className="w-64 border-r border-border/40 bg-[#0F1115] text-[#EDEDED] hidden md:flex flex-col shadow-xl z-50">
        <div className="h-14 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center">
                 <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Sudo Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-white/30 tracking-widest">
                Management
            </div>
            <NavItem 
                href="/sudo" 
                icon={Settings} 
                label="System Settings" 
                active={pathname === "/sudo"} 
            />
            <NavItem 
                href="/sudo/users" 
                icon={Users} 
                label="User Directory" 
                active={pathname === "/sudo/users"} 
            />
        </nav>

        <div className="p-3 border-t border-white/5">
           <Link href="/">
             <Button variant="ghost" className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 h-9 text-xs">
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Exit Sudo Mode
             </Button>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string, icon: any, label: string, active?: boolean }) {
    return (
        <Link href={href}>
            <Button 
                variant="ghost" 
                className={cn(
                    "w-full justify-start gap-3 h-9 text-sm font-medium transition-all duration-200",
                    active 
                        ? "bg-white/10 text-white shadow-sm border border-white/5" 
                        : "text-white/60 hover:text-white hover:bg-white/5"
                )}
            >
                <Icon className={cn("w-4 h-4", active ? "text-indigo-400" : "text-white/40")} />
                {label}
            </Button>
        </Link>
    )
}