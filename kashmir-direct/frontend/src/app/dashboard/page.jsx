'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  Package, LogOut, Home, ShieldOff, Zap, Layers, Activity,
  AlertCircle, Info, Target, ChevronLeft, ChevronRight as ChevronRightIcon,
  Bell, CheckCircle2, Clock, X, Plus, Edit2, Trash2, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import SellerProductForm from '../../components/ui/SellerProductForm';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import ProfileNode from '../../components/ui/ProfileNode';

function DashboardContent() {
  const { user, profile, loading, signOut } = useAuth();
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
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    // Only update state from URL if it actually changed
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab]);

  useEffect(() => {
    const controller = new AbortController();
    if (user && profile?.role === 'seller') {
      fetchSellerData(controller.signal);
    }
    return () => controller.abort();
  }, [user, profile, activeTab, page, pageSize]);

  const fetchSellerData = async (signal) => {
    if (!user || profile?.role !== 'seller') return;
    
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

      if (sellerId) {
        query = query.or(`seller_id.eq.${sellerId},seller_id.eq.${user.id}`);
      } else {
        query = query.eq('seller_id', user.id);
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

  if (loading || !user || !profile) return (
    <div className="min-h-screen bg-[#0D1110] flex items-center justify-center">
       <div className="w-12 h-12 border-2 border-[#BC6C25]/20 border-t-[#BC6C25] rounded-full animate-spin" />
    </div>
  );

  if (profile.role === 'seller') {
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
      <div className="min-h-screen bg-[#0D1110] flex font-sans text-white/80 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
           <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#BC6C25]/10 blur-[120px] rounded-full" />
        </div>

        {/* 🏔️ MICRO SIDEBAR (240px) */}
        <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#141A18] border-r border-white/5 flex flex-col transition-all duration-300 z-50 relative h-screen sticky top-0`}>
           {/* 🏹 TACTICAL TOGGLE */}
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="absolute -right-3 top-10 w-6 h-6 rounded-full bg-[#1C2321] border border-white/10 text-white flex items-center justify-center shadow-2xl hover:bg-[#BC6C25] hover:border-[#BC6C25] transition-all z-[60]"
           >
              {isSidebarOpen ? <ChevronLeft size={10} /> : <ChevronRightIcon size={10} />}
           </button>

           {/* 🏛️ STUDIO BRANDING */}
           <div className="h-32 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-12 h-12 rounded-2xl bg-[#BC6C25] flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(188,108,37,0.3)] border border-white/10">
                    <Zap size={22} className="text-white" />
                 </div>
                 {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Studio</span>}
              </div>
           </div>
          
          {/* 🧭 NAVIGATION NODES */}
          <nav className="flex-1 px-4 py-4 space-y-12 overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                {/* ⚡ PRIMARY ACTION: DRAFT */}
                <button 
                  onClick={() => setIsForgeOpen(true)}
                  className={`flex items-center gap-4 rounded-2xl bg-[#BC6C25] text-white shadow-[0_0_20px_rgba(188,108,37,0.2)] hover:scale-[1.05] transition-all group ${isSidebarOpen ? 'w-full px-5 py-4' : 'w-14 h-14 mx-auto justify-center'}`}
                  title="New Forge"
                >
                   <Plus size={22} className="shrink-0" />
                   {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">New Forge</span>}
                </button>

                <div className="h-px bg-white/5 mx-4 my-10" />

                <div className="space-y-3">
                  {[
                    { id: 'home', label: 'Dashboard', icon: Home },
                    { id: 'inventory', label: 'Vault', icon: Package },
                    { id: 'profile', label: 'Identity', icon: User },
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => changeTab(tab.id)}
                      className={`flex items-center gap-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-[#BC6C25]/10 text-[#BC6C25] border border-[#BC6C25]/20' : 'bg-white/[0.02] border border-white/5 text-white/20 hover:text-white/60 hover:bg-white/5'} ${isSidebarOpen ? 'w-full px-5 py-4' : 'w-14 h-14 mx-auto justify-center'}`}
                    >
                      <tab.icon size={20} className={`${activeTab === tab.id ? 'text-[#BC6C25]' : 'text-white/20 group-hover:text-white/40'} shrink-0`} />
                      {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>}
                    </button>
                  ))}
                </div>
              </div>
          </nav>

          {/* 🚪 LOGOUT ZONE */}
          <div className="p-5 border-t border-white/5">
             <button 
                onClick={async () => { await signOut(); router.push('/login'); }} 
                className={`flex items-center gap-4 rounded-2xl transition-all bg-rose-500/5 border border-rose-500/10 text-rose-500/40 hover:text-rose-400 hover:bg-rose-500/10 ${isSidebarOpen ? 'w-full px-5 py-4' : 'w-14 h-14 mx-auto justify-center'}`}
                title="Sign Out"
             >
                <LogOut size={20} className="shrink-0" /> 
                {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sign Out</span>}
             </button>
          </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto relative z-10">
          <header className="sticky top-0 z-40 bg-[#0D1110]/60 backdrop-blur-md px-10 py-5 flex justify-between items-center border-b border-white/5">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#BC6C25] rounded-full shadow-[0_0_10px_#BC6C25] animate-pulse" />
                <h2 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/30 italic">{activeTab} active</h2>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 group cursor-pointer hover:bg-white/10">
                   <div className="relative">
                      <Bell size={16} className="text-white/40 group-hover:text-[#BC6C25]" />
                      {myProducts.some(p => p.status === 'rejected') && <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0D1110]" />}
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-white/20 hidden md:block">System Logs</span>
                </div>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-4 pl-4 border-l border-white/10 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                   <div className="text-right hidden sm:block">
                      <p className="text-[7px] font-black uppercase tracking-widest text-[#BC6C25] mb-0.5 group-hover:animate-pulse">Master Access</p>
                      <p className="text-[11px] font-bold text-white/90 tracking-tight leading-none">{profile?.full_name}</p>
                   </div>
                   <div className="w-10 h-10 bg-gradient-to-br from-[#BC6C25] to-[#A65D1F] rounded-xl flex items-center justify-center text-white text-xs font-black shadow-xl border border-white/10 overflow-hidden">
                      {profile?.avatar_url ? <img src={profile.avatar_url} className="w-full h-full object-cover" /> : profile?.full_name?.[0]}
                   </div>
                </button>
             </div>
          </header>

          <div className="p-6 space-y-8 min-h-screen">
            <AnimatePresence mode="wait">
              {activeTab === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      {[
                        { label: 'Live Listings', value: myStats.live, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                        { label: 'Pending', value: myStats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/5' },
                        { label: 'Returned', value: myStats.rejected, icon: X, color: 'text-rose-500', bg: 'bg-rose-500/5' },
                        { label: 'Total Sales', value: myStats.earnings, icon: Activity, color: 'text-[#BC6C25]', bg: 'bg-[#BC6C25]/5' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-[#141A18] border border-white/5 p-7 rounded-[1.5rem] group hover:border-[#BC6C25]/20 transition-all shadow-xl">
                           <div className={`w-9 h-9 ${stat.bg} border border-white/5 rounded-lg flex items-center justify-center mb-5 ${stat.color}`}><stat.icon size={16} /></div>
                           <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{stat.label}</p>
                           <p className="text-xl font-black mt-1 text-white/90 tracking-tighter">{stat.value}</p>
                        </div>
                      ))}
                   </div>
                   <div className="bg-gradient-to-br from-[#141A18] to-[#141A18]/60 p-10 rounded-[2rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
                         <div className="max-w-xs">
                            <div className="flex items-center gap-3 mb-4">
                               <h3 className="text-sm font-black tracking-widest uppercase italic text-white/60 underline decoration-[#BC6C25] decoration-2 underline-offset-8">Studio License</h3>
                               <div className="px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 text-[6px] font-black text-emerald-500 uppercase tracking-widest">Verified</div>
                            </div>
                            <p className="text-white/20 text-[9px] italic leading-relaxed">Artisan node operational on <b>VIP Tier</b>.</p>
                         </div>
                         <div className="flex items-center gap-10">
                            <div className="text-right">
                               <p className="text-[7px] font-black uppercase tracking-widest text-white/10 mb-1">Slots Used</p>
                               <p className="text-xl font-black text-white/90">{totalProducts} <span className="text-[9px] text-[#BC6C25]/60">/ {profile?.seller?.product_limit || 5}</span></p>
                            </div>
                            <div className="text-right">
                               <p className="text-[7px] font-black uppercase tracking-widest text-white/10 mb-1">Cycle Reset</p>
                               <p className="text-[10px] font-black text-[#BC6C25] tracking-widest uppercase">{new Date(profile?.seller?.subscription_expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
              {activeTab === 'inventory' && (
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
                  getRowClassName={(p) => {
                    if (p.is_approved) return 'bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03] border-l-2 border-l-transparent';
                    if (p.status === 'rejected') return 'bg-rose-500/[0.03] border-l-2 border-l-rose-500/50';
                    return 'bg-amber-500/[0.01] border-l-2 border-l-amber-500/20';
                  }}
                  columns={[
                    {
                      header: 'Reference Listing',
                      render: (p) => (
                        <div className="flex items-center gap-5">
                           <div className="relative group/img shrink-0">
                              {/* 🎭 STACK EFFECT for multiple images */}
                              {p.images?.length > 1 && (
                                <div className="absolute -top-1 -right-1 w-14 h-14 bg-white/[0.05] rounded-xl border border-white/5 translate-x-1 -translate-y-1 -z-10 transition-transform group-hover/img:translate-x-2 group-hover/img:-translate-y-2" />
                              )}
                              <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/5 bg-black/40 shadow-2xl transition-transform group-hover:scale-105 relative z-10">
                                 <img src={p.images?.[0]} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                 {/* 🔢 MULTI-FRAME BADGE */}
                                 {p.images?.length > 1 && (
                                   <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[6px] font-black text-white/70 uppercase">
                                     +{p.images.length - 1}
                                   </div>
                                 )}
                              </div>
                           </div>
                           <div>
                              <p className="text-xs font-black text-white/90 tracking-tight">{p.title}</p>
                              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1.5">{p.category}</p>
                           </div>
                        </div>
                      )
                    },
                    { 
                      header: 'Price Node', 
                      render: (p) => (
                        <div className="flex flex-col">
                           <span className="text-[#BC6C25] font-black tracking-tight">
                              {p.currency === 'USD' ? '$' : '₹'}{p.price}
                           </span>
                           <span className="text-[10px] text-white/20 uppercase tracking-tighter">
                              per {p.weight_value || 1}{p.weight_unit || 'kg'}
                           </span>
                        </div>
                      )
                    },
                     {
                       header: 'Validation Status',
                       render: (p) => (
                         <div className="flex flex-col gap-2">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[7px] font-black uppercase tracking-widest w-fit ${p.is_approved ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : p.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/10 text-rose-500' : 'bg-amber-500/5 border-amber-500/10 text-amber-500'}`}>
                               <div className={`w-1 h-1 rounded-full ${p.is_approved ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : p.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse shadow-[0_0_5px_#f59e0b]'}`} />
                               {p.is_approved ? 'Live' : p.status === 'rejected' ? 'Returned' : 'Queued'}
                            </div>
                            {p.status === 'rejected' && p.rejection_reason && (
                              <div className="flex items-start gap-1.5 max-w-[200px] bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                                 <Info size={10} className="text-amber-500 mt-0.5 shrink-0" />
                                 <p className="text-[9px] font-bold text-amber-500/80 leading-tight italic">
                                    Audit Note: {p.rejection_reason}
                                 </p>
                              </div>
                            )}
                         </div>
                       )
                     }
                  ]}
                  actions={[
                    { icon: Edit2, onClick: (p) => handleEdit(p) },
                    { icon: Trash2, variant: 'danger', onClick: (p) => handleDelete(p.id) }
                  ]}
                />
              )}
              {activeTab === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                   <ProfileNode />
                </motion.div>
              )}
            </AnimatePresence>
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
      <DashboardContent />
    </Suspense>
  );
}
