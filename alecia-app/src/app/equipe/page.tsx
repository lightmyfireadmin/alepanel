import { Navbar, Footer } from "@/components/layout";
import { TeamCard } from "@/components/features";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équipe | Nos associés et experts",
  description:
    "Découvrez l'équipe alecia. Associés fondateurs et analystes experts en fusion-acquisition pour PME et ETI.",
};

// Mock data - Replace with DB queries when Neon is connected
const teamMembers = [
  {
    id: "1",
    slug: "gregory-colin",
    name: "Grégory Colin",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc822259a93423363d2a5_GC%201%20-%20cropped.jpg",
    linkedinUrl: "https://www.linkedin.com/in/gregorycolin/",
  },
  {
    id: "2",
    slug: "christophe-berthon",
    name: "Christophe Berthon",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc818526b707d50632ca0_CB%201%20-%20cropped%20-%20alt.jpg",
    linkedinUrl: "https://www.linkedin.com/in/christophe-berthon-843924118/",
  },
  {
    id: "3",
    slug: "martin-egasse",
    name: "Martin Egasse",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc80c259a93423363c243_ME%202%20-%20cropped%20-%20alt.jpg",
    linkedinUrl: "https://www.linkedin.com/in/martinegasse/",
  },
  {
    id: "4",
    slug: "tristan-cossec",
    name: "Tristan Cossec",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cc7ff3679607f0341d0c9_TC%202.jpg",
    linkedinUrl: "https://www.linkedin.com/in/tristan-cossec-3b5a0247/",
  },
  {
    id: "5",
    slug: "serge-de-fay",
    name: "Serge de Faÿ",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cbe6a458eb6b182fd1324_SF%202.jpg",
    linkedinUrl: "https://www.linkedin.com/in/serge-de-fa%C3%BF-09713555/",
  },
  {
    id: "6",
    slug: "jerome-berthiau",
    name: "Jérôme Berthiau",
    role: "Associé fondateur",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cbe16c830e982d28ac035_JB%201%20-%20cropped%20-%20alt.jpg",
    linkedinUrl: "https://www.linkedin.com/in/jeromeberthiau/",
  },
  {
    id: "7",
    slug: "louise-pini",
    name: "Louise Pini",
    role: "Analyste",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cbdffb4676b7f1dd5e9ba_LP%20(2)%20-%20cropped.jpg",
    linkedinUrl: "https://www.linkedin.com/in/louise-p-184b7a160/",
  },
  {
    id: "8",
    slug: "mickael-furet",
    name: "Mickael Furet",
    role: "Analyste",
    photo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670cbdcc49a653633445696e_MF.jpg",
    linkedinUrl: "https://www.linkedin.com/in/mickael-furet/",
  },
];

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
              href="/nous-rejoindre"
              className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
            >
              Voir nos offres d&apos;emploi →
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
