import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";

// =============================================================================
// SITE SETTINGS TABLE - Centralized configuration for the showcase website
// =============================================================================
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").unique().notNull(),
  value: jsonb("value"),
  category: text("category").notNull(), // 'branding', 'contact', 'integrations', 'analytics', 'legal'
  label: text("label").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Default settings structure - using interface for flexibility
export interface SiteSettingsConfig {
  // Branding
  "branding.companyName": string;
  "branding.tagline": string;
  "branding.primaryColor": string;
  "branding.accentColor": string;
  
  // Contact
  "contact.email": string;
  "contact.phone": string;
  "contact.whatsapp": string;
  
  // Stats
  "stats.operations": number;
  "stats.cumulativeValue": number;
  "stats.yearsExperience": number;
  "stats.satisfiedClients": number;
  
  // Legal
  "legal.siret": string;
  "legal.tva": string;
  "legal.rcs": string;
  "legal.capital": string;
  "legal.orias": string;
  "legal.amf": string;
  "legal.dpoEmail": string;
  
  // Integrations
  "integrations.crmType": string;
  "integrations.crmApiKey": string;
  "integrations.analyticsType": string;
  "integrations.analyticsId": string;
  "integrations.matomoUrl": string;
  
  // Features
  "features.showInvestorPortal": boolean;
  "features.showValuationTool": boolean;
  "features.enableNewsletter": boolean;
}

export const DEFAULT_SETTINGS: SiteSettingsConfig = {
  // Branding
  "branding.companyName": "alecia",
  "branding.tagline": "Conseil en fusion-acquisition",
  "branding.primaryColor": "#1a2744",
  "branding.accentColor": "#c9a227",
  
  // Contact
  "contact.email": "contact@alecia.fr",
  "contact.phone": "+33 1 00 00 00 00",
  "contact.whatsapp": "+33600000000",
  
  // Stats
  "stats.operations": 50,
  "stats.cumulativeValue": 500,
  "stats.yearsExperience": 75,
  "stats.satisfiedClients": 100,
  
  // Legal
  "legal.siret": "980 823 231",
  "legal.tva": "FR XX 980823231",
  "legal.rcs": "Nice",
  "legal.capital": "1 000 €",
  "legal.orias": "",
  "legal.amf": "",
  "legal.dpoEmail": "rgpd@alecia.fr",
  
  // Integrations
  "integrations.crmType": "",
  "integrations.crmApiKey": "",
  "integrations.analyticsType": "none",
  "integrations.analyticsId": "",
  "integrations.matomoUrl": "",
  
  // Features
  "features.showInvestorPortal": false,
  "features.showValuationTool": true,
  "features.enableNewsletter": true,
};

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
