'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Loader2, Search, Filter, ShoppingCart, Eye, 
  Package, ArrowUpRight, Truck, Check, X,
  MapPin, User, Hash, ExternalLink, AlertCircle, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ForgeTable } from '@/components/admin/shared/ForgeComponents';
import SovereignPagination from '@/components/admin/SovereignPagination';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

function OrderRegistryContent() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🚚 SHIPMENT MODAL STATE
  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shipmentData, setShipmentData] = useState({
    courier_name: 'DTDC',
    tracking_id: ''
  });
  const [isShipping, setIsShipping] = useState(false);

  // 🛑 CANCELLATION STATE
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // 🛰️ GLOBAL SYNC LISTENER
  useEffect(() => {
    const handleGlobalSync = () => {
      fetchOrders();
    };
    window.addEventListener('platform-sync', handleGlobalSync);
    return () => window.removeEventListener('platform-sync', handleGlobalSync);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data?type=orders&page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        const text = await response.text();
        console.warn(`🛡️ [Order Sync Warning]: Server returned ${response.status}. Body: ${text.substring(0, 100)}...`);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("🛡️ [Order Sync Warning]: Non-JSON response received.");
        return;
      }

      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      
      setOrders(result.data || []);
      setTotal(result.total || 0);
    } catch (err) {
      console.error('Order Fetch Error:', err);
      toast.error('Failed to sync order vault');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize]);

  const columns = [
    { label: 'Order Identity', align: 'left' },
    { label: 'Customer Detail', align: 'left' },
    { label: 'Financial Volume', align: 'left' },
    { label: 'Logistic Status', align: 'left' },
    { label: 'Governance', align: 'right' }
  ];

  const handleApproveOrder = async (order) => {
    const loadingToast = toast.loading('Processing approval...');
    try {
      const { error: orderErr } = await supabase
        .from('orders')
        .update({ status: 'approved' })
        .eq('id', order.id);

      if (orderErr) throw orderErr;

      // Notify Sellers
      if (order.items && Array.isArray(order.items)) {
        const sellerIds = [...new Set(order.items.map(item => item.seller_id).filter(Boolean))];
        for (const sellerId of sellerIds) {
          const { data: sellerData } = await supabase
            .from('sellers')
            .select('user_id')
            .eq('id', sellerId)
            .single();

          if (sellerData?.user_id) {
            await supabase.from('notifications').insert([{
              user_id: sellerData.user_id,
              title: 'New Approved Order',
              message: `Order #${order.id.substring(0, 8)} has been approved by Admin. Please check your inventory.`,
              type: 'order_approved',
              data: { order_id: order.id }
            }]);
          }
        }
      }

      toast.success('Order approved and sellers notified!', { id: loadingToast });
      fetchOrders();
    } catch (err) {
      console.error('Approval Error:', err);
      toast.error('Failed to approve order', { id: loadingToast });
    }
  };

  const handleShipOrder = async () => {
    if (!shipmentData.tracking_id) return toast.error('Tracking ID Required');
    
    setIsShipping(true);
    const loadingToast = toast.loading('Initiating shipment protocol...');
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'shipped',
          courier_name: shipmentData.courier_name,
          tracking_id: shipmentData.tracking_id
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Notify Buyer
      if (selectedOrder.profiles?.id) {
        await supabase.from('notifications').insert([{
          user_id: selectedOrder.profiles.id,
          title: 'Order Shipped!',
          message: `Your treasures (Order #${selectedOrder.id.substring(0, 8)}) are now in transit via ${shipmentData.courier_name}. Tracking: ${shipmentData.tracking_id}`,
          type: 'order_shipped',
          data: { order_id: selectedOrder.id, tracking_id: shipmentData.tracking_id }
        }]);
      }

      toast.success('Shipment Protocol Active!', { id: loadingToast });
      setIsShipModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error('Shipment Error:', err);
      toast.error('Logistics Sync Failed', { id: loadingToast });
    } finally {
      setIsShipping(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    
    const loadingToast = toast.loading('Executing cancellation protocol...');
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderToCancel.id);

      if (error) throw error;

      // Notify Buyer
      if (orderToCancel.profiles?.id) {
        await supabase.from('notifications').insert([{
          user_id: orderToCancel.profiles.id,
          title: 'Order Cancelled',
          message: `Your order #${orderToCancel.id.substring(0, 8)} has been cancelled as per request.`,
          type: 'order_cancelled',
          data: { order_id: orderToCancel.id }
        }]);
      }

      toast.success('Order Cancelled Successfully', { id: loadingToast });
      setIsCancelConfirmOpen(false);
      setOrderToCancel(null);
      fetchOrders();
    } catch (err) {
      console.error('Cancel Error:', err);
      toast.error('Cancellation Failed', { id: loadingToast });
    }
  };

  const handleRestoreOrder = async (order) => {
    const loadingToast = toast.loading('Restoring order node...');
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'pending',
          cancelled_at: null 
        })
        .eq('id', order.id);

      if (error) throw error;

      // Notify Buyer
      if (order.profiles?.id) {
        await supabase.from('notifications').insert([{
          user_id: order.profiles.id,
          title: 'Order Restored',
          message: `Your order #${order.id.substring(0, 8)} has been restored and is back under review.`,
          type: 'order_restored',
          data: { order_id: order.id }
        }]);
      }

      toast.success('Order Restored to Registry', { id: loadingToast });
      fetchOrders();
    } catch (err) {
      console.error('Restore Error:', err);
      toast.error('Restoration Failed', { id: loadingToast });
    }
  };

  const renderRow = (o) => (
    <>
      <td className="px-8 py-6">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/40 border border-[#1B4332]/5">
               <Package size={16} />
            </div>
            <div>
               <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter">{o.id.substring(0, 8)}</p>
               <p className="text-[9px] font-bold text-[#1B4332]/20 uppercase tracking-widest mt-1">{new Date(o.created_at).toLocaleDateString()}</p>
            </div>
         </div>
      </td>
      <td className="px-8 py-6">
         <p className="text-[12px] font-black text-[#1B4332] uppercase leading-none">{o.profiles?.full_name || 'Guest User'}</p>
         <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest mt-1">{o.profiles?.email}</p>
      </td>
      <td className="px-8 py-6">
         <p className="text-sm font-black text-[#1B4332]">₹{o.total_amount?.toLocaleString() || '0'}</p>
         <p className="text-[9px] font-bold text-[#BC6C25] uppercase tracking-widest mt-1">Transaction Total</p>
      </td>
      <td className="px-8 py-6">
         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${
            o.status === 'delivered' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' :
            o.status === 'shipped' ? 'bg-indigo-500/5 border-indigo-500/10 text-indigo-600' :
            o.status === 'processing' ? 'bg-blue-500/5 border-blue-500/10 text-blue-600' :
            o.status === 'rejected_by_seller' ? 'bg-rose-500/5 border-rose-500/10 text-rose-600' :
            o.status === 'approved' ? 'bg-[#1B4332]/5 border-[#1B4332]/10 text-[#1B4332]' :
            'bg-amber-500/5 border-amber-500/10 text-amber-600'
         }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
               o.status === 'delivered' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
               o.status === 'shipped' ? 'bg-indigo-500 shadow-[0_0_8px_#6366f1]' :
               o.status === 'processing' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' :
               o.status === 'rejected_by_seller' ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]' :
               o.status === 'approved' ? 'bg-[#1B4332] shadow-[0_0_8px_#1b4332]' :
               'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
            }`} />
            <span className="text-[8px] font-black uppercase tracking-widest">
               {o.status === 'processing' ? 'Accepted by Seller' : 
                o.status === 'rejected_by_seller' ? 'Rejected by Seller' : 
                o.status}
            </span>
         </div>
         {o.courier_name && (
           <p className="text-[8px] font-bold text-[#1B4332]/40 uppercase tracking-widest mt-1.5 flex items-center gap-1">
             <Truck size={10} /> {o.courier_name} • {o.tracking_id}
           </p>
         )}
      </td>
      <td className="px-8 py-6 text-right">
         <div className="flex items-center justify-end gap-2">
            {o.status === 'pending' && (
               <button 
                 onClick={() => handleApproveOrder(o)}
                 className="px-4 py-2 bg-[#BC6C25] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-[#A65D1F] transition-all"
               >
                 Approve
               </button>
            )}
            {o.status === 'processing' && (
               <button 
                 onClick={() => {
                   setSelectedOrder(o);
                   setIsShipModalOpen(true);
                 }}
                 className="px-4 py-2 bg-[#1B4332] text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
               >
                 <Truck size={12} /> Ship
               </button>
            )}
            {o.status === 'cancelled' && (
               <button 
                 onClick={() => handleRestoreOrder(o)}
                 className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
               >
                 <RefreshCw size={12} /> Restore
               </button>
            )}
            {o.status !== 'cancelled' && o.status !== 'delivered' && (
               <button 
                 onClick={() => {
                   setOrderToCancel(o);
                   setIsCancelConfirmOpen(true);
                 }}
                 className="p-2 bg-rose-500/5 text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all"
                 title="Cancel Order"
               >
                 <X size={14} />
               </button>
            )}
            <button className="p-2 bg-[#1B4332]/5 text-[#1B4332] rounded-lg hover:bg-[#1B4332]/10 transition-all">
               <Eye size={14} />
            </button>
         </div>
      </td>
    </>
  );

  return (
    <div className="space-y-8">
      <ForgeTable 
         columns={columns}
         data={orders}
         loading={loading}
         emptyMessage="No Orders Found"
         renderRow={renderRow}
         icon={ShoppingCart}
         header={
           <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
              <div className="relative group">
                 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
                 <input 
                   type="text"
                   placeholder="Search orders..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-white border border-[#1B4332]/20 rounded-[8px] pl-10 pr-4 py-2 text-[10px] font-black text-[#1B4332] placeholder:text-[#1B4332]/40 outline-none focus:border-[#BC6C25]/40 focus:bg-white transition-all w-48"
                 />
              </div>

              <SovereignPagination 
                variant="compact"
                currentPage={page}
                totalItems={total}
                itemsPerPage={pageSize}
                onPageChange={setPage}
              />
           </div>
         }
      />

      {/* 🚢 SHIPMENT MODAL */}
      <Modal 
        isOpen={isShipModalOpen} 
        onClose={() => setIsShipModalOpen(false)}
        title="Initiate Logistics"
        maxWidth="max-w-md"
        action={
          <button 
            onClick={handleShipOrder}
            disabled={isShipping}
            className="h-10 px-8 bg-[#BC6C25] text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {isShipping ? <Loader2 size={16} className="animate-spin" /> : <><span>Assign Courier</span><Truck size={16} /></>}
          </button>
        }
      >
        <div className="p-8 space-y-6">
           <div className="flex items-center gap-4 p-4 bg-[#FDFBF7] rounded-2xl border border-[#1B4332]/5">
              <div className="w-12 h-12 rounded-xl bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332]/40">
                 <Package size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-[#1B4332]/20 uppercase tracking-widest">Selected Order</p>
                 <p className="text-sm font-black text-[#1B4332] uppercase">#{selectedOrder?.id.substring(0, 8)}</p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                    <Truck size={12} className="text-[#BC6C25]" /> Logistics Partner
                 </label>
                 <select 
                   value={shipmentData.courier_name}
                   onChange={(e) => setShipmentData(prev => ({ ...prev, courier_name: e.target.value }))}
                   className="w-full bg-[#1B4332]/5 border-none rounded-xl p-3 text-xs font-bold text-[#1B4332] outline-none ring-2 ring-transparent focus:ring-[#BC6C25]/30 transition-all appearance-none"
                 >
                    <option value="DTDC">DTDC Logistics</option>
                    <option value="Delhivery">Delhivery</option>
                    <option value="BlueDart">BlueDart</option>
                    <option value="India Post">India Post</option>
                    <option value="In-House">In-House Courier</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-widest text-[#1B4332]/40 flex items-center gap-2">
                    <Hash size={12} className="text-[#BC6C25]" /> Tracking ID / AWB
                 </label>
                 <input 
                   type="text"
                   placeholder="Enter Waybill Number..."
                   value={shipmentData.tracking_id}
                   onChange={(e) => setShipmentData(prev => ({ ...prev, tracking_id: e.target.value }))}
                   className="w-full bg-[#1B4332]/5 border-none rounded-xl p-3 text-xs font-bold text-[#1B4332] outline-none ring-2 ring-transparent focus:ring-[#BC6C25]/30 transition-all placeholder:text-[#1B4332]/20"
                 />
              </div>
           </div>

           <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
              <p className="text-[8px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed flex items-start gap-2">
                 <AlertCircle size={12} className="shrink-0" />
                 Assigning a courier will notify the buyer via email and push alert. Ensure the tracking ID is valid before assignment.
              </p>
           </div>
        </div>
      </Modal>

      {/* 🛑 CANCELLATION CONFIRMATION */}
      <ConfirmDialog 
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        onConfirm={handleCancelOrder}
        title="Execute Order Cancellation"
        message={`Are you sure you want to permanently cancel Order #${orderToCancel?.id.substring(0, 8)}? This action will notify all stakeholders and stop the fulfillment chain.`}
        confirmText="Confirm Cancellation"
      />
    </div>
  );
}

export default function OrderRegistryPage() {
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center h-[400px] gap-4"><Loader2 className="animate-spin text-[#BC6C25]" size={32} /></div>}>
      <OrderRegistryContent />
    </Suspense>
  );
}
