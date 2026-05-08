import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [Supabase] Missing credentials! Check your .env.local file.');
} else {
  try {
    const host = new URL(supabaseUrl).hostname;
    console.log(`🌐 [Supabase] Connected to: ${host}`);
  } catch (e) {
    console.error('❌ [Supabase] Invalid URL format in .env.local');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Recommended for modern web apps
  },
  global: {
    headers: { 'x-application-name': 'kashmir-direct-b2b' },
  }
});
