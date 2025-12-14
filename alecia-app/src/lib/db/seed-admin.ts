
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

  // 1. Update Team Member email and ensure photo exists
  console.log(`Updating team member ${TEAM_SLUG} email and photo...`);
  // Using a professional abstract avatar or the real one if we had it. 
  // For now using a high quality Unsplash portrait that fits the professional theme.
  const AVATAR_URL = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256";
  
  await db
    .update(teamMembers)
    .set({ 
      email: EMAIL,
      photo: AVATAR_URL // Force a photo for the admin user so dropdown looks good
    })
    .where(eq(teamMembers.slug, TEAM_SLUG));

  // 2. Manage Users
  console.log("Cleaning up users...");
  await db.delete(users); // Remove all users (including 'admin@alecia.fr')

  console.log(`Creating user ${EMAIL}...`);
  const defaultPwd = process.env.NEW_USER_PWD || "alecia2024";
  
  console.log("🔐 SETTING ADMIN PASSWORD TO:", defaultPwd);
  console.log("   (Please use this password to log in)");

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
