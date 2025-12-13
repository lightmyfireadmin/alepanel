# Alecia Panel - M&A Business Operating System

> Private repository for Alecia's M&A operations management platform

## 🎯 Overview

Alecia Panel is a comprehensive Business Operating System designed for managing M&A (Mergers & Acquisitions) operations, client relationships, deal pipelines, and team activities. The platform consists of:

- **Admin Dashboard** (`/alecia-app`): Full-featured Next.js application for internal operations
- **Public Website**: Client-facing website showcasing services, team, and completed deals
- **CRM System**: Contact and company management with SIREN enrichment
- **Document Manager**: Secure file storage with magic link sharing
- **Project Pipeline**: Kanban-style deal tracking with investor matching

## ✅ Database Sync Status

**Latest Update (December 2025)**: Neon database and Vercel Blob are now fully synced with the frontend!

- ✅ **67+ Server Actions** created for all data operations
- ✅ **Public Pages** (`/operations`, `/equipe`, `/actualites`) fetch from database
- ✅ **Admin Dashboard** shows real-time database stats
- ✅ **Vercel Blob Integration** for file uploads and documents
- ✅ **Database Tooling** (migrations, seeding, GUI access)
- ✅ **Comprehensive Documentation** in `DATABASE_SETUP.md` and `SYNC_IMPLEMENTATION.md`
- ✅ **Production Ready** with zero security vulnerabilities

See `alecia-app/DATABASE_SETUP.md` for setup instructions and `alecia-app/SYNC_IMPLEMENTATION.md` for implementation details.

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 16.0.10 (App Router with Turbopack)
- **Language**: TypeScript (strict mode)
- **UI Library**: React 19.2.1
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: next-intl (French/English)
- **Theme**: next-themes (light/dark mode)
- **PDF Generation**: @react-pdf/renderer

### Backend
- **Authentication**: NextAuth.js v5 (beta)
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **File Storage**: Vercel Blob
- **Password Hashing**: bcryptjs

### Development
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm
- **Node.js**: v20+

## 📦 Project Structure

```
alepanel/
├── alecia-app/              # Main Next.js application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   │   ├── [locale]/  # i18n routes (fr/en)
│   │   │   ├── admin/     # Admin dashboard
│   │   │   └── api/       # API endpoints
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Base UI components
│   │   │   └── features/  # Feature components
│   │   ├── lib/           # Utilities and helpers
│   │   │   ├── db/        # Database schema & queries
│   │   │   └── auth/      # Authentication config
│   │   ├── hooks/         # Custom React hooks
│   │   └── messages/      # i18n translations (fr.json, en.json)
│   ├── public/            # Static assets
│   ├── drizzle/           # Database migrations
│   └── package.json
├── www.alecia.fr/         # Scraped website content
├── scrp/                  # Scraper scripts/documents
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (we use Neon)
- Vercel Blob storage account (for file uploads)

### Installation

1. **Clone the repository** (already done in your environment):
   ```bash
   cd /home/runner/work/alepanel/alepanel/alecia-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   ```env
   # Database
   DATABASE_URL="postgres://user:password@host/db"
   
   # Authentication
   AUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   NEW_USER_PWD="initial-admin-password"
   
   # Storage
   BLOB_READ_WRITE_TOKEN="vercel_blob_token"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   
   # Optional: AI Services
   MISTRAL_API_KEY="mistral_key"
   GROQ_API_KEY="gsk_key"
   
   # Optional: External APIs
   NEXT_PUBLIC_MAPBOX_TOKEN="pk.mapbox_token"
   RESEND_API_KEY="re_resend_key"
   OPENWEATHER_API_KEY="ow_key"
   DEEPL_API_KEY="deepl_key"
   ```

4. **Set up the database**:
   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate
   
   # Optional: Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 💻 Development Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database (Drizzle)
npm run db:generate  # Generate migrations from schema
npm run db:migrate   # Apply migrations to database
npm run db:push      # Push schema changes (dev only)
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:seed      # Seed database with initial data

