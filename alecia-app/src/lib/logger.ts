/**
 * Simple logging utility
 * In production, replace with proper logging service (Sentry, LogRocket, etc.)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
}

const isDev = process.env.NODE_ENV === "development";

function formatLog(entry: LogEntry): void {
  if (isDev) {
    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;
    switch (entry.level) {
      case "debug":
        console.debug(prefix, entry.message, entry.data ?? "");
        break;
      case "info":
        console.info(prefix, entry.message, entry.data ?? "");
        break;
      case "warn":
        console.warn(prefix, entry.message, entry.data ?? "");
        break;
      case "error":
        console.error(prefix, entry.message, entry.data ?? "");
        break;
    }
  }
  // In production, send to logging service
  // Example: await sendToLoggingService(entry);
}

export const logger = {
  debug: (message: string, data?: unknown) => {
    formatLog({
      level: "debug",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },
  info: (message: string, data?: unknown) => {
    formatLog({
      level: "info",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },
  warn: (message: string, data?: unknown) => {
    formatLog({
      level: "warn",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },
  error: (message: string, data?: unknown) => {
    formatLog({
      level: "error",
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },
};

export default logger;
