import { neon } from '@neondatabase/serverless';
import fs from 'fs';

const connectionString = 'postgresql://neondb_owner:npg_kBrW6MZ4UtFX@ep-purple-butterfly-avk014lq-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(connectionString);

async function setup() {
  console.log("Connecting to Neon Postgres...");
  
  // 1. Create tables
  await sql`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      package_id TEXT,
      start_date TEXT,
      end_date TEXT,
      total_visits INTEGER DEFAULT 0,
      history_count INTEGER DEFAULT 1,
      last_visit TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ Table members created");

  await sql`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      member_name TEXT NOT NULL,
      type TEXT,
      description TEXT,
      date TEXT,
      amount NUMERIC DEFAULT 0,
      payment_method TEXT,
      previous_end_date TEXT,
      previous_start_date TEXT,
      previous_package_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ Table transactions created");

  await sql`
    CREATE TABLE IF NOT EXISTS attendance_logs (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      member_name TEXT NOT NULL,
      phone TEXT,
      date TEXT,
      time TEXT,
      status_at_check_in TEXT,
      visit_number INTEGER DEFAULT 1,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ Table attendance_logs created");

  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      date TEXT,
      description TEXT,
      amount NUMERIC DEFAULT 0,
      payment_method TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ Table expenses created");

  await sql`
    CREATE TABLE IF NOT EXISTS daily_visitors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      date TEXT,
      amount_paid NUMERIC DEFAULT 35000,
      payment_method TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  console.log("✓ Table daily_visitors created");

  // 2. Check existing member count
  const countRes = await sql`SELECT count(*)::int AS cnt FROM members`;
  console.log("Current members count in Neon:", countRes[0].cnt);

  if (countRes[0].cnt === 0) {
    const raw = fs.readFileSync('src/extracted_members.json', 'utf-8');
    const members = JSON.parse(raw);
    console.log(`Seeding ${members.length} members into Neon...`);

    const chunkSize = 150;
    for (let i = 0; i < members.length; i += chunkSize) {
      const chunk = members.slice(i, i + chunkSize);
      
      // Bulk insert chunk
      for (const m of chunk) {
        await sql`
          INSERT INTO members (id, name, phone, package_id, start_date, end_date, total_visits, history_count, last_visit)
          VALUES (${m.id}, ${m.name}, ${m.phone || '-'}, ${m.packageId || 'pkg-1'}, ${m.startDate || '2026-08-31'}, ${m.endDate || '2026-09-30'}, ${m.totalVisits || 0}, ${m.historyCount || 1}, ${m.lastVisit || null})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log(`Seeded ${Math.min(i + chunkSize, members.length)} / ${members.length} members.`);
    }
    console.log("ALL MEMBERS SUCCESSFULLY SEEDED TO NEON POSTGRES!");
  }
}

setup().catch(err => {
  console.error("Setup error:", err);
});
