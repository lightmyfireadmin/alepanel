# Alecia Admin Dashboard Documentation

## Overview

The Alecia Admin Dashboard is a comprehensive Business Operating System for managing M&A operations, clients, documents, and team activities.

---

## Authentication

### `/admin/login`

**Purpose**: Secure access to the admin dashboard.

| Feature              | Description                                |
| -------------------- | ------------------------------------------ |
| Email/Password login | Standard credentials authentication        |
| Session persistence  | NextAuth.js session management             |
| Protected routes     | Middleware redirects unauthenticated users |

**Database Operations**:

- `SELECT` from `users` table to verify credentials
- Session token stored in browser

---

## Dashboard Pages

### `/admin` - Main Dashboard

**Purpose**: Overview of operations and quick access to key metrics.

| Section       | Features                                       |
| ------------- | ---------------------------------------------- |
| Stats Cards   | Opérations count, Articles count, Team members |
| Recent Deals  | Last 3 operations with type and date           |
| Quick Actions | Links to create new deal, article, team member |

**Actions**:

- Click stat card → Navigate to corresponding list page
- Click "Ajouter une opération" → `/admin/deals/new`
- Click "Créer un article" → `/admin/news/new`
- Click "Ajouter un membre" → `/admin/team/new`
- Click "Voir le site public" → Opens `/` in new tab

**Database Queries**:

```sql
-- Stats
SELECT COUNT(*) FROM deals;
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM team_members;

-- Recent deals
SELECT * FROM deals ORDER BY year DESC LIMIT 3;
```

---

### `/admin/projects` - Projects Kanban

**Purpose**: Visual pipeline management for active M&A operations.

| Feature        | Description                      |
| -------------- | -------------------------------- |
| Kanban columns | Lead → Due Diligence → Closing   |
| Project cards  | Title, client, target close date |
| Status badges  | Color-coded by pipeline stage    |
| Quick actions  | Generate Teaser PDF button       |

**Actions**:

- Click "Nouveau projet" → Create project modal
- Click project card → `/admin/projects/[id]`
- Click "Teaser PDF" → Opens PDF preview modal

**Database Queries**:

```sql
-- All projects grouped by status
SELECT * FROM projects ORDER BY status, display_order;

-- Projects by status
SELECT * FROM projects WHERE status = 'Lead';
SELECT * FROM projects WHERE status = 'Due Diligence';
SELECT * FROM projects WHERE status = 'Closing';
```

---

### `/admin/projects/[id]` - Project Detail

**Purpose**: Complete view of a single project with timeline and investor matching.

| Section         | Features                                               |
| --------------- | ------------------------------------------------------ |
| Header          | Title, status badge, sector, action buttons            |
| Details Card    | Description, client info, dates, status selector       |
| Timeline        | Chronological events (meetings, documents, milestones) |
| Deal Matchmaker | Suggested investors based on sector/tags               |

**Actions**:

- Click "Générer Teaser" → PDF preview modal with download
- Click "Modifier" → Edit project modal
- Change status → Updates project pipeline stage
- Click "Ajouter un événement" → Create timeline event

**Database Queries**:

```sql
-- Get project by ID
SELECT * FROM projects WHERE id = $1;

-- Get project events
SELECT * FROM project_events WHERE project_id = $1 ORDER BY date DESC;

-- Get client contact
SELECT * FROM contacts WHERE id = (SELECT client_id FROM projects WHERE id = $1);

-- Get matching investors
SELECT * FROM contacts
WHERE tags && ARRAY['Investisseur']
AND id != (SELECT client_id FROM projects WHERE id = $1);
```

**Database Writes**:

```sql
-- Update project status
UPDATE projects SET status = $2, updated_at = NOW() WHERE id = $1;

-- Add timeline event
INSERT INTO project_events (project_id, type, date, description, file_url)
VALUES ($1, $2, $3, $4, $5);
```

---

### `/admin/crm` - CRM (Contacts & Companies)

**Purpose**: Manage client relationships and company data.

| Tab       | Features                                             |
| --------- | ---------------------------------------------------- |
| Contacts  | Grid of contact cards with name, role, company, tags |
| Companies | Table with name, SIREN, sector, revenue              |

