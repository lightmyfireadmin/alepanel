# Neon Data Tables Documentation

This document provides a comprehensive overview of the database schema used in the Alecia Admin Panel, hosted on Neon PostgreSQL.

## Overview

The database contains tables for managing authentication, content (deals, posts, team), CRM features (companies, contacts), and business operations (projects, documents).

## Tables

### 1. Users (`users`)

**Purpose:** Admin authentication and user management.

| Variable (Column)      | Type      | Description                            |
| :--------------------- | :-------- | :------------------------------------- |
| `id`                   | UUID      | Primary Key                            |
| `email`                | Text      | Unique email address                   |
| `password_hash`        | Text      | Hashed password                        |
| `name`                 | Text      | User's full name                       |
| `role`                 | Text      | User role (default: "admin")           |
| `must_change_password` | Boolean   | Force password change on next login    |
| `has_seen_onboarding`  | Boolean   | Track if user has seen onboarding tour |
| `created_at`           | Timestamp | Creation date                          |
| `updated_at`           | Timestamp | Last update date                       |

### 2. Deals (`deals`)

**Purpose:** M&A Transactions portfolio.

| Variable (Column)     | Type    | Description                            |
| :-------------------- | :------ | :------------------------------------- |
| `id`                  | UUID    | Primary Key                            |
| `slug`                | Text    | Unique identifier for URLs             |
| `client_name`         | Text    | Name of the client                     |
| `client_logo`         | Text    | URL to client logo                     |
| `acquirer_name`       | Text    | Name of acquirer (optional)            |
| `acquirer_logo`       | Text    | URL to acquirer logo                   |
| `sector`              | Text    | Indstry sector                         |
| `region`              | Text    | Geographic region                      |
| `year`                | Integer | Year of transaction                    |
| `mandate_type`        | Text    | Type (Cession, Acquisition, etc.)      |
| `description`         | Text    | Brief description                      |
| `is_confidential`     | Boolean | If true, hides sensitive details       |
| `is_prior_experience` | Boolean | Marks operations from prior experience |
| `context`             | Text    | Detailed context (Case Study)          |
| `intervention`        | Text    | Our intervention details (Case Study)  |
| `result`              | Text    | Results obtained (Case Study)          |
| `testimonial_text`    | Text    | Client verbatim                        |
| `testimonial_author`  | Text    | Author of testimonial                  |
| `role_type`           | Text    | Specific role                          |
| `deal_size`           | Text    | Value range bracket                    |
| `key_metrics`         | JSONB   | Stats like multiple, duration, etc.    |
| `display_order`       | Integer | Sorting order                          |

### 3. Posts (`posts`)

**Purpose:** News and blog articles (Multilingual).

| Variable (Column) | Type      | Description                           |
| :---------------- | :-------- | :------------------------------------ |
| `id`              | UUID      | Primary Key                           |
| `slug`            | Text      | Unique URL slug                       |
| `title_fr`        | Text      | French title                          |
| `title_en`        | Text      | English title                         |
| `content_fr`      | Text      | French content                        |
| `content_en`      | Text      | English content                       |
| `excerpt`         | Text      | Short summary                         |
| `cover_image`     | Text      | URL to cover image                    |
| `category`        | Text      | Post type (Communiqué, Article, etc.) |
| `published_at`    | Timestamp | Publication date                      |
| `is_published`    | Boolean   | Visibility status                     |

### 4. Team Members (`team_members`)

**Purpose:** Agency team profiles.

| Variable (Column)   | Type        | Description           |
| :------------------ | :---------- | :-------------------- |
| `id`                | UUID        | Primary Key           |
| `slug`              | Text        | Unique identifier     |
| `name`              | Text        | Full name             |
| `role`              | Text        | Job title             |
| `photo`             | Text        | URL to profile photo  |
| `bio_fr`            | Text        | French biography      |
| `bio_en`            | Text        | English biography     |
| `linkedin_url`      | Text        | LinkedIn profile link |
| `email`             | Text        | Contact email         |
| `sectors_expertise` | Array(Text) | Areas of expertise    |
| `transactions`      | Array(Text) | Linked deal slugs     |
| `display_order`     | Integer     | Sorting order         |
| `is_active`         | Boolean     | Active status         |

### 5. Companies (`companies`)

**Purpose:** Business entities (linked to Pappers API).

| Variable (Column)  | Type      | Description                     |
| :----------------- | :-------- | :------------------------------ |
| `id`               | UUID      | Primary Key                     |
| `name`             | Text      | Company name                    |
| `siren`            | Text      | Unique SIREN number             |
| `address`          | Text      | Head office address             |
| `sector`           | Text      | Business sector                 |
| `financial_data`   | JSONB     | Revenue, EBITDA, employees data |
| `logo_url`         | Text      | Company logo                    |
| `is_enriched`      | Boolean   | Data enrichment flag            |
| `last_enriched_at` | Timestamp | Last API sync date              |

### 6. Contacts (`contacts`)

**Purpose:** CRM contacts (People).

| Variable (Column) | Type        | Description                                      |
| :---------------- | :---------- | :----------------------------------------------- |
| `id`              | UUID        | Primary Key                                      |
| `name`            | Text        | Full name                                        |
| `email`           | Text        | Email address                                    |
| `phone`           | Text        | Phone number                                     |
| `role`            | Text        | Job title                                        |
| `company_id`      | UUID        | Reference to `companies` table                   |
| `notes`           | Text        | Private notes                                    |
| `tags`            | Array(Text) | Classification tags (Investisseur, Cédant, etc.) |

