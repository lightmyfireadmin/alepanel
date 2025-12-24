"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/layout/Sidebar";
import Header from "@/components/admin/layout/Header";
import { CommandPalette } from "@/components/ui/command-palette";
import { OnboardingManager, VoiceNoteRecorder } from "@/components/admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Login page layout bypass
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Prevent hydration mismatch for client-only components
  if (!isClient) return null;

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
      
      {/* Global OS Components */}
      <CommandPalette />
      <OnboardingManager />
      <VoiceNoteRecorder />
    </div>
  );
}