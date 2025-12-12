import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Newspaper, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

// Mock stats - Replace with actual DB queries
const stats = [
  { label: "Opérations", value: 50, icon: Briefcase, href: "/admin/deals", change: "+2 ce mois" },
  { label: "Articles", value: 1, icon: Newspaper, href: "/admin/news", change: "1 brouillon" },
  { label: "Membres", value: 8, icon: Users, href: "/admin/team", change: "Tous actifs" },
];

const recentDeals = [
  { name: "SAFE GROUPE / Dogs Security", type: "Acquisition", date: "2024" },
  { name: "Signes / La/Ba Architectes", type: "Cession", date: "2024" },
  { name: "XRL Consulting / BPCE", type: "Levée de fonds", date: "2023" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
          Tableau de bord
        </h1>
        <p className="text-[var(--foreground-muted)] mt-1">
          Bienvenue dans l&apos;administration alecia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)] transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-[var(--foreground-muted)]">
                  {stat.label}
                </CardTitle>
                <stat.icon className="w-5 h-5 text-[var(--accent)]" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[var(--foreground)]">
                  {stat.value}
                </div>
                <p className="text-xs text-[var(--foreground-muted)] mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[var(--foreground)]">
              Opérations récentes
            </CardTitle>
            <Link
              href="/admin/deals"
              className="text-sm text-[var(--accent)] hover:underline"
            >
              Voir tout →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.map((deal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                >
                  <div>
                    <p className="text-[var(--foreground)] font-medium text-sm">
                      {deal.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {deal.type}
                    </p>
                  </div>
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {deal.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[var(--card)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/admin/deals/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-[var(--foreground)]">
                Ajouter une opération
              </span>
            </Link>
            <Link
              href="/admin/news/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              <Newspaper className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-[var(--foreground)]">
                Créer un article
              </span>
            </Link>
            <Link
              href="/admin/team/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              <Users className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-[var(--foreground)]">
                Ajouter un membre
              </span>
            </Link>
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--accent)]/10 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-[var(--accent)]" />
              <span className="text-[var(--foreground)]">
                Voir le site public
              </span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
