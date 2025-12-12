import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Équipe",
};

// Mock data
const teamMembers = [
  {
    id: "1",
    name: "Grégory Colin",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc822259a93423363d2a5_GC%201%20-%20cropped.jpg",
    isActive: true,
  },
  {
    id: "2",
    name: "Christophe Berthon",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc818526b707d50632ca0_CB%201%20-%20cropped%20-%20alt.jpg",
    isActive: true,
  },
  {
    id: "3",
    name: "Martin Egasse",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc80c259a93423363c243_ME%202%20-%20cropped%20-%20alt.jpg",
    isActive: true,
  },
  {
    id: "4",
    name: "Louise Pini",
    role: "Analyste",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cbdffb4676b7f1dd5e9ba_LP%20(2)%20-%20cropped.jpg",
    isActive: true,
  },
];

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            Équipe
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Gérez les membres de l&apos;équipe
          </p>
        </div>
        <Button asChild className="btn-gold rounded-lg">
          <Link href="/admin/team/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau membre
          </Link>
        </Button>
      </div>

      {/* Team Grid */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">
            {teamMembers.length} membres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--background-tertiary)] border border-[var(--border)]"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={member.photo} alt={member.name} />
                  <AvatarFallback className="bg-[var(--accent)]/20 text-[var(--accent)]">
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--foreground)] truncate">
                    {member.name}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)] truncate">
                    {member.role}
                  </p>
                  {member.isActive ? (
                    <Badge
                      variant="outline"
                      className="mt-1 bg-emerald-500/10 text-emerald-400 text-xs"
                    >
                      Actif
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="mt-1 bg-[var(--background-secondary)] text-[var(--foreground-muted)] text-xs"
                    >
                      Inactif
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  >
                    <Link href={`/admin/team/${member.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[var(--foreground-muted)] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
