# Neon → Convex Migration Report

**Date:** 2026-01-07
**Status:** ✅ COMPLETE

## Summary

All marketing and operational data has been successfully migrated from Neon PostgreSQL to Convex.

## Data Migrated

| Table | Records | Description |
|-------|---------|-------------|
| `transactions` | 46 | M&A deal track record |
| `team_members` | 8 | Team profiles with bios |
| `marketing_tiles` | 12 | Ambiance gallery items |
| `blog_posts` | 6 | News/PR articles |
| `forum_categories` | 4 | Discussion categories |
| `pads` | 2 | Collaborative documents |
| `job_offers` | 1 | Career listings |
| `global_config` | 12 | App configuration (map settings) |
| **TOTAL** | **91** | |

## Neon Tables NOT Migrated (Intentional)

| Table | Reason |
|-------|--------|
| `users` | Using Clerk auth in V2 |
| `images` | Binary blobs - use CDN instead |
| `weather_cache` | Runtime cache, will regenerate |
| `kanban_boards/columns` | Already rebuilt in V2 schema |
| `projects` | Using V2 deals/research_tasks |
| `spreadsheets` | Minimal test data |
| `forum_threads/posts` | Minimal test data, V2 forum ready |

## Migration Scripts

- `scripts/analyze-neon.js` - Database structure analysis
- `scripts/prepare-migration.js` - First pass data transformation
- `scripts/complete-migration.js` - Full migration with all tables
- `scripts/run-import.js` - JSONL file generation

## Files Generated

- `neon_marketing_dump.json` - Full database backup (507MB, local only)
- `complete_migration.json` - Transformed data for reference
- `data/*.jsonl` - Import-ready files for Convex

## Convex Deployment

**Instance:** `hip-iguana-601.convex.cloud`
**Dashboard:** https://dashboard.convex.dev/d/hip-iguana-601

## Post-Migration Actions

1. ✅ Verify data in Convex dashboard
2. ⬜ Build admin UI for transactions/team management
3. ⬜ Connect marketing website to Convex queries
4. ⬜ Delete Neon database when confirmed stable

## Neon Credentials (For Reference)

```
Host: ep-fancy-rice-ag8i6qv2-pooler.c-2.eu-central-1.aws.neon.tech
Database: neondb
User: neondb_owner
```

---

**V1 Panel can now be safely deprecated.**
