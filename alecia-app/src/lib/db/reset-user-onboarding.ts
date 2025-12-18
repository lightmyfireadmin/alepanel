import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";

async function resetUserOnboarding() {
  console.log("🔄 Resetting Christophe Berthon's onboarding status...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  const EMAIL = "christophe.berthon@alecia.fr";

  try {
    // Update user to reset onboarding flags
    const result = await db
      .update(users)
      .set({
        mustChangePassword: false,
        hasSeenOnboarding: false,
        updatedAt: new Date(),
      })
      .where(eq(users.email, EMAIL))
      .returning();

    if (result.length > 0) {
      console.log("✅ User onboarding status reset successfully");
      console.log("   - mustChangePassword: false");
      console.log("   - hasSeenOnboarding: false");
    } else {
      console.log("⚠️ User not found with email:", EMAIL);
    }
  } catch (error) {
    console.error("❌ Error resetting user onboarding:", error);
    throw error;
  }
}

if (require.main === module) {
  resetUserOnboarding()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default resetUserOnboarding;
