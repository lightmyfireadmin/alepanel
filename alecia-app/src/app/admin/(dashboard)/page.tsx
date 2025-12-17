import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Newspaper, Users, TrendingUp, Sparkles, LayoutDashboard, FileText, Mail, Languages, MessageSquare, Lightbulb } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getDealStats, getRecentDeals } from "@/lib/actions/deals";
import { getPostCount } from "@/lib/actions/posts";
import { getTeamMemberCount } from "@/lib/actions/team";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboard() {
  // Fetch stats from database
  const [dealCount, postCount, teamCount, recentDealsData] = await Promise.all([
    getDealStats(),
    getPostCount(),
    getTeamMemberCount(),
    getRecentDeals(3),
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
            <Card className="bg-[var(--card)] border-[var(--border)] group-hover:border-[var(--accent)] transition-all duration-300 shadow-sm group-hover:shadow-md h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--foreground-muted)]">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-full bg-[var(--background-tertiary)] ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-[var(--foreground)]">
                  {stat.value}
                </div>
                <p className="text-sm text-[var(--foreground-muted)] mt-2 font-medium">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Marketing & Tools Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-4 bg-gradient-to-r from-[var(--background-secondary)] to-[var(--background-tertiary)] border-[var(--border)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                    Marketing Studio & Création IA
                </CardTitle>
                <CardDescription>
                    Utilisez la puissance de l&apos;IA (Mistral, Groq) pour générer vos contenus en un clic.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all text-center">
                        <FileText className="w-6 h-6 text-blue-500" />
                        <span className="text-sm font-medium">Articles</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all text-center">
                        <Mail className="w-6 h-6 text-orange-500" />
                        <span className="text-sm font-medium">Emails</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all text-center">
                        <MessageSquare className="w-6 h-6 text-indigo-500" />
                        <span className="text-sm font-medium">LinkedIn</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all text-center">
                        <LayoutDashboard className="w-6 h-6 text-pink-500" />
                        <span className="text-sm font-medium">Carrousels</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all text-center">
                        <Languages className="w-6 h-6 text-green-500" />
                        <span className="text-sm font-medium">Traductions</span>
                    </Link>
                    <Link href="/admin/marketing" className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--card)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all text-center">
                        <Lightbulb className="w-6 h-6 text-yellow-500" />
                        <span className="text-sm font-medium">Conseils</span>
                    </Link>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deals */}
        <Card className="lg:col-span-2 bg-[var(--card)] border-[var(--border)] h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--foreground)]">
              Opérations récentes
            </CardTitle>
            <Link
              href="/admin/deals"
              className="text-sm text-[var(--accent)] hover:underline font-medium"
            >
              Tout voir →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y divide-[var(--border)]">
              {recentDeals.length > 0 ? recentDeals.map((deal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-4 hover:bg-[var(--background-tertiary)]/50 px-2 rounded-sm transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--background-secondary)] rounded-full">
                        <Briefcase className="w-4 h-4 text-[var(--foreground-muted)]" />
                    </div>
                    <div>
                        <p className="text-[var(--foreground)] font-semibold text-sm">
                        {deal.name}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                        {deal.type}
                        </p>
                    </div>
                  </div>
                  <span className="text-sm text-[var(--foreground-muted)] font-medium">
                    {deal.date}
                  </span>
                </div>
              )) : (
                  <div className="py-8 text-center text-[var(--foreground-muted)]">
                      Aucune opération récente.
                  </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[var(--card)] border-[var(--border)] h-full">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/deals/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20 transition-all group"
            >
              <Briefcase className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors" />
              <span className="text-[var(--foreground)] font-medium">
                Ajouter une opération
              </span>
            </Link>
            <Link
              href="/admin/news/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20 transition-all group"
            >
              <Newspaper className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors" />
              <span className="text-[var(--foreground)] font-medium">
                Créer un article
              </span>
            </Link>
            <Link
              href="/admin/team/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20 transition-all group"
            >
              <Users className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors" />
              <span className="text-[var(--foreground)] font-medium">
                Ajouter un membre
              </span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 border border-transparent hover:border-[var(--accent)]/20 transition-all group"
            >
              <TrendingUp className="w-5 h-5 text-[var(--foreground-muted)] group-hover:text-[var(--accent)] transition-colors" />
              <span className="text-[var(--foreground)] font-medium">
                Voir le site public
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
