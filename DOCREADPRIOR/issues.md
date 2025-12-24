# Issues - Alecia Panel

- **Database Performance:** Some complex joins on the `operations` table are slow; consider adding indices.
- **MSAL Node Errors:** Occasional token refresh failures with Microsoft Graph.
- **Turbopack Warnings:** Next.js 16 Turbopack sometimes shows "experimental" warnings with certain Svelte dependencies.
- **Data Integrity:** Need to ensure SIREN/SIRET numbers are unique and validated in the `companies` table.
