/**
 * Simple Database Seeding Script
 * 
 * Seeds the database with data using Faker for realism.
 * 
 * Run with: npx tsx src/lib/db/seed-simple.ts
 */

import { db } from "./index";
import { deals, teamMembers, users } from "./schema";
import * as bcrypt from "bcryptjs";
import { fakerFR as faker } from "@faker-js/faker";

const SECTORS = [
  "Technologies & logiciels",
  "Distribution & services B2B",
  "Santé",
  "Immobilier & construction",
  "Industries",
  "Agroalimentaire",
];

const ROLES = ["Associé", "Directeur", "Analyste", "Manager"];

// Main seed function
async function seed() {
  console.log("🌱 Starting database seed with Faker...\n");
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }
  
  try {
    // 1. Create admin user
    console.log("👤 Creating admin user...");
    const passwordHash = await bcrypt.hash(process.env.NEW_USER_PWD || "admin123", 10);
    
    const existingUsers = await db.select().from(users);
    const existingUser = existingUsers.find(u => u.email === "admin@alecia.fr");
    
    if (!existingUser) {
      await db.insert(users).values({
        email: "admin@alecia.fr",
        passwordHash,
        name: "Admin Alecia",
        role: "admin",
      });
      console.log("✅ Admin user created: admin@alecia.fr");
    } else {
      console.log("ℹ️  Admin user already exists\n");
    }
    
    // 2. Insert deals
    console.log("📊 Seeding deals...");
    const existingDeals = await db.select().from(deals);
    
    if (existingDeals.length === 0) {
      const dealsToInsert = Array.from({ length: 15 }).map((_, index) => {
        const sector = faker.helpers.arrayElement(SECTORS);
        return {
          slug: faker.helpers.slugify(faker.company.name() + "-" + index).toLowerCase(),
          clientName: faker.company.name(),
          clientLogo: null,
          acquirerName: faker.datatype.boolean() ? faker.company.name() : null,
          acquirerLogo: null,
          sector: sector,
          region: faker.location.state(),
          year: faker.date.past({ years: 3 }).getFullYear(),
          mandateType: faker.helpers.arrayElement(["Cession", "Acquisition", "LBO", "OBO"]),
          description: faker.lorem.paragraph(),
          isConfidential: faker.datatype.boolean(),
          isPriorExperience: faker.datatype.boolean(),
          dealSize: "€" + faker.number.int({ min: 5, max: 50 }) + "M",
          displayOrder: index,
        };
      });
      
      await db.insert(deals).values(dealsToInsert);
      console.log(`✅ Inserted ${dealsToInsert.length} deals\n`);
    } else {
      console.log(`ℹ️  Database already has ${existingDeals.length} deals\n`);
    }
    
    // 3. Insert team members
    console.log("👥 Seeding team members...");
    const existingMembers = await db.select().from(teamMembers);
    
    if (existingMembers.length === 0) {
      const membersToInsert = Array.from({ length: 8 }).map((_, index) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const name = `${firstName} ${lastName}`;
        return {
          slug: faker.helpers.slugify(name).toLowerCase(),
          name: name,
          role: faker.helpers.arrayElement(ROLES),
          photo: null,
          bioFr: faker.lorem.paragraph(),
          bioEn: faker.lorem.paragraph(),
          linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@alecia.fr`,
          displayOrder: index,
          isActive: true,
        };
      });
      
      await db.insert(teamMembers).values(membersToInsert);
      console.log(`✅ Inserted ${membersToInsert.length} team members\n`);
    } else {
      console.log(`ℹ️  Database already has ${existingMembers.length} team members\n`);
    }
    
    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
