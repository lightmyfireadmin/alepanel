"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

// Route labels mapping
const routeLabels: Record<string, string> = {
  admin: "Administration",
  projects: "Projets",
  deals: "Opérations",
  crm: "CRM",
  documents: "Documents",
  news: "Actualités",
  team: "Équipe",
  new: "Nouveau",
  expertises: "Expertises",
  operations: "Opérations",
  actualites: "Actualités",
  equipe: "Équipe",
  contact: "Contact",
  "nous-rejoindre": "Nous rejoindre",
  "mentions-legales": "Mentions légales",
  "politique-de-confidentialite": "Confidentialité",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (pathname === "/" || pathname === "/admin") return null;
  
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
        <li>
          <Link 
            href={pathname.startsWith("/admin") ? "/admin" : "/"}
            className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        {breadcrumbs.map((item, idx) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-[var(--foreground-faint)]" />
            {idx === breadcrumbs.length - 1 ? (
              <span className="text-[var(--foreground)] font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-[var(--foreground)] transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
