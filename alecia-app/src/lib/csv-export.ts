/**
 * CSV Export Utilities for Admin Dashboard
 */

type CSVData = Record<string, string | number | boolean | null | undefined>;

/**
 * Convert array of objects to CSV string
 */
export function objectsToCSV<T extends CSVData>(data: T[], columns?: (keyof T)[]): string {
  if (data.length === 0) return "";

  // Get columns from first object if not specified
  const cols = columns || (Object.keys(data[0]) as (keyof T)[]);
  
  // Build header row
  const header = cols.map((col) => `"${String(col)}"`).join(",");
  
  // Build data rows
  const rows = data.map((row) => {
    return cols
      .map((col) => {
        const value = row[col];
        if (value === null || value === undefined) return '""';
        if (typeof value === "string") {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        }
        return `"${String(value)}"`;
      })
      .join(",");
  });

  return [header, ...rows].join("\n");
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export deals to CSV
 */
export function exportDealsToCSV(deals: Array<{
  clientName: string;
  acquirerName?: string | null;
  sector: string;
  region?: string | null;
  year: number;
  mandateType: string;
}>) {
  const csv = objectsToCSV(deals, [
    "clientName",
    "acquirerName",
    "sector",
    "region",
    "year",
    "mandateType",
  ]);
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `alecia-operations-${date}.csv`);
}

/**
 * Export contacts to CSV
 */
export function exportContactsToCSV(contacts: Array<{
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  companyName?: string | null;
  tags?: string[] | null;
}>) {
  const formattedContacts = contacts.map((c) => ({
    ...c,
    tags: c.tags?.join("; ") || "",
  }));
  
  const csv = objectsToCSV(formattedContacts, [
    "name",
    "email",
    "phone",
    "role",
    "companyName",
    "tags",
  ]);
  const date = new Date().toISOString().split("T")[0];
  downloadCSV(csv, `alecia-contacts-${date}.csv`);
}
