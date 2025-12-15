import { logger } from "@/lib/logger";

interface CRMLead {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  message: string;
}

/**
 * Placeholder for CRM integration.
 * In production, this would use HubSpot, Salesforce, or Pipedrive API.
 */
export async function syncLeadToCrm(lead: CRMLead) {
  try {
    const hubspotApiKey = process.env.HUBSPOT_API_KEY;
    const salesforceApiKey = process.env.SALESFORCE_API_KEY;

    if (hubspotApiKey) {
      // Implement HubSpot integration here
      // const hubspotClient = new Client({ accessToken: hubspotApiKey });
      // await hubspotClient.crm.contacts.basicApi.create({ ... });
      logger.info("Syncing to HubSpot...", lead);
    } else if (salesforceApiKey) {
        // Implement Salesforce integration here
        logger.info("Syncing to Salesforce...", lead);
    } else {
      // Mock implementation
      logger.info("CRM API keys not found. Skipping CRM sync.", {
        // Log minimal info to avoid leaking PII in logs if possible,
        // but for debugging it's useful.
        leadEmail: lead.email
      });
    }

    return true;
  } catch (error) {
    logger.error("Failed to sync lead to CRM", error);
    // Return false but don't throw, so we don't break the user experience
    return false;
  }
}
