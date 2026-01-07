// Migration Script: Neon → Convex
// Imports marketing website content into the new V2 panel

/*
NEON DATA SUMMARY:
==================
Marketing Content (priority for migration):
- deals: 46 records (transactions showcase)
- team_members: 8 records (team page)
- posts: 6 records (blog articles)
- tiles: 12 records (gallery/ambiance)

Internal Tools (already rebuilt in V2):
- forum_categories: 4 records
- forum_threads: 1 record
- forum_posts: 2 records
- kanban_boards: 2 records
- kanban_columns: 9 records
- projects: 3 records
- research_tasks: 2 records
- pads: 2 records (collaborative docs)

Config/Cache:
- map_config: 1 record
- weather_cache: 5 records
- images: 12 records (binary blobs - skip, use CDN instead)
*/

const fs = require('fs');

// Load the dump
const dump = JSON.parse(fs.readFileSync('./neon_marketing_dump.json', 'utf-8'));

console.log('='.repeat(60));
console.log('NEON → CONVEX MIGRATION PLAN');
console.log('='.repeat(60));

// 1. Deals (Transactions)
console.log('\n📊 DEALS / TRANSACTIONS (46 records)');
console.log('   Mapping: deals → Convex site_pages OR new "transactions" table');
console.log('   Fields: slug, client_name, acquirer_name, sector, year, mandate_type, etc.');
console.log('   Sample:');
if (dump.deals && dump.deals[0]) {
  const d = dump.deals[0];
  console.log(`     ${d.client_name} → ${d.acquirer_name} (${d.sector}, ${d.year})`);
}

// 2. Team Members
console.log('\n👥 TEAM MEMBERS (8 records)');
console.log('   Mapping: team_members → Convex site_pages (team section) OR new table');
console.log('   Fields: name, role, photo, bio_fr, bio_en, linkedin_url');
console.log('   Sample:');
if (dump.team_members && dump.team_members[0]) {
  const t = dump.team_members[0];
  console.log(`     ${t.name} - ${t.role}`);
}

// 3. Blog Posts
console.log('\n📝 BLOG POSTS (6 records)');
console.log('   Mapping: posts → Convex blog_posts');
console.log('   Fields: title, slug, content, excerpt, published_at');
console.log('   Sample:');
if (dump.posts && dump.posts[0]) {
  const p = dump.posts[0];
  console.log(`     "${p.title}" - ${p.status}`);
}

// 4. Tiles (Ambiance Gallery)
console.log('\n🖼️ TILES (12 records)');
console.log('   Mapping: tiles → new Convex "marketing_tiles" table');
console.log('   Fields: title, description, sound_url, image_url');

// 5. Forum Categories (for reference)
console.log('\n💬 FORUM CATEGORIES (4 records)');
dump.forum_categories?.forEach(c => {
  console.log(`     - ${c.name} (${c.slug})`);
});

// Generate Convex import data
console.log('\n\n' + '='.repeat(60));
console.log('GENERATING CONVEX IMPORT FILES');
console.log('='.repeat(60));

// Prepare export objects without binary data
const convexImport = {
  // Blog posts mapping
  blog_posts: dump.posts?.map(p => ({
    title: p.title,
    slug: p.slug,
    content: p.content || '',
    excerpt: p.excerpt || '',
    status: p.status === 'published' ? 'published' : 'draft',
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    featuredImage: p.featured_image,
    // authorId will need to be set after user creation
  })) || [],
  
  // Team members as site content
  team_members: dump.team_members?.map(t => ({
    slug: t.slug,
    name: t.name,
    role: t.role,
    photo: t.photo,
    bio_fr: t.bio_fr,
    bio_en: t.bio_en,
    linkedinUrl: t.linkedin_url,
    email: t.email,
    sectorsExpertise: t.sectors_expertise || [],
    transactions: t.transactions || [],
    displayOrder: t.display_order || 0,
    isActive: t.is_active !== false,
  })) || [],
  
  // Transactions/Deals
  transactions: dump.deals?.map(d => ({
    slug: d.slug,
    clientName: d.client_name,
    clientLogo: d.client_logo,
    acquirerName: d.acquirer_name,
    acquirerLogo: d.acquirer_logo,
    sector: d.sector,
    region: d.region,
    year: d.year,
    mandateType: d.mandate_type,
    description: d.description,
    isConfidential: d.is_confidential || false,
    isPriorExperience: d.is_prior_experience || false,
    context: d.context,
    intervention: d.intervention,
    result: d.result,
    testimonialText: d.testimonial_text,
    testimonialAuthor: d.testimonial_author,
    roleType: d.role_type,
    dealSize: d.deal_size,
    keyMetrics: d.key_metrics || {},
    displayOrder: d.display_order || 0,
  })) || [],
  
  // Tiles for marketing ambiance
  marketing_tiles: dump.tiles?.map(t => ({
    title: t.title,
    description: t.description,
    soundUrl: t.sound_url,
    imageUrl: t.image_url,
    displayOrder: t.display_order || 0,
    styleConfig: t.style_config || {},
  })) || [],
  
  // Forum categories (reference)
  forum_categories: dump.forum_categories?.map(c => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    icon: c.icon,
    order: c.order || 0,
    isPrivate: c.is_private || false,
  })) || [],
};

// Write import file (without binary data)
fs.writeFileSync(
  './convex_import_data.json',
  JSON.stringify(convexImport, null, 2)
);

console.log('\n✅ Created: convex_import_data.json');
console.log(`   - blog_posts: ${convexImport.blog_posts.length} records`);
console.log(`   - team_members: ${convexImport.team_members.length} records`);
console.log(`   - transactions: ${convexImport.transactions.length} records`);
console.log(`   - marketing_tiles: ${convexImport.marketing_tiles.length} records`);
console.log(`   - forum_categories: ${convexImport.forum_categories.length} records`);

console.log('\n' + '='.repeat(60));
console.log('NEXT STEPS');
console.log('='.repeat(60));
console.log(`
1. Add new tables to Convex schema.ts:
   - team_members
   - transactions
   - marketing_tiles

2. Create Convex import mutation

3. Run import: npx convex run import:all

4. Verify data in Convex dashboard
`);