**Sidebar**: Company Enrichment (SIREN lookup)

| Feature            | Description                      |
| ------------------ | -------------------------------- |
| Search             | Filter by name, email, company   |
| Tag filter         | Filter contacts by role tags     |
| Company enrichment | Lookup by SIREN number           |
| Empty states       | Helpful messages when no results |

**Actions**:

- Click "Nouveau contact" → Create contact modal
- Click "Nouvelle entreprise" → Create company modal
- Click contact card → Contact detail modal
- Search by SIREN → Auto-populate company data
- Select tag filter → Filter contacts by tag

**Database Queries**:

```sql
-- All contacts
SELECT c.*, co.name as company_name
FROM contacts c
LEFT JOIN companies co ON c.company_id = co.id
ORDER BY c.name;

-- Contacts by tag
SELECT * FROM contacts WHERE $1 = ANY(tags);

-- All companies
SELECT * FROM companies ORDER BY name;

-- Company by SIREN
SELECT * FROM companies WHERE siren = $1;
```

**Database Writes**:

```sql
-- Create contact
INSERT INTO contacts (name, email, phone, role, company_id, tags, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7);

-- Create company
INSERT INTO companies (name, siren, address, sector, financial_data, logo_url)
VALUES ($1, $2, $3, $4, $5, $6);

-- Update company from enrichment
UPDATE companies SET
  address = $2,
  sector = $3,
  financial_data = $4,
  updated_at = NOW()
WHERE siren = $1;
```

---

### `/admin/documents` - Document Manager

**Purpose**: Secure file storage and sharing with magic links.

| Feature                | Description                              |
| ---------------------- | ---------------------------------------- |
| Upload zone            | Drag-and-drop file upload                |
| File list              | Name, size, date, confidentiality status |
| Magic links            | Generate shareable links with expiry     |
| Confidentiality toggle | Lock/unlock file access                  |

**Actions**:

- Drag files to upload zone → Upload to Vercel Blob
- Click "Partager" → Copy magic link to clipboard
- Click download icon → Download file
- Click delete icon → Remove file (with confirmation)
- Toggle lock → Change confidentiality status

**Database Queries**:

```sql
-- All documents
SELECT * FROM documents ORDER BY created_at DESC;

-- Documents by project
SELECT * FROM documents WHERE project_id = $1;

-- Document by magic link token
SELECT * FROM documents WHERE access_token = $1;
```

**Database Writes**:

```sql
-- Create document
INSERT INTO documents (name, url, mime_type, project_id, is_confidential, access_token)
VALUES ($1, $2, $3, $4, $5, $6);

-- Generate magic link
UPDATE documents SET access_token = $2 WHERE id = $1;

-- Delete document
DELETE FROM documents WHERE id = $1;
```

---

### `/admin/deals` - Operations

**Purpose**: Manage completed and ongoing M&A operations.

| Feature           | Description            |
| ----------------- | ---------------------- |
| Operations list   | All deals with filters |
| Create/Edit forms | Full deal details      |
| Visibility toggle | Published/Draft status |

**Database Operations**:

```sql
SELECT * FROM deals ORDER BY year DESC;
INSERT INTO deals (...) VALUES (...);
UPDATE deals SET ... WHERE id = $1;
DELETE FROM deals WHERE id = $1;
```

---

### `/admin/news` - Actualités

**Purpose**: Manage news articles and press releases.

**Database Operations**:

```sql
SELECT * FROM posts ORDER BY published_at DESC;
INSERT INTO posts (...) VALUES (...);
UPDATE posts SET ... WHERE id = $1;
DELETE FROM posts WHERE id = $1;
```

---

### `/admin/team` - Team Management

**Purpose**: Manage team member profiles.

**Database Operations**:

```sql
SELECT * FROM team_members ORDER BY display_order;
INSERT INTO team_members (...) VALUES (...);
UPDATE team_members SET ... WHERE id = $1;
DELETE FROM team_members WHERE id = $1;
```

---

## Special Features

### Voice Note Recorder (FAB)

