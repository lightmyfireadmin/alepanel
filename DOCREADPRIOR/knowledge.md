# Knowledge - Alecia Panel

## Background
Alecia is an M&A advisory firm specializing in French PME (Petites et Moyennes Entreprises) and ETI (Entreprises de Taille Intermédiaire). This panel acts as their internal command center to digitize the traditionally manual M&A workflow.

## Technical Architecture
- **Monolith/Workspace:** The project contains the main Next.js app (`alecia-app`) alongside specialized tools like a `web-crawler`.
- **Modern Stack:** Uses the bleeding edge of Next.js (version 16) and Tailwind CSS (version 4).
- **Database Architecture:** Built on Neon's serverless PostgreSQL. Drizzle ORM is used for schema management and type-safe querying. Inferred tables include `operations`, `leads`, `companies`, `contacts`, and `users`.
- **Integrations:**
    - **Microsoft 365:** Uses Azure MSAL and Microsoft Graph to likely sync emails, calendars, or documents.
    - **AI Agents:** Integrates Mistral and Groq (Llama models) for data analysis and document summarization.
    - **File Management:** Uses Vercel Blob for storing company dossiers and transaction documents.

## Key Features
- **Operations Dashboard:** A high-level view of active M&A mandates.
- **Reporting Engine:** Ability to generate Excel and PDF reports directly from the app.
- **Company Sync:** System to sync local company data with external sources (web crawler).
- **Multi-lingual:** Full support for French (primary) and English.
- **Seeding System:** Sophisticated multi-step seeding (`seed-admin`, `seed-operations`, `seed-extra`) for initializing complex relational data.
