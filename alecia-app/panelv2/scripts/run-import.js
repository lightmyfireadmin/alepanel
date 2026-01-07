// Run Convex Import from prepared data
// Usage: CONVEX_DEPLOY_KEY=xxx node scripts/run-import.js

const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");

const CONVEX_URL = "https://hip-iguana-601.convex.cloud";

async function runImport() {
  console.log("Loading import data...");
  const data = JSON.parse(fs.readFileSync("./convex_import_data.json", "utf-8"));

  console.log("\n📦 Data to import:");
  console.log(`   - Transactions: ${data.transactions.length}`);
  console.log(`   - Team Members: ${data.team_members.length}`);
  console.log(`   - Marketing Tiles: ${data.marketing_tiles.length}`);

  // Transform data to match Convex schema
  const transactions = data.transactions.map((t) => ({
    slug: t.slug || "unknown",
    clientName: t.clientName || "Unknown",
    clientLogo: t.clientLogo || undefined,
    acquirerName: t.acquirerName || undefined,
    acquirerLogo: t.acquirerLogo || undefined,
    sector: t.sector || "Other",
    region: t.region || undefined,
    year: t.year || 2024,
    mandateType: t.mandateType || "Sell-side",
    description: t.description || undefined,
    isConfidential: t.isConfidential || false,
    isPriorExperience: t.isPriorExperience || false,
    context: t.context || undefined,
    intervention: t.intervention || undefined,
    result: t.result || undefined,
    testimonialText: t.testimonialText || undefined,
    testimonialAuthor: t.testimonialAuthor || undefined,
    roleType: t.roleType || undefined,
    dealSize: t.dealSize || undefined,
    keyMetrics: t.keyMetrics || undefined,
    displayOrder: t.displayOrder || 0,
  }));

  const teamMembers = data.team_members.map((m) => ({
    slug: m.slug || "unknown",
    name: m.name || "Unknown",
    role: m.role || "Team Member",
    photo: m.photo || undefined,
    bioFr: m.bio_fr || undefined,
    bioEn: m.bio_en || undefined,
    linkedinUrl: m.linkedinUrl || undefined,
    email: m.email || undefined,
    sectorsExpertise: m.sectorsExpertise || [],
    transactionSlugs: m.transactions || [],
    displayOrder: m.displayOrder || 0,
    isActive: m.isActive !== false,
  }));

  const marketingTiles = data.marketing_tiles.map((t) => ({
    title: t.title || "Untitled",
    description: t.description || undefined,
    soundUrl: t.soundUrl || undefined,
    imageUrl: t.imageUrl || undefined,
    displayOrder: t.displayOrder || 0,
    styleConfig: t.styleConfig || undefined,
  }));

  // Write transformed data for manual import
  const importData = {
    transactions,
    team_members: teamMembers,
    marketing_tiles: marketingTiles,
  };

  fs.writeFileSync(
    "./convex_ready_import.json",
    JSON.stringify(importData, null, 2)
  );

  console.log("\n✅ Created: convex_ready_import.json");
  console.log("\n📋 Next steps:");
  console.log("   1. Go to https://dashboard.convex.dev/d/hip-iguana-601");
  console.log("   2. Click 'Data' in sidebar");
  console.log("   3. For each table (transactions, team_members, marketing_tiles):");
  console.log("      - Click table name");
  console.log('      - Click "Import data"');
  console.log("      - Paste the corresponding array from convex_ready_import.json");
  console.log("\n   OR use the npx convex import command:");
  console.log("   npx convex import --table transactions ./transactions.json");
}

runImport().catch(console.error);