# Type checking
npx tsc --noEmit     # Check TypeScript types
```

## 🗄️ Database Schema

The application uses Drizzle ORM with PostgreSQL. Key tables:

| Table | Purpose |
|-------|---------|
| `users` | Admin authentication |
| `companies` | Company registry with SIREN data |
| `contacts` | CRM contacts (clients, investors) |
| `projects` | Active M&A deals (pipeline) |
| `project_events` | Timeline events for projects |
| `deals` | Historical M&A operations |
| `documents` | File storage with magic links |
| `posts` | News articles and press releases |
| `team_members` | Team profiles |

**Schema location**: `src/lib/db/schema.ts`

### Database Migrations

When modifying the schema:

1. Update `src/lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review migration file in `drizzle/` directory
4. Apply migration: `npm run db:migrate`

## 🔐 Authentication

The admin dashboard (`/admin/*`) is protected by NextAuth.js:

- **Login route**: `/admin/login`
- **Session management**: JWT-based sessions
- **Middleware**: Automatic redirect for unauthenticated users

**First-time setup**: Create an admin user with `NEW_USER_PWD` from environment variables.

## 🌍 Internationalization

The app supports French (default) and English:

- **Translations**: `src/messages/fr.json` and `src/messages/en.json`
- **Middleware**: Automatic locale detection
- **Cookie**: `NEXT_LOCALE` stores user preference
- **Usage**: `useTranslations()` hook from next-intl

## 📝 Key Features

### Admin Dashboard
- **Dashboard Overview** (`/admin`): Stats, recent deals, quick actions
- **Projects Kanban** (`/admin/projects`): Pipeline management (Lead → Due Diligence → Closing)
- **CRM** (`/admin/crm`): Contact and company management with SIREN enrichment
- **Document Manager** (`/admin/documents`): Secure file sharing with magic links
- **Operations** (`/admin/deals`): Historical M&A deals
- **News** (`/admin/news`): Article management
- **Team** (`/admin/team`): Team member profiles

### Public Website
- **Home** (`/`): Landing page with animated hero and stats
- **Services** (`/expertises`): M&A service descriptions
- **Operations** (`/operations`): Completed deals showcase
- **Team** (`/equipe`): Team profiles with LinkedIn links
- **News** (`/actualites`): Press releases and articles
- **Contact** (`/contact`): Contact form and office locations
- **Careers** (`/nous-rejoindre`): Job listings

### Special Features
- **PDF Teaser Generator**: Branded deal summary PDFs
- **Magic Links**: Secure document sharing with tokens
- **Voice Note Recorder**: Quick voice memos (mobile FAB)
- **Dark Mode**: Full theme support with persistence
- **Command Palette**: ⌘K search modal

## 🔒 Security Considerations

- **Secrets**: Never commit `.env` or `.env.local` files
- **Auth tokens**: Rotate `AUTH_SECRET` regularly
- **Database**: Use SSL connections for production
- **File uploads**: Validate file types and sizes
- **Rate limiting**: API endpoints are throttled (see `lib/rate-limit.ts`)
- **CORS**: Configure for production domains only

## 🚢 Deployment

The application is designed for Vercel deployment:

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from `main` branch
4. Database migrations run automatically via build script

**Production checklist**:
- [ ] Set `AUTH_SECRET` to a secure random string
- [ ] Configure `NEXTAUTH_URL` to production domain
- [ ] Set up Neon PostgreSQL database
- [ ] Configure Vercel Blob storage
- [ ] Set up domain and SSL
- [ ] Configure CORS and CSP headers

## 📚 Additional Documentation

- **Dashboard Features**: See `alecia-app/DASHBOARD.md` for detailed feature documentation
- **API Endpoints**: Documented in dashboard MD file
- **Component Library**: Radix UI + custom components in `src/components/ui`

## 🤝 Contributing

This is a private repository. For team members:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes with clear commit messages
3. Test thoroughly in development
4. Create a pull request for review
5. Merge after approval

**Code style**:
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write semantic commit messages
- Add JSDoc comments for complex functions

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npm run db:studio
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Type Errors
```bash
# Check types
npx tsc --noEmit

# Regenerate types
npm run build
```

### Environment Variables
- Ensure all required variables are set in `.env.local`
- Restart dev server after changing environment variables

## 📄 License

Private repository - All rights reserved.

## 👥 Team

Maintained by the Alecia development team.

---

**Questions?** Contact the development team or check the detailed documentation in `alecia-app/DASHBOARD.md`.
