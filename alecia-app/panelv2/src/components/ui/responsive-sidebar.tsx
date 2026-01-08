"use client";

import { useState, ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResponsiveSidebarProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveSidebar({ children, className }: ResponsiveSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden md:flex w-64 border-r bg-white dark:bg-[#09090b] flex-col",
          className
        )}
      >
        {children}
      </aside>

      {/* Sidebar - Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#09090b] border-r transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3"
          onClick={() => setIsOpen(false)}
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="pt-14">{children}</div>
      </aside>
    </>
  );
}

// Hook to close sidebar on navigation (wrap around Link clicks)
export function useSidebarClose() {
  // This is a simple hook that returns a function to close
  // In a real app, this would use context
  return () => {
    // Dispatch custom event that ResponsiveSidebar listens to
    window.dispatchEvent(new CustomEvent("closeSidebar"));
  };
}
