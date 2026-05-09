'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  Package, LogOut, Home, ShieldOff, Zap, Layers, Activity,
  AlertCircle, Info, Target, ChevronLeft, ChevronRight as ChevronRightIcon,
  Bell, CheckCircle2, Clock, X, Plus, Edit2, Trash2, User, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import SellerProductForm from '../../components/ui/SellerProductForm';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProfileNode from '../../components/ui/ProfileNode';
import AuthGuard from '../../components/auth/AuthGuard';

function DashboardContent() {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'home';
  
  const [activeTab, setActiveTab] = useState(currentTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isForgeOpen, setIsForgeOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [myStats, setMyStats] = useState({ live: 0, pending: 0, rejected: 0, earnings: '₹24.5k' });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    // Legacy redirect removed - Handled by AuthGuard
  }, [user, loading, router]);

  useEffect(() => {
    // Only update state from URL if it actually changed
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  useEffect(() => {
    const controller = new AbortController();
    if (user && (profile?.role === 'seller' || profile?.role === 'shopkeeper' || isAdmin)) {
      fetchSellerData(controller.signal);
    }
    return () => controller.abort();
  }, [user, profile, activeTab, page, pageSize]);

  const fetchSellerData = async (signal) => {
    if (!user || (profile?.role !== 'seller' && profile?.role !== 'shopkeeper' && !isAdmin)) return;
    
    try {
      setIsDataLoading(true);
      
      const { data: sellerRecord } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (signal?.aborted) return;

      const sellerId = sellerRecord?.id;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      // 🛡️ ADMIN OVERRIDE: Admins see global data, others see their own
      if (!isAdmin) {
        if (sellerId) {
          query = query.or(`seller_id.eq.${sellerId},seller_id.eq.${user.id}`);
        } else {
          query = query.eq('seller_id', user.id);
        }
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)
        .abortSignal(signal);
      
      if (error) throw error;
      if (signal?.aborted) return;
      
      setMyProducts(data || []);
      setTotalProducts(count || 0);

      if (data) {
        setMyStats({
          live: data.filter(p => p.is_approved).length || 0,
          pending: data.filter(p => !p.is_approved && p.status !== 'rejected').length || 0,
          rejected: data.filter(p => p.status === 'rejected').length || 0,
          earnings: '₹24.5k' 
        });
      }
    } catch (err) { 
      const isAbort = err.name === 'AbortError' || err.message?.includes('aborted') || err.message?.includes('AbortError');
      if (!isAbort) {
        console.error('Vault Fetch Critical Error:', {
          message: err.message,
          code: err.code,
          details: err.details,
          hint: err.hint,
          full: err
        });
      }
    } finally { 
      if (!signal?.aborted) setIsDataLoading(false);
    }
  };

  const changeTab = (tabId) => {
    // We only update the URL. The useEffect on currentTab will handle the state update.
    router.push(`/dashboard?tab=${tabId}`, { scroll: false });
  };

  const handleDelete = (productId) => {
    setProductToDelete(productId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productToDelete);
      if (error) throw error;
      toast.success('Listing Purged');
      fetchSellerData();
    } catch (err) { toast.error('Purge Failed'); }
    setProductToDelete(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsForgeOpen(true);
  };

  useEffect(() => {
    if (!loading && profile) {
      if (profile.role === 'customer' || profile.role === 'buyer') {
        router.replace('/products');
      }
    }
  }, [profile, loading, router]);

  if (loading || !user || !profile) return (
    <div className="min-h-screen bg-[#0D1110] flex items-center justify-center">
       <div className="w-12 h-12 border-2 border-[#BC6C25]/20 border-t-[#BC6C25] rounded-full animate-spin" />
    </div>
  );

  if (profile.role === 'customer' || profile.role === 'buyer') {
    return null;
  }

  if (profile.role === 'seller' || profile.role === 'shopkeeper') {
    const isExpired = profile?.seller?.subscription_expires_at && new Date(profile.seller.subscription_expires_at) < new Date();
    
    if (isExpired) return (
      <div className="min-h-screen bg-[#0D1110] flex items-center justify-center p-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#BC6C2515_0%,_transparent_40%)]" />
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 bg-[#141A18] w-full max-w-lg rounded-[2rem] p-12 text-center border border-white/5 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6"><ShieldOff size={24} className="text-rose-500" /></div>
            <h1 className="text-lg font-black text-white tracking-widest uppercase italic text-center">Session Locked</h1>
            <div className="space-y-3 mt-8">
               <Button className="w-full h-14 rounded-xl bg-[#BC6C25] text-white font-black tracking-widest text-[9px] uppercase shadow-lg">RENEW PARTITION</Button>
               <button onClick={signOut} className="w-full text-white/20 text-[8px] font-black uppercase tracking-[0.3em] py-4 hover:text-white transition-colors">Sign Out</button>
            </div>
         </motion.div>
      </div>
    );

    return (
      <div className="min-h-screen bg-[var(--studio-bg)] flex font-['Inter',_sans-serif] text-[var(--studio-text)] overflow-hidden relative">
        {/* 🎭 AMBIENT BACKDROP */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
           <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[var(--studio-orange-glow)] blur-[150px] rounded-full" />
        </div>
        <div className="noise-overlay" />

        {/* 🏛️ STUDIO SIDEBAR */}
        <aside className={`${isSidebarOpen ? 'w-[260px]' : 'w-20'} bg-[var(--studio-surface)] border-r border-[var(--studio-border)] flex flex-col transition-all duration-300 z-50 relative h-screen sticky top-0 shrink-0`}>
           {/* 🏹 TACTICAL TOGGLE */}
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-[var(--studio-surface2)] border border-[var(--studio-border)] text-white flex items-center justify-center shadow-2xl hover:border-[var(--studio-orange)] transition-all z-[60]"
           >
              {isSidebarOpen ? <ChevronLeft size={10} /> : <ChevronRightIcon size={10} />}
           </button>

           {/* 🏺 STUDIO BRANDING */}
           <div className={`p-5 flex items-center gap-3.5 border-b border-[var(--studio-border)] ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-[var(--studio-orange)] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(232,124,42,0.2)]">
                 <Zap size={20} className="text-white fill-white" />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col">
                   <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[var(--studio-text)] leading-none mb-1">Studio</span>
                   <span className="text-[10px] font-medium text-[var(--studio-muted)] tracking-wide">Kashmir Jammu</span>
                </div>
              )}
           </div>

           {/* 🧭 NAVIGATION HUB */}
           <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-4">
              {/* ⚡ TACTICAL COMMANDS */}
              {isSidebarOpen ? (
                <div className="px-4 mb-6 space-y-2">
                   {(isAdmin || user?.email?.trim().toLowerCase() === 'hafezzargar987@gmail.com') && (
                     <button 
                        onClick={() => router.push('/admin/dashboard')}
                        className="w-full h-11 bg-[var(--studio-orange)] text-white rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-wider hover:bg-[var(--studio-orange-dim)] transition-all shadow-lg"
                     >
                        <ShieldCheck size={16} /> Admin
                     </button>
                   )}
                   <button 
                      onClick={() => setIsForgeOpen(true)}
                      className="w-full h-11 bg-transparent text-[var(--studio-orange)] rounded-xl flex items-center justify-center gap-2 text-[12px] font-black tracking-wide border-1.5 border-[var(--studio-orange)]/40 hover:bg-[var(--studio-orange-glow)] hover:border-[var(--studio-orange)] transition-all"
                   >
                      <Plus size={16} /> Forge
                   </button>
                </div>
              ) : (
                <div className="px-2 mb-6 flex flex-col items-center gap-3">
                   {(isAdmin || user?.email?.trim().toLowerCase() === 'hafezzargar987@gmail.com') && (
                     <button onClick={() => router.push('/admin/dashboard')} className="w-10 h-10 bg-[var(--studio-orange)] text-white rounded-xl flex items-center justify-center shadow-lg" title="Admin">
                        <ShieldCheck size={18} />
                     </button>
                   )}
                   <button onClick={() => setIsForgeOpen(true)} className="w-10 h-10 border-1.5 border-[var(--studio-orange)]/40 text-[var(--studio-orange)] rounded-xl flex items-center justify-center hover:bg-[var(--studio-orange-glow)]" title="Forge">
                      <Plus size={18} />
                   </button>
                </div>
              )}

              <nav className="px-3 space-y-6">
                 <div>
                    {isSidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--studio-muted)] px-3 mb-2">Workspace</p>}
                    <div className="space-y-1">
                       {[
                         { id: 'home', label: 'Dashboard', icon: Home },
                         { id: 'inventory', label: 'Vault', icon: Package },
                         { id: 'profile', label: 'Identity', icon: User },
                       ].map((tab) => (
                         <button 
                           key={tab.id}
                           onClick={() => changeTab(tab.id)}
                           className={`w-full flex items-center gap-3.5 rounded-xl transition-all border ${activeTab === tab.id ? 'bg-[var(--studio-orange-glow)] text-[var(--studio-orange)] border-[var(--studio-orange)]/20' : 'bg-transparent border-transparent text-[var(--studio-muted)] hover:bg-[var(--studio-surface2)] hover:text-[var(--studio-text)]'} ${isSidebarOpen ? 'px-3.5 py-2.5' : 'h-11 justify-center'}`}
                           title={!isSidebarOpen ? tab.label : ''}
                         >
                           <tab.icon size={18} className="shrink-0" />
                           {isSidebarOpen && <span className="text-[12px] font-bold">{tab.label}</span>}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    {isSidebarOpen && <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--studio-muted)] px-3 mb-2">Management</p>}
                    <div className="space-y-1">
                       {[
                         { id: 'products', label: 'Products', icon: Layers },
                         { id: 'orders', label: 'Orders', icon: Clock },
                         { id: 'analytics', label: 'Analytics', icon: Activity },
                       ].map((tab) => (
                         <button 
                           key={tab.id}
                           className={`w-full flex items-center gap-3.5 rounded-xl bg-transparent border border-transparent text-[var(--studio-muted)] hover:bg-[var(--studio-surface2)] hover:text-[var(--studio-text)] transition-all ${isSidebarOpen ? 'px-3.5 py-2.5' : 'h-11 justify-center'}`}
                           title={!isSidebarOpen ? tab.label : ''}
                         >
                           <tab.icon size={18} className="shrink-0" />
                           {isSidebarOpen && <span className="text-[12px] font-bold">{tab.label}</span>}
                         </button>
                       ))}
                    </div>
                 </div>
              </nav>
           </div>

           {/* 🚪 LOGOUT ZONE */}
           <div className="p-3 border-t border-[var(--studio-border)]">
              <button 
                 onClick={signOut}
                 className={`flex items-center gap-3.5 rounded-xl transition-all bg-transparent border border-[var(--studio-red)]/15 text-[var(--studio-red)] hover:bg-[var(--studio-red)]/5 ${isSidebarOpen ? 'w-full px-3.5 py-2.5' : 'w-11 h-11 mx-auto justify-center'}`}
                 title={!isSidebarOpen ? 'Sign Out' : ''}
              >
                 <LogOut size={18} className="shrink-0" /> 
                 {isSidebarOpen && <span className="text-[12px] font-bold">Sign Out</span>}
              </button>
           </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto relative z-10 flex flex-col">
           {/* ☁️ STUDIO TOPBAR */}
           <header className="h-16 bg-[var(--studio-surface)] border-b border-[var(--studio-border)] flex items-center justify-between px-8 shrink-0 relative z-40">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-[var(--studio-green)] rounded-full animate-pulse shadow-[0_0_10px_var(--studio-green)]" />
                 <h2 className="text-[12px] font-black tracking-[0.15em] uppercase text-[var(--studio-muted)] italic">Home Active</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 bg-[var(--studio-surface2)] rounded-xl border border-[var(--studio-border)] group cursor-pointer hover:border-[var(--studio-orange)]/30 transition-all">
                    <Bell size={16} className="text-[var(--studio-muted)] group-hover:text-[var(--studio-orange)]" />
                    <span className="text-[12px] font-semibold text-[var(--studio-muted)] hidden md:block">System Logs</span>
                 </div>
                 <div className="flex items-center gap-3 bg-[var(--studio-surface2)] border border-[var(--studio-border)] rounded-full pl-1.5 pr-4 py-1.5 group cursor-pointer hover:border-[var(--studio-orange)]/30 transition-all">
                    <div className="w-8 h-8 bg-[var(--studio-orange)] rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                       {profile?.full_name?.[0] || 'A'}
                    </div>
                    <div className="hidden sm:block">
                       <p className="text-[10px] font-black uppercase tracking-wider text-[var(--studio-orange)] leading-none mb-1">Master Access</p>
                       <p className="text-[12px] font-bold text-[var(--studio-text)] leading-none">{profile?.full_name || 'Super Admin'}</p>
                    </div>
                 </div>
              </div>
           </header>

           <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
             <div className="max-w-6xl mx-auto space-y-10">
                <div className="page-header">
                   <h1 className="text-[22px] font-bold text-[var(--studio-text)] mb-1">Dashboard Overview</h1>
                   <p className="text-[13px] text-[var(--studio-muted)]">Welcome back, {profile?.full_name || 'Super Admin'} — here's what's happening in your studio today.</p>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'home' && (
                    <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                       {/* 📊 STUDIO STATS */}
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Live Listings', value: myStats.live, sub: 'No active listings yet', dot: 'var(--studio-green)' },
                            { label: 'Pending', value: myStats.pending, sub: 'Awaiting approval', dot: 'var(--studio-orange)' },
                            { label: 'Returned', value: myStats.rejected, sub: 'Return requests', dot: 'var(--studio-red)' },
                            { label: 'Total Sales', value: myStats.earnings, sub: 'Active Growth', dot: 'var(--studio-orange)', highlight: true }
                          ].map((stat, i) => (
                            <div key={i} className="bg-[var(--studio-surface)] border border-[var(--studio-border)] p-6 rounded-2xl relative overflow-hidden group transition-all hover:border-[var(--studio-orange)]/25">
                               <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--studio-orange)] opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest text-[var(--studio-muted)] mb-3">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.dot }} />
                                  {stat.label}
                               </div>
                               <p className={`text-3xl font-black mb-2 ${stat.highlight ? 'text-[var(--studio-orange)]' : 'text-[var(--studio-text)]'}`}>{stat.value}</p>
                               <p className="text-[12px] text-[var(--studio-muted)]">{stat.sub}</p>
                            </div>
                          ))}
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* 🏺 LICENSE NODE */}
                          <div className="bg-[var(--studio-surface)] border border-[var(--studio-border)] p-8 rounded-2xl space-y-8">
                             <div className="flex justify-between items-start">
                                <div>
                                   <div className="flex items-center gap-3 mb-1">
                                      <h3 className="text-base font-black uppercase tracking-wider text-[var(--studio-text)]">Studio License</h3>
                                      <span className="px-3 py-1 bg-[var(--studio-green)]/10 text-[var(--studio-green)] border border-[var(--studio-green)]/30 rounded-full text-[10px] font-black uppercase tracking-widest">✓ Verified</span>
                                   </div>
                                   <p className="text-[12px] text-[var(--studio-muted)] italic leading-relaxed">Artisan node operational on <b>VIP Tier</b>.</p>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 gap-3">
                                {[
                                  { label: 'Slots Used', val: `${totalProducts} / ${profile?.seller?.product_limit || 5}`, accent: true },
                                  { label: 'Cycle Reset', val: new Date(profile?.seller?.subscription_expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
                                  { label: 'Tier', val: 'VIP', accent: true },
                                  { label: 'Status', val: '● Operational', color: 'var(--studio-green)' }
                                ].map((l, i) => (
                                  <div key={i} className="bg-[var(--studio-surface2)] p-4 rounded-xl">
                                     <p className="text-[10px] font-black uppercase tracking-widest text-[var(--studio-muted)] mb-1.5">{l.label}</p>
                                     <p className={`text-xl font-black ${l.accent ? 'text-[var(--studio-orange)]' : 'text-[var(--studio-text)]'}`} style={{ color: l.color }}>{l.val}</p>
                                  </div>
                                ))}
                             </div>

                             <div className="space-y-2.5">
                                <div className="flex justify-between text-[12px] font-bold text-[var(--studio-muted)]">
                                   <span>Slot capacity</span>
                                   <span>{Math.round((totalProducts / (profile?.seller?.product_limit || 5)) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-[var(--studio-surface3)] rounded-full overflow-hidden">
                                   <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${(totalProducts / (profile?.seller?.product_limit || 5)) * 100}%` }} 
                                      className="h-full bg-[var(--studio-orange)]" 
                                   />
                                </div>
                             </div>
                          </div>

                          {/* 🛍️ RECENT ACTIVITY */}
                          <div className="bg-[var(--studio-surface)] border border-[var(--studio-border)] p-8 rounded-2xl flex flex-col">
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--studio-text)]">Recent Activity</h3>
                                <button className="text-[12px] font-bold text-[var(--studio-orange)] hover:underline">View all →</button>
                             </div>
                             <div className="flex-1 space-y-1">
                                {[
                                  { icon: '🛍️', title: 'New order received', time: 'Just now', status: 'New', color: 'text-[#3498DB]', bg: 'bg-[#3498DB]/10' },
                                  { icon: '✅', title: 'License verified', time: '2 hours ago', status: 'Done', color: 'text-[var(--studio-green)]', bg: 'bg-[var(--studio-green)]/10' },
                                  { icon: '📦', title: 'Product pending review', time: 'Yesterday', status: 'Pending', color: 'text-[var(--studio-orange)]', bg: 'bg-[var(--studio-orange)]/10' }
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-4 py-3.5 border-b border-[var(--studio-border)] last:border-0 group cursor-pointer hover:bg-white/[0.01] px-2 rounded-lg transition-all">
                                     <div className="w-10 h-10 bg-[var(--studio-surface2)] rounded-xl flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-[var(--studio-text)] truncate">{item.title}</p>
                                        <p className="text-[11px] text-[var(--studio-muted)]">{item.time}</p>
                                     </div>
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.color} ${item.bg}`}>
                                        {item.status}
                                     </span>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
                  {activeTab === 'inventory' && (
                    <motion.div key="inventory" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-[var(--studio-surface)] rounded-2xl border border-[var(--studio-border)] overflow-hidden shadow-2xl">
                       <DataTable 
                         key={`vault-${myProducts.length}-${page}-${isDataLoading}`}
                         title="Artisan Vault"
                         data={myProducts}
                         isLoading={isDataLoading}
                         totalCount={totalProducts}
                         currentPage={page}
                         pageSize={pageSize}
                         onPageChange={(p) => setPage(p)}
                         onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
                         columns={[
                           {
                             header: 'Listing Reference',
                             render: (p) => (
                               <div className="flex items-center gap-5">
                                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--studio-border)] bg-black/40">
                                     <img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-[var(--studio-text)] tracking-tight">{p.title}</p>
                                     <p className="text-[10px] font-bold text-[var(--studio-muted)] uppercase tracking-widest mt-1">{p.category}</p>
                                  </div>
                               </div>
                             )
                           },
                           { 
                             header: 'Valuation', 
                             render: (p) => (
                               <div className="flex flex-col">
                                  <span className="text-[var(--studio-orange)] font-black">₹{p.price}</span>
                                  <span className="text-[10px] text-[var(--studio-muted)] uppercase italic">per {p.weight_value}{p.weight_unit}</span>
                               </div>
                             )
                           },
                           {
                             header: 'Status Node',
                             render: (p) => (
                               <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${p.is_approved ? 'bg-[var(--studio-green)]/5 border-[var(--studio-green)]/10 text-[var(--studio-green)]' : p.status === 'rejected' ? 'bg-[var(--studio-red)]/5 border-[var(--studio-red)]/10 text-[var(--studio-red)]' : 'bg-[var(--studio-orange)]/5 border-[var(--studio-orange)]/10 text-[var(--studio-orange)]'}`}>
                                  {p.is_approved ? 'Live' : p.status === 'rejected' ? 'Returned' : 'Queued'}
                               </div>
                             )
                           }
                         ]}
                         actions={[
                           { icon: Edit2, onClick: (p) => handleEdit(p) },
                           { icon: Trash2, variant: 'danger', onClick: (p) => handleDelete(p.id) }
                         ]}
                       />
                    </motion.div>
                  )}
                  {activeTab === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                       <ProfileNode />
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
           </div>
        </main>

        <Modal 
          isOpen={isForgeOpen} 
          onClose={() => { 
            setIsForgeOpen(false); 
            setEditingProduct(null); 
            // 🛡️ SETTLEMENT BUFFER: Give the DB 500ms to commit before re-fetching
            setTimeout(() => fetchSellerData(), 500); 
          }} 
          title={editingProduct ? "Edit Product Forge" : "New Product Forge"}
        >
           <SellerProductForm 
             initialData={editingProduct}
             onClose={() => { 
               setIsForgeOpen(false); 
               setEditingProduct(null); 
               setTimeout(() => fetchSellerData(), 500); 
             }} 
           />
        </Modal>

        <ConfirmDialog 
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setProductToDelete(null); }}
          onConfirm={confirmDelete}
          title="Product Purge Node"
          message="You are about to permanently purge this listing from the Artisan Vault. This action is irreversible and will update your validation slot immediately."
          confirmText="Confirm Purge"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center p-12 text-center">
       <h1 className="text-3xl font-black text-[#1B4332] tracking-tighter uppercase italic">Bazaar Node</h1>
       <Button onClick={() => router.push('/')} className="mt-8 bg-[#BC6C25] rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[9px]">Enter</Button>
    </div>
  );
}

export default function UnifiedDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D1110] flex items-center justify-center text-[#BC6C25] font-black uppercase tracking-widest text-xs">Accessing Node...</div>}>
      <AuthGuard allowedRoles={['seller', 'shopkeeper', 'admin', 'superadmin']}>
        <DashboardContent />
      </AuthGuard>
    </Suspense>
  );
}
