export const ACTUALITES_PREFIX = "actualites/";

// Legacy redirections for slugs that were published with a different wording.
// Example: early marketing links used "...-acquiert-..." while the database kept "...-acquisition-..."
const LEGACY_SLUG_REDIRECTIONS: Record<string, string> = {
  "safe-groupe-acquiert-dogs-security": "safe-groupe-acquisition-dogs-security",
};
const LEGACY_SLUG_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(LEGACY_SLUG_REDIRECTIONS).map(([legacy, target]) => [target, legacy])
);

export const normalizeSlug = (slug?: string | null) => {
  const cleaned = (slug || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
  const withoutPrefix = cleaned.replace(/^actualites\//i, "");
  const lower = withoutPrefix.toLowerCase();
  return LEGACY_SLUG_REDIRECTIONS[lower] || lower;
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

  const addVariants = (raw?: string, resolved?: string) => {
    if (!raw) return;
    const canonical = (resolved ?? normalizeSlug(raw)).toLowerCase();
    candidates.add(raw);
    if (canonical) {
      if (canonical !== raw.toLowerCase()) {
        candidates.add(canonical);
      }
      const prefixed = canonical.startsWith(ACTUALITES_PREFIX)
        ? canonical
        : `${ACTUALITES_PREFIX}${canonical}`;
      candidates.add(prefixed);
    }
  };

  addVariants(slug, normalized);

  // If the normalized slug corresponds to a legacy redirect target,
  // also include the legacy source so both URLs resolve.
  const normalizedLower = normalized.toLowerCase();
  if (LEGACY_SLUG_REVERSE[normalizedLower]) {
    addVariants(LEGACY_SLUG_REVERSE[normalizedLower]);
  }

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
