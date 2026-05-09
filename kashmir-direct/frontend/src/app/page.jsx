'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import LogisticsAnimation from '../components/ui/LogisticsAnimation';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

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
    tag: "HERITAGE",
    image: "🏔️"
  },
  {
    title: "The Secret of the Pashmina Loom",
    excerpt: "Meet Master Artisan Ahmed, who has spent 40 years perfecting the delicate art of hand-weaving Pashmina.",
    date: "Sep 12, 2026",
    tag: "ARTISAN",
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
      <div className="bg-organic-mesh" />

      {/* 🛡️ MINIMALIST ELITE HEADER (No Navbar) */}
      <header className="absolute top-0 left-0 right-0 h-24 flex items-center justify-between px-8 sm:px-12 z-50">
         <Link href="/" className="hover:opacity-70 transition-opacity">
            <Logo className="h-10 sm:h-12" />
         </Link>
         <div className="flex items-center gap-8">
            <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 hover:text-[#1B4332] transition-colors">
               Log In
            </Link>
            <Link href="/register">
               <Button size="sm" className="h-10 px-6 text-[9px]">Join</Button>
            </Link>
         </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 sm:pt-40 pb-20 px-6 overflow-hidden">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-7xl mx-auto text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B4332]/10 mb-10">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">Verified Valley Heritage</span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#1B4332] mb-10 leading-[1.1]">
            Elite Shop Management<br/>
            <span className="text-[#BC6C25] font-serif italic font-normal tracking-wide">& Inventory Systems</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-8 text-sm sm:text-lg text-[#1B4332]/50 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide">
            The all-in-one shop management software for local stores. From labour management dashboards to a small business inventory system and delivery management for India—all protected by a secure role-based admin system.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 pb-12">
            <Link href="/products" className="w-full sm:w-auto"><Button size="sm" className="w-full sm:w-44 h-11">Shop Authentic</Button></Link>
            <Link href="/register" className="w-full sm:w-auto"><Button size="sm" variant="secondary" className="w-full sm:w-44 h-11">Join Community</Button></Link>
          </motion.div>
        </motion.div>
      </section>

      {/* LOGISTICS STORY */}
      <section className="relative py-24 px-6 border-t border-[#1B4332]/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-[#1B4332]/30 mb-4">Direct Supply Path</h2>
            <div className="w-10 h-0.5 bg-[#BC6C25]/30 mx-auto rounded-full" />
          </motion.div>
          <LogisticsAnimation />
        </div>
      </section>

      {/* BLOGS: STORIES FROM THE VALLEY - NEW SECTION */}
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
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1B4332]/40 mb-10">Local Store Delivery</div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#1B4332] mb-6">Marketplace Management</h3>
                <p className="text-[#1B4332]/50 font-bold text-lg leading-relaxed">Direct shop management software for local stores to sell pure saffron and textiles.</p>
                <div className="mt-12 opacity-40 group-hover:opacity-100 transition-opacity"><span className="text-xs font-black uppercase tracking-widest text-[#1B4332]">Explore &rarr;</span></div>
              </div>
            </div>
          </Link>
          <Link href="/register?type=business" className="group">
            <div className="glass-card p-10 sm:p-20 rounded-[3.5rem] border border-[#BC6C25]/5 hover:bg-white h-full relative overflow-hidden transition-all duration-700">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-8xl">🏬</div>
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#BC6C25]/40 mb-10">Delivery Management App India</div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#1B4332] mb-6">Business Inventory System</h3>
                <p className="text-[#1B4332]/50 font-bold text-lg leading-relaxed">Verified small business inventory system for retail, hotels, and export partners worldwide.</p>
                <div className="mt-12 opacity-40 group-hover:opacity-100 transition-opacity"><span className="text-xs font-black uppercase tracking-widest text-[#BC6C25]">Partner &rarr;</span></div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 🔬 NEW: QUALITY & PURITY VAULT */}
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
                The Purity <br/>
                <span className="text-[#BC6C25] font-serif italic font-normal">Vault</span>
              </h2>
              <p className="text-lg text-[#1B4332]/60 font-medium leading-relaxed max-w-xl">
                Every treasure from the valley undergoes a three-stage scientific verification process before receiving the "Verified Valley" seal.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
                {[
                  { title: "Potency Test", desc: "Saffron crocin levels verified in regional labs.", icon: "🔬" },
                  { title: "Fiber Analysis", desc: "Pashmina micron count checked for pure authenticity.", icon: "🧶" },
                  { title: "Organic Origin", desc: "Soil and water purity checked at the source.", icon: "🌱" },
                  { title: "Direct Seal", desc: "Tamper-proof heritage tags applied post-check.", icon: "🏷️" }
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332]/10 to-[#BC6C25]/10 rounded-[4rem] blur-3xl opacity-30" />
               <div className="glass-card h-full w-full rounded-[4rem] border border-[#1B4332]/5 flex flex-col items-center justify-center p-12 text-center group">
                  <div className="w-48 h-48 rounded-full border-8 border-dashed border-[#BC6C25]/10 flex items-center justify-center relative mb-12 group-hover:rotate-12 transition-transform duration-1000">
                     <span className="text-9xl">🛡️</span>
                     <div className="absolute inset-0 border-4 border-[#1B4332]/5 rounded-full animate-ping" />
                  </div>
                  <h3 className="text-2xl font-black text-[#1B4332] uppercase tracking-tighter">Verified Heritage</h3>
                  <p className="mt-4 text-xs font-bold text-[#1B4332]/40 leading-relaxed max-w-xs mx-auto">
                    Scanning this seal reveals the laboratory report, artisan identity, and harvest date of your treasure.
                  </p>
                  <Link href="/products">
                    <div className="mt-12 bg-[#1B4332] text-white px-10 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform cursor-pointer">
                      View Sample Report
                    </div>
                  </Link>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🏛️ ROLE & GOVERNANCE ARCHITECTURE */}
      <section className="py-24 px-6 bg-[#FDFBF7]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B4332]/10 mb-6">
                <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">Role-Based Admin System</span>
             </div>
             <h2 className="text-4xl sm:text-5xl font-black text-[#1B4332] tracking-tighter">
                Labour & <span className="text-[#BC6C25] font-serif italic font-normal">Inventory</span> Governance
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
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">Absolute Command</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Manage All Identities", "Artisan Verification", "Marketplace Logistics", 
                  "Financial Analytics", "Category Governance", "System Security", "Activity Surveillance"
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
                  <h3 className="text-xl font-black text-emerald-900">Shopkeeper</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Limited Shop Access</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Inventory Management", "Direct Sales Control", "Order Fulfilment", 
                  "Revenue Tracking", "Profile Portfolio"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-xs font-bold text-[#1B4332]/60">{p}</span>
                  </li>
                ))}
                {[
                  "No System Governance", "No User Management"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-[10px]">✕</div>
                    <span className="text-xs font-bold text-[#1B4332]">{p}</span>
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
                  <h3 className="text-xl font-black text-[#BC6C25]">Elite Buyer</h3>
                  <p className="text-[10px] font-bold text-[#BC6C25]/40 uppercase tracking-widest mt-0.5">Commercial Access</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Bespoke Catalog Access", "Detailed Provenance View", "Seamless Procurement", 
                  "Order History Vault", "Personal Account Control"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#BC6C25]/10 text-[#BC6C25] flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-xs font-bold text-[#1B4332]/60">{p}</span>
                  </li>
                ))}
                {[
                  "No Selling Capability", "No Administrative Access"
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-[10px]">✕</div>
                    <span className="text-xs font-bold text-[#1B4332]">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Connectors */}
            <div className="hidden lg:block absolute top-1/2 left-[31.5%] -translate-y-1/2 z-0 opacity-20">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[8px] font-black text-[#1B4332] uppercase tracking-widest">Grants</span>
                  <div className="h-px w-8 bg-[#1B4332]" />
                  <ArrowRight size={14} className="-ml-4 text-[#1B4332]" />
               </div>
            </div>
            <div className="hidden lg:block absolute top-1/2 left-[65%] -translate-y-1/2 z-0 opacity-20">
               <div className="flex flex-col items-center gap-2">
                  <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Restricted</span>
                  <div className="h-px w-8 bg-rose-500 border-dashed border" />
                  <ArrowRight size={14} className="-ml-4 text-rose-500" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* HARVEST GRID */}
      <section className="py-24 sm:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4332] tracking-tighter">The Harvest</h2>
              <p className="text-[#1B4332]/30 font-bold mt-2 text-lg">Handpicked treasures from the source.</p>
            </div>
            <Link href="/categories" className="text-[10px] font-black uppercase tracking-widest text-[#BC6C25] hover:opacity-100 transition-opacity">Explore All &rarr;</Link>
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
      <section className="py-24 sm:py-40 px-6 bg-[#1B4332] rounded-t-[4rem] sm:rounded-t-[6rem]">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl sm:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-12">Pure Heritage. <br/>Direct to You.</h2>
            <Link href="/products"><Button variant="secondary" size="sm" className="px-12 h-12">Shop the Harvest</Button></Link>
        </div>
      </section>
    </div>
  );
}
