import postgres from 'postgres';
const sql = postgres('postgres://postgres.yvfxqrmjttddmhljigms:testpassword123!!@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres');
await sql`NOTIFY pgrst, 'reload schema'`;
console.log('Reloaded schema successfully');
process.exit(0);
