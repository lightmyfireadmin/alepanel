import { Navbar, Footer } from "@/components/layout";
import { TeamCard } from "@/components/features/team/team-card";
import { teamMembers } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équipe | Nos associés et experts",
  description:
    "Découvrez l'équipe alecia. Associés fondateurs et analystes experts en fusion-acquisition pour PME et ETI.",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function EquipePage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-semibold mb-4">
              Notre équipe
            </h1>
            <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto text-lg">
              La variété de nos parcours et de nos expertises fait la richesse d&apos;alecia
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-8 px-6 pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.id}
                  slug={member.slug}
                  name={member.name}
                  role={member.role}
                  photo={member.photo}
                  linkedinUrl={member.linkedinUrl}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Hiring CTA */}
        <section className="py-16 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-4">
              Nous recrutons
            </h2>
            <p className="text-[var(--foreground-muted)] mb-6">
              Rejoignez une équipe dynamique et participez à des opérations passionnantes.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
            >
              Nous contacter →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
