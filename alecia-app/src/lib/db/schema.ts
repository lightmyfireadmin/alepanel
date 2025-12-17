import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, date, index } from "drizzle-orm/pg-core";

// =============================================================================
// USERS TABLE - Admin authentication
// =============================================================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("admin"),
  mustChangePassword: boolean("must_change_password").default(false),
  hasSeenOnboarding: boolean("has_seen_onboarding").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// DEALS TABLE - M&A Transactions
// =============================================================================
export const deals = pgTable("deals", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  
  // Client/Vendor info
  clientName: text("client_name").notNull(),
  clientLogo: text("client_logo"),
  
  // Acquirer/Investor info
  acquirerName: text("acquirer_name"),
  acquirerLogo: text("acquirer_logo"),
  
  // Classification
  sector: text("sector").notNull(),
  // Sectors: 'Technologies & logiciels', 'Distribution & services B2B', 
  // 'Distribution & services B2C', 'Santé', 'Immobilier & construction',
  // 'Industries', 'Services financiers & assurance', 'Agroalimentaire',
  // 'Énergie & environnement'
  
  region: text("region"),
  // Regions: 'Île-de-France', 'Provence-Alpes-Côte d\'Azur', 
  // 'Auvergne-Rhône-Alpes', 'Pays de la Loire', 'Centre-Val de Loire',
  // 'Hauts-de-France', 'Occitanie', 'Grand Ouest', 'Normandie', etc.
  
  year: integer("year").notNull(),
  
  mandateType: text("mandate_type").notNull(),
  // Types: 'Cession', 'Acquisition', 'Levée de fonds'
  
  // Content
  description: text("description"),
  
  // Flags
  isConfidential: boolean("is_confidential").default(false),
  isPriorExperience: boolean("is_prior_experience").default(false), // Operations with *
  
  // Enhanced case study content (Phase 1 - Roadmap #25)
  context: text("context"), // Context of the operation
  intervention: text("intervention"), // Our intervention details
  result: text("result"), // Results obtained
  testimonialText: text("testimonial_text"), // Client verbatim
  testimonialAuthor: text("testimonial_author"), // Testimonial author
  roleType: text("role_type"), // "Conseil vendeur" | "Conseil acquéreur" | "Conseil levée"
  dealSize: text("deal_size"), // Value range bracket
  keyMetrics: jsonb("key_metrics").$type<{
    multiple?: number;
    duration?: string;
    approachedBuyers?: number;
  }>(),
  
  // Display
  displayOrder: integer("display_order").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// POSTS TABLE - News/Blog articles
// =============================================================================
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  
  // Multilingual content
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en"),
  contentFr: text("content_fr").notNull(),
  contentEn: text("content_en"),
  excerpt: text("excerpt"),
  
  // Media
  coverImage: text("cover_image"),
  
  // Classification
  category: text("category"), // 'Communiqué', 'Article', 'Revue de presse'
  
  // Publishing
  publishedAt: timestamp("published_at"),
  isPublished: boolean("is_published").default(false),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// TEAM MEMBERS TABLE
// =============================================================================
export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  
  // Identity
  name: text("name").notNull(),
  role: text("role").notNull(), // 'Associé fondateur', 'Analyste', 'Directeur'
  
  // Media
  photo: text("photo"),
  
  // Multilingual bio
  bioFr: text("bio_fr"),
  bioEn: text("bio_en"),
  
  // Contact
  linkedinUrl: text("linkedin_url"),
  email: text("email"),
  
  // Expertise (Phase 1 - Roadmap #22)
  sectorsExpertise: text("sectors_expertise").array(), // Array of sector slugs
  transactions: text("transactions").array(), // Array of deal slugs
  
  // Display
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// COMPANIES TABLE - Linked to Pappers API
// =============================================================================
export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Identity
  name: text("name").notNull(),
  siren: text("siren").unique(),
  
  // Details
  address: text("address"),
  sector: text("sector"),
  
  // Financial data (JSONB for revenue/EBITDA)
  financialData: jsonb("financial_data").$type<{
    revenue?: number;
    ebitda?: number;
    employees?: number;
    year?: number;
  }>(),
  
  // Media
  logoUrl: text("logo_url"),
  
  // Enrichment tracking (cost control)
  isEnriched: boolean("is_enriched").default(false),
  lastEnrichedAt: timestamp("last_enriched_at"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// CONTACTS TABLE - CRM
// =============================================================================
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Identity
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role"),
  
  // Company relation
  companyId: uuid("company_id").references(() => companies.id),
  
  // CRM data
  notes: text("notes"),
  tags: text("tags").array(), // ["Investisseur", "Cédant", etc.]
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    companyIdIdx: index("contacts_company_id_idx").on(table.companyId),
  };
});

