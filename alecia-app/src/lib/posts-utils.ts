export const ACTUALITES_PREFIX = "actualites/";

// Legacy redirections for slugs that were published with a different wording
// Example: early marketing links used "...-acquiert-..." while the database kept "...-acquisition-..."
const LEGACY_SLUG_REDIRECTIONS: Record<string, string> = {
  "safe-groupe-acquisition-dogs-security": "safe-groupe-acquiert-dogs-security",
};

export const normalizeSlug = (slug?: string | null) => {
  const cleaned = (slug || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
  const withoutPrefix = cleaned.replace(/^actualites\//i, "");
  const lower = withoutPrefix.toLowerCase();
  return LEGACY_SLUG_REDIRECTIONS[lower] || withoutPrefix;
};

/**
 * Build all slug variants we should accept for lookup.
 * - normalizes the slug
 * - adds/strips the /actualites prefix
 * - includes legacy wording variations to avoid 404 on shared links
 */
export const buildSlugCandidates = (slug: string) => {
  const normalized = normalizeSlug(slug);
  const candidates = new Set<string>();

  const addSlug = (value?: string) => {
    if (!value) return;
    candidates.add(value);
    const canonical = normalizeSlug(value);
    if (canonical) {
      candidates.add(canonical);
      candidates.add(`${ACTUALITES_PREFIX}${canonical}`);
    }
  };

  addSlug(slug);
  addSlug(normalized);

  // If the normalized slug corresponds to a legacy redirect target,
  // also include the legacy source so both URLs resolve.
  Object.entries(LEGACY_SLUG_REDIRECTIONS).forEach(([legacy, target]) => {
    if (normalized.toLowerCase() === target.toLowerCase()) {
      addSlug(legacy);
    }
  });

  return Array.from(candidates).filter(Boolean);
};

export const normalizeCoverImage = (src?: string | null) => {
  if (!src) return "/assets/Actualites_Alecia/illustration.jpg";
  const trimmed = src.trim();
  if (!trimmed) return "/assets/Actualites_Alecia/illustration.jpg";
  const hasHttpProtocol = /^(https?:\/\/|\/\/)/.test(trimmed);
  const withPrefix = hasHttpProtocol || trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withPrefix;
};
