"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Briefcase,
  Newspaper,
  Users,
  LogOut,
  Menu,
  FolderKanban,
  Contact2,
  FileStack,
  Sun,
  Moon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { VoiceNoteRecorder } from "@/components/admin";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/deals", label: "Opérations", icon: Briefcase },
  { href: "/admin/crm", label: "CRM", icon: Contact2 },
  { href: "/admin/documents", label: "Documents", icon: FileStack },
  { href: "/admin/news", label: "Actualités", icon: Newspaper },
  { href: "/admin/team", label: "Équipe", icon: Users },
];

function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/" className="text-2xl font-bold text-[var(--foreground)]">
          alecia
        </Link>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-tertiary)]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)]">
        <Button
          variant="ghost"
          className="w-full justify-start text-[var(--foreground-muted)] hover:text-red-400"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-[var(--background-secondary)] border-r border-[var(--border)]">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center gap-4 h-16 px-4 bg-[var(--background-secondary)] border-b border-[var(--border)]">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-[var(--foreground)]">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-[var(--background-secondary)] border-[var(--border)]"
          >
            <Sidebar onItemClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="flex-1 text-lg font-bold text-[var(--foreground)]">alecia</span>
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          aria-label={resolvedTheme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {mounted && resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      {/* Voice Note Recorder FAB (Mobile only) */}
      <VoiceNoteRecorder />
    </div>
  );
}

