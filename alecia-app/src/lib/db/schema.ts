import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, date } from "drizzle-orm/pg-core";

// =============================================================================
// USERS TABLE - Admin authentication
// =============================================================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("admin"),
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

