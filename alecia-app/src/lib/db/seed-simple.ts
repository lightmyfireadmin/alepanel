/**
 * Simple Database Seeding Script
 * 
 * Seeds the database with data from lib/data.ts
 * 
 * Run with: npx tsx src/lib/db/seed-simple.ts
 */

import { db } from "./index";
import { deals, teamMembers, users } from "./schema";
import bcrypt from "bcryptjs";
import { teamMembers as teamData, mockDeals } from "../data";

// Main seed function
async function seed() {
  console.log("🌱 Starting database seed...\n");
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    console.error("   Please set it in .env.local file");
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
      console.log(`   Password: ${process.env.NEW_USER_PWD || "admin123"}\n`);
    } else {
      console.log("ℹ️  Admin user already exists\n");
    }
    
    // 2. Insert deals
    console.log("📊 Seeding deals...");
    const existingDeals = await db.select().from(deals);
    
    if (existingDeals.length === 0) {
      const dealsToInsert = mockDeals.map((deal, index) => ({
        slug: deal.slug,
        clientName: deal.clientName,
        clientLogo: deal.clientLogo,
        acquirerName: deal.acquirerName,
        acquirerLogo: deal.acquirerLogo,
        sector: deal.sector,
        region: deal.region,
        year: deal.year,
        mandateType: deal.mandateType,
        description: null,
        isConfidential: false,
        isPriorExperience: deal.isPriorExperience,
        context: null,
        intervention: null,
        result: null,
        testimonialText: null,
        testimonialAuthor: null,
        roleType: null,
        dealSize: null,
        keyMetrics: null,
        displayOrder: index,
      }));
      
      await db.insert(deals).values(dealsToInsert);
      console.log(`✅ Inserted ${dealsToInsert.length} deals\n`);
    } else {
      console.log(`ℹ️  Database already has ${existingDeals.length} deals\n`);
    }
    
    // 3. Insert team members
    console.log("👥 Seeding team members...");
    const existingMembers = await db.select().from(teamMembers);
    
    if (existingMembers.length === 0) {
      const membersToInsert = teamData.map((member, index) => ({
        slug: member.slug,
        name: member.name,
        role: member.role,
        photo: member.photo,
        bioFr: null,
        bioEn: null,
        linkedinUrl: member.linkedinUrl || null,
        email: null,
        sectorsExpertise: null,
        transactions: null,
        displayOrder: index,
        isActive: true,
      }));
      
      await db.insert(teamMembers).values(membersToInsert);
      console.log(`✅ Inserted ${membersToInsert.length} team members\n`);
    } else {
      console.log(`ℹ️  Database already has ${existingMembers.length} team members\n`);
    }
    
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📝 Summary:");
    const dealCount = await db.select().from(deals);
    const memberCount = await db.select().from(teamMembers);
    const userCount = await db.select().from(users);
    console.log(`   - ${userCount.length} users`);
    console.log(`   - ${dealCount.length} deals`);
    console.log(`   - ${memberCount.length} team members`);
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
      console.error("   Stack:", error.stack);
    }
    throw error;
  }
}

// Run if executed directly
seed()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
