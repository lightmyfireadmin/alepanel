import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, date, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// =============================================================================
// USERS TABLE - Admin authentication
// =============================================================================
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").default("admin"), // 'sudo', 'admin', 'advisor', 'guest'
  mustChangePassword: boolean("must_change_password").default(false),
  hasSeenOnboarding: boolean("has_seen_onboarding").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ... existing tables ...
// I will insert relations at the end of the file or after the tables.
// Let's rewrite the end of the file to include relations.


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
  region: text("region"),
  year: integer("year").notNull(),
  mandateType: text("mandate_type").notNull(),
  
  // Content
  description: text("description"),
  
  // Flags
  isConfidential: boolean("is_confidential").default(false),
  isPriorExperience: boolean("is_prior_experience").default(false),
  
  // Enhanced case study content
  context: text("context"),
  intervention: text("intervention"),
  result: text("result"),
  testimonialText: text("testimonial_text"),
  testimonialAuthor: text("testimonial_author"),
  roleType: text("role_type"),
  dealSize: text("deal_size"),
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
}, (table) => {
  return {
    yearIdx: index("deals_year_idx").on(table.year),
    sectorIdx: index("deals_sector_idx").on(table.sector),
    regionIdx: index("deals_region_idx").on(table.region),
    mandateTypeIdx: index("deals_mandate_type_idx").on(table.mandateType),
    yearDisplayOrderIdx: index("deals_year_display_order_idx").on(table.year, table.displayOrder),
  };
});

// =============================================================================
// POSTS TABLE - News/Blog articles
// =============================================================================
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  titleFr: text("title_fr").notNull(),
  titleEn: text("title_en"),
  contentFr: text("content_fr").notNull(),
  contentEn: text("content_en"),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  category: text("category"),
  publishedAt: timestamp("published_at"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    isPublishedIdx: index("posts_is_published_idx").on(table.isPublished),
    publishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
    categoryIdx: index("posts_category_idx").on(table.category),
    isPublishedPublishedAtIdx: index("posts_is_published_published_at_idx").on(table.isPublished, table.publishedAt),
  };
});

// =============================================================================
// TEAM MEMBERS TABLE
// =============================================================================
export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  photo: text("photo"),
  bioFr: text("bio_fr"),
  bioEn: text("bio_en"),
  linkedinUrl: text("linkedin_url"),
  email: text("email"),
  sectorsExpertise: text("sectors_expertise").array(),
  transactions: text("transactions").array(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// COMPANIES TABLE - Linked to Pappers API
// =============================================================================
export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  siren: text("siren").unique(),
  address: text("address"),
  sector: text("sector"),
  financialData: jsonb("financial_data").$type<{
    revenue?: number;
    ebitda?: number;
    employees?: number;
    year?: number;
  }>(),
  logoUrl: text("logo_url"),
  isEnriched: boolean("is_enriched").default(false),
  lastEnrichedAt: timestamp("last_enriched_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// CONTACTS TABLE - CRM
// =============================================================================
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  role: text("role"),
  companyId: uuid("company_id").references(() => companies.id),
  notes: text("notes"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    companyIdIdx: index("contacts_company_id_idx").on(table.companyId),
    tagsIdx: index("contacts_tags_idx").using("gin", table.tags),
  };
});

// =============================================================================
// KANBAN SYSTEM
// =============================================================================
export const kanbanBoards = pgTable("kanban_boards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const kanbanColumns = pgTable("kanban_columns", {
  id: uuid("id").defaultRandom().primaryKey(),
  boardId: uuid("board_id").references(() => kanbanBoards.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// PROJECTS TABLE - Interactive timeline
// =============================================================================
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("Lead"), // Legacy field
  boardId: uuid("board_id").references(() => kanbanBoards.id),
  columnId: uuid("column_id").references(() => kanbanColumns.id),
  clientId: uuid("client_id").references(() => contacts.id),
  startDate: date("start_date"),
  targetCloseDate: date("target_close_date"),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    clientIdIdx: index("projects_client_id_idx").on(table.clientId),
    boardIdIdx: index("projects_board_id_idx").on(table.boardId),
  };
});

