/**
 * Central export file for all server actions
 * Import from here to keep imports clean and organized
 */

// Deals
export {
  getAllDeals,
  getDealBySlug,
  getFilteredDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  getDealFilterOptions,
  getDealStats,
  getRecentDeals,
  type DealFormData,
} from "./deals";

// Team Members
export {
  getAllTeamMembers,
  getTeamMemberBySlug,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamMemberCount,
  type TeamMemberFormData,
} from "./team";

// Documents
export {
  uploadDocument,
  getAllDocuments,
  getProjectDocuments,
  getDocumentByToken,
  getDocumentById,
  updateDocument,
  deleteDocument,
  regenerateDocumentToken,
  getDocumentCount,
  type DocumentFormData,
} from "./documents";

// CRM (Contacts & Companies)
export {
  getContacts as getAllContacts,
  createContact,
  getCompanies as getAllCompanies,
} from "./crm";

// Projects
export {
  getProjects as getAllProjects,
  getProject as getProjectById,
  createProject,
  updateProjectStatus,
} from "./projects";

// Posts/News
export {
  getAllPublishedPosts,
  getAllPosts,
  getPostBySlug,
  getPostById,
  getPostsByCategory,
  createPost,
  updatePost,
  deletePost,
  togglePostPublish,
  getPostCount,
  getPublishedPostCount,
  getRecentPosts,
  type PostFormData,
} from "./posts";

// Voice Notes (already existed)
export {
  uploadVoiceNote,
  deleteVoiceNote,
  getProjectVoiceNotes,
  updateTranscription,
} from "./voice-notes";

// Deal Matcher (already existed)
export {
  findMatchingBuyers,
  getInvestorsByTag,
  saveBuyerCriteria,
  type MatchCriteria,
  type MatchedBuyer,
} from "./deal-matcher";

// Company Enrichment (already existed)
export {
  enrichCompany,
  checkEnrichedCompany,
  type EnrichedCompanyData,
} from "./company-enrichment";
