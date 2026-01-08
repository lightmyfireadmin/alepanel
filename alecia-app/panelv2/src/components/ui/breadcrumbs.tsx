"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

// Route label mappings (French)
const routeLabels: Record<string, string> = {
  admin: "Administration",
  deals: "Pipeline M&A",
  crm: "Intelligence",
  companies: "Sociétés",
  contacts: "Contacts",
  reporting: "Reporting",
  forum: "Forum",
  research: "Recherche",
  signatures: "Signatures",
  blog: "Blog",
  transactions: "Track Record",
  team: "Équipe",
  careers: "Carrières",
  tiles: "Galerie",
  governance: "Gouvernance",
  sudo: "Sudo Panel",
  users: "Utilisateurs",
  settings: "Paramètres",
  new: "Nouveau",
};

function getLabelForSegment(segment: string): string {
  // Check if it's a known route
  if (routeLabels[segment]) {
    return routeLabels[segment];
  }
  // If it looks like an ID (long string or UUID), show "Détails"
  if (segment.length > 20 || /^[a-z0-9]{24,}$/i.test(segment)) {
    return "Détails";
  }
  // Capitalize first letter
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (pathname === "/" || pathname === "") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  
  // Build breadcrumb items with paths
  const breadcrumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = getLabelForSegment(segment);
    const isLast = index === segments.length - 1;
    
    return { segment, path, label, isLast };
  });

  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center text-sm text-muted-foreground">
      <Link 
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbs.map(({ path, label, isLast }) => (
        <div key={path} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-2" />
          {isLast ? (
            <span className="font-medium text-foreground">{label}</span>
          ) : (
            <Link 
              href={path}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
