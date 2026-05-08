'use client';

import { Briefcase, UserCircle, Plus, Settings } from 'lucide-react';
import Button from '../ui/Button';

export default function OpsCommand({ managers }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-16 shadow-2xl relative overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-5 text-white"><Briefcase size={200} /></div>
       <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white">Operations Command</h3>
       <p className="text-sm font-medium text-white/20 mt-2 mb-12 max-w-xl italic">The elite personnel layer responsible for manual marketplace oversight and labour force governance.</p>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {managers.map(m => (
            <div key={m.id} className="bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] hover:border-[#BC6C25]/40 transition-all group">
               <div className="w-16 h-16 bg-[#BC6C25]/20 text-[#BC6C25] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform"><UserCircle size={32} /></div>
               <h4 className="text-xl font-black tracking-tight text-white">{m.full_name}</h4>
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1 mb-6">{m.email}</p>
               <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 h-12 rounded-2xl border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">Team Stats</Button>
                  <Button variant="outline" className="w-12 h-12 rounded-2xl border-white/10 flex items-center justify-center p-0 text-white/40 hover:text-white"><Settings size={16} /></Button>
               </div>
            </div>
          ))}
          <button className="bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-4 group hover:border-[#BC6C25]/20 transition-all">
             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-[#BC6C25] transition-colors"><Plus size={24} /></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Commission Manager</p>
          </button>
       </div>
    </div>
  );
}
