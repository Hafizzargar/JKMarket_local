'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import WhatsAppButton from '../../../components/ui/WhatsAppButton';
import Button from '../../../components/ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*, sellers(*)')
        .eq('id', id)
        .single();
      
      if (!error) {
        setProduct(data);
      }
      setLoading(false);
    }

    if (id) fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
      <Button onClick={() => router.push('/products')} className="mt-4 bg-emerald-600 text-white">Back to Marketplace</Button>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <div className="bg-3d-mesh" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-slate-500 hover:text-emerald-600 mb-8 transition-colors group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="glass-card aspect-square rounded-3xl overflow-hidden border border-white/50 bg-slate-100">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-4xl">
                  KASHMIR
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card aspect-square rounded-xl border border-white/50 bg-slate-50 opacity-50"></div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="glass-card p-8 rounded-3xl border border-white/50 flex-grow">
              <span className="text-emerald-600 text-sm font-bold uppercase tracking-widest">{product.category}</span>
              <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-4">{product.title}</h1>
              
              <div className="flex items-center mb-6">
                <span className="text-3xl font-extrabold text-slate-900">₹{product.price}</span>
                <span className="text-slate-500 ml-2 font-medium">/ {product.unit}</span>
                <span className="ml-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">IN STOCK</span>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-8">
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-tight">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description || "No description provided for this authentic Kashmiri treasure. Please contact the seller for more details."}
                </p>
              </div>

              {/* Seller Info */}
              <div className="bg-slate-50/50 rounded-2xl p-6 mb-8 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mr-4">
                      {product.sellers?.shop_name?.[0] || "S"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{product.sellers?.shop_name || "Verified Seller"}</h4>
                      <p className="text-xs text-slate-500">{product.location || "Jammu & Kashmir, India"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-emerald-600">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                    <span className="text-xs font-bold uppercase">Verified</span>
                  </div>
                </div>
              </div>

              <WhatsAppButton 
                phoneNumber={product.whatsapp_number || product.sellers?.whatsapp_number} 
                productName={product.title} 
                className="w-full py-4 text-lg font-bold rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
