# Alecia Admin Panel

A Next.js 16 Business Operating System for M&A advisory operations management.

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Database:** Neon PostgreSQL with Drizzle ORM
- **Auth:** NextAuth.js v5 (Credentials provider)
- **Styling:** TailwindCSS v4
- **Animations:** Framer Motion
- **i18n:** next-intl (French/English)
- **Validation:** Zod v4

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.  
Admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

## Environment Variables

| Variable                | Purpose                           |
| ----------------------- | --------------------------------- |
| `DATABASE_URL`          | Neon PostgreSQL connection string |
| `NEXTAUTH_SECRET`       | Session encryption key            |
| `NEXTAUTH_URL`          | Base URL for auth callbacks       |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token         |
| `SUDO_PWD`              | Developer panel password          |

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin dashboard (protected)
│   ├── sudo/         # Developer panel (protected)
│   ├── api/          # API routes
│   └── ...           # Public pages
├── components/
│   ├── ui/           # Base UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Navbar, Footer
├── lib/
│   ├── db/           # Drizzle schema & connection
│   ├── actions/      # Server actions
│   └── validations/  # Zod schemas
└── messages/         # i18n translation files
```

## Features

- **Authentication**: Secure admin login with NextAuth.js.
- **Content Management**: Full CRUD for Deals, News, and Team members.
- **CRM**: Manage Companies and Contacts with enrichment capabilities.
- **Project Management**: Kanban-style project tracking with timeline events.
- **Data Room**: Secure document sharing via Vercel Blob.
- **Deal Matchmaker**: SQL-based matching of buyer criteria with deals.
- **Localization**: Native support for French and English content.

## Documentation

- [Dashboard Features](./DASHBOARD.md) - Detailed page-by-page documentation
- [Data Tables & Schema](./NEON_DATA_TABLES.md) - Database schema documentation
- [Audit Report](./AUDIT_REPORT.md) - Codebase audit findings

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

Private - All rights reserved.
