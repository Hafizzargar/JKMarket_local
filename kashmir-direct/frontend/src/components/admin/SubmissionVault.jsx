import { Package, Scale, ArrowUpRight, Search } from 'lucide-react';
import { ForgeTable, ForgeButton } from './shared/ForgeComponents';
import SovereignPagination from './SovereignPagination';

export default function SubmissionVault({ 
  products = [], 
  onInspect, 
  loading = false,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange
}) {
  const columns = [
    { label: 'Product Info', align: 'left' },
    { label: 'Weight', align: 'center' },
    { label: 'Price', align: 'center' },
    { label: 'Shop Name', align: 'left' },
    { label: 'Status', align: 'center' },
    { label: 'Action', align: 'right' }
  ];

  const renderRow = (p, idx) => (
    <>
      {/* 🏺 PRODUCT IDENTITY */}
      <td className="px-5 py-5">
         <div className="space-y-0.5">
            <p className="text-[12px] font-black text-[#1B4332] uppercase tracking-tight group-hover:text-[#BC6C25] transition-colors">{p.title || p.name}</p>
            <span className="text-[8px] font-black text-[#1B4332]/30 uppercase tracking-widest">{p.category}</span>
         </div>
      </td>

      {/* ⚖️ WEIGHT */}
      <td className="px-5 py-5 text-center">
         <div className="flex flex-col items-center">
            <Scale size={10} className="text-[#BC6C25] opacity-40 mb-0.5" />
            <span className="text-[10px] font-black text-[#1B4332]/60 uppercase tracking-tighter">{p.weight}{p.unit || 'g'}</span>
         </div>
      </td>

      {/* 💰 PRICE */}
      <td className="px-5 py-5 text-center">
         <div className="space-y-0">
            <p className="text-[14px] font-black text-[#1B4332]">₹{p.price}</p>
            <p className="text-[7px] font-bold text-[#1B4332]/20 uppercase tracking-tighter">₹{(p.price / (p.weight || 1)).toFixed(2)}/u</p>
         </div>
      </td>

      {/* 🏷️ SHOP */}
      <td className="px-5 py-5">
         <div className="space-y-0">
            <p className="text-[11px] font-black text-[#1B4332] uppercase tracking-tight truncate max-w-[120px]">{p.sellers?.shop_name || 'Individual'}</p>
            <p className="text-[8px] font-bold text-[#1B4332]/20 uppercase tracking-widest italic truncate max-w-[120px]">{p.sellers?.profiles?.full_name || 'Seller'}</p>
         </div>
      </td>

      {/* 🛡️ STATUS */}
      <td className="px-5 py-5">
         <div className="flex justify-center">
            <div className={`px-3 py-1 rounded-[10px] text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${p.is_approved ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600' : p.status === 'rejected' ? 'bg-rose-500/5 border-rose-500/10 text-rose-600' : 'bg-amber-500/5 border-amber-500/10 text-amber-600'}`}>
               <div className={`w-1 h-1 rounded-full ${p.is_approved ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : p.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'}`} />
               {p.is_approved ? 'Live' : p.status === 'rejected' ? 'Returned' : 'Review'}
            </div>
         </div>
      </td>

      {/* 🚀 ACTION */}
      <td className="px-5 py-5 text-right">
         <ForgeButton 
           variant="primary" 
           icon={ArrowUpRight} 
           onClick={() => onInspect(p)}
         >
            Check
         </ForgeButton>
      </td>
    </>
  );

  return (
    <ForgeTable 
      columns={columns}
      data={products}
      loading={loading}
      emptyMessage="No Pending Products"
      renderRow={renderRow}
      icon={Package}
      header={
        <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
           {/* 🔍 COMPACT SEARCH */}
           <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
              <input 
                type="text"
                placeholder="Search products..."
                className="bg-white border border-[#1B4332]/20 rounded-[8px] pl-10 pr-4 py-2 text-[10px] font-black text-[#1B4332] placeholder:text-[#1B4332]/40 outline-none focus:border-[#BC6C25]/40 focus:bg-white transition-all w-48"
              />
           </div>

           {/* 🚀 COMPACT NAVIGATION */}
           <SovereignPagination 
             variant="compact"
             currentPage={currentPage}
             totalItems={totalItems}
             itemsPerPage={itemsPerPage}
             onPageChange={onPageChange}
           />
        </div>
      }
    />
  );
}
