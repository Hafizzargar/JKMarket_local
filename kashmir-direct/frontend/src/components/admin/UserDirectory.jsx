'use client';

import { User, Shield, Briefcase, HardHat, Store, ChevronRight, Fingerprint } from 'lucide-react';
import { ForgeTable, ForgeBadge } from './shared/ForgeComponents';

export default function UserDirectory({ users }) {
  const getRoleIcon = (role) => {
    switch(role) {
      case 'manager':    return Briefcase;
      case 'labour':     return HardHat;
      case 'seller':     return Store;
      case 'superadmin': return Shield;
      default:           return User;
    }
  };

  const getRoleVariant = (role) => {
    switch(role) {
      case 'superadmin': return 'warning';
      case 'manager':    return 'indigo';
      case 'seller':     return 'success';
      default:           return 'neutral';
    }
  };

  const columns = [
    { label: 'Identity Node', width: '40%' },
    { label: 'Access Clearance', width: '35%' },
    { label: 'Status', width: '25%', align: 'right' }
  ];

  const renderRow = (u, idx) => (
    <>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#1B4332]/5 rounded-xl flex items-center justify-center text-[#1B4332]/40 group-hover:bg-[#BC6C25]/10 group-hover:text-[#BC6C25] transition-all border border-[#1B4332]/5 shrink-0">
            <User size={18} />
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="text-[13px] font-black tracking-tight text-[#1B4332] truncate">{u.full_name || 'Anonymous'}</p>
            <p className="text-[9px] font-bold text-[#1B4332]/30 uppercase tracking-widest truncate">{u.email}</p>
          </div>
        </div>
      </td>

      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1B4332]/5 rounded-lg flex items-center justify-center text-[#1B4332]/40 border border-[#1B4332]/5 shrink-0">
            {(() => { const Icon = getRoleIcon(u.role); return <Icon size={14} />; })()}
          </div>
          <div className="flex flex-col min-w-0">
            <ForgeBadge label={u.role || 'user'} variant={getRoleVariant(u.role)} />
            <span className="text-[7px] font-bold text-[#1B4332]/20 uppercase tracking-widest italic mt-1">
              Level: {u.role === 'superadmin' ? '∞' : '01'}
            </span>
          </div>
        </div>
      </td>

      <td className="px-8 py-6 text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 rounded-full border border-emerald-500/10">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]" />
          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Active</span>
        </div>
      </td>
    </>
  );

  return (
    <ForgeTable
      columns={columns}
      data={users}
      renderRow={renderRow}
      emptyMessage="No users found"
      icon={Fingerprint}
    />
  );
}
