
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-[var(--background-tertiary)] rounded" />
          <div className="h-4 w-96 bg-[var(--background-tertiary)] rounded" />
        </div>
        <div className="h-10 w-40 bg-[var(--background-tertiary)] rounded" />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-32">
            <div className="flex items-center gap-4 h-full">
              <div className="h-12 w-12 rounded-full bg-[var(--background-tertiary)]" />
              <div className="flex-1 space-y-2">
                <div className="h-6 w-12 bg-[var(--background-tertiary)] rounded" />
                <div className="h-4 w-24 bg-[var(--background-tertiary)] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marketing & Tools Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6">
           <div className="h-6 w-48 bg-[var(--background-tertiary)] rounded mb-6" />
           <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 rounded-lg bg-[var(--background-tertiary)]" />
              ))}
           </div>
        </div>
      </div>

      {/* Recent Deals & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-80 bg-[var(--background-tertiary)]" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-80 bg-[var(--background-tertiary)]" />
      </div>
    </div>
  );
}
