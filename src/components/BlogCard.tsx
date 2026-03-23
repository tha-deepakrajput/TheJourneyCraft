"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowUpRight, Sparkles } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  readingTime: string;
  index: number;
  tag?: string;
}

export default function BlogCard({ id, title, description, coverImage, readingTime, index, tag }: BlogCardProps) {
  return (
    <Link href={`/stories/${id}`} className="block h-full group outline-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, delay: (index % 3) * 0.1, type: "spring", stiffness: 90 }}
        className="relative flex flex-col justify-between h-full bg-card/60 dark:bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 dark:border-white/10 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-indigo-500/20 group-hover:-translate-y-2"
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      >
        {/* Decorative inner glowing rim */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="aspect-[4/3] w-full bg-muted overflow-hidden relative p-3">
          {/* Inner rounded image container with depth */}
          <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
            {coverImage ? (
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110" 
                style={{ backgroundImage: `url(${coverImage})` }} 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400/30 via-indigo-500/30 to-purple-600/30 flex items-center justify-center transition-transform duration-[1.5s] ease-out group-hover:scale-110 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] mix-blend-overlay opacity-20" />
                <Sparkles className="w-12 h-12 text-white/50 animate-pulse" />
              </div>
            )}
            
            {/* Multi-layer gradients for intense depth overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 opacity-60 group-hover:opacity-20 transition-opacity duration-700 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-color-burn z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
            
            {/* Inner bottom glow */}
            <div className="absolute bottom-[-20%] left-[-10%] right-[-10%] h-1/2 bg-blue-500/30 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none" />
          </div>
          
          {/* Floating High-Contrast Tag */}
          {tag && (
            <div className="absolute top-7 right-7 z-20 px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-xl border border-black/10 dark:border-white/10 text-xs font-bold text-foreground tracking-wider shadow-lg transform group-hover:translate-y-1 transition-transform duration-700 ease-out">
              {tag}
            </div>
          )}
        </div>

        <div className="p-8 md:p-10 flex flex-col flex-grow relative z-20 mt-[-1rem]">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-4 text-foreground tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-500 dark:group-hover:from-blue-400 dark:group-hover:to-indigo-300 transition-all duration-500">
            {title}
          </h3>
          <p className="text-muted-foreground/80 font-normal line-clamp-3 mb-8 flex-grow text-base md:text-lg leading-relaxed group-hover:text-muted-foreground transition-colors duration-500">
            {description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-sm text-foreground/70 font-semibold bg-primary/5 dark:bg-primary/10 border border-primary/10 px-4 py-2 rounded-full backdrop-blur-md shadow-sm">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              {readingTime}
            </div>
            
            {/* Ultra-premium interactive button */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border/50 shadow-sm overflow-hidden group/btn">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />
               <ArrowUpRight className="w-5 h-5 text-foreground group-hover:text-white transition-colors duration-500 z-10 relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
