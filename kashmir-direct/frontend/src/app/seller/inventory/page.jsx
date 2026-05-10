'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/ui/DataTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import SellerProductForm from '@/components/ui/SellerProductForm';
import { Edit2, Trash2, ArrowUpRight, Loader2, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SellerInventoryPage() {
  const { user, profile, isAdmin } = useAuth();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const submitRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchProducts();
    }
  }, [user, profile, isAdmin, page, pageSize]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // 🛡️ RE-SYNC: Fetching from standardized seller node
      const { data: sellerRecord } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const sellerId = sellerRecord?.id;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (!isAdmin) {
        if (sellerId) {
          query = query.or(`seller_id.eq.${sellerId},seller_id.eq.${user.id}`);
        } else {
          query = query.eq('seller_id', user.id);
        }
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      setMyProducts(data || []);
      setTotalProducts(count || 0);
    } catch (err) {
      console.error('Inventory fetch error:', err);
      toast.error('Sync Failed');
    } finally {
      setLoading(false);
    }
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
      toast.success('Listing Removed');
      fetchProducts();
    } catch (err) { toast.error('Removal Failed'); }
    setProductToDelete(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="page-header">
             <h1 className="text-3xl font-black text-[#1B4332] uppercase tracking-tighter">Inventory Registry</h1>
             <p className="text-[12px] font-medium text-[#1B4332]/40 italic">Monitoring {totalProducts} artisan listings across the valley.</p>
          </div>
          <button 
             onClick={() => router.push('/seller/add-product')}
             className="h-12 px-8 bg-[#1B4332] text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-[#1B4332]/10 active:scale-95"
          >
             <Package size={16} /> New Product
          </button>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white border border-[#1B4332]/5 rounded-[2.5rem] shadow-xl overflow-hidden p-2">
            <DataTable 
              title="Active Artisan Listings"
              data={myProducts}
              isLoading={loading}
              totalCount={totalProducts}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
              columns={[
                {
                  header: 'Identity & Details',
                  render: (p) => (
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl overflow-hidden border border-[#1B4332]/10 bg-[#FDFBF7] shrink-0 p-1">
                          <img src={p.images?.[0]} className="w-full h-full object-cover rounded-xl" alt="" />
                       </div>
                       <div>
                          <p className="text-[13px] lg:text-sm font-black text-[#1B4332] tracking-tight">{p.title}</p>
                          <p className="text-[9px] font-bold text-[#BC6C25] uppercase tracking-[0.2em] mt-1">{p.category}</p>
                       </div>
                    </div>
                  )
                },
                { 
                  header: 'Valuation', 
                  render: (p) => (
                    <div className="flex flex-col">
                       <span className="text-[#1B4332] font-black text-[14px] lg:text-lg tracking-tighter">₹{p.price}</span>
                       <span className="text-[9px] text-[#1B4332]/30 uppercase italic font-bold">per {p.weight_value}{p.weight_unit}</span>
                    </div>
                  )
                },
                {
                  header: 'Registry Status',
                  render: (p) => {
                    const isApproved = p.is_approved;
                    const isRejected = p.status === 'rejected';
                    return (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${isApproved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : isRejected ? 'bg-rose-500/10 border-rose-500/20 text-rose-600' : 'bg-amber-500/10 border-amber-500/20 text-amber-600'}`}>
                         <div className={`w-1 h-1 rounded-full ${isApproved ? 'bg-emerald-500' : isRejected ? 'bg-rose-500' : 'bg-amber-500'} animate-pulse`} />
                         {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Pending Review'}
                      </div>
                    );
                  }
                }
              ]}
              actions={[
                { icon: Edit2, onClick: (p) => handleEdit(p) },
                { icon: Trash2, variant: 'danger', onClick: (p) => handleDelete(p.id) }
              ]}
            />
          </div>
       </motion.div>

       <Modal 
          isOpen={isEditOpen} 
          onClose={() => { setIsEditOpen(false); setEditingProduct(null); }} 
          title="Update Identity"
          maxWidth="max-w-4xl"
          action={
            <button 
              onClick={() => submitRef.current?.()}
              disabled={isSaving}
              className="h-10 px-8 bg-[#BC6C25] text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><span>Sync Changes</span><ArrowUpRight size={16} /></>}
            </button>
          }
        >
           <div className="p-4 sm:p-10">
             <SellerProductForm 
               initialData={editingProduct}
               onSubmitRef={submitRef}
               onLoadingChange={setIsSaving}
               onClose={() => { setIsEditOpen(false); setEditingProduct(null); fetchProducts(); }} 
             />
           </div>
       </Modal>

       <ConfirmDialog 
          isOpen={isConfirmOpen}
          onClose={() => { setIsConfirmOpen(false); setProductToDelete(null); }}
          onConfirm={confirmDelete}
          title="Remove Listing"
          message="Are you sure you want to permanently erase this artisan node from the valley? This action cannot be undone."
          confirmText="Confirm Removal"
       />
    </div>
  );
}
