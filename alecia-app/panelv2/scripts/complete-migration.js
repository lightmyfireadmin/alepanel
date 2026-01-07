// Complete Neon → Convex Migration
// Migrates ALL remaining data for full Neon DB deprecation

const fs = require('fs');
const dump = JSON.parse(fs.readFileSync('./neon_marketing_dump.json', 'utf-8'));

console.log('='.repeat(60));
console.log('COMPLETE NEON → CONVEX MIGRATION');
console.log('='.repeat(60));

// Already migrated in previous run:
// - transactions (from deals): 46
// - team_members: 8
// - marketing_tiles (from tiles): 12

const migration = {
  // ==========================================
  // BLOG / CMS
  // ==========================================
  blog_posts: dump.posts?.map(p => ({
    title: p.title_fr || p.title_en || 'Untitled',
    slug: p.slug || 'untitled-' + Date.now(),
    content: p.content_fr || p.content_en || '',
    excerpt: p.excerpt || '',
    coverImage: p.cover_image || undefined,
    category: p.category || 'news',
    status: p.is_published ? 'published' : 'draft',
    publishedAt: p.published_at ? new Date(p.published_at).getTime() : undefined,
    seoTitle: p.title_fr,
    seoDescription: p.excerpt,
    // Will need authorId after user migration
  })) || [],

  // ==========================================
  // FORUM (Already has schema in V2)
  // ==========================================
  forum_categories_import: dump.forum_categories?.map(c => ({
    neonId: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || '',
    icon: c.icon || 'MessageSquare',
    order: c.order || 0,
    isPrivate: c.is_private || false,
  })) || [],

  forum_threads_import: dump.forum_threads?.map(t => ({
    neonId: t.id,
    neonCategoryId: t.category_id,
    neonAuthorId: t.author_id,
    title: t.title,
    isPinned: t.is_pinned || false,
    isLocked: t.is_locked || false,
    replyCount: t.reply_count || 0,
    viewCount: t.view_count || 0,
  })) || [],

  forum_posts_import: dump.forum_posts?.map(p => ({
    neonId: p.id,
    neonThreadId: p.thread_id,
    neonAuthorId: p.author_id,
    content: p.content,
    neonParentId: p.parent_id,
  })) || [],

  // ==========================================
  // JOB OFFERS (Marketing)
  // ==========================================
  job_offers: dump.job_offers?.map(j => ({
    slug: j.slug,
    title: j.title,
    type: j.type || 'CDI',
    location: j.location || 'Nice',
    description: j.description || '',
    requirements: j.requirements || '',
    contactEmail: j.contact_email,
    pdfUrl: j.pdf_url,
    isPublished: j.is_published !== false,
    displayOrder: j.display_order || 0,
  })) || [],

  // ==========================================
  // KANBAN (Already has schema in V2)
  // ==========================================
  kanban_boards_import: dump.kanban_boards?.map(b => ({
    neonId: b.id,
    name: b.name,
    neonOwnerId: b.owner_id,
  })) || [],

  kanban_columns_import: dump.kanban_columns?.map(c => ({
    neonId: c.id,
    neonBoardId: c.board_id,
    name: c.name,
    order: c.order || 0,
  })) || [],

  // ==========================================
  // PADS (Collaborative Documents)
  // ==========================================
  pads: dump.pads?.map(p => ({
    neonId: p.id,
    title: p.title,
    content: p.content || '',
    neonOwnerId: p.owner_id,
    isPublic: p.is_public || false,
  })) || [],

  // ==========================================
  // PROJECTS (Internal tracking)
  // ==========================================
  projects_import: dump.projects?.map(p => ({
    neonId: p.id,
    title: p.title,
    status: p.status || 'Lead',
    description: p.description || '',
    displayOrder: p.display_order || 0,
    neonBoardId: p.board_id,
    neonColumnId: p.column_id,
  })) || [],

  // ==========================================
  // RESEARCH TASKS (Already has schema in V2)
  // ==========================================
  research_tasks_import: dump.research_tasks?.map(t => ({
    neonId: t.id,
    query: t.query,
    status: t.status || 'pending',
    resultSummary: t.result_summary,
    sources: t.sources || [],
    neonCreatedBy: t.created_by,
  })) || [],

  // ==========================================
  // MAP CONFIG (Single record)
  // ==========================================
  map_config: dump.map_config?.length ? {
    tileLayerUrl: dump.map_config[0].tile_layer_url,
    centerLat: parseFloat(dump.map_config[0].center_lat),
    centerLng: parseFloat(dump.map_config[0].center_lng),
    zoomLevel: dump.map_config[0].zoom_level,
    maxZoom: dump.map_config[0].max_zoom,
    minZoom: dump.map_config[0].min_zoom,
    attribution: dump.map_config[0].attribution,
    backgroundTheme: dump.map_config[0].background_theme,
    appTitle: dump.map_config[0].app_title,
    appSubtitle: dump.map_config[0].app_subtitle,
    primaryColor: dump.map_config[0].primary_color,
    secondaryColor: dump.map_config[0].secondary_color,
  } : null,

  // ==========================================
  // SPREADSHEETS (Minimal data tool)
  // ==========================================
  spreadsheets: dump.spreadsheets?.map(s => ({
    neonId: s.id,
    title: s.title,
    data: s.data || [],
    schemaDef: s.schema_def,
    neonOwnerId: s.owner_id,
  })) || [],

  // ==========================================
  // USERS (Reference for ID mapping)
  // ==========================================
  neon_users_reference: dump.users?.map(u => ({
    neonId: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    // NOT migrating password_hash - users will use Clerk auth
  })) || [],

  // ==========================================
  // IMAGES (Binary - extract URLs only)
  // ==========================================
  images_reference: dump.images?.map(i => ({
    neonId: i.id,
    filename: i.filename,
    mimeType: i.mime_type,
    size: i.size,
    // NOTE: Binary data stored in Neon. Need to re-upload to Convex Storage or CDN.
    // For now, storing filename for reference during manual re-upload.
  })) || [],
};

