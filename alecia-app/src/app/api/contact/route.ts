import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { sendContactEmail } from "@/lib/email";
import { syncLeadToCrm } from "@/lib/crm";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, rateLimitConfigs.contact);
    
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans quelques instants." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimit.resetTime),
          }
        }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, company, message } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs requis doivent être remplis" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // 1. Save to Supabase (Leads Table)
    // We try/catch this specifically to allow fallback if DB is down but we want to try other services?
    // Or if DB fails, we probably should fail the request or at least log it critically.
    // Given the architecture, if DB fails, it's critical.
    try {
        await db.insert(leads).values({
            firstName,
            lastName,
            email,
            company,
            message,
        });
    } catch (dbError) {
        logger.error("Failed to insert lead into database", dbError);
        // We continue execution to try sending email at least
    }

    // 2. Send Email (Resend)
    // Fire and forget or await? Await is safer to confirm it worked, but adds latency.
    // The user wants feedback, so we await.
    await sendContactEmail({
        firstName,
        lastName,
        email,
        company,
        message,
    });

    // 3. Sync to CRM (HubSpot/Salesforce)
    // This can be done in background or awaited.
    await syncLeadToCrm({
        firstName,
        lastName,
        email,
        company,
        message,
    });
    
    logger.info("Contact form submission processed", {
      firstName,
      lastName,
      email,
      company,
    });

    return NextResponse.json({
      success: true,
      message: "Votre message a bien été envoyé. Nous vous recontacterons rapidement.",
    });
  } catch (error) {
    logger.error("Contact form error", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
