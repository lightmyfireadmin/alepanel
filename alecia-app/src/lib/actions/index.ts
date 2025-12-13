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
  getAllContacts,
  getContactsByTag,
  searchContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getAllCompanies,
  searchCompanies,
  getCompanyById,
  getCompanyBySiren,
  createCompany,
  updateCompany,
  deleteCompany,
  getContactCount,
  getCompanyCount,
  type ContactFormData,
  type CompanyFormData,
} from "./crm";

// Projects
export {
  getAllProjects,
  getProjectsByStatus,
  getProjectById,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
  getProjectCount,
  getActiveProjectCount,
  getProjectEvents,
  createProjectEvent,
  updateProjectEvent,
  deleteProjectEvent,
  type ProjectFormData,
  type ProjectEventFormData,
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
  enrichCompanyBySiren,
  type CompanyEnrichmentData,
} from "./company-enrichment";
