import { Store, ShieldCheck, Zap, Package, MapPin, Mail, Clock, Search, ShieldAlert } from 'lucide-react';
import { ForgeTable, ForgeBadge, ForgeButton } from './shared/ForgeComponents';
import SovereignPagination from './SovereignPagination';

export default function ArtisanRegistry({ 
  shopkeepers = [], 
  onEdit, 
  loading = false,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange
}) {
  const columns = [
    { label: 'Owner Details', align: 'left' },
    { label: 'Shop Details', align: 'left' },
    { label: 'Verification', align: 'center' },
    { label: 'Max Products', align: 'center' },
    { label: 'Actions', align: 'right' }
  ];

  const renderRow = (sk) => (
    <>
      {/* 👤 OWNER DETAILS */}
      <td className="px-4 py-3">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1B4332]/5 flex items-center justify-center text-[#1B4332] border border-[#1B4332]/10 font-black text-[12px] group-hover:bg-[#1B4332] group-hover:text-white transition-all duration-300">
               {sk.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="space-y-0.5">
               <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tight leading-none">{sk.profiles?.full_name || 'Artisan Head'}</p>
               <div className="flex items-center gap-1.5 opacity-40">
                  <Mail size={10} />
                  <p className="text-[9px] font-bold lowercase tracking-tight">{sk.profiles?.email}</p>
               </div>
            </div>
         </div>
      </td>

      {/* 🏪 SHOP DETAILS */}
      <td className="px-4 py-3">
         <div className="space-y-1.5">
            <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tighter leading-none">{sk.shop_name}</p>
            <div className="flex flex-col gap-1">
               <p className="text-[8px] font-black text-[#BC6C25] uppercase tracking-[0.3em]">{sk.profiles?.full_name || 'Proprietor'}</p>
               <div className="flex items-center gap-1.5 text-[#1B4332]/40">
                  <MapPin size={10} className="text-[#BC6C25]" />
                  <p className="text-[8px] font-black uppercase tracking-[0.1em]">{sk.location || 'Kashmir, India'}</p>
               </div>
            </div>
         </div>
      </td>

      {/* 🛡️ VERIFICATION */}
      <td className="px-4 py-3 text-center">
         <ForgeBadge 
            label={sk.is_verified ? 'Verified' : 'Pending'}
            variant={sk.is_verified ? 'success' : 'warning'}
            icon={sk.is_verified ? ShieldCheck : Clock}
         />
      </td>

      {/* 📦 MAX PRODUCTS */}
      <td className="px-4 py-3 text-center">
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
               <Package size={14} className="text-[#1B4332]/20" />
               <p className="text-[15px] font-black text-[#1B4332] tracking-tighter">{sk.product_limit}</p>
            </div>
            <p className="text-[8px] font-bold text-[#1B4332]/30 uppercase tracking-[0.2em]">Items Allowed</p>
         </div>
      </td>

      {/* 🚀 ACTIONS */}
      <td className="px-4 py-3 text-right">
         <ForgeButton 
           variant="primary" 
           icon={Zap} 
           onClick={() => onEdit(sk)}
         >
            Manage
         </ForgeButton>
      </td>
    </>
  );

  return (
    <ForgeTable 
      columns={columns}
      data={shopkeepers || []}
      loading={loading}
      emptyMessage="No Shopkeepers Found"
      renderRow={renderRow}
      icon={Store}
      header={
        <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
           {/* 🔍 COMPACT SEARCH */}
           <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
              <input 
                type="text"
                placeholder="Search artisans..."
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
