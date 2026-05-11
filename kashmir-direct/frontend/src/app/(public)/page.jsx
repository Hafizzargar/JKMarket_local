'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../context/AuthContext';
import LogisticsAnimation from '../../components/ui/LogisticsAnimation';
import ProductGrid from '../../components/products/ProductGrid';
import Button from '../../components/ui/Button';
import Logo from '../../components/ui/Logo';

const categories = [
  { name: 'Saffron & Spices', icon: '🌸', color: 'bg-[#FEF9C3]', slug: 'saffron' },
  { name: 'Pashmina Shawls', icon: '🧣', color: 'bg-[#F3E8FF]', slug: 'pashmina' },
  { name: 'Fresh Apples', icon: '🍎', color: 'bg-[#FEE2E2]', slug: 'fruits' },
  { name: 'Walnuts & Honey', icon: '🌰', color: 'bg-[#FEF3C7]', slug: 'dry-fruits' },
  { name: 'Paper Mache', icon: '🏺', color: 'bg-[#ECFDF5]', slug: 'paper-mache' },
  { name: 'Handicrafts', icon: '🧶', color: 'bg-[#F0F9FF]', slug: 'handicrafts' },
];

const blogs = [
  {
    title: "The Saffron Harvest: A Family Tradition",
    excerpt: "Journey to the purple fields of Pampore where the world's most expensive spice is hand-picked at dawn.",
    date: "Oct 24, 2026",
    tag: "TRADITION",
    image: "🏔️"
  },
  {
    title: "The Secret of the Pashmina Loom",
    excerpt: "Meet Ahmed, who has spent 40 years perfecting the delicate art of hand-weaving Pashmina.",
    date: "Sep 12, 2026",
    tag: "CRAFT",
    image: "🧶"
  },
  {
    title: "Organic Honey: From Forest to Jar",
    excerpt: "How our wild honey collection supports local biodiversity and preserves ancient forest traditions.",
    date: "Aug 05, 2026",
    tag: "ORGANIC",
    image: "🍯"
  }
];


