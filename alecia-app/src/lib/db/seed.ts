/**
 * Database Seeding Script
 * 
 * Parses Opérations_alecia.md and Equipe_Alecia.md to populate
 * the deals and team_members tables with real data.
 * 
 * Run with: npx ts-node --esm src/lib/db/seed.ts
 */

import { db } from "./index";
import { deals, teamMembers, users } from "./schema";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Helper to extract slug from URL
function extractSlug(url: string): string {
  const match = url.match(/\/operations\/([^)]+)/);
  return match ? match[1] : "";
}

type MandateType = "Cession" | "Acquisition" | "Levée de fonds";

// Parse Opérations_alecia.md
async function parseDeals() {
  const filePath = path.join(process.cwd(), "..", "www.alecia.fr", "Opérations_alecia.md");
  const content = fs.readFileSync(filePath, "utf-8");
  
  const deals = [];
  const lines = content.split("\n");
  
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // Look for deal links: [Name](https://www.alecia.fr/operations/slug)
    if (line.startsWith("[") && line.includes("](https://www.alecia.fr/operations/")) {
      const nameMatch = line.match(/\[([^\]]+)\]/);
      const urlMatch = line.match(/\(([^)]+)\)/);
      
      if (nameMatch && urlMatch) {
        const clientName = nameMatch[1];
        const url = urlMatch[1];
        const slug = extractSlug(url);
        
        // Parse subsequent lines for details
        let sector = "";
        let mandateType: MandateType = "Cession";
        let year = 2024;
        let region = "";
        let acquirerName = "";
        let isPriorExperience = false;
        let clientLogo = "";
        const acquirerLogo = "";
        
        // Look ahead for details (next 100 lines)
        for (let j = i + 1; j < Math.min(i + 100, lines.length); j++) {
          const detailLine = lines[j].trim();
          
          // Sector (appears right after the name)
          if (
            detailLine.includes("Distribution & services") ||
            detailLine.includes("Technologies & logiciels") ||
            detailLine.includes("Santé") ||
            detailLine.includes("Immobilier & construction") ||
            detailLine.includes("Industries") ||
            detailLine.includes("Services financiers & assurance") ||
            detailLine.includes("Agroalimentaire") ||
            detailLine.includes("Énergie & environnement")
          ) {
            sector = detailLine;
          }
          
          // Mandate type
          if (detailLine === "Cession" || detailLine === "AcquisitioN" || detailLine === "Levée de fonds") {
            mandateType = detailLine === "AcquisitioN" ? "Acquisition" : detailLine as MandateType;
          }
          
          // Year
          if (detailLine.startsWith("20") && detailLine.length === 4) {
            year = parseInt(detailLine);
          } else if (detailLine.match(/^\d{4}\s*\*/)) {
            // Prior experience (has *)
            isPriorExperience = true;
            year = parseInt(detailLine);
          } else if (detailLine.match(/^\d{4}\s*-\s*\d{4}/)) {
            // Range like "2023 - 2024"
            const years = detailLine.match(/\d{4}/g);
            if (years) year = parseInt(years[1]); // Take the later year
            if (detailLine.includes("*")) isPriorExperience = true;
          }
          
          // Region
          if (
            detailLine.includes("Île-de-France") ||
            detailLine.includes("Provence-Alpes-Côte d'Azur") ||
            detailLine.includes("Auvergne-Rhône-Alpes") ||
            detailLine.includes("Pays de la Loire") ||
            detailLine.includes("Centre-Val de Loire") ||
            detailLine.includes("Hauts-de-France") ||
            detailLine.includes("Occitanie") ||
            detailLine.includes("Grand Ouest") ||
            detailLine.includes("Normandie") ||
            detailLine.includes("Bretagne") ||
            detailLine.includes("Nouvelle-Aquitaine") ||
            detailLine.includes("Grand Est") ||
            detailLine.includes("Bourgogne-Franche-Comté")
          ) {
            region = detailLine;
          }
          
          // Client logo (first image after client name)
          if (!clientLogo && detailLine.startsWith("![](https://cdn.prod.website-files.com/")) {
            const imgMatch = detailLine.match(/!\[\]\(([^)]+)\)/);
            if (imgMatch) {
              clientLogo = imgMatch[1];
            }
          }
          
          // Acquirer name (appears after second arrow image)
          if (lines[j - 1]?.includes("66150a8fbb665ae1ed1a9cce_Frame.svg") && detailLine && !detailLine.startsWith("![") && !detailLine.startsWith("[") && detailLine !== clientName && detailLine !== "Année" && detailLine !== "Région" && detailLine !== "Montant") {
            if (!acquirerName && detailLine.length > 2 && detailLine !== "à" && detailLine !== "par" && detailLine !== "auprès de") {
              acquirerName = detailLine;
            }
          }
          
          // Stop when we hit "Montant" (end of this deal)
          if (detailLine === "Montant") {
            break;
          }
        }
        
        if (sector && slug) {
          deals.push({
            slug,
            clientName,
            clientLogo: clientLogo || null,
            acquirerName: acquirerName || null,
            acquirerLogo: acquirerLogo || null,
            sector,
            region: region || null,
            year,
            mandateType,
            description: null,
            isConfidential: clientName.toLowerCase().includes("confidentiel"),
            isPriorExperience,
            displayOrder: deals.length,
          });
        }
      }
    }
    
    i++;
  }
  
  return deals;
}

