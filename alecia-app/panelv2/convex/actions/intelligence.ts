import { action } from "../_generated/server";
import { v } from "convex/values";

export const searchCompanyPappers = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.PAPPERS_API_KEY;
    if (!apiKey) {
      throw new Error("PAPPERS_API_KEY is not defined");
    }

    try {
      const response = await fetch(
        `https://api.pappers.fr/v2/recherche?q=${encodeURIComponent(args.query)}&api_token=${apiKey}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Pappers API error: ${response.statusText}`);
      }

      const data = await response.json();

      // Map Pappers result to our schema
      const companies = data.resultats.map((company: any) => {
        // Extract financials if available (Pappers often provides this in a separate call or specific fields, 
        // here we map what's available in search or set placeholders)
        // Note: Pappers search endpoint returns basic info. 
        // Detailed financials usually require a separate call by SIREN.
        // We will map basic info here.

        return {
          name: company.nom_entreprise || "",
          siren: company.siren,
          nafCode: company.code_naf,
          vatNumber: company.numero_tva_intracommunautaire,
          address: {
            street: `${company.siege?.adresse_ligne_1 || ""} ${company.siege?.adresse_ligne_2 || ""}`.trim(),
            city: company.siege?.ville || "",
            zip: company.siege?.code_postal || "",
            country: "France", // Pappers is French data
          },
          financials: {
            // Placeholder as search results might not have full financials
            // In a real flow, we'd fetch details by SIREN
            revenue: company.chiffre_affaires,
            ebitda: company.resultat, // Approximation if available
            year: company.annee_comptes,
          },
          pappersId: company.siren, // SIREN is effectively the ID
        };
      });

      return companies;
    } catch (error) {
      console.error("Error searching Pappers:", error);
      throw new Error("Failed to search companies");
    }
  },
});

export const enrichCompanyData = action({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    // Placeholder for enrichment logic (e.g., Clearbit, Apollo, or Pappers by domain if supported)
    // Effectively a no-op or mock for now as requested.
    console.log(`Enriching data for domain: ${args.domain}`);
    
    return {
      description: "Enriched description placeholder",
      logoUrl: `https://logo.clearbit.com/${args.domain}`,
      // Add other enriched fields as needed
    };
  },
});
