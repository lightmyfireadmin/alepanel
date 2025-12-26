"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SidebarLinkGroup from "./SidebarLinkGroup";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  LayoutDashboard,
  Settings,
  Users,
  Briefcase,
  FileText,
  PieChart,
  ChevronDown,
  ArrowLeft,
  MessageSquare,
  PenTool,
  Sheet,
  ScrollText,
  Globe,
  Database,
  Building2,
  Newspaper,
  UserPlus,
  Terminal
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLElement>(null);

  // Stored sidebar expanded state
  const [sidebarExpanded, setSidebarExpanded] = useLocalStorage("sidebar-expanded", "true");

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    if (sidebarExpanded) {
      document.body.classList.add("sidebar-expanded");
    } else {
      document.body.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-sidebar text-sidebar-foreground duration-300 ease-linear border-r border-sidebar-border lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                A
            </div>
            <span className="text-xl font-semibold">Alecia OS</span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-sidebar-foreground"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          
          {/* DASHBOARD */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-sidebar-foreground/70">PRINCIPAL</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/admin"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname === "/admin" ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* COMMUNICATION */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-sidebar-foreground/70">COMMUNICATION</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                    <Link
                    href="/admin/forum"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        pathname.includes("forum") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                    }`}
                    >
                    <MessageSquare className="w-5 h-5" />
                    Forum Interne
                    </Link>
                </li>
            </ul>
          </div>

          {/* COLLABORATION */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-sidebar-foreground/70">COLLABORATION</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={pathname.includes("deals") || pathname.includes("projects")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                          (pathname.includes("deals") || pathname.includes("projects")) && "bg-sidebar-accent text-sidebar-accent-foreground"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded("true");
                        }}
                      >
                        <Briefcase className="w-5 h-5" />
                        Transactions & Projets
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${open && "rotate-180"}`} width={20} height={20} />
                      </Link>
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link href="/admin/deals" className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-sidebar-foreground ${pathname === "/admin/deals" ? "text-sidebar-foreground" : "text-sidebar-foreground/60"}`}>
                              Portefeuille (Tombstones)
                            </Link>
                          </li>
                          <li>
                            <Link href="/admin/projects" className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium duration-300 ease-in-out hover:text-sidebar-foreground ${pathname === "/admin/projects" ? "text-sidebar-foreground" : "text-sidebar-foreground/60"}`}>
                              Kanban Opérationnel
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>

              <li>
                <Link
                  href="/admin/whiteboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname.includes("whiteboard") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  Tableau Blanc
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/sheets"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname.includes("sheets") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                  }`}
                >
                  <Sheet className="w-5 h-5" />
                  Feuilles de Calcul
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/documents"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname.includes("documents") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                  }`}
                >
                  <ScrollText className="w-5 h-5" />
                  Documents & Signatures
                </Link>
              </li>
            </ul>
          </div>

          {/* INTELLIGENCE */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-sidebar-foreground/70">INTELLIGENCE</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                    <Link
                    href="/admin/research"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        pathname.includes("research") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                    }`}
                    >
                    <Globe className="w-5 h-5" />
                    Études de Marché
                    </Link>
                </li>
                <li>
                    <Link
                    href="/admin/crm"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        pathname.includes("crm") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                    }`}
                    >
                    <Database className="w-5 h-5" />
                    Base CRM
                    </Link>
                </li>
                 <li>
                    <Link
                    href="/admin/marketing"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        pathname.includes("marketing") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                    }`}
                    >
                    <PieChart className="w-5 h-5" />
                    Marketing & Analytics
                    </Link>
                </li>
            </ul>
          </div>

          {/* WEBSITE */}
          <SidebarLinkGroup activeCondition={pathname.includes("news") || pathname.includes("team") || pathname.includes("sectors") || pathname.includes("careers")}>
            {(handleClick, open) => {
                return (
                <React.Fragment>
                    <Link
                    href="#"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        (pathname.includes("news") || pathname.includes("team") || pathname.includes("sectors")) && "bg-sidebar-accent text-sidebar-accent-foreground"
                    }`}
                    onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded ? handleClick() : setSidebarExpanded("true");
                    }}
                    >
                    <Globe className="w-5 h-5" />
                    Site Web Public
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 ${open && "rotate-180"}`} width={20} height={20} />
                    </Link>
                    <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                    <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        <li><Link href="/admin/news" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground"><Newspaper className="w-4 h-4" /> Actualités</Link></li>
                        <li><Link href="/admin/team" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground"><Users className="w-4 h-4" /> Équipe</Link></li>
                        <li><Link href="/admin/sectors" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground"><Building2 className="w-4 h-4" /> Secteurs</Link></li>
                        <li><Link href="/admin/careers" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground"><UserPlus className="w-4 h-4" /> Carrières</Link></li>
                    </ul>
                    </div>
                </React.Fragment>
                );
            }}
            </SidebarLinkGroup>

          {/* SYSTEM */}
          <div>
            <h3 className="mb-4 ml-4 mt-6 text-sm font-semibold text-sidebar-foreground/70">SYSTÈME</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/admin/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    pathname.includes("settings") ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Paramètres
                </Link>
              </li>
              <li>
                <Link
                  href="/sudo"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-red-400`}
                >
                  <Terminal className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Accès Sudo</span>
                </Link>
              </li>
            </ul>
          </div>
          
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
