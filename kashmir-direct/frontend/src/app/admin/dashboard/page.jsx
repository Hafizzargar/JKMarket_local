'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

// 🏗️ INTERNAL COMPONENTS
import AdminSidebar from '../../../components/admin/AdminSidebar';
import StatGrid from '../../../components/admin/StatGrid';
import MarketInsight from '../../../components/admin/MarketInsight';
import SubmissionVault from '../../../components/admin/SubmissionVault';
import OpsCommand from '../../../components/admin/OpsCommand';
import GovernanceInspector from '../../../components/admin/GovernanceInspector';
import ArtisanRegistry from '../../../components/admin/ArtisanRegistry';
import UserDirectory from '../../../components/admin/UserDirectory';
import PrivilegeManager from '../../../components/admin/PrivilegeManager';
import JobForge from '../../../components/admin/JobForge';
import GovernanceDropdown from '../../../components/admin/GovernanceDropdown';
import ProfileForge from '../../../components/admin/ProfileForge';
import AuthGuard from '../../../components/auth/AuthGuard';

function DashboardContent() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  
  const [activeTab, setActiveTab] = useState(currentTab);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 🛰️ GLOBAL STATE
  const [stats, setStats] = useState({ products: 0, sellers: 0, managers: 0, buyers: 0, pending: 0, revenue: '₹4.2M' });
  const [products, setProducts] = useState([]);
  const [shopkeepers, setShopkeepers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // 🕵️‍♂️ MODAL STATE
  const [inspectModal, setInspectModal] = useState({ isOpen: false, item: null, isRejecting: false, reason: '' });
  const [privilegeModal, setPrivilegeModal] = useState({ isOpen: false, seller: null, newLimit: '', newExpiry: '', isVerified: true });

  const SUPER_ADMIN_EMAIL = 'hafezzargar987@gmail.com';

  const changeTab = (tabId) => {
    setActiveTab(tabId);
    router.push(`/admin/dashboard?tab=${tabId}`, { scroll: false });
    // Proactively fetch fresh data on every tab click
    fetchGlobalData();
  };

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    // Legacy redirect removed - Handled by AuthGuard
    if (isAdmin) fetchGlobalData();
  }, [isAdmin, loading, activeTab]);

  const fetchGlobalData = async () => {
    try {
      setIsDataLoading(true);
      
      const { data: pData } = await supabase
        .from('products')
        .select('*, sellers(shop_name, profiles(full_name, email))')
        .order('created_at', { ascending: false });
      const { data: sData } = await supabase.from('sellers').select('*, profiles!inner(*)');
      const { data: profData } = await supabase.from('profiles').select('*');
      const { data: oData, error: oError } = await supabase.from('orders').select('total_price');
      
      // 🛡️ REVENUE SENTINEL: Handle missing orders table gracefully
      const totalRevenue = (oError || !oData) ? 0 : oData.reduce((sum, order) => sum + (order.total_price || 0), 0);
      const formattedRevenue = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumSignificantDigits: 3,
        notation: totalRevenue > 100000 ? 'compact' : 'standard'
      }).format(totalRevenue);

      console.log('📡 Registry Sync:', { 
        products: pData?.length, 
        sellers: sData?.length, 
        users: profData?.length,
        revenue: totalRevenue 
      });

      setProducts(pData || []);
      setShopkeepers(sData || []);
      setAllUsers(profData || []);
      
      const mList = profData?.filter(p => p.role?.toLowerCase() === 'manager') || [];
      const sList = profData?.filter(p => p.role?.toLowerCase() === 'seller') || [];
      const bList = profData?.filter(p => {
        const r = p.role?.toLowerCase();
        return !r || r === 'user' || (r !== 'manager' && r !== 'seller' && r !== 'superadmin' && r !== 'admin');
      }) || [];

      setManagers(mList);

      setStats({
        products: pData?.length || 0,
        sellers: sData?.length || 0,
        managers: mList.length,
        buyers: bList.length,
        pending: pData?.filter(p => !p.is_approved).length || 0,
        revenue: formattedRevenue
      });
    } catch (err) {
      console.error('System Sync Failure:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleGovernance = async (status) => {
    const { item, reason } = inspectModal;
    const isApprove = status === 'approved';
    try {
      const { error } = await supabase.from('products').update({ 
        is_approved: isApprove, 
        status: isApprove ? 'approved' : 'rejected', 
        rejection_reason: isApprove ? null : reason 
      }).eq('id', item.id);
      
      if (error) throw error;
      toast.success(isApprove ? 'Listing Live!' : 'Rejection Recorded.');
      fetchGlobalData();
      setInspectModal({ ...inspectModal, isOpen: false });
    } catch (err) {
      toast.error('Sync Error');
    }
  };

  const updatePrivileges = async (forceTerminate = false) => {
    const { seller, newLimit, newExpiry, isVerified } = privilegeModal;
    try {
      const updates = { 
        product_limit: forceTerminate ? 0 : parseInt(newLimit),
        subscription_expires_at: forceTerminate ? new Date().toISOString() : new Date(newExpiry).toISOString(),
        is_verified: forceTerminate ? false : isVerified
      };
      await supabase.from('sellers').update(updates).eq('id', seller.id);
      toast.success('Governance Updated.');
      fetchGlobalData();
      setPrivilegeModal({ ...privilegeModal, isOpen: false });
    } catch (err) {
      toast.error('Operation failed.');
    }
  };

  return (
    <div className="h-screen bg-[#121716] flex font-sans text-white/90 overflow-hidden">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={changeTab} 
        stats={stats} 
        signOut={signOut} 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        profile={profile}
      />

      <main className="flex-1 h-full overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#121716]/80 backdrop-blur-3xl border-b border-white/5 px-10 py-5 flex justify-between items-center">
           <div>
              <h2 className="text-xl font-black tracking-tighter uppercase italic leading-none">{activeTab === 'overview' ? 'God Mode' : activeTab}</h2>
              <div className="flex items-center gap-2 mt-2">
                 <div className="w-1 h-1 bg-[#BC6C25] rounded-full animate-pulse shadow-[0_0_8px_#BC6C25]" />
                 <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em]">Sovereign Session • Secure</p>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="relative hidden lg:block">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                 <input type="text" placeholder="Search Global Registry..." className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[9px] font-black uppercase tracking-widest w-72 text-white focus:border-[#BC6C25]/40 focus:outline-none transition-all" />
              </div>
              
              <GovernanceDropdown onAction={changeTab} />

              <div className="flex items-center gap-4">
                 <div className="hidden md:flex flex-col items-end">
                    <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{profile?.full_name || 'Administrator'}</p>
                    <p className="text-[7px] font-black text-[#BC6C25] uppercase tracking-[0.2em] mt-1 italic">Sovereign Operator</p>
                 </div>
                 <div className="w-10 h-10 bg-gradient-to-br from-[#1B4332] to-[#0A1A13] rounded-xl border border-white/10 flex items-center justify-center text-white font-black text-xs shadow-xl shrink-0">
                    {profile?.full_name?.substring(0, 2).toUpperCase() || 'AD'}
                 </div>
              </div>
           </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto space-y-12">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                 <StatGrid stats={stats} />
                 <MarketInsight />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <UserDirectory users={allUsers} />
              </motion.div>
            )}

            {activeTab === 'artisans' && (
              <motion.div key="artisans" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <ArtisanRegistry 
                    shopkeepers={shopkeepers} 
                    onEdit={(sk) => setPrivilegeModal({ isOpen: true, seller: sk, newLimit: sk.product_limit.toString(), newExpiry: sk.subscription_expires_at.split('T')[0], isVerified: sk.is_verified })} 
                 />
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <SubmissionVault products={products} onInspect={(p) => setInspectModal({ isOpen: true, item: p, isRejecting: false, reason: '' })} />
              </motion.div>
            )}

            {activeTab === 'managers' && (
              <motion.div key="managers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <OpsCommand managers={managers} />
              </motion.div>
            )}

            {activeTab === 'careers' && (
              <motion.div key="careers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <JobForge />
              </motion.div>
            )}
            
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                 <ProfileForge profile={profile} onUpdate={fetchGlobalData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        <GovernanceInspector 
          key="governance-overlay"
          {...inspectModal} 
          setModal={(update) => setInspectModal(prev => ({ ...prev, ...update }))} 
          onAction={handleGovernance} 
        />
        <PrivilegeManager 
          key="privilege-overlay"
          {...privilegeModal} 
          setModal={(update) => setPrivilegeModal(prev => ({ ...prev, ...update }))} 
          onUpdate={updatePrivileges} 
        />
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050B08] flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Establishing Connection...</div>}>
      <AuthGuard allowedRoles={['admin', 'superadmin']}>
        <DashboardContent />
      </AuthGuard>
    </Suspense>
  );
}
