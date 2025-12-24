"use server";

import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function uploadFile(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
    });

    return { url: blob.url };
  } catch (error) {
    console.error("Upload failed:", error);
    return { error: "Upload failed" };
  }
}
