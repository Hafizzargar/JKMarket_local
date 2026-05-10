'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardOverview() {
  const { user, profile, isAdmin } = useAuth();
  const router = useRouter();
  const [myStats, setMyStats] = useState({ Approved: 0, pending: 0, rejected: 0, earnings: '₹24.5k' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchStats();
    }
  }, [user, profile, isAdmin]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');
      
      if (!isAdmin) {
        const { data: sellerRecord } = await supabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (sellerRecord?.id) {
          query = query.or(`seller_id.eq.${sellerRecord.id},seller_id.eq.${user.id}`);
        } else {
          query = query.eq('seller_id', user.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        setMyStats({
          Approved: data.filter(p => p.is_approved).length || 0,
          pending: data.filter(p => !p.is_approved && p.status !== 'rejected').length || 0,
          rejected: data.filter(p => p.status === 'rejected').length || 0,
          earnings: '₹24.5k' 
        });
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-10">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div className="page-header">
             <h1 className="text-[18px] lg:text-[20px] font-black text-[#1B4332] uppercase tracking-tight">Dashboard Overview</h1>
             <p className="text-[12px] lg:text-[13px] font-medium text-[#1B4332]/50">Welcome back, {profile?.full_name || 'Artisan'} — your operational overview.</p>
          </div>
          
          <button 
             onClick={() => router.push('/inventory/new')}
             className="h-10 lg:h-12 px-6 bg-[#BC6C25] text-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg active:scale-95"
          >
             <Plus size={16} /> Add Product
          </button>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 lg:space-y-8">
          {/* 📊 STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: 'Live Listings', value: myStats.Approved, sub: 'Verified & active', dot: '#10B981', trend: '+2%' },
                { label: 'Pending', value: myStats.pending, sub: 'In review queue', dot: '#BC6C25' },
                { label: 'Returned', value: myStats.rejected, sub: 'Needs attention', dot: '#EF4444' },
                { label: 'Revenue', value: myStats.earnings, sub: 'Total earnings', dot: '#BC6C25', highlight: true, trend: '+12%' }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-[#1B4332]/10 p-4 lg:p-6 rounded-xl lg:rounded-2xl relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-lg shadow-sm">
                   <div className="absolute top-0 left-0 w-full h-1 bg-[#BC6C25]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="flex justify-between items-start mb-3 lg:mb-4">
                      <div className="flex items-center gap-2 text-[9px] lg:text-[10px] font-black uppercase tracking-wider text-[#1B4332]/50">
                         <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.dot }} />
                         <span className="hidden sm:block">{stat.label}</span>
                         <span className="sm:hidden">{stat.label.split(' ')[0]}</span>
                      </div>
                   </div>
                   <p className={`text-xl lg:text-2xl font-black mb-0.5 lg:mb-1 tracking-tight ${stat.highlight ? 'text-[#BC6C25]' : 'text-[#1B4332]'}`}>{stat.value}</p>
                   <p className="text-[10px] lg:text-[11px] font-medium text-[#1B4332]/30 italic truncate">{stat.sub}</p>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* 🏺 STORE STATUS NODE */}
             <div className="bg-white border border-[#1B4332]/10 p-5 lg:p-6 rounded-xl lg:rounded-2xl space-y-4 lg:space-y-6 shadow-sm">
                <div className="flex justify-between items-start">
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h3 className="text-[13px] lg:text-sm font-black uppercase tracking-wider text-[#1B4332]">Store Status</h3>
                         <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[8px] lg:text-[9px] font-black uppercase tracking-widest">✓ Verified</span>
                      </div>
                      <p className="text-[11px] lg:text-[12px] text-[#1B4332]/40 italic leading-relaxed">Your store is <b>fully active</b>.</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {[
                     { label: 'Plan', val: 'Premium', accent: true },
                     { label: 'Account', val: 'Active', color: '#10B981' }
                   ].map((l, i) => (
                     <div key={i} className="bg-[#FDFBF7] p-3 lg:p-4 rounded-xl border border-[#1B4332]/10">
                        <p className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 mb-1 lg:mb-1.5">{l.label}</p>
                        <p className={`text-sm lg:text-lg font-black ${l.accent ? 'text-[#BC6C25]' : 'text-[#1B4332]'}`} style={{ color: l.color }}>{l.val}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </motion.div>
    </div>
  );
}
