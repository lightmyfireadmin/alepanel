// Neon Database Analyzer and Migration Script
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_8BFvsyeuP0CO@ep-fancy-rice-ag8i6qv2-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require',
});

async function analyzeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('='.repeat(60));
    console.log('NEON DATABASE ANALYSIS');
    console.log('='.repeat(60));
    
    // 1. List all tables
    console.log('\n📋 TABLES:\n');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    const tables = tablesResult.rows.map(r => r.table_name);
    tables.forEach(t => console.log(`  - ${t}`));
    
    // 2. For each table, get schema and row count
    console.log('\n📊 TABLE DETAILS:\n');
    
    for (const tableName of tables) {
      console.log(`\n${'─'.repeat(50)}`);
      console.log(`📁 ${tableName.toUpperCase()}`);
      console.log(`${'─'.repeat(50)}`);
      
      // Get row count
      const countResult = await client.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
      console.log(`   Rows: ${countResult.rows[0].count}`);
      
      // Get columns
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `, [tableName]);
      
      console.log('   Columns:');
      columnsResult.rows.forEach(col => {
        console.log(`     - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
      });
      
      // Get sample data (first 3 rows)
      console.log('   Sample Data:');
      const sampleResult = await client.query(`SELECT * FROM "${tableName}" LIMIT 3`);
      sampleResult.rows.forEach((row, i) => {
        console.log(`     [${i + 1}] ${JSON.stringify(row).substring(0, 200)}...`);
      });
    }
    
    // 3. Generate JSON dump
    console.log('\n\n' + '='.repeat(60));
    console.log('GENERATING JSON DUMP');
    console.log('='.repeat(60));
    
    const dump = {};
    for (const tableName of tables) {
      const dataResult = await client.query(`SELECT * FROM "${tableName}"`);
      dump[tableName] = dataResult.rows;
      console.log(`   ✓ ${tableName}: ${dataResult.rows.length} records`);
    }
    
    // Write to file
    const fs = require('fs');
    const dumpPath = './neon_marketing_dump.json';
    fs.writeFileSync(dumpPath, JSON.stringify(dump, null, 2));
    console.log(`\n✅ Dump saved to: ${dumpPath}`);
    
    return dump;
    
  } finally {
    client.release();
    await pool.end();
  }
}

analyzeDatabase().catch(console.error);
