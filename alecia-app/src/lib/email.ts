import { Resend } from "resend";
import { logger } from "@/lib/logger";

// Initialize Resend only if key is present to avoid build-time errors
// The key might not be available at build time in some environments (like CI/CD or sandbox)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendContactEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  company,
  message,
}: SendContactEmailParams) {
  if (!resend) {
    logger.warn("RESEND_API_KEY is not set. Skipping email sending.");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || "contact@alecia.fr"; // Fallback or env var

  try {
    const { data, error } = await resend.emails.send({
      from: "Alecia Contact <onboarding@resend.dev>", // Update this with verified domain in production
      to: [adminEmail],
      replyTo: email,
      subject: `Nouveau contact de ${firstName} ${lastName}`,
      html: `
        <div>
          <h1>Nouveau message de contact</h1>
          <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Société:</strong> ${company || "Non renseigné"}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    if (error) {
      logger.error("Error sending email via Resend", error);
      throw new Error("Failed to send email");
    }

    logger.info("Email sent successfully", { messageId: data?.id });
    return data;
  } catch (error) {
    logger.error("Exception sending email", error);
    // Don't block the flow if email fails, but log it
  }
}
