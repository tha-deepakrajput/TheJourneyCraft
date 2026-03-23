"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Sparkles, Tag, Share2 } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import MediaEmbed from "@/components/MediaEmbed";

interface StoryData {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readingTime: string;
  category: string;
  images: string[];
  video: string | null;
}

export default function StoryClientView({ story }: { story: StoryData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const coverImage = story.images.length > 0 ? story.images[0] : null;
  const paragraphs = story.content.split('\n').filter(p => p.trim() !== "");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-blue-500/30">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none z-0 mix-blend-overlay opacity-[0.03] bg-[url('/noise.png')]" />

      {/* Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 p-4 md:p-6 bg-gradient-to-b from-background/90 via-background/50 to-transparent backdrop-blur-sm pointer-events-none">
        <div className="max-w-5xl mx-auto flex items-center pointer-events-auto">
          <Link 
            href="/stories" 
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/5 backdrop-blur-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:-translate-x-1 duration-300" />
            <span className="text-sm font-semibold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
              STORIES
            </span>
          </Link>
        </div>
      </nav>

      <main ref={containerRef} className="relative z-10 pt-32 md:pt-40 pb-40">
        <article className="max-w-5xl mx-auto px-6 lg:px-8">
          
          {/* Header Section */}
          <header className="mb-16 md:mb-24 flex flex-col items-center text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 border border-blue-500/20 bg-blue-500/10 rounded-full mb-8"
            >
              <Tag className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                {story.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-foreground"
            >
              {story.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-muted-foreground font-medium text-sm md:text-base"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" />
                <span>{story.author}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-border hidden md:block" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-teal-400" />
                <span>{story.date}</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-border hidden md:block" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-rose-400" />
                <span>{story.readingTime}</span>
              </div>
            </motion.div>
          </header>

          {/* Cover Media */}
          {coverImage ? (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="relative w-full aspect-[4/3] md:aspect-[2.5/1] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-20 md:mb-32 shadow-2xl border border-black/5 dark:border-white/10 group"
              style={{ y: headerY, opacity: headerOpacity }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-black/10 dark:via-transparent to-transparent z-10" />
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105"
                style={{ backgroundImage: `url(${coverImage})` }}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-20"
            />
          )}

          {/* Story Content wrapper */}
          <div className="relative max-w-3xl mx-auto">
             {/* Decorative glow */}
             <div className="absolute top-0 inset-x-0 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
             
             <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="space-y-8 md:space-y-12"
            >
              {paragraphs.map((paragraph, idx) => (
                <motion.p 
                  key={idx} 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                  }}
                  className={`text-lg md:text-2xl text-foreground/80 dark:text-muted-foreground/90 font-serif leading-loose md:leading-[1.8] tracking-wide ${
                    idx === 0 ? "first-letter:text-7xl first-letter:font-black first-letter:text-foreground first-letter:mr-3 first-letter:float-left first-letter:mt-[-0.2em]" : ""
                  }`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </div>

          {/* Other images/videos */}
          {(story.images.length > 1 || story.video) && (
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.8 }}
               className="mt-24 md:mt-32 pt-16 border-t border-border grid gap-10 max-w-4xl mx-auto"
            >
               <h3 className="text-3xl font-black flex items-center justify-center gap-3 tracking-tight">
                 <Sparkles className="w-8 h-8 text-blue-500" />
                 Media Gallery
                 <Sparkles className="w-8 h-8 text-indigo-500" />
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                 {story.images.slice(1).map((img, idx) => (
                   <div key={idx} className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted border border-black/5 dark:border-white/5 shadow-lg group">
                     <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]" style={{ backgroundImage: `url(${img})` }} />
                   </div>
                 ))}
                 {story.video && (
                   <MediaEmbed url={story.video} />
                 )}
               </div>
            </motion.div>
          )}

          {/* Footer of article */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 md:mt-32 pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8 max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20">
                 {story.author.charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="font-extrabold text-xl text-foreground">Written by {story.author}</p>
                 <p className="text-muted-foreground font-medium mt-1">Published on The Journey Craft</p>
               </div>
            </div>
            
            <button className="group flex items-center gap-2 px-8 py-4 rounded-full bg-card hover:bg-muted border border-border transition-all duration-300 shadow-sm hover:shadow-md font-bold text-foreground">
              <Share2 className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
              Share Story
            </button>
          </motion.div>

        </article>
      </main>
    </div>
  );
}
