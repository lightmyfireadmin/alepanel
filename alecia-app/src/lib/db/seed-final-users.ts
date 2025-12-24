import { db } from "./index";
import { users, teamMembers } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedFinalUsers() {
  console.log("👥 Seeding Final Admin Users...");

  const CB_EMAIL = "christophe.berthon@alecia.fr";
  const MICOU_EMAIL = "micou@alecia.fr"; // consistent test email

  const CB_PWD = "Bienvenue2026!";
  const MICOU_PWD = "Tester06";

  const CB_PHOTO = "/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg";

  // 1. Clean up existing users
  console.log("🧹 Cleaning up old users...");
  await db.delete(users);
  
  // 2. Create Christophe Berthon
  console.log("👤 Creating Christophe Berthon...");
  const cbHash = await bcrypt.hash(CB_PWD, 10);
  
  await db.insert(users).values({
    email: CB_EMAIL,
    name: "Christophe Berthon",
    passwordHash: cbHash,
    role: "admin", // Main user
    mustChangePassword: true,
    hasSeenOnboarding: false,
  });

  // Ensure Team Member entry matches for avatar linkage if needed later
  const existingCBTeam = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.slug, "christophe-berthon")
  });

  if (existingCBTeam) {
    await db.update(teamMembers)
      .set({ email: CB_EMAIL, photo: CB_PHOTO })
      .where(eq(teamMembers.slug, "christophe-berthon"));
  } else {
    await db.insert(teamMembers).values({
        slug: "christophe-berthon",
        name: "Christophe Berthon",
        role: "Associé Fondateur",
        email: CB_EMAIL,
        photo: CB_PHOTO,
        isActive: true
    });
  }

  // 3. Create Micou Dev
  console.log("🤖 Creating Micou Dev...");
  const micouHash = await bcrypt.hash(MICOU_PWD, 10);

  await db.insert(users).values({
    email: MICOU_EMAIL,
    name: "Micou Dev",
    passwordHash: micouHash,
    role: "admin", // Tester admin
    mustChangePassword: false,
    hasSeenOnboarding: true,
  });

  console.log("✅ Final Users Seeded.");
}

if (require.main === module) {
    seedFinalUsers().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
