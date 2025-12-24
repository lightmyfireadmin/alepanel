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
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-xl">
                A
            </div>
            <span className="text-white text-xl font-semibold">Alecia OS</span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
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
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MAIN</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/admin"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname === "/admin" ? "bg-graydark dark:bg-meta-4" : ""
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* COMMUNICATION */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">COMMUNICATION</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                    <Link
                    href="/admin/forum"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("forum") ? "bg-graydark dark:bg-meta-4" : ""
                    }`}
                    >
                    <MessageSquare className="w-5 h-5" />
                    Forum
                    </Link>
                </li>
            </ul>
          </div>

          {/* COLLABORATION */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">COLLABORATION</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={pathname.includes("deals") || pathname.includes("projects")}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <Link
                        href="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname.includes("deals") || pathname.includes("projects")) && "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded("true");
                        }}
                      >
                        <Briefcase className="w-5 h-5" />
                        Deals & Projects
                        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`} width={20} height={20} />
                      </Link>
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <Link href="/admin/deals" className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/admin/deals" && "text-white"}`}>
                              Tombstones
                            </Link>
                          </li>
                          <li>
                            <Link href="/admin/projects" className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === "/admin/projects" && "text-white"}`}>
                              Kanban
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
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("whiteboard") ? "bg-graydark dark:bg-meta-4" : ""
                  }`}
                >
                  <PenTool className="w-5 h-5" />
                  Whiteboard
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/sheets"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("sheets") ? "bg-graydark dark:bg-meta-4" : ""
                  }`}
                >
                  <Sheet className="w-5 h-5" />
                  Spreadsheets
                </Link>
              </li>

              <li>
                <Link
                  href="/admin/documents"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("documents") ? "bg-graydark dark:bg-meta-4" : ""
                  }`}
                >
                  <ScrollText className="w-5 h-5" />
                  Documents & Sign
                </Link>
              </li>
            </ul>
          </div>

          {/* INTELLIGENCE */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">INTELLIGENCE</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                    <Link
                    href="/admin/research"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("research") ? "bg-graydark dark:bg-meta-4" : ""
                    }`}
                    >
                    <Globe className="w-5 h-5" />
                    Market Research
                    </Link>
                </li>
                <li>
                    <Link
                    href="/admin/crm"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("crm") ? "bg-graydark dark:bg-meta-4" : ""
                    }`}
                    >
                    <Database className="w-5 h-5" />
                    CRM Database
                    </Link>
                </li>
                 <li>
                    <Link
                    href="/admin/marketing"
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes("marketing") ? "bg-graydark dark:bg-meta-4" : ""
                    }`}
                    >
                    <PieChart className="w-5 h-5" />
                    Marketing Analytics
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
                    className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        (pathname.includes("news") || pathname.includes("team") || pathname.includes("sectors")) && "bg-graydark dark:bg-meta-4"
                    }`}
                    onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded ? handleClick() : setSidebarExpanded("true");
                    }}
                    >
                    <Globe className="w-5 h-5" />
                    Public Website
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"}`} width={20} height={20} />
                    </Link>
                    <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                    <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        <li><Link href="/admin/news" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 hover:text-white"><Newspaper className="w-4 h-4" /> News</Link></li>
                        <li><Link href="/admin/team" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 hover:text-white"><Users className="w-4 h-4" /> Team</Link></li>
                        <li><Link href="/admin/sectors" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 hover:text-white"><Building2 className="w-4 h-4" /> Sectors</Link></li>
                        <li><Link href="/admin/careers" className="group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 hover:text-white"><UserPlus className="w-4 h-4" /> Careers</Link></li>
                    </ul>
                    </div>
                </React.Fragment>
                );
            }}
            </SidebarLinkGroup>

          {/* SYSTEM */}
          <div>
            <h3 className="mb-4 ml-4 mt-6 text-sm font-semibold text-bodydark2">SYSTEM</h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <Link
                  href="/admin/settings"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes("settings") ? "bg-graydark dark:bg-meta-4" : ""
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  href="/sudo"
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4`}
                >
                  <Terminal className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Sudo Access</span>
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