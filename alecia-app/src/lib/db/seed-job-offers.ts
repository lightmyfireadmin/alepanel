/**
 * Seed script for job offers
 * Seeds the existing job offers from the admin panel into the database
 */

import { db } from "./index";
import { jobOffers } from "./schema";

async function seedJobOffers() {
  console.log("🌱 Seeding job offers...");

  try {
    // Seed job offers based on the existing hardcoded data
    const jobOffersData = [
      {
        slug: "analyste-ma-junior",
        title: "Analyste M&A Junior",
        type: "CDI",
        location: "Paris",
        description: "Rejoignez notre équipe dynamique en tant qu'analyste M&A junior. Vous participerez à des opérations de cession et d'acquisition de PME et ETI françaises.",
        requirements: [
          "Master Grande École de commerce ou d'ingénieur",
          "Stage en banque d'affaires ou audit Big4",
          "Excel avancé et modélisation financière",
          "Anglais courant"
        ],
        contactEmail: "recrutement@alecia.fr",
        isPublished: true,
        displayOrder: 1,
      },
      {
        slug: "associate-ma",
        title: "Associate M&A",
        type: "CDI",
        location: "Lyon",
        description: "Nous recherchons un(e) Associate expérimenté(e) pour piloter des mandats de bout en bout et encadrer les analystes junior.",
        requirements: [
          "3-5 ans d'expérience en M&A mid-cap",
          "Track record de deals closés",
          "Leadership et autonomie",
          "Réseau acquéreurs développé"
        ],
        contactEmail: "recrutement@alecia.fr",
        isPublished: true,
        displayOrder: 2,
      },
    ];

    // Insert job offers
    for (const jobOffer of jobOffersData) {
      await db.insert(jobOffers).values(jobOffer);
      console.log(`  ✓ Created job offer: ${jobOffer.title}`);
    }

    console.log("✅ Job offers seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding job offers:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedJobOffers()
    .then(() => {
      console.log("Done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Fatal error:", error);
      process.exit(1);
    });
}

export { seedJobOffers };
