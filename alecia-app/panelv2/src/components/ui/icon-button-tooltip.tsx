"use client";

import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, ButtonProps } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface IconButtonWithTooltipProps extends ButtonProps {
  icon: LucideIcon;
  tooltip: string;
  shortcut?: string;
  iconClassName?: string;
}

/**
 * Icon button with tooltip and optional keyboard shortcut display
 */
export function IconButtonWithTooltip({
  icon: Icon,
  tooltip,
  shortcut,
  iconClassName = "h-4 w-4",
  ...buttonProps
}: IconButtonWithTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" {...buttonProps}>
            <Icon className={iconClassName} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <span>{tooltip}</span>
            {shortcut && (
              <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded font-mono">
                {shortcut}
              </kbd>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface TooltipWrapperProps {
  children: ReactNode;
  tooltip: string;
  side?: "top" | "right" | "bottom" | "left";
}

/**
 * Simple wrapper to add tooltip to any element
 */
export function TooltipWrapper({
  children,
  tooltip,
  side = "top",
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
