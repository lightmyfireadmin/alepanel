"use client";

import { useEffect, useRef } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Component that syncs Clerk user to Convex on authentication.
 * Should be placed inside ConvexProviderWithClerk.
 * Creates user record if not exists, updates profile if changed.
 */
export function UserSync() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const ensureUser = useMutation(api.mutations.ensureUser);
  const hasSynced = useRef(false);

  useEffect(() => {
    // Only sync once per session, when authenticated
    if (isAuthenticated && !isLoading && !hasSynced.current) {
      hasSynced.current = true;
      ensureUser()
        .then((user) => {
          if (user) {
            console.log("[UserSync] User synced:", user.email);
          }
        })
        .catch((err) => {
          console.error("[UserSync] Failed to sync user:", err);
        });
    }
  }, [isAuthenticated, isLoading, ensureUser]);

  return null; // This component renders nothing
}