// Parse Equipe_Alecia.md
async function parseTeamMembers() {
  const filePath = path.join(process.cwd(), "..", "www.alecia.fr", "Equipe_Alecia.md");
  const content = fs.readFileSync(filePath, "utf-8");
  
  const members = [];
  const lines = content.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for image with name: ![Name](url)
    if (line.startsWith("![") && line.includes("](https://cdn.prod.website-files.com/")) {
      const nameMatch = line.match(/!\[([^\]]+)\]/);
      const photoMatch = line.match(/\(([^)]+)\)/);
      
      if (nameMatch && photoMatch) {
        const name = nameMatch[1];
        const photo = photoMatch[1];
        
        // Get role from next line
        let role = "";
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].trim();
          // Next non-empty line should be the role
          if (nextLine && !nextLine.startsWith("[") && !nextLine.startsWith("!") && nextLine !== "\\-") {
            role = nextLine;
          } else if (i + 3 < lines.length) {
            // Try line after name
            const roleLine = lines[i + 3].trim();
            if (roleLine && !roleLine.startsWith("[") && !roleLine.startsWith("!") && roleLine !== "\\-") {
              role = roleLine;
            }
          }
        }
        
        // Get LinkedIn URL
        let linkedinUrl = "";
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes("linkedin.com/in/")) {
            const urlMatch = lines[j].match(/\(([^)]+)\)/);
            if (urlMatch) {
              linkedinUrl = urlMatch[1];
              break;
            }
          }
        }
        
        if (name && role) {
          const slug = name.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[éèê]/g, "e")
            .replace(/[à]/g, "a")
            .replace(/[ô]/g, "o")
            .replace(/[ç]/g, "c")
            .replace(/[^a-z0-9-]/g, "");
          
          members.push({
            slug,
            name,
            role,
            photo,
            bioFr: null,
            bioEn: null,
            linkedinUrl: linkedinUrl || null,
            email: null,
            displayOrder: members.length,
            isActive: true,
          });
        }
      }
    }
  }
  
  return members;
}

// Main seed function
async function seed() {
  console.log("🌱 Starting database seed...\n");
  
  try {
    // 1. Create admin user: Christophe Berthon
    console.log("👤 Creating admin user...");
    const passwordHash = await bcrypt.hash("testing", 10);
    
    const existingUsers = await db.select().from(users);
    const existingUser = existingUsers.filter(u => u.email === "c.berthon@alecia.fr");
    
    if (existingUser.length === 0) {
      await db.insert(users).values({
        email: "c.berthon@alecia.fr",
        passwordHash,
        name: "Christophe Berthon",
        role: "admin",
      });
      console.log("✅ Admin user created: c.berthon@alecia.fr (password: testing)\n");
    } else {
      console.log("ℹ️  Admin user already exists\n");
    }
    
    // 2. Parse and insert deals
    console.log("📊 Parsing deals from Opérations_alecia.md...");
    const dealsData = await parseDeals();
    console.log(`   Found ${dealsData.length} deals`);
    
    if (dealsData.length > 0) {
      // Clear existing deals
      await db.delete(deals);
      
      // Insert new deals
      await db.insert(deals).values(dealsData);
      console.log(`✅ Inserted ${dealsData.length} deals\n`);
    }
    
    // 3. Parse and insert team members
    console.log("👥 Parsing team members from Equipe_Alecia.md...");
    const membersData = await parseTeamMembers();
    console.log(`   Found ${membersData.length} team members`);
    
    if (membersData.length > 0) {
      // Clear existing team members
      await db.delete(teamMembers);
      
      // Insert new team members
      await db.insert(teamMembers).values(membersData);
      console.log(`✅ Inserted ${membersData.length} team members\n`);
    }
    
    console.log("🎉 Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seed, parseDeals, parseTeamMembers };