// Print summary
console.log('\n📊 MIGRATION SUMMARY:\n');
Object.entries(migration).forEach(([key, value]) => {
  if (Array.isArray(value)) {
    console.log(`   ${key}: ${value.length} records`);
  } else if (value) {
    console.log(`   ${key}: 1 record (config)`);
  }
});

// Write to file
fs.writeFileSync('./complete_migration.json', JSON.stringify(migration, null, 2));
console.log('\n✅ Created: complete_migration.json');

// Create individual JSONL files for Convex import
const dataDir = './data';

// Blog posts
if (migration.blog_posts.length) {
  fs.writeFileSync(`${dataDir}/blog_posts.jsonl`, 
    migration.blog_posts.map(p => JSON.stringify(p)).join('\n'));
  console.log(`   → data/blog_posts.jsonl (${migration.blog_posts.length})`);
}

// Job offers - need to add to schema
if (migration.job_offers.length) {
  fs.writeFileSync(`${dataDir}/job_offers.jsonl`, 
    migration.job_offers.map(j => JSON.stringify(j)).join('\n'));
  console.log(`   → data/job_offers.jsonl (${migration.job_offers.length})`);
}

// Forum categories
if (migration.forum_categories_import.length) {
  fs.writeFileSync(`${dataDir}/forum_categories.jsonl`, 
    migration.forum_categories_import.map(c => JSON.stringify({
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      order: c.order,
      isPrivate: c.isPrivate,
    })).join('\n'));
  console.log(`   → data/forum_categories.jsonl (${migration.forum_categories_import.length})`);
}

// Pads (as site_pages content type)
if (migration.pads.length) {
  fs.writeFileSync(`${dataDir}/pads.jsonl`, 
    migration.pads.map(p => JSON.stringify({
      title: p.title,
      content: p.content,
      isPublic: p.isPublic,
    })).join('\n'));
  console.log(`   → data/pads.jsonl (${migration.pads.length})`);
}

console.log('\n' + '='.repeat(60));
console.log('SCHEMA ADDITIONS NEEDED');
console.log('='.repeat(60));
console.log(`
The following tables need to be added to schema.ts:

1. job_offers - Marketing job listings
2. forum_categories - Update existing or add if missing
3. pads - Collaborative documents (or use existing site_pages)
4. global_config - Map config and app settings

Tables that can use existing V2 schema:
- blog_posts (already exists)
- forum_threads (already exists)
- forum_posts (already exists)
- kanban_boards (already exists as kanban_columns with boardId)
- research_tasks (already exists)
`);