// =============================================================================
// PROJECT EVENTS TABLE - Timeline details
// =============================================================================
export const projectEvents = pgTable("project_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  type: text("type").notNull(),
  date: date("date").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
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
  name: text("name").notNull(),
  url: text("url"),
  content: jsonb("content"),
  mimeType: text("mime_type"),
  projectId: uuid("project_id").references(() => projects.id),
  isConfidential: boolean("is_confidential").default(true),
  accessToken: text("access_token").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    documentsProjectIdIdx: index("documents_project_id_idx").on(table.projectId),
  };
});

// =============================================================================
// WEATHER CACHE TABLE
// =============================================================================
export const weatherCache = pgTable("weather_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  locationKey: text("location_key").unique().notNull(),
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
// BUYER CRITERIA TABLE
// =============================================================================
export const buyerCriteria = pgTable("buyer_criteria", {
  id: uuid("id").defaultRandom().primaryKey(),
  contactId: uuid("contact_id").references(() => contacts.id).notNull(),
  targetSectors: text("target_sectors").array(),
  targetRegions: text("target_regions").array(),
  minRevenue: integer("min_revenue"),
  maxRevenue: integer("max_revenue"),
  minEbitda: integer("min_ebitda"),
  maxEbitda: integer("max_ebitda"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  contactIdIdx: index("buyer_criteria_contact_id_idx").on(table.contactId),
  targetSectorsIdx: index("buyer_criteria_target_sectors_idx").using("gin", table.targetSectors),
  targetRegionsIdx: index("buyer_criteria_target_regions_idx").using("gin", table.targetRegions),
}));

// =============================================================================
// VOICE NOTES TABLE
// =============================================================================
export const voiceNotes = pgTable("voice_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id),
  contactId: uuid("contact_id").references(() => contacts.id),
  blobUrl: text("blob_url").notNull(),
  durationSeconds: integer("duration_seconds"),
  transcription: text("transcription"),
  recordedBy: uuid("recorded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  projectIdIdx: index("voice_notes_project_id_idx").on(table.projectId),
  contactIdIdx: index("voice_notes_contact_id_idx").on(table.contactId),
  recordedByIdIdx: index("voice_notes_recorded_by_idx").on(table.recordedBy),
}));

// =============================================================================
// SECTORS TABLE
// =============================================================================
export const sectors = pgTable("sectors", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  nameFr: text("name_fr").notNull(),
  nameEn: text("name_en"),
  descriptionFr: text("description_fr"),
  descriptionEn: text("description_en"),
  investmentThesisFr: text("investment_thesis_fr"),
  investmentThesisEn: text("investment_thesis_en"),
  iconType: text("icon_type"),
  referentPartnerId: uuid("referent_partner_id").references(() => teamMembers.id),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  referentPartnerIdIdx: index("sectors_referent_partner_id_idx").on(table.referentPartnerId),
}));

