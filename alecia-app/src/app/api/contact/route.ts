import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIdentifier, rateLimitConfigs } from "@/lib/rate-limit";

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

    // TODO: In production, integrate with:
    // - Email service (Resend, SendGrid, etc.)
    // - CRM (HubSpot, Salesforce, etc.)
    // - Supabase leads table
    
    console.log("Contact form submission:", {
      firstName,
      lastName,
      email,
      company,
      message,
      timestamp: new Date().toISOString(),
    });

    // For now, just return success
    return NextResponse.json({
      success: true,
      message: "Votre message a bien été envoyé. Nous vous recontacterons rapidement.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
