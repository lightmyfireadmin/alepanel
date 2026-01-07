"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { evaluate } from "mathjs";
import Papa from "papaparse";

export const calculateValuation = action({
  args: {
    inputs: v.any(), // Record<string, number> - using v.any() to allow dynamic keys, but ideally strict object if keys known
    formula: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Security check: simple evaluation, but mathjs evaluate is relatively safe for math expressions.
      // Ideally, sanitize inputs or use a scope.
      const scope = args.inputs;
      const result = evaluate(args.formula, scope);
      return result;
    } catch (error) {
      console.error("Valuation calculation error:", error);
      throw new Error("Failed to calculate valuation: " + (error as Error).message);
    }
  },
});

export const parseFinancialUpload = action({
  args: { fileUrl: v.string() },
  handler: async (ctx, args) => {
    try {
      const response = await fetch(args.fileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }
      const fileText = await response.text();

      // Basic CSV parsing using Papaparse
      const result = Papa.parse(fileText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      if (result.errors.length > 0) {
        console.warn("CSV parsing errors:", result.errors);
      }

      const rows = result.data as Record<string, any>[];

      // Simple heuristic to extract key metrics from rows
      // Assuming rows might look like { Metric: "Revenue", Value: 100000 } or columns "Revenue", "EBITDA"
      // This logic is highly dependent on file format. 
      // We'll implement a simple finder for "Revenue" and "EBITDA" keys or values.

      let revenue = 0;
      let ebitda = 0;

      // Strategy 1: Column based
      if (rows.length > 0) {
        const firstRow = rows[0];
        if ("Revenue" in firstRow) revenue = Number(firstRow["Revenue"]);
        if ("EBITDA" in firstRow) ebitda = Number(firstRow["EBITDA"]);
      }

      // Strategy 2: Row based (Metric, Value)
      if (revenue === 0 && ebitda === 0) {
        for (const row of rows) {
            const keys = Object.keys(row);
            const values = Object.values(row);
            
            // Look for "Revenue" in values
            const revenueIdx = values.findIndex(val => typeof val === 'string' && val.toLowerCase().includes('revenue'));
            if (revenueIdx !== -1) {
                // Try to find a number in the same row
                const val = values.find(v => typeof v === 'number');
                if (val) revenue = val as number;
            }

            const ebitdaIdx = values.findIndex(val => typeof val === 'string' && val.toLowerCase().includes('ebitda'));
            if (ebitdaIdx !== -1) {
                const val = values.find(v => typeof v === 'number');
                if (val) ebitda = val as number;
            }
        }
      }

      return {
        revenue,
        ebitda,
        raw: rows.slice(0, 5) // Return first 5 rows for preview
      };

    } catch (error) {
      console.error("Error parsing financial upload:", error);
      throw new Error("Failed to parse file");
    }
  },
});
