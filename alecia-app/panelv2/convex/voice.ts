import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveVoiceNote = mutation({
  args: {
    storageId: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("voice_notes", {
      audioFileId: args.storageId,
      // duration: args.duration, // Schema doesn't have duration yet? Let's check schema.ts
    });
    return id;
  },
});

export const transcribeAction = action({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) throw new Error("File not found");

    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const file = new File([blob], "recording.webm", { type: "audio/webm" });

    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });

    // Update the record with transcription
    // Need a mutation for this
    return transcription.text;
  },
});
