"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  pageName?: string;
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
  careers: "Carrières",
  sectors: "Secteurs",
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

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const pathname = usePathname();
  
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbs = pathSegments.map((segment, idx) => {
    const href = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href };
  });

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName || breadcrumbs[breadcrumbs.length - 1]?.label || "Page"}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link 
              href="/admin"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {breadcrumbs.map((item, idx) => (
            <li key={item.href} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-sm font-medium text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.href} 
                  className="text-sm text-gray-500 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
