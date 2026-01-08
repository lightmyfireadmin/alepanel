import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Check for locale cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  
  // Fallback to Accept-Language header or default to French
  let locale = localeCookie || "fr";
  
  // Validate locale is supported
  if (!["fr", "en"].includes(locale)) {
    locale = "fr";
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

