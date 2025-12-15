import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, rateLimitConfigs.valuation);

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
    const { revenue, ebitda, sector, email, company, result } = body;

    // Validate required fields
    if (!revenue || !ebitda || !sector || !email || !result) {
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

    // TODO: In production, integrate with:
    // - Email service (Resend, SendGrid, etc.)
    // - CRM (HubSpot, Salesforce, etc.)
    // - Supabase leads table

    logger.info("Valuation lead captured", {
      revenue,
      ebitda,
      sector,
      email,
      company,
      valuationResult: result,
      timestamp: new Date().toISOString(),
    });

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Votre demande a bien été prise en compte. Vous recevrez votre analyse détaillée sous 24h.",
    });
  } catch (error) {
    logger.error("Valuation lead capture error", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
