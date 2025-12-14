
import { db } from "@/lib/db";
import { deals } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function checkData() {
  console.log("Checking distinct values...");
  
  const sectors = await db.selectDistinct({ val: deals.sector }).from(deals);
  console.log("Sectors count:", sectors.length);
  console.log("Sectors:", sectors.map(s => s.val));

  const regions = await db.selectDistinct({ val: deals.region }).from(deals);
  console.log("Regions count:", regions.length);
  
  const years = await db.selectDistinct({ val: deals.year }).from(deals);
  console.log("Years count:", years.length);
  
  const types = await db.selectDistinct({ val: deals.mandateType }).from(deals);
  console.log("Types count:", types.length);
}

checkData().catch(console.error);
