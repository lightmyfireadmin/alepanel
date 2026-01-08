"use client";

import { useCallback, useState, useRef } from "react";
import { toast } from "sonner";

export interface UndoableAction<T = any> {
  /** Unique action ID */
  id: string;
  /** Action type for display */
  type: string;
  /** Description for toast/UI */
  description: string;
  /** Execute the action */
  execute: () => Promise<T> | T;
  /** Undo the action */
  undo: () => Promise<void> | void;
  /** Optional: Redo (if different from execute) */
  redo?: () => Promise<T> | T;
  /** Timestamp */
  timestamp: Date;
}

interface UndoRedoState {
  past: UndoableAction[];
  future: UndoableAction[];
  isUndoing: boolean;
  isRedoing: boolean;
}

interface UseUndoRedoOptions {
  /** Max history size (default: 50) */
  maxHistory?: number;
  /** Show toast on undo/redo */
  showToasts?: boolean;
}

/**
 * Hook for undo/redo functionality
 * 
 * Usage:
 * const { execute, undo, redo, canUndo, canRedo } = useUndoRedo();
 * 
 * await execute({
 *   type: 'delete',
 *   description: 'Supprimer contact',
 *   execute: () => deleteContact(id),
 *   undo: () => restoreContact(contactData),
 * });
 */
export function useUndoRedo(options: UseUndoRedoOptions = {}) {
  const { maxHistory = 50, showToasts = true } = options;
  
  const [state, setState] = useState<UndoRedoState>({
    past: [],
    future: [],
    isUndoing: false,
    isRedoing: false,
  });

  /**
   * Execute an undoable action
   */
  const execute = useCallback(async <T,>(
    action: Omit<UndoableAction<T>, "id" | "timestamp">
  ): Promise<T> => {
    const fullAction: UndoableAction<T> = {
      ...action,
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };

    // Execute the action
    const result = await fullAction.execute();

    // Add to history
    setState(prev => ({
      ...prev,
      past: [...prev.past.slice(-(maxHistory - 1)), fullAction],
      future: [], // Clear redo stack on new action
    }));

    return result;
  }, [maxHistory]);

  /**
   * Undo the last action
   */
  const undo = useCallback(async () => {
    const lastAction = state.past[state.past.length - 1];
    if (!lastAction) return;

    setState(prev => ({ ...prev, isUndoing: true }));

    try {
      await lastAction.undo();

      setState(prev => ({
        ...prev,
        past: prev.past.slice(0, -1),
        future: [lastAction, ...prev.future],
        isUndoing: false,
      }));

      if (showToasts) {
        toast.success(`Annulé: ${lastAction.description}`, {
          action: {
            label: "Rétablir",
            onClick: () => redo(),
          },
        });
      }
    } catch (error) {
      setState(prev => ({ ...prev, isUndoing: false }));
      if (showToasts) {
        toast.error("Impossible d'annuler cette action");
      }
      throw error;
    }
  }, [state.past, showToasts]);

  /**
   * Redo the last undone action
   */
  const redo = useCallback(async () => {
    const nextAction = state.future[0];
    if (!nextAction) return;

    setState(prev => ({ ...prev, isRedoing: true }));

    try {
      // Use redo function if provided, otherwise re-execute
      const redoFn = nextAction.redo || nextAction.execute;
      await redoFn();

      setState(prev => ({
        ...prev,
        past: [...prev.past, nextAction],
        future: prev.future.slice(1),
        isRedoing: false,
      }));

      if (showToasts) {
        toast.success(`Rétabli: ${nextAction.description}`);
      }
    } catch (error) {
      setState(prev => ({ ...prev, isRedoing: false }));
      if (showToasts) {
        toast.error("Impossible de rétablir cette action");
      }
      throw error;
    }
  }, [state.future, showToasts]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setState({
      past: [],
      future: [],
      isUndoing: false,
      isRedoing: false,
    });
  }, []);

  return {
    /** Execute an undoable action */
    execute,
    /** Undo the last action */
    undo,
    /** Redo the last undone action */
    redo,
    /** Clear all history */
    clearHistory,
    /** Can undo? */
    canUndo: state.past.length > 0 && !state.isUndoing && !state.isRedoing,
    /** Can redo? */
    canRedo: state.future.length > 0 && !state.isUndoing && !state.isRedoing,
    /** Currently undoing */
    isUndoing: state.isUndoing,
    /** Currently redoing */
    isRedoing: state.isRedoing,
    /** Undo history */
    history: state.past,
    /** Redo queue */
    future: state.future,
  };
}

/**
 * Context provider for global undo/redo (optional)
 */
import { createContext, useContext, ReactNode } from "react";

const UndoRedoContext = createContext<ReturnType<typeof useUndoRedo> | null>(null);

export function UndoRedoProvider({ 
  children, 
  options 
}: { 
  children: ReactNode;
  options?: UseUndoRedoOptions;
}) {
  const undoRedo = useUndoRedo(options);
  return (
    <UndoRedoContext.Provider value={undoRedo}>
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useGlobalUndoRedo() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error("useGlobalUndoRedo must be used within UndoRedoProvider");
  }
  return context;
}

/**
 * Keyboard shortcut hook for undo/redo
 */
import { useEffect } from "react";

export function useUndoRedoKeyboard(
  undoRedo: ReturnType<typeof useUndoRedo>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (undoRedo.canUndo) {
          undoRedo.undo();
        }
      }
      
      // Cmd/Ctrl + Shift + Z = Redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        if (undoRedo.canRedo) {
          undoRedo.redo();
        }
      }
      
      // Cmd/Ctrl + Y = Redo (Windows style)
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        if (undoRedo.canRedo) {
          undoRedo.redo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoRedo]);
}
