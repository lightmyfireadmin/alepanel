// CRM Intelligence Components
// Re-export all CRM-related components from this index

// Company Intelligence
export { CompanyEnricher } from "./CompanyEnricher";
export { CompanyNewsFeed } from "./CompanyNewsFeed";
export { CompetitorMapping } from "./CompetitorMapping";
export { FinancialHistoryChart } from "./FinancialHistoryChart";
export { OwnershipTree, exampleOwnershipData } from "./OwnershipTree";
export type { ShareholderNode } from "./OwnershipTree";

// Contact Intelligence
export { ContactDuplicatesDetector } from "./ContactDuplicatesDetector";
export { ContactEmailHistory } from "./ContactEmailHistory";
export { RelationshipGraph, exampleRelationshipData } from "./RelationshipGraph";

// Entity Management
export { EntityDrawer } from "./EntityDrawer";

// Integrations
export { PipedriveSync } from "./PipedriveSync";

// Re-export the auto-enrich hook
export { useAutoEnrich, AutoEnrichTrigger } from "@/hooks/useAutoEnrich";
