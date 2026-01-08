"use client";

import { useEffect } from "react";

/**
 * Hook to add Ctrl+S keyboard shortcut for form saving
 * @param onSave - Callback function to execute on save
 * @param enabled - Whether the shortcut is enabled
 */
export function useKeyboardSave(onSave: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, enabled]);
}

/**
 * Format a date as relative time in French
 * @param date - Date to format
 * @returns Relative time string (e.g., "Il y a 2h")
 */
export function formatRelativeTime(date: Date | number | string): string {
  const d = typeof date === "object" ? date : new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 10) return "À l'instant";
  if (seconds < 60) return `Il y a ${seconds}s`;
  if (minutes < 60) return `Il y a ${minutes}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  if (weeks < 4) return `Il y a ${weeks} sem.`;
  if (months < 12) return `Il y a ${months} mois`;
  return `Il y a ${years} an${years > 1 ? "s" : ""}`;
}

/**
 * Format a timestamp for display with relative date
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Object with relative and absolute date strings
 */
export function formatTimestamp(timestamp: number): {
  relative: string;
  absolute: string;
} {
  const date = new Date(timestamp);
  return {
    relative: formatRelativeTime(date),
    absolute: date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

/**
 * Copy text to clipboard and show toast feedback
 * @param text - Text to copy
 * @param label - Label for the toast (e.g., "ID copié")
 */
export async function copyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess?.();
    return true;
  } catch (error) {
    onError?.(error as Error);
    return false;
  }
}
