"use client";

import { useCallback, useState } from "react";
import { useAuth, useSession } from "@clerk/nextjs";

// Types for Calendar/Teams integration
export interface CalendarEvent {
  id: string;
  subject: string;
  start: string; // ISO8601
  end: string;
  location?: string;
  webLink: string;
  isOnlineMeeting: boolean;
  onlineMeetingUrl?: string;
  attendees: Attendee[];
  organizer: {
    name: string;
    email: string;
  };
  dealId?: string; // Custom property for linking to deals
}

export interface Attendee {
  name: string;
  email: string;
  type: "required" | "optional" | "resource";
  response?: "accepted" | "declined" | "tentative" | "none";
}

export interface CreateMeetingParams {
  subject: string;
  startDateTime: string; // ISO8601
  endDateTime: string;
  attendees: { email: string; name?: string; type?: "required" | "optional" }[];
  location?: string;
  body?: string;
  isOnlineMeeting?: boolean;
  dealId?: string;
}

export interface TeamsChannel {
  id: string;
  displayName: string;
  description?: string;
  webUrl: string;
  membershipType: "standard" | "private";
}

export interface CreateChannelParams {
  teamId: string;
  displayName: string;
  description?: string;
  membershipType?: "standard" | "private";
}

/**
 * Hook for Microsoft Calendar and Teams integration
 */
export function useMicrosoftCalendar() {
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get Microsoft access token
   */
  const getMicrosoftToken = useCallback(async (): Promise<string | null> => {
    if (!session) return null;
    try {
      const token = await session.getToken({ template: "microsoft" });
      return token;
    } catch (err) {
      console.error("Failed to get Microsoft token:", err);
      return null;
    }
  }, [session]);

  /**
   * Get upcoming calendar events
   */
  const getUpcomingEvents = useCallback(async (
    daysAhead: number = 14
  ): Promise<CalendarEvent[]> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const now = new Date();
      const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/calendarview?startDateTime=${now.toISOString()}&endDateTime=${endDate.toISOString()}&$orderby=start/dateTime&$top=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Prefer: 'outlook.timezone="Europe/Paris"',
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch calendar events");
      }

      const data = await response.json();
      return (data.value || []).map((event: any) => ({
        id: event.id,
        subject: event.subject,
        start: event.start.dateTime,
        end: event.end.dateTime,
        location: event.location?.displayName,
        webLink: event.webLink,
        isOnlineMeeting: event.isOnlineMeeting,
        onlineMeetingUrl: event.onlineMeeting?.joinUrl,
        attendees: (event.attendees || []).map((a: any) => ({
          name: a.emailAddress?.name,
          email: a.emailAddress?.address,
          type: a.type,
          response: a.status?.response,
        })),
        organizer: {
          name: event.organizer?.emailAddress?.name,
          email: event.organizer?.emailAddress?.address,
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get events");
      return [];
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken]);

  /**
   * Create a new calendar event (with optional Teams meeting)
   */
  const createMeeting = useCallback(async (
    params: CreateMeetingParams
  ): Promise<CalendarEvent | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const eventPayload: any = {
        subject: params.subject,
        start: {
          dateTime: params.startDateTime,
          timeZone: "Europe/Paris",
        },
        end: {
          dateTime: params.endDateTime,
          timeZone: "Europe/Paris",
        },
        attendees: params.attendees.map((a) => ({
          emailAddress: {
            address: a.email,
            name: a.name || a.email,
          },
          type: a.type || "required",
        })),
        isOnlineMeeting: params.isOnlineMeeting ?? true,
        onlineMeetingProvider: params.isOnlineMeeting ? "teamsForBusiness" : undefined,
      };

      if (params.location) {
        eventPayload.location = { displayName: params.location };
      }

      if (params.body) {
        eventPayload.body = {
          contentType: "HTML",
          content: params.body,
        };
      }

      const response = await fetch("https://graph.microsoft.com/v1.0/me/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create meeting");
      }

      const event = await response.json();
      return {
        id: event.id,
        subject: event.subject,
        start: event.start.dateTime,
        end: event.end.dateTime,
        location: event.location?.displayName,
        webLink: event.webLink,
        isOnlineMeeting: event.isOnlineMeeting,
        onlineMeetingUrl: event.onlineMeeting?.joinUrl,
        attendees: [],
        organizer: {
          name: event.organizer?.emailAddress?.name,
          email: event.organizer?.emailAddress?.address,
        },
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create meeting");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken]);

  /**
   * Delete a calendar event
   */
  const deleteMeeting = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.ok;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete meeting");
      return false;
    }
  }, [getMicrosoftToken]);

  /**
   * Get user's Teams
   */
  const getTeams = useCallback(async (): Promise<{ id: string; displayName: string; description?: string }[]> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const response = await fetch("https://graph.microsoft.com/v1.0/me/joinedTeams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Teams");
      }

      const data = await response.json();
      return (data.value || []).map((team: any) => ({
        id: team.id,
        displayName: team.displayName,
        description: team.description,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get Teams");
      return [];
    }
  }, [getMicrosoftToken]);

  /**
   * Get channels in a Team
   */
  const getTeamChannels = useCallback(async (
    teamId: string
  ): Promise<TeamsChannel[]> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch channels");
      }

      const data = await response.json();
      return (data.value || []).map((channel: any) => ({
        id: channel.id,
        displayName: channel.displayName,
        description: channel.description,
        webUrl: channel.webUrl,
        membershipType: channel.membershipType,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get channels");
      return [];
    }
  }, [getMicrosoftToken]);

  /**
   * Create a new channel in a Team
   */
  const createChannel = useCallback(async (
    params: CreateChannelParams
  ): Promise<TeamsChannel | null> => {
    setLoading(true);
    setError(null);

    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const response = await fetch(
        `https://graph.microsoft.com/v1.0/teams/${params.teamId}/channels`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName: params.displayName,
            description: params.description,
            membershipType: params.membershipType || "standard",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to create channel");
      }

      const channel = await response.json();
      return {
        id: channel.id,
        displayName: channel.displayName,
        description: channel.description,
        webUrl: channel.webUrl,
        membershipType: channel.membershipType,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create channel");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken]);

  return {
    // State
    isLoaded,
    isSignedIn,
    loading,
    error,

    // Calendar
    getUpcomingEvents,
    createMeeting,
    deleteMeeting,

    // Teams
    getTeams,
    getTeamChannels,
    createChannel,
  };
}
