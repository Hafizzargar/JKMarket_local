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
import SubmissionVault from '../../../components/admin/SubmissionVault';
import OpsCommand from '../../../components/admin/OpsCommand';
import GovernanceInspector from '../../../components/admin/GovernanceInspector';
import ArtisanRegistry from '../../../components/admin/ArtisanRegistry';
import UserDirectory from '../../../components/admin/UserDirectory';
import PrivilegeManager from '../../../components/admin/PrivilegeManager';

function DashboardContent() {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';
  
  const [activeTab, setActiveTab] = useState(currentTab);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 🛰️ GLOBAL STATE
  const [stats, setStats] = useState({ products: 0, sellers: 0, managers: 0, pending: 0, revenue: '₹4.2M' });
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
  };

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
      return;
    }
    if (isAdmin) fetchGlobalData();
  }, [isAdmin, loading, activeTab]);

  const fetchGlobalData = async () => {
    try {
      setIsDataLoading(true);
      
      const { data: pData } = await supabase
        .from('products')
        .select('*, sellers(shop_name, profiles(full_name, email))')
        .order('created_at', { ascending: false });
      const { data: sData } = await supabase.from('sellers').select('*, profiles!inner(*)').neq('profiles.email', SUPER_ADMIN_EMAIL);
      const { data: profData } = await supabase.from('profiles').select('*').neq('email', SUPER_ADMIN_EMAIL);

      setProducts(pData || []);
      setShopkeepers(sData || []);
      setAllUsers(profData || []);
      
      const mList = profData?.filter(p => p.role === 'manager') || [];
      setManagers(mList);

      setStats({
        products: pData?.length || 0,
        sellers: sData?.length || 0,
        managers: mList.length,
        pending: pData?.filter(p => !p.is_approved).length || 0,
        revenue: '₹4.2M'
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
    <div className="min-h-screen bg-[#050B08] flex font-sans text-white/90 overflow-hidden">
      <AdminSidebar activeTab={activeTab} setActiveTab={changeTab} stats={stats} signOut={signOut} />

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-[#050B08]/80 backdrop-blur-3xl border-b border-white/5 px-16 py-10 flex justify-between items-center">
           <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">{activeTab === 'overview' ? 'God Mode' : activeTab}</h2>
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-2">Sovereign Session • Secure</p>
           </div>
           <div className="flex items-center gap-10">
              <div className="relative hidden lg:block">
                 <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                 <input type="text" placeholder="Search Global Registry..." className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-xs font-medium w-80 text-white focus:outline-none" />
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-[#1B4332] to-[#0A1A13] rounded-[1.5rem] border border-white/10 flex items-center justify-center text-white font-black text-lg">AD</div>
           </div>
        </header>

        <div className="p-16 max-w-7xl mx-auto space-y-16">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
                 <StatGrid stats={stats} />
                 <SubmissionVault products={products.slice(0, 5)} onInspect={(p) => setInspectModal({ isOpen: true, item: p, isRejecting: false, reason: '' })} />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <UserDirectory users={allUsers} />
              </motion.div>
            )}

            {activeTab === 'artisans' && (
              <motion.div key="artisans" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <ArtisanRegistry 
                    shopkeepers={shopkeepers} 
                    onEdit={(sk) => setPrivilegeModal({ isOpen: true, seller: sk, newLimit: sk.product_limit.toString(), newExpiry: sk.subscription_expires_at.split('T')[0], isVerified: sk.is_verified })} 
                 />
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <SubmissionVault products={products} onInspect={(p) => setInspectModal({ isOpen: true, item: p, isRejecting: false, reason: '' })} />
              </motion.div>
            )}

            {activeTab === 'managers' && (
              <motion.div key="managers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                 <OpsCommand managers={managers} />
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
      <DashboardContent />
    </Suspense>
  );
}
