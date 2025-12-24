"use server";

/**
 * Sudo Panel Server Actions
 * 
 * Developer-only maintenance interface.
 * Function over Form - raw functionality for debugging.
 */

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { users, weatherCache, systemConfig } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

const SUDO_COOKIE_NAME = "alecia_sudo_session";
const SUDO_COOKIE_MAX_AGE = 60 * 60 * 4; // 4 hours

// =============================================================================
// AUTHENTICATION
// =============================================================================

export async function sudoLogin(password: string): Promise<{ success: boolean; error?: string }> {
  const sudoPwd = process.env.SUDO_PWD || "HelloMyDear06!";
  
  if (password !== sudoPwd) {
    return { success: false, error: "Invalid password" };
  }
  
  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SUDO_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SUDO_COOKIE_MAX_AGE,
    path: "/sudo",
  });
  
  return { success: true };
}

export async function sudoLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SUDO_COOKIE_NAME);
}

export async function checkSudoSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SUDO_COOKIE_NAME);
  return session?.value === "authenticated";
}

// =============================================================================
// API HEALTH CHECK
// =============================================================================

interface HealthCheckResult {
  service: string;
  status: "OK" | "ERROR";
  latency: number;
  error?: string;
}

export async function runHealthChecks(): Promise<HealthCheckResult[]> {
  const results: HealthCheckResult[] = [];
  
  // 1. Database Check
  const dbStart = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    results.push({
      service: "Database (Neon)",
      status: "OK",
      latency: Date.now() - dbStart,
    });
  } catch (error) {
    results.push({
      service: "Database (Neon)",
      status: "ERROR",
      latency: Date.now() - dbStart,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  
  // 2. OpenWeatherMap Check
  const owStart = Date.now();
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error("API key not configured");
    
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Paris,FR&appid=${apiKey}&units=metric`,
      { cache: "no-store" }
    );
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    results.push({
      service: "OpenWeatherMap",
      status: "OK",
      latency: Date.now() - owStart,
    });
  } catch (error) {
    results.push({
      service: "OpenWeatherMap",
      status: "ERROR",
      latency: Date.now() - owStart,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
  
  return results;
}

// =============================================================================
// SQL RUNNER (DANGER ZONE)
// =============================================================================

export async function executeSql(query: string, force: boolean = false): Promise<{
  success: boolean;
  data?: unknown;
  error?: string;
  rowCount?: number;
  warning?: string;
  requiresConfirmation?: boolean;
}> {
  if (!query.trim()) {
    return { success: false, error: "Empty query" };
  }
  
  // Safety check for destructive operations
  const destructiveKeywords = ["DROP", "DELETE", "TRUNCATE", "ALTER"];
  const queryUpper = query.toUpperCase().trim();
  const isDestructive = destructiveKeywords.some(keyword => 
    queryUpper.startsWith(keyword) || queryUpper.includes(` ${keyword} `)
  );
  
  if (isDestructive && !force) {
    return {
      success: false,
      warning: `⚠️ DESTRUCTIVE OPERATION DETECTED: This query contains ${destructiveKeywords.find(k => queryUpper.includes(k))} which may cause data loss. Set force=true to execute.`,
      requiresConfirmation: true,
    };
  }
  
  try {
    const result = await db.execute(sql.raw(query));
    return {
      success: true,
      data: result,
      rowCount: Array.isArray(result) ? result.length : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// =============================================================================
// USER MANAGEMENT
// =============================================================================

export async function getAllUsers() {
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    }).from(users);
    
    return { success: true, users: allUsers };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      users: [] 
    };
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(users).where(eq(users.id, userId));
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function forcePasswordReset(
  userId: string, 
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await db
      .update(users)
      .set({ 
        passwordHash: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

// =============================================================================
// CACHE & SYSTEM
// =============================================================================

export async function toggleMaintenanceMode(enabled: boolean): Promise<{ success: boolean }> {
    try {
        await db.insert(systemConfig)
            .values({ key: "maintenance_mode", value: enabled ? "true" : "false" })
            .onConflictDoUpdate({
                target: systemConfig.key,
                set: { value: enabled ? "true" : "false", updatedAt: new Date() }
            });
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

export async function getMaintenanceMode(): Promise<boolean> {
    try {
        const config = await db.query.systemConfig.findFirst({
            where: eq(systemConfig.key, "maintenance_mode")
        });
        return config?.value === "true";
    } catch (error) {
        return false;
    }
}

export async function purgeAllCaches(): Promise<{ success: boolean; message: string }> {
  try {
    await db.delete(weatherCache);
    revalidatePath("/", "layout");
    return { 
      success: true, 
      message: "All caches purged successfully" 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

export async function getEnvKeys(): Promise<{ key: string; isPublic: boolean; hasValue: boolean }[]> {
  const envKeys = Object.keys(process.env).filter(key => 
    !key.startsWith("npm_") && 
    !key.startsWith("_") &&
    !key.startsWith("HOME") &&
    !key.startsWith("PATH") &&
    !key.startsWith("USER") &&
    !key.startsWith("SHELL") &&
    !key.startsWith("TERM") &&
    !key.startsWith("LANG") &&
    key !== "PWD" &&
    key !== "OLDPWD" &&
    key !== "SHLVL"
  );
  
  return envKeys.map(key => ({
    key,
    isPublic: key.startsWith("NEXT_PUBLIC_"),
    hasValue: !!process.env[key],
  }));
}