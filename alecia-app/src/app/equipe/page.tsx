import { Navbar, Footer } from "@/components/layout";
import { TeamCard } from "@/components/features";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Équipe | Nos associés et experts",
  description:
    "Découvrez l'équipe alecia. Associés fondateurs et analystes experts en fusion-acquisition pour PME et ETI.",
};

// Team data with local asset paths
const teamMembers = [
  {
    id: "1",
    slug: "gregory-colin",
    name: "Grégory Colin",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/GC_1_-_cropped_p1080.jpg",
    linkedinUrl: "https://www.linkedin.com/in/gregorycolin/",
  },
  {
    id: "2",
    slug: "christophe-berthon",
    name: "Christophe Berthon",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p1080.jpg",
    linkedinUrl: "https://www.linkedin.com/in/christophe-berthon-843924118/",
  },
  {
    id: "3",
    slug: "martin-egasse",
    name: "Martin Egasse",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/ME_2_-_cropped_-_alt_p1080.jpg",
    linkedinUrl: "https://www.linkedin.com/in/martinegasse/",
  },
  {
    id: "4",
    slug: "tristan-cossec",
    name: "Tristan Cossec",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/TC_2_p1080.jpg",
    linkedinUrl: "https://www.linkedin.com/in/tristan-cossec-3b5a0247/",
  },
  {
    id: "5",
    slug: "serge-de-fay",
    name: "Serge de Faÿ",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/SF_2_p1080.jpg",
    linkedinUrl: "https://www.linkedin.com/in/serge-de-fa%C3%BF-09713555/",
  },
  {
    id: "6",
    slug: "jerome-berthiau",
    name: "Jérôme Berthiau",
    role: "Associé fondateur",
    photo: "/assets/Equipe_Alecia/JB_1_-_cropped_-_alt_p1080.jpg",
    linkedinUrl: "https://www.linkedin.com/in/jeromeberthiau/",
  },
  {
    id: "7",
    slug: "louise-pini",
    name: "Louise Pini",
    role: "Analyste",
    photo: "/assets/Equipe_Alecia/LP__2__-_cropped.jpg",
    linkedinUrl: "https://www.linkedin.com/in/louise-p-184b7a160/",
  },
  {
    id: "8",
    slug: "mickael-furet",
    name: "Mickael Furet",
    role: "Analyste",
    photo: "/assets/Equipe_Alecia/MF_p1080.jpg",
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
