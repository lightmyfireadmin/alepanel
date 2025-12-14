# Database Setup Guide

This guide explains how to set up and sync the Neon PostgreSQL database with the frontend.

## Overview

The application uses:
- **Neon PostgreSQL** for data storage (deals, contacts, projects, etc.)
- **Vercel Blob** for file storage (documents, voice notes, images)
- **Drizzle ORM** for type-safe database queries
- **Server Actions** for data fetching and mutations

## Prerequisites

1. Node.js 20+ installed
2. Neon database account (https://neon.tech)
3. Vercel account with Blob storage enabled
4. `.env.local` file configured

## Environment Variables

Create a `.env.local` file in the `alecia-app` directory:

```env
# Database (Required)
DATABASE_URL="postgres://user:password@host/db?sslmode=require"

# Blob Storage (Required)
BLOB_READ_WRITE_TOKEN="vercel_blob_token_here"

# Authentication (Required)
AUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NEW_USER_PWD="your-admin-password"

# Optional APIs
MISTRAL_API_KEY="mistral_key"
GROQ_API_KEY="gsk_key"
NEXT_PUBLIC_MAPBOX_TOKEN="pk.mapbox_token"
RESEND_API_KEY="re_resend_key"
OPENWEATHER_API_KEY="ow_key"
DEEPL_API_KEY="deepl_key"
```

## Database Schema

The database includes the following tables:

| Table | Purpose |
|-------|---------|
| `users` | Admin authentication |
| `deals` | M&A operations/transactions |
| `team_members` | Team profiles |
| `companies` | Company registry (CRM) |
| `contacts` | Contact information (CRM) |
| `projects` | Active pipeline projects |
| `project_events` | Project timeline events |
| `documents` | File references (Vercel Blob) |
| `posts` | News articles/blog posts |
| `voice_notes` | Voice note references (Vercel Blob) |
| `buyer_criteria` | Investor matching criteria |
| `sectors` | Sector definitions |
| `offices` | Regional offices |
| `testimonials` | Client testimonials |
| `weather_cache` | Weather API cache |

## Setup Steps

### 1. Install Dependencies

```bash
cd alecia-app
npm install
```

### 2. Configure Environment Variables

Copy `env.example` to `.env.local` and fill in your credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values.

### 3. Generate and Push Schema

Generate migrations from the schema:

```bash
npm run db:generate
```

Push the schema to your Neon database:

```bash
npm run db:push
```

Or apply migrations:

```bash
npm run db:migrate
```

### 4. Seed Initial Data

Populate the database with initial data:

```bash
npm run db:seed
```

This will create:
- An admin user (email: admin@alecia.fr, password from NEW_USER_PWD)
- Sample deals from `lib/data.ts`
- Sample team members from `lib/data.ts`

### 5. Verify Setup

Open Drizzle Studio to inspect your database:

```bash
npm run db:studio
```

This will open a web interface at `https://local.drizzle.studio`

## Server Actions

All database operations are handled through server actions in `src/lib/actions/`:

### Available Actions

- **`deals.ts`**: CRUD for M&A operations
- **`team.ts`**: CRUD for team members
- **`documents.ts`**: File upload/management with Vercel Blob
- **`crm.ts`**: CRUD for contacts and companies
- **`projects.ts`**: CRUD for projects and events
- **`posts.ts`**: CRUD for news articles
- **`voice-notes.ts`**: Voice recording management
- **`deal-matcher.ts`**: Investor matching algorithm
- **`company-enrichment.ts`**: SIREN enrichment

### Usage Example

```typescript
// In a Server Component
import { getAllDeals, getDealBySlug } from "@/lib/actions/deals";

export default async function DealsPage() {
  const deals = await getAllDeals();
  return <div>{/* render deals */}</div>;
}

// In a Client Component with Server Action
"use client";
import { createDeal } from "@/lib/actions/deals";

async function handleSubmit(formData: FormData) {
  const result = await createDeal({
    slug: "my-deal",
    clientName: "Client Name",
    // ... other fields
  });
  
  if (result.success) {
    // Handle success
  }
}
```

## File Uploads (Vercel Blob)

Documents and voice notes are stored in Vercel Blob:

1. Files are uploaded to `https://[your-blob-url]/documents/...`
2. A reference is saved in the database with the Blob URL
3. Magic links are generated for secure sharing

### Upload Example

```typescript
import { uploadDocument } from "@/lib/actions/documents";

async function handleUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", file.name);
  formData.append("isConfidential", "true");
  
  const result = await uploadDocument(formData);
  
  if (result.success) {
    console.log("Uploaded to:", result.url);
  }
}
```

## Frontend Integration

### Public Pages (Database)

These pages fetch data from Neon:

- `/operations` - Lists all deals
- `/equipe` - Lists all team members  
- `/actualites` - Lists published posts
- `/admin` - Dashboard with stats

### Admin Pages (To Update)

These pages currently use mock data and need migration to server actions:

- ❌ `/admin/deals` - Still using mock data
- ❌ `/admin/documents` - Still using mock data
- ❌ `/admin/crm` - Still using mock data
- ❌ `/admin/projects` - Still using mock data
- ❌ `/admin/news` - Still using mock data
- ❌ `/admin/team` - Still using mock data

## Troubleshooting

### Database Connection Errors

```
Error: DATABASE_URL environment variable is not set
```

**Solution**: Make sure `.env.local` has a valid `DATABASE_URL`

### SSL Connection Issues

```
Error: SSL connection required
```

**Solution**: Append `?sslmode=require` to your DATABASE_URL

### Blob Upload Failures

```
Error: BLOB_READ_WRITE_TOKEN is invalid
```

**Solution**: Get a valid token from Vercel dashboard → Storage → Blob

### Seed Script Fails

```
Error: Cannot find module 'tsx'
```

**Solution**: Run `npm install` to install all dependencies

## Migration from Mock Data

To migrate from mock data to database:

1. ✅ Server actions created
2. ✅ Public pages updated (operations, equipe, actualites)
3. ✅ Admin dashboard updated
4. ⏳ Admin pages need updating (deals, documents, crm, projects, news, team)
5. ⏳ Test all CRUD operations
6. ⏳ Test file uploads

## Production Checklist

Before deploying:

- [ ] Set `DATABASE_URL` in Vercel environment variables
- [ ] Set `BLOB_READ_WRITE_TOKEN` in Vercel environment variables
- [ ] Set `AUTH_SECRET` to a secure random string
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Run `npm run db:push` to sync production schema
- [ ] Run `npm run db:seed` to populate production data
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Verify magic link sharing works

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
