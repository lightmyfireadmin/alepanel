import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(clientId, rateLimitConfigs.newsletter);
    
    if (rateLimit.isLimited) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez réessayer dans quelques instants." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: "L'email est requis" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // TODO: In production, integrate with:
    // - Mailchimp, Resend, or other email marketing service
    // - Store in Supabase/database for own mailing list
    
    logger.info("Newsletter subscription", {
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Inscription réussie ! Vous recevrez bientôt nos actualités.",
    });
  } catch (error) {
    logger.error("Newsletter error", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
