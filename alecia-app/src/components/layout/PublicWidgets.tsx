"use client";

import { usePathname } from "next/navigation";
import { ContactWidget } from "@/components/features/contact-widget";

export function PublicWidgets() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/sudo");

  if (isAdmin) return null;

  return (
    <>
      <ContactWidget />
    </>
  );
}
