import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 🏛️ ADMIN DATA REGISTRY API
 * Endpoint: /api/admin/data
 * Purpose: Streams specialized dataset chunks for specific admin tabs.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'products';

    let data, error;

    switch (type) {
      case 'products':
        ({ data, error } = await supabase
          .from('products')
          .select('*, sellers(shop_name, profiles(full_name, email))')
          .order('created_at', { ascending: false }));
        break;
      
      case 'artisans':
        ({ data, error } = await supabase
          .from('sellers')
          .select('*, profiles!inner(*)')
          .order('created_at', { ascending: false }));
        break;

      case 'users':
        ({ data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }));
        break;

      default:
        return NextResponse.json({ error: 'Invalid Registry Type' }, { status: 400 });
    }

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error) {
    console.error('🛡️ [Data Registry Failure]:', error);
    return NextResponse.json({ error: 'Registry Stream Failed' }, { status: 500 });
  }
}