// =============================================================================
// PROJECTS TABLE - Interactive timeline
// =============================================================================
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Identity
  title: text("title").notNull(),
  
  // Kanban status
  status: text("status").notNull().default("Lead"),
  // Statuses: "Lead", "Due Diligence", "Closing", "Closed"
  
  // Relations
  clientId: uuid("client_id").references(() => contacts.id),
  
  // Timeline
  startDate: date("start_date"),
  targetCloseDate: date("target_close_date"),
  
  // Description
  description: text("description"),
  
  // Display
  displayOrder: integer("display_order").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientIdIdx: index("projects_client_id_idx").on(table.clientId),
  };
});

// =============================================================================
// PROJECT EVENTS TABLE - Timeline details
// =============================================================================
export const projectEvents = pgTable("project_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Project relation
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  
  // Event details
  type: text("type").notNull(), // "Meeting", "Document", "Milestone", "Note"
  date: date("date").notNull(),
  description: text("description"),
  
  // Optional file attachment
  fileUrl: text("file_url"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    projectIdIdx: index("project_events_project_id_idx").on(table.projectId),
  };
});

// =============================================================================
// DOCUMENTS TABLE - Data Room / Magic Links
// =============================================================================
export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // File info
  name: text("name").notNull(),
  url: text("url").notNull(), // Vercel Blob URL
  mimeType: text("mime_type"),
  
  // Project relation (optional)
  projectId: uuid("project_id").references(() => projects.id),
  
  // Access control
  isConfidential: boolean("is_confidential").default(true),
  accessToken: text("access_token").unique(), // For magic links
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    documentsProjectIdIdx: index("documents_project_id_idx").on(table.projectId),
  };
});

// =============================================================================
// WEATHER CACHE TABLE - Max 2 API calls per day (Cost Control)
// =============================================================================
export const weatherCache = pgTable("weather_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationKey: text("location_key").unique().notNull(), // e.g., "Paris,FR"
  data: jsonb("data").$type<{
    temp: number;
    description: string;
    icon: string;
    humidity?: number;
    windSpeed?: number;
  }>(),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

// =============================================================================
// BUYER CRITERIA TABLE - For Deal Matchmaker SQL matching
// =============================================================================
export const buyerCriteria = pgTable("buyer_criteria", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Linked to contact (buyer/investor)
  contactId: uuid("contact_id").references(() => contacts.id).notNull(),
  
  // Target preferences
  targetSectors: text("target_sectors").array(),
  targetRegions: text("target_regions").array(),
  
  // Financial range preferences
  minRevenue: integer("min_revenue"), // in euros
  maxRevenue: integer("max_revenue"),
  minEbitda: integer("min_ebitda"),
  maxEbitda: integer("max_ebitda"),
  
  // Additional preferences
  notes: text("notes"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  contactIdIdx: index("buyer_criteria_contact_id_idx").on(table.contactId),
}));

// =============================================================================
// VOICE NOTES TABLE - Stored in Vercel Blob
// =============================================================================
export const voiceNotes = pgTable("voice_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Relations (optional - can be linked to project or contact)
  projectId: uuid("project_id").references(() => projects.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  
  // Storage
  blobUrl: text("blob_url").notNull(), // Vercel Blob URL
  
  // Metadata
  durationSeconds: integer("duration_seconds"),
  transcription: text("transcription"), // Future: Whisper API
  
  // User who recorded
  recordedBy: uuid("recorded_by").references(() => users.id),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  projectIdIdx: index("voice_notes_project_id_idx").on(table.projectId),
  contactIdIdx: index("voice_notes_contact_id_idx").on(table.contactId),
  recordedByIdIdx: index("voice_notes_recorded_by_idx").on(table.recordedBy),
}));

// =============================================================================
// SECTORS TABLE - Sector verticals (Phase 1 - Roadmap #44)
// =============================================================================
export const sectors = pgTable("sectors", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  
  // Multilingual content
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  investmentThesisFr: text("investment_thesis_fr"),
  investmentThesisEn: text("investment_thesis_en"),
  
  // UI
  iconType: text("icon_type"), // For selecting appropriate icon
  
  // Relations
  referentPartnerId: uuid("referent_partner_id").references(() => teamMembers.id),
  
  // Display
  displayOrder: integer("display_order").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  referentPartnerIdIdx: index("sectors_referent_partner_id_idx").on(table.referentPartnerId),
}));

