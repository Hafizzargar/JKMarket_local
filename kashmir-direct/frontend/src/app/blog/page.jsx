'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const posts = [
  {
    id: 1,
    title: "The Saffron Harvest: A Family Tradition",
    excerpt: "Journey to the purple fields of Pampore where the world's most expensive spice is hand-picked at dawn.",
    date: "Oct 24, 2026",
    category: "Heritage",
    image: "🏔️",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "The Secret of the Pashmina Loom",
    excerpt: "Meet Master Artisan Ahmed, who has spent 40 years perfecting the delicate art of hand-weaving Pashmina.",
    date: "Sep 12, 2026",
    category: "Artisan",
    image: "🧶",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "Organic Honey: From Forest to Jar",
    excerpt: "How our wild honey collection supports local biodiversity and preserves ancient forest traditions.",
    date: "Aug 05, 2026",
    category: "Organic",
    image: "🍯",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "The Art of Walnut Wood Carving",
    excerpt: "Exploring the intricate geometric patterns that define Kashmiri architectural heritage.",
    date: "Jul 28, 2026",
    category: "Craft",
    image: "🪵",
    readTime: "6 min read"
  },
  {
    id: 5,
    title: "Harvesting the Red Gold: Apple Season",
    excerpt: "A deep dive into the 100-year history of apple orchards in the northern valleys.",
    date: "Jun 15, 2026",
    category: "Harvest",
    image: "🍎",
    readTime: "7 min read"
  }
];

export default function BlogPage() {
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 sm:pt-40 pb-24 px-6 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-20 text-center sm:text-left">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#1B4332]/10 mb-8">
            <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#1B4332]/40">Valley Journal</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-[#1B4332] tracking-tighter mb-8 leading-tight">
            Stories from<br/>
            <span className="text-[#BC6C25] font-serif italic font-normal tracking-wide">The Source</span>
          </h1>
          <div className="max-w-md mx-auto sm:mx-0">
            <Input 
              placeholder="Search stories..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Featured Post (First one) */}
        {filteredPosts.length > 0 && !search && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20 group cursor-pointer"
          >
            <div className="glass-card flex flex-col lg:flex-row rounded-[4rem] overflow-hidden border border-[#1B4332]/5 hover:bg-white transition-all duration-700 min-h-[500px]">
              <div className="lg:w-1/2 bg-[#1B4332]/[0.02] flex items-center justify-center p-20 relative">
                <span className="text-[12rem] opacity-10 group-hover:scale-110 transition-transform duration-700">{filteredPosts[0].image}</span>
                <div className="absolute top-10 left-10">
                  <span className="bg-[#1B4332] text-white px-5 py-2 rounded-full text-[9px] font-black tracking-widest uppercase">FEATURED</span>
                </div>
              </div>
              <div className="lg:w-1/2 p-10 sm:p-20 flex flex-col justify-center">
                <div className="flex gap-6 mb-8 text-[10px] font-black text-[#1B4332]/30 uppercase tracking-[0.3em]">
                  <span>{filteredPosts[0].date}</span>
                  <span>•</span>
                  <span className="text-[#BC6C25]">{filteredPosts[0].category}</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#1B4332] mb-8 leading-tight group-hover:text-[#BC6C25] transition-colors">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-lg text-[#1B4332]/50 font-medium leading-relaxed mb-12 max-w-xl">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#1B4332]">
                  Read full story &rarr;
                  <span className="opacity-30 ml-4 font-bold lowercase italic">{filteredPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {filteredPosts.slice(search ? 0 : 1).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <div className="glass-card aspect-[4/5] rounded-[3.5rem] overflow-hidden mb-8 border border-[#1B4332]/5 relative flex items-center justify-center hover:bg-white hover:shadow-2xl transition-all duration-500">
                <span className="text-8xl opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">{post.image}</span>
                <div className="absolute top-8 left-8">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-black tracking-widest text-[#1B4332] uppercase border border-[#1B4332]/5">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="px-6">
                <div className="flex gap-4 text-[9px] font-black text-[#1B4332]/30 uppercase tracking-widest mb-4">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-black text-[#1B4332] mb-4 leading-tight group-hover:text-[#BC6C25] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-[#1B4332]/50 leading-relaxed font-medium line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-xl font-bold text-[#1B4332]/20 italic">"No stories found matching your search."</p>
          </div>
        )}

      </div>
    </div>
  );
}
