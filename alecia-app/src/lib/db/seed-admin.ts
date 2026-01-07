
import { db } from "./index";
import { users, teamMembers } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  console.log("👤 Seeding Admin User (Christophe Berthon)...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const EMAIL = "christophe.berthon@alecia.fr";
  const NAME = "Christophe Berthon";
  const TEAM_SLUG = "christophe-berthon";

  // 1. Ensure Team Member exists and update photo
  console.log(`Checking team member ${TEAM_SLUG}...`);
  
  const teamMember = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.slug, TEAM_SLUG)
  });

  const AVATAR_URL = "/assets/Equipe_Alecia/CB_1_-_cropped_-_alt_p800.jpg";

  if (teamMember) {
    console.log(`Updating team member ${TEAM_SLUG} email and photo...`);
    await db
      .update(teamMembers)
      .set({ 
        email: EMAIL,
        photo: AVATAR_URL // Force a photo for the admin user so dropdown looks good
      })
      .where(eq(teamMembers.slug, TEAM_SLUG));
  } else {
    console.log(`⚠️ Team member ${TEAM_SLUG} not found. Creating minimal entry...`);
    await db.insert(teamMembers).values({
        slug: TEAM_SLUG,
        name: NAME,
        role: "Partner", // Default role
        email: EMAIL,
        photo: AVATAR_URL,
        isActive: true,
        displayOrder: 0
    });
  }

  // 2. Manage Users
  console.log("Cleaning up users...");
  await db.delete(users); // Remove all users (including 'admin@alecia.fr')

  console.log(`Creating user ${EMAIL}...`);
  // Use ALREADY HASHED password if provided in env, otherwise hash the default one
  // But standard flow is: env var is plain text password.
  const defaultPwd = process.env.NEW_USER_PWD || "alecia2024";
  
  console.log("🔐 SETTING ADMIN PASSWORD...");

  const passwordHash = await bcrypt.hash(defaultPwd, 10);

  await db.insert(users).values({
    email: EMAIL,
    name: NAME,
    passwordHash: passwordHash,
    role: "admin",
    mustChangePassword: false,
    hasSeenOnboarding: false, // Reset to make user go through onboarding again
  });

  console.log("✅ Admin user seeded successfully.");
}

if (require.main === module) {
    seedAdmin().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
