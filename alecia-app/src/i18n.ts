import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // For now, use French as default. 
  // In production, this would detect from headers or path
  const locale = "fr";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
