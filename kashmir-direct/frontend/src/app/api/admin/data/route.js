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
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 5;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let data, error, count;

    switch (type) {
      case 'products':
        let prodQuery = supabase
          .from('products')
          .select('*, sellers(shop_name, profiles(full_name, email))', { count: 'exact' });

        const statusFilter = searchParams.get('status');
        if (statusFilter && statusFilter !== 'all') {
          // Alignment: 'active' in UI maps to 'approved' in DB
          const dbStatus = statusFilter === 'active' ? 'approved' : statusFilter;
          prodQuery = prodQuery.eq('status', dbStatus);
        }

        ({ data, error, count } = await prodQuery
          .order('created_at', { ascending: false })
          .range(from, to));
        break;
      
      case 'artisans':
        ({ data, error, count } = await supabase
          .from('sellers')
          .select('*, profiles!inner(*)', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to));
        break;

      case 'buyers':
        ({ data, error, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'customer')
          .order('created_at', { ascending: false })
          .range(from, to));
        break;

      case 'orders':
        ({ data, error, count } = await supabase
          .from('orders')
          .select('*, profiles(full_name, email)', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to));
        break;

      case 'managers':
        ({ data, error, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .ilike('role', '%Manager%')
          .order('created_at', { ascending: false })
          .range(from, to));
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
    return NextResponse.json({ data, total: count });

  } catch (error) {
    console.error('🛡️ [Data Registry Failure]:', error);
    return NextResponse.json({ error: 'Registry Stream Failed' }, { status: 500 });
  }
}
export async function POST(request) {
  try {
    const payload = await request.json();
    const { full_name, email, password, role } = payload;

    // 1. 🛡️ RECRUIT USER IN AUTH REGISTRY
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, role }
    });

    if (authError) throw authError;

    // 2. 🏛️ FINALIZE IDENTITY IN PROFILES
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name, role })
      .eq('id', authData.user.id);

    if (profileError) {
      // Cleanup auth if profile update fails (Optional but safer)
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return NextResponse.json({ success: true, user: authData.user });

  } catch (error) {
    console.error('🛡️ [Manager Recruitment Failure]:', error);
    return NextResponse.json({ error: error.message || 'Recruitment Failed' }, { status: 500 });
  }
}
