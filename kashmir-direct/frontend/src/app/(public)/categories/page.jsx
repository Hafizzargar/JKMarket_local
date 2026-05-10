'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { 
    name: 'Pashmina & Shawls', 
    slug: 'pashmina', 
    icon: '🧣', 
    color: 'bg-purple-100', 
    desc: 'Exquisite hand-woven shawls made from the finest cashmere wool.' 
  },
  { 
    name: 'Saffron & Spices', 
    slug: 'saffron', 
    icon: '🌸', 
    color: 'bg-orange-100', 
    desc: 'The world\'s most expensive spice, harvested from the fields of Pampore.' 
  },
  { 
    name: 'Dry Fruits & Honey', 
    slug: 'dry-fruits', 
    icon: '🌰', 
    color: 'bg-amber-100', 
    desc: 'Premium walnuts, almonds, and organic honey from the high mountains.' 
  },
  { 
    name: 'Paper Mache Art', 
    slug: 'paper-mache', 
    icon: '🏺', 
    color: 'bg-emerald-100', 
    desc: 'Intricate hand-painted boxes and decor, a signature craft of Kashmir.' 
  },
  { 
    name: 'Wooden Carvings', 
    slug: 'woodwork', 
    icon: '🪵', 
    color: 'bg-stone-100', 
    desc: 'Masterpieces carved from seasoned walnut wood by expert craftsmen.' 
  },
  { 
    name: 'Fresh Fruits', 
    slug: 'fruits', 
    icon: '🍎', 
    color: 'bg-red-100', 
    desc: 'World-famous Kashmiri apples and pears, direct from the orchards.' 
  },
];

export default function CategoriesPage() {
  return (
    <div className="relative min-h-screen pt-32 sm:pt-40">
      <div className="bg-3d-mesh" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight"
          >
            Browse <span className="text-gradient">Collections</span>
          </motion.h1>
          <p className="mt-4 text-xl text-slate-500 font-bold max-w-2xl mx-auto">
            Explore the diverse heritage of Jammu & Kashmir through our curated categories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-10 rounded-[2.5rem] border border-white/60 hover:border-emerald-200 transition-all group cursor-pointer overflow-hidden relative"
            >
              <div className={`${cat.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                {cat.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">{cat.name}</h3>
              <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                {cat.desc}
              </p>
              <Link href={`/products?category=${cat.slug}`}>
                <button className="text-emerald-600 font-black flex items-center group-hover:gap-2 transition-all">
                  Browse Collection <span className="ml-2">&rarr;</span>
                </button>
              </Link>
              
              {/* Subtle background icon */}
              <div className="absolute -right-8 -bottom-8 text-8xl opacity-5 grayscale group-hover:rotate-12 transition-transform duration-700">
                {cat.icon}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
