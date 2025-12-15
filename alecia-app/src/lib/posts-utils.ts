export const normalizeSlug = (slug?: string | null) => {
  const cleaned = (slug || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
  return cleaned.replace(/^actualites\//i, "");
};

export const normalizeCoverImage = (src?: string | null) => {
  if (!src) return "/assets/Actualites_Alecia/illustration.jpg";
  const trimmed = src.trim();
  if (!trimmed) return "/assets/Actualites_Alecia/illustration.jpg";
  const hasHttpProtocol = /^(https?:\/\/|\/\/)/.test(trimmed);
  const withPrefix = hasHttpProtocol || trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withPrefix;
};
