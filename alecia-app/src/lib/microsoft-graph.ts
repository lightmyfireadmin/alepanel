/**
 * Microsoft Graph API Service (Skeleton)
 * 
 * Provides integration with Microsoft 365:
 * - Calendar sync
 * - SSO authentication
 * 
 * Documentation: https://learn.microsoft.com/en-us/graph/overview
 */

// TODO: Add Microsoft Graph SDK
// npm install @microsoft/microsoft-graph-client @azure/msal-node

interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  organizer?: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  attendees?: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
    status: {
      response: string;
    };
  }>;
}

/**
 * Fetch calendar events for the authenticated user
 * 
 * @param accessToken - Microsoft Graph access token
 * @param startDate - Start date for events (ISO string)
 * @param endDate - End date for events (ISO string)
 * @returns Array of calendar events
 */
export async function getCalendarEvents(
  accessToken: string,
  startDate: string,
  endDate: string
): Promise<CalendarEvent[]> {
  if (!accessToken) {
    throw new Error("Access token is required");
  }

  const queryParams = new URLSearchParams({
    startDateTime: startDate,
    endDateTime: endDate,
  });

  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/calendar/calendarView?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          // Prefer header can be used to set timezone if needed
          // "Prefer": 'outlook.timezone="UTC"'
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching calendar events: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate that data.value is an array
    if (!data || !Array.isArray(data.value)) {
      console.error("Invalid response format from Microsoft Graph API", data);
      throw new Error("Invalid response format from Microsoft Graph API");
    }

    return data.value as CalendarEvent[];
  } catch (error) {
    console.error("Error in getCalendarEvents:", error);
    throw error;
  }
}

/**
 * Get Microsoft Graph access token using MSAL
 * 
 * @returns Access token for Microsoft Graph API
 */
export async function getMicrosoftGraphToken(): Promise<string> {
  // TODO: Implement MSAL authentication flow
  // 1. Configure MSAL client with tenant ID and client ID
  // 2. Use client credentials or authorization code flow
  // 3. Return access token
  
  throw new Error("Microsoft Graph authentication not yet implemented");
}

/**
 * Validate Microsoft Graph connection
 * 
 * @returns Boolean indicating if connection is working
 */
export async function validateGraphConnection(): Promise<boolean> {
  try {
    // TODO: Make a simple test call to Microsoft Graph API
    // Example: GET /me to get current user info
    
    return false; // Not yet implemented
  } catch (error) {
    console.error("Microsoft Graph connection validation failed:", error);
    return false;
  }
}

export type { CalendarEvent };
