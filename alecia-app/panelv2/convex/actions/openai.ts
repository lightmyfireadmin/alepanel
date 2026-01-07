import { action } from "../_generated/server";
import { v } from "convex/values";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const generateSummary = action({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Please summarize the following text concisely:\n\n${args.text}`,
      });
      return text;
    } catch (error) {
      console.error("Error generating summary:", error);
      throw new Error("Failed to generate summary");
    }
  },
});

export const generateDiffSummary = action({
  args: { oldContent: v.string(), newContent: v.string() },
  handler: async (ctx, args) => {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Compare the following two versions of a text and provide a concise natural language explanation of the key changes (what was added, removed, or modified) for a governance voting system context.\n\nOld Content:\n${args.oldContent}\n\nNew Content:\n${args.newContent}`,
      });
      return text;
    } catch (error) {
      console.error("Error generating diff summary:", error);
      throw new Error("Failed to generate diff summary");
    }
  },
});
