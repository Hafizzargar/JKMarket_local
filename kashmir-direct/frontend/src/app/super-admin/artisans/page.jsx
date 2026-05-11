'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ShieldCheck, RefreshCw, Store, Users } from 'lucide-react';
import toast from 'react-hot-toast';

// 🏛️ ADMINISTRATIVE COMPONENTS
import ArtisanRegistry from '@/components/admin/ArtisanRegistry';
import BuyerRegistry from '@/components/admin/BuyerRegistry';
import PrivilegeManager from '@/components/admin/PrivilegeManager';
import SuspensionManager from '@/components/admin/SuspensionManager';
import { supabase } from '@/lib/supabase';

function IdentityRegistryContent() {
  const { isAdmin } = useAuth();
  const [artisans, setArtisans] = useState([]);
  const [artisanTotal, setArtisanTotal] = useState(0);
  const [artisanPage, setArtisanPage] = useState(1);
  const [artisanPageSize, setArtisanPageSize] = useState(5);
  const [buyers, setBuyers] = useState([]);
  const [buyerTotal, setBuyerTotal] = useState(0);
  const [buyerPage, setBuyerPage] = useState(1);
  const [buyerPageSize, setBuyerPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sellers');
  
  // 🕵️‍♂️ GOVERNANCE STATE
  const [privilegeModal, setPrivilegeModal] = useState({ isOpen: false, seller: null, newLimit: '', newExpiry: '', isVerified: true });
  const [suspensionModal, setSuspensionModal] = useState({ isOpen: false, user: null, message: '' });

  // 🛰️ GLOBAL SYNC LISTENER (Connected to Header Refresh)
  useEffect(() => {
    const handleGlobalSync = () => {
      fetchData();
    };
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin, activeTab, artisanPage, artisanPageSize, buyerPage, buyerPageSize]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'sellers') {
        // Fetch Artisans (Paginated)
        const artRes = await fetch(`/api/admin/data?type=artisans&page=${artisanPage}&pageSize=${artisanPageSize}`);
        const artResult = await artRes.json();
        setArtisans(artResult.data || []);
        setArtisanTotal(artResult.total || 0);
      } else {
        // Fetch Buyers (Paginated via API)
        const buyerRes = await fetch(`/api/admin/data?type=buyers&page=${buyerPage}&pageSize=${buyerPageSize}`);
        const buyerResult = await buyerRes.json();
        setBuyers(buyerResult.data || []);
        setBuyerTotal(buyerResult.total || 0);
      }

    } catch (err) {
      console.error('Registry Stream Failure:', err);
      toast.error('Identity sync failed');
    } finally {
      setLoading(false);
    }
  };

  // 📧 SEND REAL EMAIL PROTOCOL
  const sendRealEmail = async (email, userName, message, subject) => {
    try {
      const response = await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userName, message, subject })
      });
      
      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        return { success: false, error: 'Server error' };
      }

      if (result.error) return { success: false, error: result.error };
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updatePrivileges = async (isTerminate = false, reason = '') => {
    const { seller, newLimit, newExpiry, isVerified } = privilegeModal;
    const toastId = toast.loading(isTerminate ? 'Terminating Access...' : 'Updating Boutique Rights...');
    
    try {
      if (isTerminate) {
        // 🚫 TERMINATION
        await supabase.from('profiles').update({ status: 'banned' }).eq('id', seller.user_id);
        await supabase.from('sellers').update({ is_verified: false }).eq('id', seller.id);
        
        await sendRealEmail(
          seller.profiles?.email, 
          seller.profiles?.full_name, 
          reason || 'Your shopkeeper access has been terminated due to platform policy violations.', 
          'Account Security: Shopkeeper Access Terminated'
        );
        toast.success('Access Terminated & Notice Sent', { id: toastId });
      } else {
        // ✅ STANDARD UPDATE
        const updates = { 
          product_limit: parseInt(newLimit),
          subscription_expires_at: new Date(newExpiry).toISOString(),
          is_verified: isVerified
        };
        await supabase.from('sellers').update(updates).eq('id', seller.id);

        // 📩 SEND UPDATE NOTICE TO SHOPKEEPER
        const updateMessage = `Your artisan boutique rights have been updated by the Super-Admin. New Product Limit: ${newLimit}. Verification Status: ${isVerified ? 'Verified' : 'Pending'}. Expiry: ${new Date(newExpiry).toLocaleDateString()}.`;
        
        await sendRealEmail(
          seller.profiles?.email, 
          seller.profiles?.full_name, 
          updateMessage, 
          'Boutique Rights Updated - Kashmir Direct'
        );

        toast.success('Rights Updated & Shopkeeper Notified', { id: toastId });
      }
      
      fetchData();
      setPrivilegeModal({ ...privilegeModal, isOpen: false });
    } catch (err) {
      toast.error('Governance failed', { id: toastId });
    }
  };

  const updateUserStatus = async (status) => {
    const { user, message } = suspensionModal;
    const isEnabling = status === 'active';
    const toastId = toast.loading(isEnabling ? 'Restoring Access...' : 'Suspending Account...');
    
    try {
      const { error } = await supabase.from('profiles').update({ status }).eq('id', user.id);
      if (error) throw error;
      
      const noticeMessage = isEnabling 
        ? `We are pleased to inform you that your account access has been restored. You can now log back into the Kashmir Direct marketplace.`
        : (message || 'Your account access has been temporarily suspended due to a platform policy review.');

      const subject = isEnabling ? 'Identity Restored - Kashmir Direct' : 'Identity Suspension Notice - Kashmir Direct';

      await sendRealEmail(user.email, user.full_name, noticeMessage, subject);
      
      toast.success(`${isEnabling ? 'Access Restored' : 'Account Suspended'} & Email Sent`, { id: toastId });
      
      fetchData();
      setSuspensionModal({ ...suspensionModal, isOpen: false });
    } catch (err) {
      toast.error('Identity update failed', { id: toastId });
    }
  };

  const tabs = [
    { id: 'sellers', label: 'Sellers', icon: Store },
    { id: 'buyers', label: 'Buyers', icon: Users }
  ];

  return (
    <div className="space-y-10 pb-20">
       <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 p-1 bg-[#1B4332]/5 rounded-2xl w-fit border border-[#1B4332]/5">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`relative px-6 py-2.5 rounded-xl transition-all flex items-center gap-2 group`}
               >
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="active-identity-tab"
                      className="absolute inset-0 bg-white shadow-md rounded-xl z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <tab.icon 
                    size={14} 
                    className={`relative z-10 transition-colors ${activeTab === tab.id ? 'text-[#BC6C25]' : 'text-[#1B4332]/40 group-hover:text-[#1B4332]/60'}`} 
                  />
                  <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest transition-colors ${activeTab === tab.id ? 'text-[#1B4332]' : 'text-[#1B4332]/40 group-hover:text-[#1B4332]/60'}`}>
                     {tab.label}
                  </span>
               </button>
             ))}
          </div>
       </div>

       <AnimatePresence mode="wait">
         <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            {activeTab === 'sellers' ? (
              <ArtisanRegistry 
                shopkeepers={artisans} 
                onEdit={(sk) => setPrivilegeModal({ isOpen: true, seller: sk, newLimit: sk.product_limit.toString(), newExpiry: sk.subscription_expires_at?.split('T')[0], isVerified: sk.is_verified })} 
                totalItems={artisanTotal}
                currentPage={artisanPage}
                itemsPerPage={artisanPageSize}
                onPageChange={setArtisanPage}
                onPageSizeChange={setArtisanPageSize}
              />
            ) : (
              <BuyerRegistry 
                buyers={buyers} 
                onManage={(b) => setSuspensionModal({ isOpen: true, user: b, message: b.status === 'banned' ? 'Your account access has been restored.' : 'You are doing some harm to our platform so I will disable you.' })} 
                totalItems={buyerTotal}
                currentPage={buyerPage}
                itemsPerPage={buyerPageSize}
                onPageChange={setBuyerPage}
                onPageSizeChange={setBuyerPageSize}
              />
            )}
         </motion.div>
       </AnimatePresence>

       <SuspensionManager {...suspensionModal} setMessage={(msg) => setSuspensionModal(prev => ({ ...prev, message: msg }))} onUpdate={updateUserStatus} onClose={() => setSuspensionModal(prev => ({ ...prev, isOpen: false }))} />
       <PrivilegeManager {...privilegeModal} setModal={(update) => setPrivilegeModal(prev => ({ ...prev, ...update }))} onUpdate={updatePrivileges} />
    </div>
  );
}

export default function IdentityRegistryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#BC6C25]" /></div>}>
       <IdentityRegistryContent />
    </Suspense>
  );
}