- **Location**: Floating action button (mobile only)
- **Purpose**: Quick voice memos for deal notes
- **Future**: OpenAI Whisper transcription

### PDF Teaser Generator

- **Trigger**: "Générer Teaser" button on project pages
- **Output**: Branded PDF with deal summary
- **Features**: Preview modal, direct download

### Magic Links

- **Route**: `/shared/[token]`
- **Features**: Token validation, expiry checking, confidentiality notice

---

## Database Schema Summary

| Table            | Purpose                | Key Relations       |
| ---------------- | ---------------------- | ------------------- |
| `users`          | Admin authentication   | -                   |
| `deals`          | M&A operations history | -                   |
| `posts`          | News articles          | -                   |
| `team_members`   | Team profiles          | -                   |
| `companies`      | Company registry       | ← contacts          |
| `contacts`       | CRM contacts           | → companies         |
| `projects`       | Active pipelines       | → contacts (client) |
| `project_events` | Timeline events        | → projects          |
| `documents`      | File storage           | → projects          |

---

## Environment Variables

| Variable                | Purpose                     |
| ----------------------- | --------------------------- |
| `DATABASE_URL`          | Neon PostgreSQL connection  |
| `NEXTAUTH_SECRET`       | Session encryption key      |
| `NEXTAUTH_URL`          | Base URL for auth callbacks |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token   |

---

## Public Website Pages

### `/` - Home Page

**Purpose**: Main landing page with hero, stats, and CTAs.

| Section        | Features                                  |
| -------------- | ----------------------------------------- |
| Hero           | Animated headline, particles, gradient bg |
| Stats Counter  | Smooth 2s animation with easeOut easing   |
| Expertises     | Lordicon animated icons, gradient accent  |
| Regional Map   | Accurate France SVG with office markers   |
| Valuation Tool | Free company valuation estimator          |
| Team Preview   | Featured team members with avatars        |

**New Components**:

- `HeroBackground` - Animated particles, grid pattern, logo watermark
- `ExpertiseCard` - Lordicon icons with hover effects
- `AnimatedCounter` - requestAnimationFrame with easeOutQuart

**i18n**: Full French/English support with cookie-based locale switching.

---

### `/expertises` - Services Page

**Purpose**: Detailed service descriptions for M&A offerings.

| Section        | Features                             |
| -------------- | ------------------------------------ |
| Service Cards  | Cession, Levée de fonds, Acquisition |
| Process Steps  | Numbered workflow for each service   |
| Key Challenges | Bullet points with checkmarks        |

---

### `/operations` - Deal History

**Purpose**: Completed M&A operations showcase.

| Feature          | Description                        |
| ---------------- | ---------------------------------- |
| Deal Grid        | Cards with client/acquirer logos   |
| Filters          | Sector, Region, Year, Mandate Type |
| Prior Experience | Asterisk indicator for past deals  |

---

### `/equipe` - Team Page

**Purpose**: Team member profiles and bios.

| Feature    | Description                    |
| ---------- | ------------------------------ |
| Team Grid  | Photo cards with name and role |
| LinkedIn   | Direct profile links           |
| Hiring CTA | Link to careers page           |

---

### `/actualites` - News/Blog

**Purpose**: Press releases and articles.

| Feature      | Description                          |
| ------------ | ------------------------------------ |
| Article Grid | Cover images, titles, excerpts       |
| Categories   | Communiqué, Article, Revue de presse |
| Newsletter   | Subscription form                    |

---

### `/contact` - Contact Page

**Purpose**: Contact form and office information.

| Feature      | Description                        |
| ------------ | ---------------------------------- |
| Contact Form | Validated form with API submission |
| Office Grid  | Regional office locations          |
| Privacy Link | GDPR consent notice                |

**API**: `POST /api/contact` - Form submission with validation.

---

### `/nous-rejoindre` - Careers Page

**Purpose**: Job listings and company culture.

| Section         | Features                         |
| --------------- | -------------------------------- |
| Values          | Team icons with descriptions     |
| Open Positions  | Job cards with requirements      |
| Spontaneous App | CTA for unsolicited applications |

---

## UX/UI Enhancements

### Theme System

