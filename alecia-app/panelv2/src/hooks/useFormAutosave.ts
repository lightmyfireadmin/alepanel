"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface AutosaveOptions {
  /** Unique key for this form (e.g., "deal-edit-{id}") */
  key: string;
  /** Interval in ms between autosaves (default: 30000 = 30s) */
  interval?: number;
  /** Callback when data is saved */
  onSave?: () => void;
  /** Whether to show toast notifications */
  showToasts?: boolean;
}

interface AutosaveState {
  lastSaved: Date | null;
  isSaving: boolean;
  isDirty: boolean;
}

/**
 * Hook for form autosave functionality
 * Saves form data to localStorage and optionally to Convex
 * 
 * Usage:
 * const { register, lastSaved, isDirty, saveNow, clearDraft } = useFormAutosave({
 *   key: `deal-${dealId}`,
 *   interval: 30000,
 * });
 * 
 * // Track changes
 * useEffect(() => { register(formData) }, [formData]);
 */
export function useFormAutosave<T extends object>(options: AutosaveOptions) {
  const { key, interval = 30000, onSave, showToasts = true } = options;
  
  const [state, setState] = useState<AutosaveState>({
    lastSaved: null,
    isSaving: false,
    isDirty: false,
  });
  
  const dataRef = useRef<T | null>(null);
  const initialDataRef = useRef<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `autosave_${key}`;

  // Load draft from localStorage on mount
  const loadDraft = useCallback((): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data as T;
      }
    } catch {
      // Invalid stored data
    }
    return null;
  }, [storageKey]);

  // Save to localStorage
  const saveDraft = useCallback((data: T) => {
    if (typeof window === "undefined") return;
    
    setState(s => ({ ...s, isSaving: true }));
    
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
      }));
      
      setState(s => ({
        ...s,
        isSaving: false,
        lastSaved: new Date(),
        isDirty: false,
      }));
      
      if (showToasts) {
        toast.success("Brouillon sauvegardé", { duration: 2000 });
      }
      
      onSave?.();
    } catch (error) {
      setState(s => ({ ...s, isSaving: false }));
      if (showToasts) {
        toast.error("Erreur de sauvegarde");
      }
    }
  }, [storageKey, onSave, showToasts]);

  // Clear draft
  const clearDraft = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(storageKey);
    setState(s => ({ ...s, isDirty: false, lastSaved: null }));
  }, [storageKey]);

  // Register data for autosave
  const register = useCallback((data: T) => {
    // Store initial data on first call
    if (!initialDataRef.current) {
      initialDataRef.current = data;
    }
    
    // Check if data has changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(initialDataRef.current);
    
    dataRef.current = data;
    setState(s => ({ ...s, isDirty: hasChanged }));
  }, []);

  // Manual save
  const saveNow = useCallback(() => {
    if (dataRef.current) {
      saveDraft(dataRef.current);
    }
  }, [saveDraft]);

  // Setup autosave interval
  useEffect(() => {
    if (interval <= 0) return;

    timeoutRef.current = setInterval(() => {
      if (dataRef.current && state.isDirty) {
        saveDraft(dataRef.current);
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [interval, saveDraft, state.isDirty]);

  // Save on page unload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.isDirty && dataRef.current) {
        saveDraft(dataRef.current);
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.isDirty, saveDraft]);

  return {
    /** Register form data for autosave tracking */
    register,
    /** Trigger immediate save */
    saveNow,
    /** Clear saved draft */
    clearDraft,
    /** Load previously saved draft */
    loadDraft,
    /** Last save timestamp */
    lastSaved: state.lastSaved,
    /** Currently saving */
    isSaving: state.isSaving,
    /** Has unsaved changes */
    isDirty: state.isDirty,
  };
}

/**
 * Component to show autosave status
 */
export function AutosaveIndicator({ 
  lastSaved, 
  isDirty, 
  isSaving 
}: { 
  lastSaved: Date | null; 
  isDirty: boolean; 
  isSaving: boolean;
}) {
  if (isSaving) {
    return (
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        Sauvegarde...
      </span>
    );
  }

  if (isDirty) {
    return (
      <span className="text-xs text-amber-600 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        Modifications non sauvegardées
      </span>
    );
  }

  if (lastSaved) {
    const timeAgo = getTimeAgo(lastSaved);
    return (
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Sauvegardé {timeAgo}
      </span>
    );
  }

  return null;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "à l'instant";
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)}h`;
  return `il y a ${Math.floor(seconds / 86400)}j`;
}
