'use client';

import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#FDFBF7] border-t border-[#1B4332]/5 mt-auto py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-md">
            <Logo className="h-20 w-auto mb-8" />
            <p className="text-slate-600 text-lg font-bold leading-relaxed">
              Empowering the farmers, artisans, and creators of Jammu & Kashmir. 
              Connecting you directly to the source of pure heritage.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-24">
            <div className="space-y-6">
              <h4 className="text-[#1B4332] font-black uppercase tracking-widest text-sm">Marketplace</h4>
              <ul className="space-y-4">
                <li><a href="/products" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">All Products</a></li>
                <li><a href="/sellers" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Meet Artisans</a></li>
                <li><a href="/categories" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Collections</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[#1B4332] font-black uppercase tracking-widest text-sm">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Our Story</a></li>
                <li><a href="#" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Trust & Safety</a></li>
                <li><a href="#" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[#1B4332] font-black uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-500 hover:text-[#BC6C25] font-bold transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 pt-12 border-t border-[#1B4332]/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm font-black tracking-widest uppercase">
            &copy; {new Date().getFullYear()} DirectFromKashmirJammu. Rooted in Trust.
          </p>
          <div className="flex items-center space-x-6 text-[#1B4332]/20">
            <span className="text-2xl">🏔️</span>
            <span className="text-2xl">🌿</span>
            <span className="text-2xl">🏺</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
