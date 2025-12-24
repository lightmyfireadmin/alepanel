import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { users, forumCategories } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedBusinessOS() {
  console.log("🏗️ Seeding Business OS Data...");

  // 1. Update/Re-create Admin as Sudo
  const EMAIL = "christophe.berthon@alecia.fr";
  const NAME = "Christophe Berthon";
  const PASSWORD = "HelloMyDear06!";
  
  console.log(`🔐 Updating ${EMAIL} to role 'sudo'...`);
  
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  
  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, EMAIL)
  });

  if (existingUser) {
    await db.update(users).set({
      role: "sudo",
      passwordHash: passwordHash,
      name: NAME
    }).where(eq(users.email, EMAIL));
  } else {
    await db.insert(users).values({
      email: EMAIL,
      name: NAME,
      passwordHash: passwordHash,
      role: "sudo",
      mustChangePassword: false,
      hasSeenOnboarding: true,
    });
  }

  // 2. Seed Forum Categories
  const CATEGORIES = [
    {
        slug: "announcements",
        name: "Annonces Officielles",
        description: "Nouvelles importantes de l'entreprise",
        icon: "Megaphone",
        order: 1,
        isPrivate: false
    },
    {
        slug: "deals-talk",
        name: "Discussions Deals",
        description: "Échanges sur les opérations en cours",
        icon: "Briefcase",
        order: 2,
        isPrivate: true
    },
    {
        slug: "market-watch",
        name: "Veille Marché",
        description: "Tendances, news et concurrents",
        icon: "Eye",
        order: 3,
        isPrivate: false
    },
    {
        slug: "watercooler",
        name: "Pause Café",
        description: "Discussions informelles",
        icon: "Coffee",
        order: 4,
        isPrivate: false
    }
  ];

  console.log("📢 Seeding Forum Categories...");
  
  for (const cat of CATEGORIES) {
    await db.insert(forumCategories).values(cat).onConflictDoUpdate({
        target: forumCategories.slug,
        set: cat
    });
  }

  console.log("✅ Business OS Seeded Successfully.");
}

if (require.main === module) {
    seedBusinessOS().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
}
