import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// GET all settings
export async function GET() {
  try {
    const settings = await db.select().from(siteSettings);
    
    // Convert to key-value object
    const settingsObject: Record<string, unknown> = {};
    settings.forEach((setting) => {
      settingsObject[setting.key] = setting.value;
    });
    
    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT/PATCH to update settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Update each setting
    for (const [key, value] of Object.entries(body)) {
      // Check if setting exists
      const existing = await db
        .select()
        .from(siteSettings)
        .where(eq(siteSettings.key, key))
        .limit(1);
      
      if (existing.length > 0) {
        // Update existing
        await db
          .update(siteSettings)
          .set({ 
            value: value as unknown,
            updatedAt: new Date()
          })
          .where(eq(siteSettings.key, key));
      } else {
        // Insert new
        await db.insert(siteSettings).values({
          key,
          value: value as unknown,
          category: key.split(".")[0] || "general",
          label: key,
          description: null,
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
