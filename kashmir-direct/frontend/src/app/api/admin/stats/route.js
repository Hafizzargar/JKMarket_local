import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 🏛️ SUPER ADMIN STATS API
 * Endpoint: /api/admin/stats
 * Purpose: Provides real-time global metrics for the administrative command center.
 */
export async function GET(request) {
  console.log('📡 [Admin Stats API]: GET Request Received');
  try {
    // 1. Parallel Metrics Aggregation
    const [products, sellers, profiles, orders] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('sellers').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('total_price')
    ]);

    // 2. Revenue Intelligence
    const totalRevenue = orders.data?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
    const formattedRevenue = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: totalRevenue > 100000 ? 'compact' : 'standard'
    }).format(totalRevenue);

    // 3. Status Extraction
    const { count: pendingCount } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('is_approved', false)
      .neq('status', 'rejected');

    return NextResponse.json({
      products: products.count || 0,
      sellers: sellers.count || 0,
      users: profiles.count || 0,
      pending: pendingCount || 0,
      revenue: formattedRevenue,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('🛡️ [Admin API Failure]:', error);
    return NextResponse.json({ error: 'Global Registry Sync Failed' }, { status: 500 });
  }
}
