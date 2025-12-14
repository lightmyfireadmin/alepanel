export const normalizeSlug = (slug?: string | null) =>
  (slug || "").replace(/^\/+/, "").replace(/^actualites\//, "");

export const normalizeCoverImage = (src?: string | null) => {
  if (!src) return "/assets/Actualites_Alecia/illustration.jpg";
  const trimmed = src.trim();
  if (!trimmed) return "/assets/Actualites_Alecia/illustration.jpg";
  const withPrefix = trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withPrefix;
};
