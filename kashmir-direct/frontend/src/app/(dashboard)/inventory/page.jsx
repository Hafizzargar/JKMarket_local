'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import DataTable from '@/components/ui/DataTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import SellerProductForm from '@/components/ui/SellerProductForm';
import { Edit2, Trash2, ArrowUpRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const { user, profile, isAdmin } = useAuth();
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
      toast.success('Product Deleted');
      fetchProducts();
    } catch (err) { toast.error('Delete Failed'); }
    setProductToDelete(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4 lg:space-y-8">
       <div className="page-header px-1 lg:px-0">
          <h1 className="text-[18px] lg:text-[20px] font-black text-[#1B4332] uppercase tracking-tight">Product Inventory</h1>
          <p className="text-[10px] lg:text-[13px] font-medium text-[#1B4332]/50 italic">Manage your listings and stock levels.</p>
       </div>

       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <DataTable 
            title="Active Listings"
            data={myProducts}
            isLoading={loading}
            totalCount={totalProducts}
            currentPage={page}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
            columns={[
              {
                header: 'Product Details',
                render: (p) => (
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden border border-[#1B4332]/5 bg-[#1B4332]/5 shrink-0">
                        <img src={p.images?.[0]} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <p className="text-[13px] lg:text-sm font-black text-[#1B4332] tracking-tight">{p.title}</p>
                        <p className="text-[9px] font-bold text-[#1B4332]/40 uppercase tracking-widest mt-0.5">{p.category}</p>
                     </div>
                  </div>
                )
              },
              { 
                header: 'Price', 
                render: (p) => (
                  <div className="flex flex-col">
                     <span className="text-[#BC6C25] font-black text-[13px] lg:text-base">₹{p.price}</span>
                     <span className="text-[8px] lg:text-[10px] text-[#1B4332]/40 uppercase italic font-bold">per {p.weight_value}{p.weight_unit}</span>
                  </div>
                )
              },
              {
                header: 'Status',
                render: (p) => (
                  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${p.is_approved ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500' : p.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/10 text-rose-500' : 'bg-[#BC6C25]/5 border-[#BC6C25]/10 text-[#BC6C25]'}`}>
                     {p.is_approved ? 'Approved' : p.status === 'rejected' ? 'Rejected' : 'Pending'}
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

       <Modal 
          isOpen={isEditOpen} 
          onClose={() => { setIsEditOpen(false); setEditingProduct(null); }} 
          title="Edit Product"
          maxWidth="max-w-3xl"
          action={
            <button 
              onClick={() => submitRef.current?.()}
              disabled={isSaving}
              className="h-9 px-6 bg-[#BC6C25] text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <><span>Update</span><ArrowUpRight size={14} /></>}
            </button>
          }
        >
           <SellerProductForm 
             initialData={editingProduct}
             onSubmitRef={submitRef}
             onLoadingChange={setIsSaving}
             onClose={() => { setIsEditOpen(false); setEditingProduct(null); fetchProducts(); }} 
           />
       </Modal>

       <ConfirmDialog 
         isOpen={isConfirmOpen}
         onClose={() => { setIsConfirmOpen(false); setProductToDelete(null); }}
         onConfirm={confirmDelete}
         title="Delete Product"
         message="Are you sure you want to permanently remove this product from your inventory?"
         confirmText="Delete"
       />
    </div>
  );
}
