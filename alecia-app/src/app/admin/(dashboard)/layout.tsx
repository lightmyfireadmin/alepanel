import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await auth();

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