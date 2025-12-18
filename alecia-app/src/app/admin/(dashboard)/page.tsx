import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Newspaper, Users, TrendingUp, Sparkles, LayoutDashboard, FileText, Mail, Languages, MessageSquare, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getDealStats, getRecentDeals, getDealsBySector } from "@/lib/actions/deals";
import { getPostCount } from "@/lib/actions/posts";
import { getTeamMemberCount } from "@/lib/actions/team";
import { DashboardSkeleton } from "@/components/admin/skeletons";
import { DashboardChart } from "@/components/admin/dashboard-chart";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

async function DashboardContent() {
  // Fetch stats from database
  const [dealCount, postCount, teamCount, recentDealsData, dealsBySector] = await Promise.all([
    getDealStats(),
    getPostCount(),
    getTeamMemberCount(),
    getRecentDeals(3),
    getDealsBySector(),
  ]);

  const stats = [
    { label: "Opérations", value: dealCount, icon: Briefcase, href: "/admin/deals", change: `${dealCount} au total`, color: "text-blue-500" },
    { label: "Articles", value: postCount, icon: Newspaper, href: "/admin/news", change: `${postCount} au total`, color: "text-green-500" },
    { label: "Membres", value: teamCount, icon: Users, href: "/admin/team", change: "Tous actifs", color: "text-purple-500" },
  ];

  const recentDeals = recentDealsData.map(deal => ({
    name: `${deal.clientName} / ${deal.acquirerName || "N/A"}`,
    type: deal.mandateType,
    date: deal.year.toString(),
  }));

  // Clean data for chart (remove null sectors)
  const chartData = dealsBySector
    .filter(item => item.name)
    .map(item => ({
      name: item.name as string,
      value: item.value,
    }));

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            Vue d&apos;ensemble
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1 text-lg">
            Gérez vos opérations, vos contenus et votre marketing.
          </p>
        </div>
        <Link href="/admin/marketing">
           <div className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white px-4 py-2 rounded-md shadow-md flex items-center gap-2 transition-all">
               <Sparkles className="w-4 h-4" />
               <span>Marketing Studio</span>
           </div>
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group">
            <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-full group-hover:border-[var(--accent)] transition-all">
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h4 className="text-title-md font-bold text-black dark:text-white">
                    {stat.value}
                  </h4>
                  <span className="text-sm font-medium text-bodydark">{stat.label}</span>
                </div>

                <span className="text-sm font-medium text-meta-3">
                   {stat.change}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Marketing & Tools Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Marketing Studio & Création IA
                </h3>
            </div>
            <div className="p-6.5">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-2 dark:bg-meta-4 rounded-lg border border-transparent hover:border-primary hover:shadow-md transition-all text-center">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <span className="text-sm font-medium text-black dark:text-white">Articles</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-2 dark:bg-meta-4 rounded-lg border border-transparent hover:border-primary hover:shadow-md transition-all text-center">
                        <Mail className="w-6 h-6 text-orange-500" />
                        <span className="text-sm font-medium text-black dark:text-white">Emails</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-2 dark:bg-meta-4 rounded-lg border border-transparent hover:border-primary hover:shadow-md transition-all text-center">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        <span className="text-sm font-medium text-black dark:text-white">LinkedIn</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-2 dark:bg-meta-4 rounded-lg border border-transparent hover:border-primary hover:shadow-md transition-all text-center">
                        <LayoutDashboard className="w-6 h-6 text-pink-500" />
                        <span className="text-sm font-medium text-black dark:text-white">Carrousels</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-2 dark:bg-meta-4 rounded-lg border border-transparent hover:border-primary hover:shadow-md transition-all text-center">
                        <Languages className="w-6 h-6 text-green-500" />
                        <span className="text-sm font-medium text-black dark:text-white">Traductions</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-2 dark:bg-meta-4 rounded-lg border border-transparent hover:border-primary hover:shadow-md transition-all text-center">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        <span className="text-sm font-medium text-black dark:text-white">Conseils</span>
                    </Link>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deals */}
        <div className="lg:col-span-2 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex items-center justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Opérations récentes
            </h3>
            <Link
              href="/admin/deals"
              className="text-sm text-primary hover:underline font-medium"
            >
              Tout voir →
            </Link>
          </div>
          <div className="p-6.5">
            <div className="flex flex-col gap-3">
              {recentDeals.length > 0 ? recentDeals.map((deal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-stroke dark:border-strokedark last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-2 dark:bg-meta-4 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-bodydark2" />
                    </div>
                    <div>
                        <h5 className="font-medium text-black dark:text-white text-sm">
                        {deal.name}
                        </h5>
                        <span className="text-xs text-bodydark2">
                        {deal.type}
                        </span>
                    </div>
                  </div>
                  <span className="text-sm text-black dark:text-white font-medium">
                    {deal.date}
                  </span>
                </div>
              )) : (
                  <div className="py-4 text-center text-bodydark2">
                      Aucune opération récente.
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Sector Distribution Chart */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Répartition sectorielle
            </h3>
          </div>
          <div className="p-6.5 h-80">
            <DashboardChart data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
