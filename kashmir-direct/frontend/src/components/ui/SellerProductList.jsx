'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from './Button';

export default function SellerProductList({ onAddProduct }) {
  const { profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [profile?.seller?.id]);

  const fetchProducts = async () => {
    if (!profile?.seller?.id) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', profile.seller.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Could not load your inventory.');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      toast.success('Listing removed.');
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const getStatusStyle = (status, is_approved) => {
    if (is_approved) return { label: 'Live', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 };
    if (status === 'rejected') return { label: 'Rejected', bg: 'bg-rose-50', text: 'text-rose-600', icon: XCircle };
    return { label: 'Pending Approval', bg: 'bg-amber-50', text: 'text-amber-600', icon: Clock };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-40">
        <div className="w-10 h-10 border-4 border-[#1B4332]/10 border-t-[#1B4332] rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest">Scanning Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[#1B4332] tracking-tighter">My Inventory</h2>
          <p className="text-[10px] font-bold text-[#1B4332]/40 uppercase tracking-widest mt-1">Manage your artisan listings</p>
        </div>
        <Button onClick={onAddProduct} variant="primary" size="sm" className="gap-2">
          <Plus size={16} />
          New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-[#1B4332]/5 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-[#1B4332]/20" />
          </div>
          <h3 className="text-xl font-black text-[#1B4332]">No active listings</h3>
          <p className="text-sm font-medium text-[#1B4332]/40 mt-2 max-w-xs mx-auto">Start showcasing your authentic Kashmiri products to the world.</p>
          <Button onClick={onAddProduct} variant="secondary" size="sm" className="mt-8">Create your first listing</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {products.map((product) => {
              const status = getStatusStyle(product.status, product.is_approved);
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={product.id}
                  className="bg-white p-6 rounded-[2.5rem] border border-[#1B4332]/5 flex items-center gap-6 group hover:shadow-xl hover:shadow-[#1B4332]/5 transition-all"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden flex-shrink-0 border border-[#1B4332]/5 relative">
                    <img 
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1'} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                    {!product.is_approved && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <Clock size={20} className="text-white opacity-80" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-3 py-1 rounded-full ${status.bg} ${status.text} text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5`}>
                        <status.icon size={10} />
                        {status.label}
                      </span>
                      <span className="text-[10px] font-black text-[#BC6C25]/40 uppercase tracking-widest">{product.category}</span>
                    </div>
                    <h4 className="text-lg font-black text-[#1B4332] tracking-tight">{product.title}</h4>
                    <div className="flex items-center gap-4 mt-2">
                       <p className="text-[11px] font-bold text-[#1B4332]/60">₹{product.price} / {product.unit || 'kg'}</p>
                       <div className="w-1 h-1 rounded-full bg-[#1B4332]/10" />
                       <p className="text-[10px] font-medium text-[#1B4332]/30 italic truncate max-w-[200px]">{product.description}</p>
                    </div>

                    {product.status === 'rejected' && product.rejection_reason && (
                      <div className="mt-4 bg-rose-50 border border-rose-100/50 p-4 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Reason for Rejection</p>
                          <p className="text-[11px] font-medium text-rose-800/60 mt-0.5">{product.rejection_reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pr-4">
                    <button className="p-3 hover:bg-gray-50 rounded-2xl text-[#1B4332]/20 hover:text-[#1B4332] transition-all"><Eye size={18} /></button>
                    <button className="p-3 hover:bg-gray-50 rounded-2xl text-[#1B4332]/20 hover:text-[#1B4332] transition-all"><Edit3 size={18} /></button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="p-3 hover:bg-rose-50 rounded-2xl text-[#1B4332]/20 hover:text-rose-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {(profile?.seller?.is_verified === false || profile?.verification_status === 'rejected') && (
        <div className={`p-6 rounded-3xl border flex items-start gap-4 ${profile?.verification_status === 'rejected' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'}`}>
          <AlertCircle className={`${profile?.verification_status === 'rejected' ? 'text-rose-500' : 'text-amber-500'} mt-1`} size={20} />
          <div>
            <h5 className={`text-[10px] font-black uppercase tracking-widest ${profile?.verification_status === 'rejected' ? 'text-rose-600' : 'text-amber-600'}`}>
              {profile?.verification_status === 'rejected' ? 'Verification Rejected' : 'Verification Advisory'}
            </h5>
            <p className={`text-xs font-medium mt-1 ${profile?.verification_status === 'rejected' ? 'text-rose-900/60' : 'text-amber-900/60'}`}>
              {profile?.verification_status === 'rejected' 
                ? `Your identity verification was declined. Reason: ${profile.rejection_reason || 'No specific reason provided.'}`
                : 'Your listings will remain in "Pending Approval" state until the Super Admin verifies your shopkeeper credentials. Once verified, your products will be eligible for the public marketplace.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
