import { getForumCategories } from "@/lib/actions/forum";
import { IconMapper } from "@/components/forum/IconMapper";
import { ForumSearch } from "@/components/forum/ForumSearch";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default async function ForumPage() {
  const result = await getForumCategories();
  
  if (!result.success || !result.data) {
    return <div>Error loading forum categories.</div>;
  }

  const categories = result.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Forum Interne</h1>
            <p className="text-[var(--foreground-muted)]">Espace de discussion et de partage pour l&apos;équipe.</p>
        </div>
        <ForumSearch />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link href={`/admin/forum/${category.slug}`} key={category.id} className="block group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-[var(--accent)] cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="p-2 bg-[var(--background-secondary)] rounded-lg group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)] transition-colors">
                    <IconMapper name={category.icon} className="w-6 h-6" />
                </div>
                {category.isPrivate && <Lock className="w-4 h-4 text-[var(--foreground-muted)]" />}
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors">
                    {category.name}
                </CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                    {category.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
