import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // ⚠️ TEMPORARY BYPASS FOR TESTING PHASE ONLY ⚠️
  // TODO: Re-enable authentication check before production deployment
  // Commented out to allow access without authentication
  /*
  if (!session) {
    redirect("/admin/login");
  }
  */

  // No need for additional layout wrapper - parent /admin/layout.tsx handles it
  return <>{children}</>;
}
