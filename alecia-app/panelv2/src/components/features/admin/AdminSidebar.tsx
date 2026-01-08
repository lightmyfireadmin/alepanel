"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ResponsiveSidebar } from "@/components/ui/responsive-sidebar";
import {
  Briefcase,
  Building2,
  Users,
  BarChart3,
  MessageSquare,
  FileSignature,
  PenTool,
  ClipboardCheck,
  Award,
  Users2,
  BriefcaseBusiness,
  LayoutGrid,
  Settings,
  Home,
} from "lucide-react";

const navItems = [
  { 
    label: "Dashboard", 
    href: "/admin", 
    icon: Home,
    exact: true,
  },
  { type: "divider", label: "M&A" },
  { 
    label: "Pipeline", 
    href: "/admin/deals", 
    icon: Briefcase,
  },
  { 
    label: "Sociétés", 
    href: "/admin/crm/companies", 
    icon: Building2,
  },
  { 
    label: "Contacts", 
    href: "/admin/crm/contacts", 
    icon: Users,
  },
  { type: "divider", label: "Collaboration" },
  { 
    label: "Forum", 
    href: "/admin/forum", 
    icon: MessageSquare,
  },
  { 
    label: "Signatures", 
    href: "/admin/signatures", 
    icon: FileSignature,
  },
  { 
    label: "Recherche", 
    href: "/admin/research", 
    icon: ClipboardCheck,
  },
  { type: "divider", label: "Website" },
  { 
    label: "Track Record", 
    href: "/admin/transactions", 
    icon: Award,
  },
  { 
    label: "Blog", 
    href: "/admin/blog", 
    icon: PenTool,
  },
  { 
    label: "Équipe", 
    href: "/admin/team", 
    icon: Users2,
  },
  { 
    label: "Carrières", 
    href: "/admin/careers", 
    icon: BriefcaseBusiness,
  },
  { 
    label: "Galerie", 
    href: "/admin/tiles", 
    icon: LayoutGrid,
  },
  { type: "divider", label: "Système" },
  { 
    label: "Reporting", 
    href: "/admin/reporting", 
    icon: BarChart3,
  },
  { 
    label: "Paramètres", 
    href: "/admin/settings", 
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <ResponsiveSidebar>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-lg">alecia</span>
            <span className="text-xs text-muted-foreground ml-1">admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item, index) => {
            if (item.type === "divider") {
              return (
                <div key={index} className="pt-4 pb-2 first:pt-0">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3">
                    {item.label}
                  </span>
                </div>
              );
            }

            const Icon = item.icon!;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname?.startsWith(item.href!);

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t text-xs text-muted-foreground text-center">
          Panel v2.0
        </div>
      </div>
    </ResponsiveSidebar>
  );
}