### 7. Projects (`projects`)

**Purpose:** Operation management and timeline.

| Variable (Column)   | Type    | Description                               |
| :------------------ | :------ | :---------------------------------------- |
| `id`                | UUID    | Primary Key                               |
| `title`             | Text    | Project name                              |
| `status`            | Text    | Kanban status (Lead, Due Diligence, etc.) |
| `client_id`         | UUID    | Reference to `contacts` table             |
| `start_date`        | Date    | Project start                             |
| `target_close_date` | Date    | Estimated closing                         |
| `description`       | Text    | Details                                   |
| `display_order`     | Integer | Sorting order                             |

### 8. Project Events (`project_events`)

**Purpose:** Timeline events for projects.

| Variable (Column) | Type | Description                          |
| :---------------- | :--- | :----------------------------------- |
| `id`              | UUID | Primary Key                          |
| `project_id`      | UUID | Linked project                       |
| `type`            | Text | Event type (Meeting, Document, etc.) |
| `date`            | Date | Event date                           |
| `description`     | Text | Event details                        |
| `file_url`        | Text | Attachment URL                       |

### 9. Documents (`documents`)

**Purpose:** Data Room and file management.

| Variable (Column) | Type    | Description               |
| :---------------- | :------ | :------------------------ |
| `id`              | UUID    | Primary Key               |
| `name`            | Text    | File name                 |
| `url`             | Text    | File URL (Vercel Blob)    |
| `mime_type`       | Text    | File type                 |
| `project_id`      | UUID    | Linked project (optional) |
| `is_confidential` | Boolean | Access restriction flag   |
| `access_token`    | Text    | Magic link token          |

### 10. Buyer Criteria (`buyer_criteria`)

**Purpose:** Investment preferences for Deal Matchmaker.

| Variable (Column) | Type        | Description              |
| :---------------- | :---------- | :----------------------- |
| `id`              | UUID        | Primary Key              |
| `contact_id`      | UUID        | Linked investor/buyer    |
| `target_sectors`  | Array(Text) | Preferred sectors        |
| `target_regions`  | Array(Text) | Preferred regions        |
| `min_revenue`     | Integer     | Min revenue target (EUR) |
| `max_revenue`     | Integer     | Max revenue target (EUR) |
| `min_ebitda`      | Integer     | Min EBITDA target (EUR)  |
| `max_ebitda`      | Integer     | Max EBITDA target (EUR)  |
| `notes`           | Text        | Specific requirements    |

### 11. Sectors (`sectors`)

**Purpose:** Sector verticals content.

| Variable (Column)       | Type | Description               |
| :---------------------- | :--- | :------------------------ |
| `id`                    | UUID | Primary Key               |
| `slug`                  | Text | URL slug                  |
| `name_fr` / `name_en`   | Text | Translated names          |
| `description_fr/en`     | Text | Translated descriptions   |
| `investment_thesis_...` | Text | Investment thesis content |
| `icon_type`             | Text | Icon identifier           |
| `referent_partner_id`   | UUID | Linked team member        |

### 12. Offices (`offices`)

**Purpose:** Regional presence.

| Variable (Column)        | Type | Description  |
| :----------------------- | :--- | :----------- |
| `id`                     | UUID | Primary Key  |
| `name`                   | Text | Office name  |
| `city`                   | Text | City         |
| `region`                 | Text | Region       |
| `address`                | Text | Full address |
| `latitude` / `longitude` | Text | Coordinates  |
| `image_url`              | Text | Office photo |

### 13. Job Offers (`job_offers`)

**Purpose:** Recruitment.

| Variable (Column) | Type        | Description                |
| :---------------- | :---------- | :------------------------- |
| `id`              | UUID        | Primary Key                |
| `slug`            | Text        | URL slug                   |
| `title`           | Text        | Job title                  |
| `type`            | Text        | Contract type (CDI, Stage) |
| `location`        | Text        | Job location               |
| `description`     | Text        | Full description           |
| `requirements`    | Array(Text) | List of requirements       |
| `contact_email`   | Text        | Application email          |
| `pdf_url`         | Text        | PDF brochure URL           |
| `is_published`    | Boolean     | Visibility                 |

### 14. Voice Notes (`voice_notes`)

**Purpose:** Audio notes for CRM.

| Variable (Column) | Type | Description       |
| :---------------- | :--- | :---------------- |
| `id`              | UUID | Primary Key       |
| `blob_url`        | Text | Audio file URL    |
| `transcription`   | Text | Text content      |
| `recorded_by`     | UUID | User who recorded |

### 15. Weather Cache (`weather_cache`)

**Purpose:** API caching for dashboard weather widget.

| Variable (Column) | Type      | Description                |
| :---------------- | :-------- | :------------------------- |
| `location_key`    | Text      | Cache key (e.g., Paris,FR) |
| `data`            | JSONB     | Cached weather data        |
| `fetched_at`      | Timestamp | Cache timestamp            |

### 16. Testimonials (`testimonials`)

**Purpose:** Client feedback.

| Variable (Column) | Type    | Description     |
| :---------------- | :------ | :-------------- |
| `deal_id`         | UUID    | Linked Deal     |
| `author_name`     | Text    | Name            |
| `content`         | Text    | Quote content   |
| `rating`          | Integer | 1-5 Star rating |
