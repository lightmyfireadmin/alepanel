import { redirect } from "next/navigation";

// Admin index redirects to dashboard
export default function AdminPage() {
  redirect("/admin/dashboard");
}

