"use client";

import { motion } from "framer-motion";

/**
 * Loading skeleton components for admin pages
 */

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 animate-pulse ${className}`}>
      <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-full" />
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-2/3" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 animate-pulse">
      <div className="h-5 bg-[var(--background-tertiary)] rounded w-3/4 mb-3" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 bg-[var(--background-tertiary)] rounded" />
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-1/2" />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-[var(--background-tertiary)] rounded" />
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-2/3" />
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <div className="h-8 bg-[var(--background-tertiary)] rounded w-full" />
      </div>
    </div>
  );
}

export function ContactCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 animate-pulse">
      <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/2 mb-2" />
      <div className="h-3 bg-[var(--background-tertiary)] rounded w-3/4 mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-full" />
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-2/3" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-5 bg-[var(--background-tertiary)] rounded-full w-16" />
        <div className="h-5 bg-[var(--background-tertiary)] rounded-full w-20" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--border)] animate-pulse">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-4 py-3">
          <div className="h-4 bg-[var(--background-tertiary)] rounded w-full" />
        </td>
      ))}
    </tr>
  );
}

export function DocumentSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 bg-[var(--background-tertiary)] rounded-lg" />
      <div className="flex-1">
        <div className="h-4 bg-[var(--background-tertiary)] rounded w-1/2 mb-2" />
        <div className="h-3 bg-[var(--background-tertiary)] rounded w-1/4" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-[var(--background-tertiary)] rounded" />
        <div className="h-8 w-8 bg-[var(--background-tertiary)] rounded" />
      </div>
    </div>
  );
}

/**
 * Page transition wrapper
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children animation wrapper
 */
export function StaggerContainer({ 
  children, 
  staggerDelay = 0.05 
}: { 
  children: React.ReactNode;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