export default function HomePage() {
  const { user } = useAuth();
  const { products, fetchProducts } = useStore();

  useEffect(() => {
    fetchProducts(user);
  }, [user, fetchProducts]);

  const featuredProducts = (products || []).slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0.5, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="relative min-h-screen selection:bg-[#1B4332] selection:text-white">

      {/* HERO SECTION */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center items-center px-6 overflow-hidden bg-[#FDFBF7]/30 pt-40 sm:pt-48">
        <div className="max-w-7xl mx-auto text-center relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-5 py-2 rounded-full border border-[#1B4332]/10 mb-12 bg-white/60 backdrop-blur-md shadow-sm"
          >
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">Verified Local Heritage</span>
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black tracking-tight text-[#1B4332] mb-6 leading-[1.1] sm:leading-[1.15]">
            Direct Shop Management<br/>
            <span className="text-[#BC6C25] font-serif italic font-normal tracking-wide lowercase">& inventory systems</span>
          </h1>
          <p className="mt-12 text-base sm:text-xl text-[#1B4332]/50 max-w-2xl mx-auto font-medium leading-loose tracking-wide px-4 sm:px-0">
            The all-in-one shop management software for local stores. From team management dashboards to a simple inventory system and delivery management for India—all protected by a secure admin system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-20 pb-12 px-6 sm:px-0">
            <Link href="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-56 h-16 rounded-full shadow-2xl">Shop Now</Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-56 h-16 rounded-full">Join Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-24 sm:py-32 px-6 bg-[#FDFBF7]/80 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#1B4332]/10 to-transparent" />
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-20 gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BC6C25]/10 border border-[#BC6C25]/20">
                  <Sparkles size={12} className="text-[#BC6C25]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#BC6C25]">Featured Picks</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-[#1B4332] tracking-tighter uppercase">Our <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Featured</span> Products</h2>
              </div>
              <Link href="/products" className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#BC6C25] transition-colors flex items-center gap-2 pb-2 group">
                View Full Shop <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* LOGISTICS STORY */}
      <section className="relative py-24 px-6 border-t border-[#1B4332]/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#1B4332]/30 mb-4">Direct Delivery Path</h2>
            <div className="w-10 h-0.5 bg-[#BC6C25]/30 mx-auto rounded-full" />
          </motion.div>
          <LogisticsAnimation />
        </div>
      </section>

      {/* BLOGS: STORIES FROM THE VALLEY */}
      <section className="py-24 px-6 border-b border-[#1B4332]/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#BC6C25] mb-4">Valley Journal</h2>
              <h3 className="text-4xl font-black text-[#1B4332] tracking-tighter">Stories from the Source</h3>
            </div>
            <Link href="/blog" className="text-xs font-black uppercase tracking-widest text-[#1B4332]/40 hover:text-[#BC6C25] transition-colors">Read All Stories &rarr;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((post, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="glass-card aspect-[4/5] rounded-[3rem] overflow-hidden mb-8 border border-[#1B4332]/5 relative flex items-center justify-center group-hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1B4332]/5" />
                  <span className="text-8xl opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">{post.image}</span>
                  <div className="absolute top-8 left-8">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-black tracking-widest text-[#1B4332] uppercase">{post.tag}</span>
                  </div>
                </div>
                <div className="px-4">
                  <span className="text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest">{post.date}</span>
                  <h4 className="text-2xl font-black text-[#1B4332] mt-3 mb-4 leading-tight group-hover:text-[#BC6C25] transition-colors">{post.title}</h4>
                  <p className="text-sm text-[#1B4332]/50 leading-relaxed font-medium line-clamp-2">{post.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TWO PATHS */}
      <section className="py-24 px-6 bg-[#1B4332]/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <Link href="/products" className="group">
            <div className="glass-card p-10 sm:p-20 rounded-[3.5rem] border border-[#1B4332]/5 hover:bg-white h-full relative overflow-hidden transition-all duration-700">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl">🏡</div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 mb-10">Local Shop Delivery</div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#1B4332] mb-6">Shop Management</h3>
                <p className="text-[#1B4332]/50 font-bold text-lg leading-relaxed">Direct shop management software for local stores to sell pure saffron and textiles.</p>
                <div className="mt-12 opacity-40 group-hover:opacity-100 transition-opacity"><span className="text-xs font-black uppercase tracking-widest text-[#1B4332]">Explore &rarr;</span></div>
              </div>
            </div>
          </Link>
          <Link href="/register?type=business" className="group">
            <div className="glass-card p-10 sm:p-20 rounded-[3.5rem] border border-[#BC6C25]/5 hover:bg-white h-full relative overflow-hidden transition-all duration-700">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl">🏬</div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BC6C25]/40 mb-10">Delivery Management App</div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#1B4332] mb-6">Inventory System</h3>
                <p className="text-[#1B4332]/50 font-bold text-lg leading-relaxed">Verified small business inventory system for retail, hotels, and export partners worldwide.</p>
                <div className="mt-12 opacity-40 group-hover:opacity-100 transition-opacity"><span className="text-xs font-black uppercase tracking-widest text-[#BC6C25]">Partner &rarr;</span></div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 🔬 NEW: QUALITY & PURITY GUARANTEE */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1B4332]/[0.02] -skew-y-3 origin-right" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#BC6C25]/20">
                <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#BC6C25]">Lab Verified</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-[#1B4332] tracking-tighter leading-[1.1]">
                Quality <br/>
                <span className="text-[#BC6C25] font-serif italic font-normal">Guarantee</span>
              </h2>
              <p className="text-lg text-[#1B4332]/60 font-medium leading-relaxed max-w-xl">
                Every product from the valley undergoes a three-stage verification process before receiving the "Verified Local" seal.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                {[
                  { title: "Potency Test", desc: "Saffron crocin levels verified in regional labs.", icon: "🔬" },
                  { title: "Fiber Analysis", desc: "Pashmina micron count checked for pure authenticity.", icon: "🧶" },
                  { title: "Organic Origin", desc: "Soil and water purity checked at the source.", icon: "🌱" },
                  { title: "Direct Seal", desc: "Tamper-proof tags applied post-check.", icon: "🏷️" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div>
                      <h4 className="text-xs font-black text-[#1B4332] uppercase tracking-wider">{item.title}</h4>
                      <p className="text-[11px] text-[#1B4332]/40 font-bold mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332]/5 to-[#BC6C25]/5 rounded-[4rem] blur-3xl opacity-30" />
               <div className="glass-card h-full w-full rounded-[4rem] border border-[#1B4332]/10 flex flex-col items-center justify-center p-8 sm:p-12 text-center group relative overflow-hidden">
                  <div className="absolute inset-0 bg-organic-mesh opacity-5 pointer-events-none" />
                  
                  {/* 🛡️ SEAL ARCHITECTURE */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-[#BC6C25]/10 flex items-center justify-center relative mb-10 sm:mb-12 group-hover:scale-105 transition-transform duration-1000">
                     <div className="absolute inset-4 rounded-full bg-[#BC6C25]/5 blur-xl animate-pulse" />
                     <div className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#BC6C25] to-[#8B4513] flex items-center justify-center shadow-2xl shadow-[#BC6C25]/20 border-4 border-white/20">
                        <ShieldCheck size={48} className="text-white drop-shadow-lg" />
                     </div>
                     <div className="absolute inset-0 border border-dashed border-[#BC6C25]/20 rounded-full animate-[spin_20s_linear_infinite]" />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#1B4332] uppercase tracking-tighter">Verified Local</h3>
                  <p className="mt-4 text-[10px] sm:text-xs font-bold text-[#1B4332]/40 leading-relaxed max-w-xs mx-auto uppercase tracking-wide">
                    Scanning this seal reveals the lab report, artisan details, and harvest date.
                  </p>
                  
                  <Link href="/products" className="mt-10 sm:mt-12">
                    <Button 
                      className="h-12 px-10 rounded-full bg-[#1B4332] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#1B4332]/20 hover:-translate-y-1 transition-all duration-300"
                    >
                      View Sample Report
                    </Button>
                  </Link>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🏛️ GOVERNANCE ARCHITECTURE */}
      <section className="py-24 px-6 bg-[#FDFBF7]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B4332]/10 mb-6">
                <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">Admin Access Roles</span>
             </div>
             <h2 className="text-4xl sm:text-5xl font-black text-[#1B4332] tracking-tighter">
                Staff & <span className="text-[#BC6C25] font-serif italic font-normal">Inventory</span> Management
             </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
            {/* Super Admin */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-[3rem] p-10 border border-blue-500/10 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🛡️</div>
                <div>
                  <h3 className="text-xl font-black text-blue-900">Super Admin</h3>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Main Access</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Manage All Profiles", "Verify Artisans", "Marketplace Logistics", 
                  "Business Stats", "Manage Categories", "Security Controls", "Monitor Activity"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-xs font-bold text-[#1B4332]/60">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Shopkeeper */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-[3rem] p-10 border border-emerald-500/10 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-sm">🏪</div>
                <div>
                  <h3 className="text-xl font-black text-emerald-900">Shop Manager</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Shop Access Only</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Inventory Management", "Sales Control", "Order Fulfilment", 
                  "Revenue Stats", "My Shop Profile"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-xs font-bold text-[#1B4332]/60">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Buyer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[3rem] p-10 border border-[#BC6C25]/10 shadow-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#BC6C25]/5 rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-[#BC6C25]/5 text-[#BC6C25] rounded-2xl flex items-center justify-center text-3xl shadow-sm">🛍️</div>
                <div>
                  <h3 className="text-xl font-black text-[#BC6C25]">Buyer</h3>
                  <p className="text-[10px] font-bold text-[#BC6C25]/40 uppercase tracking-widest mt-0.5">Shopping Access</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Complete Catalog Access", "Origin Details", "Fast Checkout", 
                  "Order History", "Manage My Account"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#BC6C25]/10 text-[#BC6C25] flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-xs font-bold text-[#1B4332]/60">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HARVEST GRID */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tighter">The Collection</h2>
              <p className="text-[#1B4332]/30 font-bold mt-2 text-lg">Handpicked items from the valley.</p>
            </div>
            <Link href="/categories" className="text-[10px] font-black uppercase tracking-widest text-[#BC6C25] hover:opacity-100 transition-opacity">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Link key={i} href={`/products?category=${cat.slug}`}>
                <motion.div whileHover={{ y: -6 }} className="glass-card p-8 rounded-[2.5rem] text-center border-transparent hover:border-[#1B4332]/5 transition-all group">
                  <div className={`${cat.color} w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>{cat.icon}</div>
                  <h3 className="font-black text-[#1B4332] text-xs tracking-tight">{cat.name}</h3>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-32 sm:py-48 lg:py-60 px-6 bg-[#1B4332] rounded-t-[5rem] sm:rounded-t-[8rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <h2 className="text-4xl sm:text-6xl lg:text-[6rem] font-black text-white leading-[1.1] tracking-[-0.03em] sm:tracking-tighter">
                Pure Tradition. <br/>
                <span className="text-[#BC6C25] font-serif italic font-normal lowercase">Direct to You.</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 px-6 sm:px-0">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:px-24 h-16 rounded-full text-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform">Shop the Collection</Button>
                </Link>
                <Link href="/register">
                  <button className="text-xs font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all group flex items-center gap-3">
                    Join Our Community <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
