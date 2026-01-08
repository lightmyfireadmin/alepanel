
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Briefcase, MapPin, Clock, ArrowRight, Users, TrendingUp, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getJobOffers } from "@/lib/actions/convex-marketing";

export const metadata: Metadata = {
  title: "Nous rejoindre | Carrières chez alecia",
  description:
    "Rejoignez l'équipe alecia. Découvrez nos offres d'emploi et opportunités en fusion-acquisition pour PME et ETI.",
};

const values = [
  {
    icon: Users,
    titleKey: "teamwork",
    descKey: "teamworkDesc",
  },
  {
    icon: TrendingUp,
    titleKey: "growth",
    descKey: "growthDesc",
  },
  {
    icon: Heart,
    titleKey: "balance",
    descKey: "balanceDesc",
  },
];

export default async function NousRejoindrePage() {
  const t = await getTranslations("careers");
  const jobsData = await getJobOffers();
  
  // Map Convex format to expected format
  const openPositions = jobsData.map(job => ({
    id: job._id,
    slug: job.slug,
    title: job.title,
    type: job.type,
    location: job.location,
    description: job.description,
    requirements: Array.isArray(job.requirements) 
      ? job.requirements 
      : job.requirements ? [job.requirements] : [],
  }));

  return (
    <>
      

      <main className="min-h-screen bg-[var(--background)] pt-24">
        {/* Header */}
        <section className="relative py-20 px-6 overflow-hidden">
          {/* Background Image with Overlay */}
           <div className="absolute inset-0 z-0 select-none">
            <Image
              src="/assets/Nous_rejoindre_Alecia/john-towner-Hf4Ap1-ef40-unsplash_1.webp"
              alt="Background"
              fill
              className="object-cover"
              quality={90}
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <p className="font-medium tracking-widest uppercase mb-4 text-sm text-[var(--accent)]">
              {t("tagline")}
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold mb-6">
              {t("title")}
            </h1>
            <p className="text-lg md:text-xl leading-relaxed opacity-90">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <p className="text-sm tracking-widest uppercase text-[var(--foreground-muted)] mb-4">
                  {t("vision.tagline")}
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold mb-8 text-[var(--foreground)]">
                  {t("vision.title")}
                </h2>
                <div className="space-y-6 text-lg text-[var(--foreground-muted)]">
                  <p>{t("vision.p1")}</p>
                  <p>{t("vision.p2")}</p>
                  <p>{t("vision.p3")}</p>
                  <p>{t("vision.p4")}</p>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/Nous_rejoindre_Alecia/La_matrice_-_compressed_p1080.jpg" 
                  alt="Notre vision" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Invest In Future Section */}
        <section className="py-24 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/assets/Nous_rejoindre_Alecia/Escalier_-_compressed_p800.jpg" 
                  alt="Investir dans l'avenir" 
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-semibold mb-8 text-[var(--foreground)]">
                  {t("invest.title")}
                </h2>
                <div className="space-y-6 text-lg text-[var(--foreground-muted)]">
                   <p>{t("invest.p1")}</p>
                   <p>{t("invest.p2")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-center mb-16 text-[var(--foreground)]">
              {t("whyJoinTitle")}
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {values.map((value, idx) => (
                <div key={idx} className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-8 h-8 text-[var(--accent)]" />
                  </div>
                  <h3 className="font-semibold text-xl text-[var(--foreground)] mb-3">{t(`values.${value.titleKey}`)}</h3>
                  <p className="text-[var(--foreground-muted)] leading-relaxed">{t(`values.${value.descKey}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-24 px-6 bg-[var(--background-secondary)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-12 text-[var(--foreground)]">
              {t("openPositions")}
            </h2>
            <div className="space-y-6">
              {openPositions.length > 0 ? (
                openPositions.map((position) => (
                  <Card key={position.id} className="bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-300">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-[var(--foreground)] font-[family-name:var(--font-playfair)] text-xl mb-2">
                            {position.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-4 text-sm text-[var(--foreground-muted)]">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {position.type}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {position.location}
                            </span>
                          </div>
                        </div>
                        <Button asChild className="btn-gold rounded-lg w-fit">
                          <Link href={`/contact?subject=Candidature: ${position.title}`}>
                            {t("applyButton")}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[var(--foreground-muted)] mb-4">{position.description}</p>
                      {position.requirements && position.requirements.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)] mb-2">{t("profileLabel")}</p>
                          <ul className="space-y-1">
                            {position.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm text-[var(--foreground-muted)] flex items-start gap-2">
                                <span className="text-[var(--accent)]">•</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-xl">
                  <p className="text-[var(--foreground-muted)]">Aucun poste ouvert pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Spontaneous Application CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block p-4 rounded-full bg-[var(--accent)]/10 mb-6">
              <Briefcase className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold mb-4 text-[var(--foreground)]">
              {t("spontaneous.title")}
            </h2>
            <p className="text-[var(--foreground-muted)] mb-8 max-w-xl mx-auto text-lg">
              {t("spontaneous.subtitle")}
            </p>
            <Button asChild size="lg" className="btn-gold rounded-xl px-8">
              <Link href="/contact?subject=Candidature spontanée">
                {t("spontaneous.button")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      
    </>
  );
}
