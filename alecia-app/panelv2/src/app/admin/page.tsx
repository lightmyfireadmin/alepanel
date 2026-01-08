import { redirect } from "next/navigation";

// Admin index redirects to deals/pipeline
export default function AdminPage() {
  redirect("/admin/deals");
}
