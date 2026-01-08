// Microsoft 365 Integration Components
// Re-export all Microsoft-related components from this index

// OneDrive
export { OneDrivePicker } from "./OneDrivePicker";
export { RecentFilesWidget } from "./RecentFilesWidget";
export { FilePreviewDialog } from "./FilePreviewDialog";
export { FileUploadDialog } from "./FileUploadDialog";
export { DataRoomBuilder } from "./DataRoomBuilder";

// Excel
export { ExcelFinanceImporter } from "./ExcelFinanceImporter";

// Calendar & Teams (Phase 2)
export { CalendarWidget } from "./CalendarWidget";
export { MeetingScheduler } from "./MeetingScheduler";
export { TeamsChannelManager } from "./TeamsChannelManager";

// Re-export hooks for convenience
export { useMicrosoft } from "@/hooks/use-microsoft";
export { useMicrosoftCalendar } from "@/hooks/use-microsoft-calendar";

// Re-export types
export type { 
  CalendarEvent, 
  Attendee, 
  CreateMeetingParams,
  TeamsChannel,
  CreateChannelParams
} from "@/hooks/use-microsoft-calendar";
