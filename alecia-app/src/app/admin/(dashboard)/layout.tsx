import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // No need for additional layout wrapper - parent /admin/layout.tsx handles it
  return <>{children}</>;
}
