
import { db } from "@/lib/db";
import { deals } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function checkData() {
  console.log("Checking distinct values...");
  
  const sectors = await db.select({ val: deals.sector }).distinct().from(deals);
  console.log("Sectors count:", sectors.length);
  console.log("Sectors:", sectors.map(s => s.val));

  const regions = await db.select({ val: deals.region }).distinct().from(deals);
  console.log("Regions count:", regions.length);
  
  const years = await db.select({ val: deals.year }).distinct().from(deals);
  console.log("Years count:", years.length);
  
  const types = await db.select({ val: deals.mandateType }).distinct().from(deals);
  console.log("Types count:", types.length);
}

checkData().catch(console.error);
