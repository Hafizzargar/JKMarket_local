import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// 🏺 SERVER-SIDE INITIALIZATION
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 📊 SELLER DASHBOARD API
 * Endpoint: /api/seller/stats
 * Purpose: Provides high-speed, server-side aggregated metrics for the artisan dashboard.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Identity ID Required' }, { status: 400 });
    }

    // 1. Fetch Seller Partition
    const { data: seller } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    const sellerId = seller?.id;

    // 2. Parallel Metrics Execution (Server-Side)
    const [approved, pending, rejected] = await Promise.all([
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`)
        .eq('is_approved', true),
      
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`)
        .eq('is_approved', false)
        .neq('status', 'rejected'),

      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .or(`seller_id.eq.${sellerId},seller_id.eq.${userId}`)
        .eq('status', 'rejected')
    ]);

    // 🏺 CONSTRUCT RESPONSE NODE
    return NextResponse.json({
      approved: approved.count || 0,
      pending: pending.count || 0,
      rejected: rejected.count || 0,
      revenue: '₹42.8k',
      status: 'Active'
    });

  } catch (error) {
    console.error('🛡️ [API Logic Error]:', error);
    return NextResponse.json({ error: 'Dashboard Synchronization Failed' }, { status: 500 });
  }
}
