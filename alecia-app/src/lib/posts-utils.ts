export const normalizeSlug = (slug?: string | null) =>
  (slug || "").replace(/^\/+/, "").replace(/^actualites\//, "");

export const normalizeCoverImage = (src?: string | null) => {
  if (!src) return "/assets/Actualites_Alecia/illustration.jpg";
  const trimmed = src.trim();
  if (!trimmed) return "/assets/Actualites_Alecia/illustration.jpg";
  const hasProtocol = trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("//");
  const withPrefix = hasProtocol || trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withPrefix;
};
