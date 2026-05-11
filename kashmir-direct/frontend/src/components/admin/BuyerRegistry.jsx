import { User, Mail, Calendar, ArrowUpRight, ShieldCheck, MapPin, ShieldAlert, Search } from 'lucide-react';
import { ForgeTable } from './shared/ForgeComponents';
import SovereignPagination from './SovereignPagination';

export default function BuyerRegistry({ 
  buyers = [], 
  onManage, 
  loading = false,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPageSizeChange
}) {
  const columns = [
    { label: 'Guest Information', align: 'left' },
    { label: 'Location', align: 'center' },
    { label: 'Join Date', align: 'center' },
    { label: 'Contact Registry', align: 'left' },
    { label: 'Status', align: 'right' }
  ];

  const renderRow = (b) => (
    <>
      {/* 👤 GUEST IDENTITY */}
      <td className="px-8 py-6">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center text-white font-black text-[12px] shadow-lg shadow-[#1B4332]/20 group-hover:scale-105 transition-transform overflow-hidden">
               {b.avatar_url ? <img src={b.avatar_url} className="w-full h-full object-cover" /> : b.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="space-y-0.5">
               <p className="text-[13px] font-black text-[#1B4332] uppercase tracking-tight group-hover:text-[#BC6C25] transition-colors">{b.full_name || 'Guest User'}</p>
               <span className="text-[8px] font-black text-[#1B4332]/30 uppercase tracking-widest">ID: {b.id.substring(0, 8)}</span>
            </div>
         </div>
      </td>

      {/* 📍 LOCATION */}
      <td className="px-4 py-6 text-center">
         <div className="flex flex-col items-center">
            <MapPin size={10} className="text-[#BC6C25] opacity-40 mb-1" />
            <span className="text-[10px] font-black text-[#1B4332]/60 uppercase tracking-tighter">{b.address?.city || 'Unset'}</span>
         </div>
      </td>

      {/* 📅 JOIN DATE */}
      <td className="px-4 py-6 text-center">
         <div className="space-y-0">
            <p className="text-[11px] font-black text-[#1B4332] tracking-tighter">{new Date(b.created_at).toLocaleDateString()}</p>
            <p className="text-[7px] font-bold text-[#1B4332]/20 uppercase tracking-widest">Member Since</p>
         </div>
      </td>

      {/* 📧 CONTACT */}
      <td className="px-4 py-6">
         <div className="space-y-0">
            <p className="text-[11px] font-black text-[#1B4332] uppercase tracking-tight">{b.email}</p>
            <p className="text-[8px] font-bold text-[#1B4332]/20 uppercase tracking-widest italic">{b.phone || 'No Phone'}</p>
         </div>
      </td>

      {/* 🛡️ STATUS */}
      <td className="px-8 py-6 text-right">
         <button 
           onClick={() => onManage(b)}
           className={`inline-flex items-center gap-2 h-9 px-5 rounded-xl border transition-all active:scale-95 group/btn shadow-md ${b.status === 'banned' ? 'bg-rose-500 text-white border-rose-600' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-600 hover:bg-rose-500 hover:text-white hover:border-rose-600'}`}
         >
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">{b.status === 'banned' ? 'Restricted' : 'Manage Access'}</span>
            <ShieldAlert size={14} className="group-hover/btn:scale-110 transition-transform" />
         </button>
      </td>
    </>
  );

  return (
    <ForgeTable 
      columns={columns}
      data={buyers || []}
      loading={loading}
      emptyMessage="No Buyers Registered"
      renderRow={renderRow}
      icon={User}
      header={
        <div className="flex items-center justify-between px-6 py-3 bg-[#FDFBF7]/50 border-b border-[#1B4332]/5">
           {/* 🔍 COMPACT SEARCH */}
           <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1B4332]/40 group-focus-within:text-[#BC6C25] transition-colors" />
              <input 
                type="text"
                placeholder="Search buyers..."
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
