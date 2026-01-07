import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Static locale for now (French only)
  const locale = 'fr';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
