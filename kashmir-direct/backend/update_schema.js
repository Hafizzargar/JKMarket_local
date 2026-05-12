const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Hafiz78651234@db.hqfeugrebpumkukervqz.supabase.co:5432/postgres'
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // 1. Add columns to profiles
    // Wait, the schema file says 'users', but the frontend queries 'profiles'. 
    // Let's see if 'profiles' table exists.
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles';
    `);

    let targetTable = 'profiles';
    if (res.rows.length === 0) {
      console.log('profiles table not found, checking users...');
      const resUsers = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users';
      `);
      if (resUsers.rows.length > 0) {
        targetTable = 'users';
      } else {
        throw new Error('Neither profiles nor users table found');
      }
    }
    console.log(`Target table for user data: ${targetTable}`);

    // Add columns to the target table
    await client.query(`
      ALTER TABLE public.${targetTable}
      ADD COLUMN IF NOT EXISTS address TEXT,
      ADD COLUMN IF NOT EXISTS phone_primary TEXT,
      ADD COLUMN IF NOT EXISTS phone_secondary TEXT;
    `);
    console.log(`Added address/phone columns to ${targetTable}`);

    // 2. Add contact_phones and items to orders
    await client.query(`
      ALTER TABLE public.orders
      ADD COLUMN IF NOT EXISTS contact_phones TEXT,
      ADD COLUMN IF NOT EXISTS items JSONB;
    `);
    console.log('Added contact_phones and items columns to orders');

    // 3. Create order_items table just in case, though we will use JSONB for speed
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
          product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
          quantity INTEGER NOT NULL,
          price_at_time DECIMAL(12,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `);
    console.log('Created order_items table');

    console.log('Schema update complete.');
  } catch (e) {
    console.error('Error updating schema:', e);
  } finally {
    await client.end();
  }
}

run();