| Feature          | Description                         |
| ---------------- | ----------------------------------- |
| Day/Night Toggle | Sun/Moon button in Navbar and Admin |
| CSS Variables    | Full light/dark color palette       |
| Persistence      | Theme saved via next-themes         |

### Internationalization (i18n)

| Feature           | Description                                    |
| ----------------- | ---------------------------------------------- |
| Cookie-based      | `NEXT_LOCALE` cookie for persistence           |
| Languages         | French (default), English                      |
| Translation Files | `src/messages/fr.json`, `en.json`              |
| Components        | Navbar, Home page, forms use `useTranslations` |

### Accessibility

| Feature          | Description                           |
| ---------------- | ------------------------------------- |
| Skip-to-Content  | Hidden link for keyboard navigation   |
| ARIA Labels      | All interactive elements labeled      |
| Focus Indicators | Visible focus rings on all clickables |
| Screen Reader    | Semantic HTML structure               |

### New Components

| Component       | Purpose                                     |
| --------------- | ------------------------------------------- |
| `ScrollToTop`   | Floating button, appears after 400px scroll |
| `CookieBanner`  | GDPR consent with localStorage persistence  |
| `ToastProvider` | Global notification system (4 types)        |
| `Breadcrumbs`   | Navigation trail for nested pages           |
| `ContactForm`   | Validated form with loading/success states  |
| `Skeletons`     | Loading placeholders for grids              |

### Error Handling

| Page         | Description                             |
| ------------ | --------------------------------------- |
| `/not-found` | Custom 404 with branding and navigation |
| Error toasts | User-friendly error messages            |

---

## Build Information

```
Next.js 16.0.10 (Turbopack)
25 Routes (23 dynamic, 2 static)
TypeScript strict mode
```

**Static Routes**: `/robots.txt`, `/sitemap.xml`

**Dynamic Routes**: All pages (i18n middleware)

---

## API Endpoints

| Endpoint                  | Method   | Purpose                 | Rate Limit |
| ------------------------- | -------- | ----------------------- | ---------- |
| `/api/auth/[...nextauth]` | GET/POST | Authentication          | -          |
| `/api/contact`            | POST     | Contact form submission | 5/min      |
| `/api/newsletter`         | POST     | Newsletter subscription | 3/min      |

---

## Utilities & Hooks

| Utility            | File                            | Description                  |
| ------------------ | ------------------------------- | ---------------------------- |
| CSV Export         | `lib/csv-export.ts`             | Export data to CSV files     |
| Rate Limiter       | `lib/rate-limit.ts`             | In-memory request throttling |
| Keyboard Shortcuts | `hooks/useKeyboardShortcuts.ts` | Global keyboard handler      |

---

### Features (`components/features/`)

| Component            | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `HeroBackground`     | Animated particles, grid, gradient overlays |
| `ExpertiseCard`      | Lordicon icons with hover effects           |
| `AnimatedCounter`    | Smooth RAF-based counter with easing        |
| `RegionalMap`        | Accurate France SVG with office markers     |
| `CommandPalette`     | ⌘K search modal                             |
| `ContactForm`        | Validated contact form                      |
| `NewsletterForm`     | Email subscription                          |
| `ScrollToTop`        | Floating scroll button                      |
| `CookieBanner`       | GDPR consent                                |
| `Breadcrumbs`        | Navigation trail                            |
| `ValuationEstimator` | Company valuation calculator                |

### UI (`components/ui/`)

| Component       | Purpose              |
| --------------- | -------------------- |
| `AnimatedIcon`  | Lordicon wrapper     |
| `ToastProvider` | Global notifications |
| `Skeletons`     | Loading placeholders |
| `Loading`       | Spinner and progress |

### Utilities (`lib/`)

| Utility      | File                | Description               |
| ------------ | ------------------- | ------------------------- |
| `unsplash`   | `lib/unsplash.ts`   | Unsplash API with caching |
| `logger`     | `lib/logger.ts`     | Structured logging        |
| `csv-export` | `lib/csv-export.ts` | Export data to CSV        |
| `rate-limit` | `lib/rate-limit.ts` | Request throttling        |
