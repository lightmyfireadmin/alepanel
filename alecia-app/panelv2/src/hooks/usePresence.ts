"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface PresenceUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currentPage: string;
  lastSeen: number;
}

/**
 * Hook for real-time presence tracking
 * Updates current user's presence and fetches active users
 */
export function usePresence(currentPage: string = "/") {
  const { user } = useUser();
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);
  
  const presenceData = useQuery(api.presence?.getActiveUsers ?? (() => []) as any);
  const updatePresence = useMutation(api.presence?.updatePresence ?? (() => {}) as any);

  // Update presence every 30 seconds
  useEffect(() => {
    if (!user) return;

    const sendHeartbeat = () => {
      updatePresence?.({ currentPage }).catch(() => {
        // Silently fail if presence not set up
      });
    };

    // Initial heartbeat
    sendHeartbeat();

    // Periodic heartbeat
    const interval = setInterval(sendHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [user, currentPage, updatePresence]);

  // Update active users from query
  useEffect(() => {
    if (presenceData && Array.isArray(presenceData)) {
      setActiveUsers(presenceData);
    }
  }, [presenceData]);

  const isOnline = useCallback((userId: string) => {
    return activeUsers.some(u => u.id === userId);
  }, [activeUsers]);

  const getOnlineCount = useCallback(() => {
    return activeUsers.length;
  }, [activeUsers]);

  return {
    activeUsers,
    isOnline,
    getOnlineCount,
    currentUser: user,
  };
}
