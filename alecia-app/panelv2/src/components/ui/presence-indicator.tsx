"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

interface PresenceIndicatorProps {
  maxAvatars?: number;
  showCount?: boolean;
  className?: string;
}

/**
 * Shows currently active users with avatars
 * Displays a "+N" badge for additional users beyond maxAvatars
 */
export function PresenceIndicator({
  maxAvatars = 5,
  showCount = true,
  className = "",
}: PresenceIndicatorProps) {
  const activeUsers = useQuery(api.presence.getActiveUsers);

  if (!activeUsers || activeUsers.length === 0) {
    return null;
  }

  const displayUsers = activeUsers.slice(0, maxAvatars);
  const remainingCount = activeUsers.length - maxAvatars;

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${className}`}>
        {showCount && (
          <span className="text-xs text-muted-foreground mr-2">
            {activeUsers.length} en ligne
          </span>
        )}
        <div className="flex -space-x-2">
          {displayUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online indicator dot */}
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.currentPage}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{remainingCount} autres utilisateurs en ligne</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
