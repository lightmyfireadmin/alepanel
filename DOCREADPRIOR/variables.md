# Variables & State - Alecia Panel

## Global State (NextAuth + Context)
- `session`: Current advisor session.
- `activeOperationId`: The operation currently being focused on.
- `uiTheme`: Light/Dark mode.

## Database Schema (Drizzle)
*Inferred from `NEON_DATA_TABLES.md` and seed files:*
- `users`: `{ id, email, name, role, msalId }`
- `operations`: `{ id, title, type (Buy/Sell), status, budget, timeline }`
- `companies`: `{ id, name, siren, industry, revenue, location }`
- `leads`: `{ id, company_id, source, status, score }`
- `documents`: `{ id, operation_id, url, type, category }`

## AI Context
- `MISTRAL_API_KEY`: For analysis.
- `GROQ_API_KEY`: For fast reasoning/summarization.
- `PROMPT_TEMPLATES`: System prompts for company categorization.
