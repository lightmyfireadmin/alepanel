import { pgTable, uuid, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

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
