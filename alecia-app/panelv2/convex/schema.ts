import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Identity & RBAC
  users: defineTable({
    tokenIdentifier: v.string(), // Clerk ID
    role: v.union(v.literal("sudo"), v.literal("partner"), v.literal("advisor")),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    signature: v.optional(v.string()), // For signing docs
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  // 2. Smart CRM (Pappers & Migration Ready)
  companies: defineTable({
    // Basic
    name: v.string(),
    description: v.optional(v.string()),
    website: v.optional(v.string()),
    logoUrl: v.optional(v.string()),

    // Legal (France)
    siren: v.optional(v.string()), // Indexed
    nafCode: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    address: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        zip: v.string(),
        country: v.string(),
      })
    ),

    // Financials (JSON Object for raw data)
    financials: v.optional(
      v.object({
        revenue: v.optional(v.number()),
        ebitda: v.optional(v.number()),
        netDebt: v.optional(v.number()),
        valuationAsk: v.optional(v.number()),
        year: v.optional(v.number()),
        currency: v.optional(v.string()),
      })
    ),

    // Source
    pappersId: v.optional(v.string()),
    pipedriveId: v.optional(v.string()), // Indexed
  })
    .index("by_siren", ["siren"])
    .index("by_pipedriveId", ["pipedriveId"]),

  contacts: defineTable({
    companyId: v.id("companies"),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  }).index("by_companyId", ["companyId"]),

  // 3. Deal Flow & Intelligence (The Engine)
  deals: defineTable({
    title: v.string(),
    stage: v.string(), // e.g. "New", "Due Diligence", "Closed"
    amount: v.optional(v.number()),
    ownerId: v.id("users"),
    companyId: v.id("companies"),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_companyId", ["companyId"]),

  embeddings: defineTable({
    targetId: v.string(), // ID of the deal or buyer/contact
    targetType: v.union(v.literal("deal"), v.literal("buyer")),
    vector: v.array(v.float64()), // Vector embedding
  }).vectorIndex("by_vector", {
    vectorField: "vector",
    dimensions: 1536, // Standard OpenAI dimensions, adjust if needed
    filterFields: ["targetType"],
  }),

  buyer_criteria: defineTable({
    contactId: v.id("contacts"),
    minValuation: v.optional(v.number()),
    maxValuation: v.optional(v.number()),
    targetSectors: v.array(v.string()),
  }).index("by_contactId", ["contactId"]),

  // 4. CMS & Governance ("Edit Everything")
  global_settings: defineTable({
    theme: v.object({
      primaryColor: v.string(),
      radius: v.number(),
      font: v.string(),
    }),
    governance: v.object({
      quorumPercentage: v.number(),
    }),
  }), // Singleton pattern usually implies checking for a single doc

  site_pages: defineTable({
    slug: v.string(),
    title: v.string(), // Added title for easier management
    content: v.string(), // Changed to string for Tiptap HTML/JSON stringified storage for easier diffing
    isPublished: v.boolean(),
    seo: v.optional(
      v.object({
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        keywords: v.optional(v.array(v.string())),
      })
    ),
  }).index("by_slug", ["slug"]),

  proposals: defineTable({
    targetPageId: v.id("site_pages"),
    title: v.string(), // Commit message
    diffSnapshot: v.string(), // Stringified diff or new content
    aiSummary: v.optional(v.string()), // AI generated summary
    authorId: v.id("users"),
    votesFor: v.array(v.id("users")),
    votesAgainst: v.array(v.id("users")), // Added votesAgainst
    status: v.union(
      v.literal("voting"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("merged")
    ),
  })
    .index("by_targetPageId", ["targetPageId"])
    .index("by_status", ["status"]),

  // 5. Tools & Assets
  whiteboards: defineTable({
    roomId: v.string(),
    snapshot: v.string(), // Stringified Tldraw store
  }).index("by_roomId", ["roomId"]),

  voice_notes: defineTable({
    audioFileId: v.string(), // Storage ID
    transcription: v.optional(v.string()),
    summary: v.optional(v.string()),
  }),

  valuation_models: defineTable({
    name: v.string(),
    formula: v.string(), // string for mathjs
    variables: v.array(v.string()),
  }),
});