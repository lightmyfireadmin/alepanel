import { Mistral } from "@mistralai/mistralai";

export const mistral = process.env.MISTRAL_API_KEY
  ? new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
  : null;
