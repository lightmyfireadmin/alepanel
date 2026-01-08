// Deal Flow Pro Components
// Re-export all deal-related components from this index

// Pipeline Management
export { DealTimeline } from "./DealTimeline";
export type { DealMilestone } from "./DealTimeline";
export { exampleTimelineData } from "./DealTimeline";

// Analytics
export { WinLossAnalysis, exampleWinLossData } from "./WinLossAnalysis";
export { ProbabilityForecast, getDefaultProbability, exampleForecastData } from "./ProbabilityForecast";

// Due Diligence
export { DDChecklist } from "./DDChecklist";
export type { ChecklistItem, ChecklistCategory } from "./DDChecklist";
export { RedFlagTracker, exampleRedFlags } from "./RedFlagTracker";
export type { RedFlag } from "./RedFlagTracker";
export { DocumentRequestList } from "./DocumentRequestList";
export type { DocumentRequest } from "./DocumentRequestList";
export { ValuationCalculator } from "./ValuationCalculator";

// AI Features
export { SmartSummary } from "./SmartSummary";

// Other Deal Components
export { DealMatchmaker } from "./DealMatchmaker";
export { DealCard } from "./deal-card";
export { DealDetailLogo } from "./deal-detail-logo";
export { DealFilter } from "./deal-filter";
