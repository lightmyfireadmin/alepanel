import { Navbar_3 } from "@/components/layout_3/Navbar_3";
import { Footer_3 } from "@/components/layout_3/Footer_3";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getTeamMembers } from "@/lib/actions/convex-marketing";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Équipe | Alecia",
  description: "Découvrez nos associés et experts.",
};

export default async function EquipePage() {
  const teamData = await getTeamMembers();
  
  // Extend team data with mock "Passion" and "Citation" for V3 demo
  const teamMembers = teamData.map(m => ({
    id: m._id,
    slug: m.slug,
    name: m.name,
    role: m.role,
    photo: m.photo,
    linkedinUrl: m.linkedinUrl,
    // V3 Specific Mock Data
    passion: "Alpinisme & Grands espaces",
    citation: "La réussite d'une opération se joue dans les détails et la confiance.",
    recentDeals: [
      { id: 1, client: "Groupe Industriel", type: "Cession", year: 2024 },
      { id: 2, client: "Tech SaaS", type: "Levée de fonds", year: 2023 }
    ]
  }));

  return (
    <>
      <Navbar_3 />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-6">
              Une Équipe Engagée
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              Des experts passionnés, alliant rigueur technique et intelligence relationnelle.
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="group relative">
                  {/* Card Main */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[var(--background-secondary)]">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--background-secondary)] text-[var(--foreground-muted)]">
                        No Photo
                      </div>
                    )}
                    
                    {/* Overlay Details (V3 Specific) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium text-[var(--gold)] mb-1 uppercase tracking-wider">Passion</p>
                        <p className="text-base font-light mb-4">{member.passion}</p>
                        
                        <div className="flex gap-3">
                          {member.linkedinUrl && (
                            <a 
                              href={member.linkedinUrl} 
                              target="_blank" 
                              rel="noopener" 
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="px-4 py-2 bg-[var(--gold)] text-black text-sm font-medium rounded-full hover:bg-white transition-colors">
                                Voir le profil
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden bg-[var(--background)] border-[var(--border)]">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="relative h-64 md:h-full bg-[var(--background-secondary)]">
                                        {member.photo && (
                                            <Image src={member.photo} alt={member.name} fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="p-8">
                                        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-1">{member.name}</h2>
                                        <p className="text-[var(--accent)] font-medium mb-6">{member.role}</p>

                                        <blockquote className="italic text-[var(--foreground-muted)] mb-8 border-l-2 border-[var(--accent)] pl-4">
                                            "{member.citation}"
                                        </blockquote>

                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-sm uppercase tracking-wide">Dernières opérations</h3>
                                            {member.recentDeals.map(deal => (
                                                <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-secondary)]">
                                                    <div>
                                                        <div className="font-medium">{deal.client}</div>
                                                        <div className="text-xs text-[var(--foreground-muted)]">{deal.type}</div>
                                                    </div>
                                                    <Badge variant="outline">{deal.year}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Name Info (always visible) */}
                  <div className="mt-4 text-center">
                    <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold">{member.name}</h3>
                    <p className="text-[var(--foreground-muted)]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer_3 />
    </>
  );
}
