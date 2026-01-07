import { mutation } from "./_generated/server";

export const seedHomepage = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if homepage exists
    const existing = await ctx.db
        .query("site_pages")
        .withIndex("by_slug", (q) => q.eq("slug", "home"))
        .first();

    if (existing) {
        console.log("Homepage already seeded.");
        return;
    }

    // Initial Content (HTML for Tiptap)
    const initialContent = `
      <h1>Vos ambitions, notre engagement</h1>
      <p>Partenaire de confiance des dirigeants de PME et ETI pour leurs opérations de haut de bilan : Cession, Acquisition, Finance.</p>
      <h2>Notre approche</h2>
      <p>Vos décisions stratégiques nécessitent plus qu'un simple accompagnement.</p>
      <ul>
        <li>Expertise sectorielle</li>
        <li>Réseau étendu</li>
        <li>Confidentialité absolue</li>
      </ul>
    `;

    await ctx.db.insert("site_pages", {
        slug: "home",
        title: "Page d'Accueil",
        content: initialContent,
        isPublished: true,
        seo: {
            title: "Alecia - Banque d'affaires M&A",
            description: "Conseil en fusion-acquisition pour PME et ETI.",
            keywords: ["M&A", "Cession", "Acquisition"]
        }
    });

    console.log("✅ Homepage seeded.");
  },
});