// =============================================================================
// OFFICES TABLE
// =============================================================================
export const officesTable = pgTable("offices", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  region: text("region").notNull(),
  address: text("address"),
  phone: text("phone"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================================================
// TESTIMONIALS TABLE
// =============================================================================
export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  dealId: uuid("deal_id").references(() => deals.id),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role"),
  authorCompany: text("author_company"),
  content: text("content").notNull(),
  rating: integer("rating"),
  isPublished: boolean("is_published").default(false),
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
  title: text("title").notNull(),
  type: text("type").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  requirements: text("requirements").array(),
  contactEmail: text("contact_email"),
  pdfUrl: text("pdf_url"),
  isPublished: boolean("is_published").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// LEADS TABLE
// =============================================================================
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =============================================================================
// BUSINESS OS TABLES (NEW)
// =============================================================================

// FORUM
export const forumCategories = pgTable("forum_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  order: integer("order").default(0),
  isPrivate: boolean("is_private").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const forumThreads = pgTable("forum_threads", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => forumCategories.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  lastPostAt: timestamp("last_post_at").defaultNow(),
  replyCount: integer("reply_count").default(0),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumPosts = pgTable("forum_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id").references(() => forumThreads.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(), 
  parentId: uuid("parent_id"), 
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// COLLAB - PADS
export const pads = pgTable("pads", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  ownerId: uuid("owner_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const padRevisions = pgTable("pad_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  padId: uuid("pad_id").references(() => pads.id).notNull(),
  contentSnapshot: text("content_snapshot"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

// COLLAB - WHITEBOARDS
export const whiteboards = pgTable("whiteboards", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  content: jsonb("content"),
  thumbnailUrl: text("thumbnail_url"),
  ownerId: uuid("owner_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// COLLAB - SPREADSHEETS
export const spreadsheets = pgTable("spreadsheets", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  data: jsonb("data"),
  schemaDef: jsonb("schema_def"),
  ownerId: uuid("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// SIGNATURES
export const signRequests = pgTable("sign_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  documentUrl: text("document_url").notNull(),
  status: text("status").default("pending"),
  requesterId: uuid("requester_id").references(() => users.id),
  signerEmail: text("signer_email").notNull(),
  signedUrl: text("signed_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const signAuditLogs = pgTable("sign_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id").references(() => signRequests.id).notNull(),
  action: text("action").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// RESEARCH
export const researchTasks = pgTable("research_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  query: text("query").notNull(),
  status: text("status").default("pending"),
  resultSummary: text("result_summary"),
  sources: jsonb("sources"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companyEnrichments = pgTable("company_enrichments", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companies.id),
  source: text("source").notNull(),
  data: jsonb("data"),
  fetchedAt: timestamp("fetched_at").defaultNow(),
});

export const systemConfig = pgTable("system_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chartConfigs = pgTable("chart_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  title: text("title").notNull(),
  type: text("type").notNull().default("line"), // 'line', 'bar', 'pie'
  dataSource: text("data_source").notNull().default("internal"), // 'internal', 'google', 'microsoft'
  externalSourceId: text("external_source_id"), // e.g. sheet ID
  dataConfig: jsonb("data_config"), // mapping of columns
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

export type ForumCategory = typeof forumCategories.$inferSelect;
export type ForumThread = typeof forumThreads.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;

export type Pad = typeof pads.$inferSelect;
export type Whiteboard = typeof whiteboards.$inferSelect;
export type Spreadsheet = typeof spreadsheets.$inferSelect;

export type SignRequest = typeof signRequests.$inferSelect;
export type ResearchTask = typeof researchTasks.$inferSelect;
export type ChartConfig = typeof chartConfigs.$inferSelect;

// =============================================================================
// ENUMS
// =============================================================================
export const USER_ROLES = ["sudo", "admin", "advisor", "guest"] as const;

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

export const leadRelations = relations(leads, () => ({
  // Define any relations if needed
}));

// BUSINESS OS RELATIONS
export const projectRelations = relations(projects, ({ one, many }) => ({
  client: one(contacts, {
    fields: [projects.clientId],
    references: [contacts.id],
  }),
  events: many(projectEvents),
}));

export const contactRelations = relations(contacts, ({ one, many }) => ({
  company: one(companies, {
    fields: [contacts.companyId],
    references: [companies.id],
  }),
  projects: many(projects),
}));

export const projectEventRelations = relations(projectEvents, ({ one }) => ({
  project: one(projects, {
    fields: [projectEvents.projectId],
    references: [projects.id],
  }),
}));

export const userRelations = relations(users, ({ many }) => ({
  charts: many(chartConfigs),
}));

export const chartConfigRelations = relations(chartConfigs, ({ one }) => ({
  user: one(users, {
    fields: [chartConfigs.userId],
    references: [users.id],
  }),
}));

export const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
