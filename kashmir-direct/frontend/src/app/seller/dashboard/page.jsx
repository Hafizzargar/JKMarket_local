'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { SellerService } from '@/services/SellerService';
import { Plus, BarChart3, Activity, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { Activity as ActivityIcon, Clock, AlertCircle, Bell, Zap as ZapIcon, ShoppingCart } from 'lucide-react';

export default function SellerDashboard() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [myStats, setMyStats] = useState({ approved: 0, pending: 0, rejected: 0, earnings: '₹0' });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const hasFetched = useRef(false);

  useEffect(() => {
    if (user && !hasFetched.current) {
      loadStats();
      loadNotifications();
      hasFetched.current = true;
    }
  }, [user]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // 🛡️ FETCHING FROM DEDICATED SERVER API
      const response = await fetch(`/api/seller/stats?userId=${user.id}`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setMyStats({
        approved: data.approved,
        pending: data.pending,
        rejected: data.rejected,
        earnings: data.revenue
      });
    } catch (err) {
      console.error('Stats fetch error:', err);
      toast.error('Dashboard API Offline');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (!error) setNotifications(data);
  };

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div className="space-y-10 pb-20">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="page-header">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40">Status</span>
             </div>
             <h1 className="text-4xl font-black text-[#1B4332] tracking-tighter leading-none">Sales <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Summary</span></h1>
             <p className="text-[12px] font-medium text-[#1B4332]/40 italic mt-2">Welcome back, {profile?.full_name?.split(' ')[0] || 'Seller'}.</p>
          </div>
          
          <button 
             onClick={() => router.push('/seller/add-product')}
             className="h-14 px-8 bg-[#BC6C25] text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-[#BC6C25]/20 active:scale-95 transition-all"
          >
             <Plus size={20} /> New Product
          </button>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* 📊 RAPID STATS NODES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'My Products', value: myStats.approved, sub: 'Active', color: '#10B981', icon: ActivityIcon },
                { label: 'Pending Review', value: myStats.pending, sub: 'Checking', color: '#BC6C25', icon: Clock },
                { label: 'Needs Action', value: myStats.rejected, sub: 'Issues', color: '#EF4444', icon: AlertCircle },
                { label: 'Total Earnings', value: myStats.earnings, sub: 'Successful Sales', color: '#1B4332', highlight: true, icon: BarChart3 }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-[#1B4332]/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-500 shadow-sm">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-[#BC6C25]/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1B4332]/20 mb-4">{stat.label}</p>
                   <p className={`text-4xl font-black mb-2 tracking-tighter ${stat.highlight ? 'text-[#BC6C25]' : 'text-[#1B4332]'}`}>
                    {loading ? '...' : stat.value}
                   </p>
                   <p className="text-[10px] font-bold text-[#1B4332]/40 italic">{stat.sub}</p>
                </div>
              ))}
          </div>

          {/* 🏛️ STORE STATUS & QUICK ACTIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-7 bg-white border border-[#1B4332]/10 p-10 rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                        <ZapIcon size={24} className="fill-emerald-600" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black uppercase tracking-[0.1em] text-[#1B4332]">Account Status: Active</h3>
                         <p className="text-xs text-[#1B4332]/40 font-medium">Your account is connected and live.</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                   <button onClick={() => router.push('/seller/inventory')} className="p-6 rounded-[1.5rem] bg-[#1B4332]/5 border border-[#1B4332]/5 text-left group hover:bg-[#1B4332] transition-all">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/30 group-hover:text-white/40 mb-2">My Shop</p>
                      <p className="text-sm font-black text-[#1B4332] group-hover:text-white">My Products</p>
                   </button>
                   <button onClick={() => router.push('/seller/inbound')} className="p-6 rounded-[1.5rem] bg-[#BC6C25]/5 border border-[#BC6C25]/5 text-left group hover:bg-[#BC6C25] transition-all">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#BC6C25]/30 group-hover:text-white/40 mb-2">Inbound Requests</p>
                      <p className="text-sm font-black text-[#BC6C25] group-hover:text-white">Inbound Orders</p>
                   </button>
                </div>
             </div>

             {/* 🔔 NOTIFICATIONS FEED */}
             <div className="lg:col-span-5 space-y-6">
                <div className="bg-white border border-[#1B4332]/10 p-8 rounded-[3rem] shadow-sm flex flex-col h-full">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#1B4332]">Sovereign Alerts</h3>
                      {notifications.some(n => !n.is_read) && (
                        <div className="w-2 h-2 bg-[#BC6C25] rounded-full" />
                      )}
                   </div>

                   <div className="space-y-4 flex-grow overflow-y-auto no-scrollbar max-h-[250px]">
                      {notifications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2 opacity-20">
                           <Bell size={24} />
                           <p className="text-[10px] font-bold uppercase tracking-widest">No Alerts</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => markAsRead(n.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                              n.is_read 
                                ? 'bg-[#FDFBF7] border-transparent opacity-60' 
                                : 'bg-white border-[#BC6C25]/20 shadow-sm'
                            }`}
                          >
                            <h4 className="text-[10px] font-black text-[#1B4332] uppercase">{n.title}</h4>
                            <p className="text-[9px] font-bold text-[#1B4332]/50 uppercase tracking-tighter mt-1 leading-tight">{n.message}</p>
                            <p className="text-[7px] font-black text-[#BC6C25] uppercase mt-2 opacity-60">{new Date(n.created_at).toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                   </div>
                   
                   <button 
                     onClick={() => router.push('/seller/inbound')}
                     className="w-full py-4 mt-6 bg-[#1B4332]/5 text-[#1B4332] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#1B4332] hover:text-white transition-all"
                   >
                      View Inbound Requests
                   </button>
                </div>
             </div>
          </div>
       </motion.div>
    </div>
  );
}
