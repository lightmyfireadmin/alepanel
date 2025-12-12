/**
 * Zod Validation Schemas for Deal Form
 * 
 * TypeScript-first validation with internationalized error messages.
 * Uses Zod v4 API syntax.
 */

import { z } from "zod";
import { SECTORS, REGIONS, MANDATE_TYPES } from "@/lib/db/schema";

// Create enum schemas from const arrays
const sectorEnum = z.enum(SECTORS);
const regionEnum = z.enum(REGIONS);
const mandateTypeEnum = z.enum(MANDATE_TYPES);

/**
 * Deal form schema with French error messages.
 */
export const dealSchema = z.object({
  clientName: z
    .string()
    .min(1, "Le nom du client est requis")
    .max(200, "Le nom ne peut pas dépasser 200 caractères"),
  
  clientLogo: z
    .string()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),
  
  acquirerName: z
    .string()
    .max(200, "Le nom ne peut pas dépasser 200 caractères")
    .optional()
    .or(z.literal("")),
  
  acquirerLogo: z
    .string()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),
  
  sector: sectorEnum,
  
  region: regionEnum.optional().or(z.literal("")),
  
  year: z
    .number()
    .min(2000, "L'année doit être supérieure à 2000")
    .max(new Date().getFullYear(), `L'année ne peut pas dépasser ${new Date().getFullYear()}`),
  
  mandateType: mandateTypeEnum,
  
  description: z
    .string()
    .max(5000, "La description ne peut pas dépasser 5000 caractères")
    .optional()
    .or(z.literal("")),
  
  isPriorExperience: z.boolean().optional(),
});

export type DealFormData = z.infer<typeof dealSchema>;

/**
 * Contact form schema.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  
  email: z
    .string()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  
  phone: z
    .string()
    .regex(/^(\+?\d{1,3}[-.\s]?)?\d{9,14}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  
  role: z
    .string()
    .max(100, "Le rôle ne peut pas dépasser 100 caractères")
    .optional(),
  
  companyId: z.string().uuid().optional().or(z.literal("")),
  
  notes: z
    .string()
    .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
    .optional(),
  
  tags: z.array(z.string()).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Company form schema.
 */
export const companySchema = z.object({
  name: z
    .string()
    .min(1, "Le nom est requis")
    .max(200, "Le nom ne peut pas dépasser 200 caractères"),
  
  siren: z
    .string()
    .length(9, "Le SIREN doit contenir exactement 9 chiffres")
    .regex(/^\d{9}$/, "Le SIREN doit contenir uniquement des chiffres")
    .optional()
    .or(z.literal("")),
  
  address: z
    .string()
    .max(500, "L'adresse ne peut pas dépasser 500 caractères")
    .optional(),
  
  sector: sectorEnum.optional(),
  
  financialData: z.object({
    revenue: z.number().nonnegative().optional(),
    ebitda: z.number().optional(),
    employees: z.number().nonnegative().int().optional(),
    year: z.number().min(2000).max(new Date().getFullYear()).optional(),
  }).optional(),
  
  logoUrl: z
    .string()
    .url("URL invalide")
    .optional()
    .or(z.literal("")),
});

export type CompanyFormData = z.infer<typeof companySchema>;

/**
 * Buyer criteria schema for Deal Matchmaker.
 */
export const buyerCriteriaSchema = z.object({
  contactId: z.string().uuid("ID de contact invalide"),
  
  targetSectors: z.array(sectorEnum).optional(),
  
  targetRegions: z.array(regionEnum).optional(),
  
  minRevenue: z
    .number()
    .nonnegative("Le CA minimum doit être positif")
    .optional(),
  
  maxRevenue: z
    .number()
    .nonnegative("Le CA maximum doit être positif")
    .optional(),
  
  minEbitda: z.number().optional(),
  
  maxEbitda: z.number().optional(),
  
  notes: z
    .string()
    .max(2000, "Les notes ne peuvent pas dépasser 2000 caractères")
    .optional(),
}).refine(
  (data) => !data.minRevenue || !data.maxRevenue || data.minRevenue <= data.maxRevenue,
  { message: "Le CA minimum doit être inférieur au CA maximum", path: ["maxRevenue"] }
).refine(
  (data) => !data.minEbitda || !data.maxEbitda || data.minEbitda <= data.maxEbitda,
  { message: "L'EBITDA minimum doit être inférieur à l'EBITDA maximum", path: ["maxEbitda"] }
);

export type BuyerCriteriaFormData = z.infer<typeof buyerCriteriaSchema>;
