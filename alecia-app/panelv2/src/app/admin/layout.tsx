"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background flex">
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col min-h-screen md:ml-0">
            {/* Breadcrumbs bar */}
            <div className="border-b bg-muted/30">
              <div className="px-6 py-3 pl-14 md:pl-6">
                <Breadcrumbs />
              </div>
            </div>
            {/* Page content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
