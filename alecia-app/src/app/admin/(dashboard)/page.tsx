import { DashboardGrid } from "@/components/admin/dashboard/DashboardGrid";
import { getRecentThreads } from "@/lib/actions/forum";
import { getDashboardMetrics } from "@/lib/actions/metrics";
import { getOfficeDashboardData } from "@/lib/actions/office";

export default async function AdminDashboardPage() {
  const forumResult = await getRecentThreads(5);
  const recentThreads = forumResult.success ? forumResult.data || [] : [];
  const metrics = await getDashboardMetrics();
  const officeData = await getOfficeDashboardData();

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Dashboard
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <a className="font-medium" href="/admin">
                Dashboard /
              </a>
            </li>
            <li className="font-medium text-primary">Overview</li>
          </ol>
        </nav>
      </div>
      <DashboardGrid recentThreads={recentThreads} metrics={metrics} officeData={officeData} />
    </>
  );
}