// =============================================================================
// OFFICES TABLE - Regional offices (Phase 1 - Roadmap #44)
// =============================================================================
export const officesTable = pgTable("offices", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Identity
  name: text("name").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  
  // Location
  address: text("address"),
  phone: text("phone"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  
  // Media
  imageUrl: text("image_url"),
  
  // Display
  displayOrder: integer("display_order").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// TESTIMONIALS TABLE - Client verbatims (Phase 1 - Roadmap #44)
// =============================================================================
export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  
  // Relations
  dealId: uuid("deal_id").references(() => deals.id),
  
  // Content
  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  authorCompany: text("author_company"),
  content: text("content").notNull(),
  rating: integer("rating"), // 1-5 stars
  
  // Publishing
  isPublished: boolean("is_published").default(false),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  dealIdIdx: index("testimonials_deal_id_idx").on(table.dealId),
}));

// =============================================================================
// JOB OFFERS TABLE
// =============================================================================
export const jobOffers = pgTable("job_offers", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  
  // Job details
  title: text("title").notNull(),
  type: text("type").notNull(), // 'Stage/alternance', 'CDI'
  location: text("location").notNull(),
  description: text("description"),
  requirements: text("requirements").array(),
  
  // Contact/Application
  contactEmail: text("contact_email"),
  pdfUrl: text("pdf_url"),
  
  // Display
  isPublished: boolean("is_published").default(true),
  displayOrder: integer("display_order").default(0),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// LEADS TABLE - Contact form submissions
// =============================================================================
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Form fields
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),

  // Status
  status: text("status").default("new"), // "new", "contacted", "qualified", "closed"

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectEvent = typeof projectEvents.$inferSelect;
export type NewProjectEvent = typeof projectEvents.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type WeatherCache = typeof weatherCache.$inferSelect;
export type NewWeatherCache = typeof weatherCache.$inferInsert;

export type BuyerCriteria = typeof buyerCriteria.$inferSelect;
export type NewBuyerCriteria = typeof buyerCriteria.$inferInsert;

export type VoiceNote = typeof voiceNotes.$inferSelect;
export type NewVoiceNote = typeof voiceNotes.$inferInsert;

export type Sector = typeof sectors.$inferSelect;
export type NewSector = typeof sectors.$inferInsert;

export type Office = typeof officesTable.$inferSelect;
export type NewOffice = typeof officesTable.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type JobOffer = typeof jobOffers.$inferSelect;
export type NewJobOffer = typeof jobOffers.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

// =============================================================================
// ENUMS (for reference/validation)
// =============================================================================
export const SECTORS = [
  "Technologies & logiciels",
  "Distribution & services B2B",
  "Distribution & services B2C",
  "Santé",
  "Immobilier & construction",
  "Industries",
  "Services financiers & assurance",
  "Agroalimentaire",
  "Énergie & environnement",
] as const;

export const REGIONS = [
  "Île-de-France",
  "Provence-Alpes-Côte d'Azur",
  "Auvergne-Rhône-Alpes",
  "Pays de la Loire",
  "Centre-Val de Loire",
  "Hauts-de-France",
  "Occitanie",
  "Grand Ouest",
  "Normandie",
  "Bretagne",
  "Nouvelle-Aquitaine",
  "Grand Est",
  "Bourgogne-Franche-Comté",
] as const;

export const MANDATE_TYPES = ["Cession", "Acquisition", "Levée de fonds"] as const;

export const POST_CATEGORIES = ["Communiqué", "Article", "Revue de presse"] as const;

export const TEAM_ROLES = ["Associé fondateur", "Associé", "Directeur", "Manager", "Analyste"] as const;

// New Business OS enums
export const PROJECT_STATUSES = ["Lead", "Due Diligence", "Closing", "Closed"] as const;

export const PROJECT_EVENT_TYPES = ["Meeting", "Document", "Milestone", "Note"] as const;

export const CONTACT_TAGS = [
  "Investisseur",
  "Cédant",
  "Acquéreur",
  "Conseil juridique",
  "Conseil fiscal",
  "Banque",
  "Family Office",
  "Fonds PE",
] as const;

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;