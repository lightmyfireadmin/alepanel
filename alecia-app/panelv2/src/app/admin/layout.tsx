"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-background">
          {/* Breadcrumbs bar */}
          <div className="border-b bg-muted/30">
            <div className="container mx-auto px-6 py-3">
              <Breadcrumbs />
            </div>
          </div>
          {/* Page content */}
          <main>{children}</main>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
