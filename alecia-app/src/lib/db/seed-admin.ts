
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

  // 1. Update Team Member email
  console.log(`Updating team member ${TEAM_SLUG} email...`);
  await db
    .update(teamMembers)
    .set({ email: EMAIL })
    .where(eq(teamMembers.slug, TEAM_SLUG));

  // 2. Manage Users
  console.log("Cleaning up users...");
  await db.delete(users); // Remove all users (including 'admin@alecia.fr')

  console.log(`Creating user ${EMAIL}...`);
  const defaultPwd = process.env.NEW_USER_PWD || "alecia2024";
  const passwordHash = await bcrypt.hash(defaultPwd, 10); // Default password

  await db.insert(users).values({
    email: EMAIL,
    name: NAME,
    passwordHash: passwordHash,
    role: "admin",
    mustChangePassword: true,
    hasSeenOnboarding: false,
  });

  console.log("✅ Admin user seeded successfully.");
}

if (require.main === module) {
    seedAdmin().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
