"use client";

import { Play, Film, Sparkles } from "lucide-react";
import * as motion from "framer-motion/client";

const MOCK_VIDEOS = [
  { id: "v1", title: "My First Solo Trip exploring the Unknown", duration: "10:45", views: "14K views", date: "2 months ago", category: "Travel Vlog" },
  { id: "v2", title: "Behind the Scenes: JourneyCraft", duration: "18:20", views: "32K views", date: "3 weeks ago", category: "Tech & Design" },
  { id: "v3", title: "Reflections on Year One of Independence", duration: "05:30", views: "8K views", date: "1 year ago", category: "Personal" },
  { id: "v4", title: "Finding Peace in the Noise of the City", duration: "12:15", views: "21K views", date: "5 months ago", category: "Cinematic" },
  { id: "v5", title: "The Hardware Setup that Built This", duration: "14:40", views: "45K views", date: "1 week ago", category: "Gear" },
  { id: "v6", title: "A Letter to My Younger Self", duration: "08:20", views: "11K views", date: "8 months ago", category: "Reflections" },
];

export default function VideosPage() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-32">
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-purple-900/10 via-background to-background" />
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/5 blur-[140px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/5 blur-[140px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        
        {/* Page Header */}
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/20"
          >
            <Film className="w-8 h-8 text-purple-500" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8"
          >
            Video <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-fuchsia-400 drop-shadow-sm">
              Library.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-purple-500/50 hidden md:block" />
            Cinematic visuals, deeply personal vlogs, and behind-the-scenes glimpses.
            <Sparkles className="w-5 h-5 text-purple-500/50 hidden md:block" />
          </motion.p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 relative z-20">
          {MOCK_VIDEOS.map((video, index) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1, type: "spring", stiffness: 80 }}
              className="group cursor-pointer flex flex-col"
            >
              {/* Thumbnail Container */}
              <div 
                className="relative aspect-video rounded-[2rem] overflow-hidden bg-card/40 backdrop-blur-sm mb-6 border border-white/10 dark:border-white/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >
                {/* Fallback pattern / Image placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-background to-fuchsia-900/20 group-hover:scale-110 transition-transform duration-[1.5s] ease-out flex items-center justify-center">
                   <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                   <span className="text-purple-500/20 font-bold text-2xl tracking-widest uppercase">Visuals</span>
                </div>

                {/* Hover darken overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700 z-10" />
                
                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider z-20 shadow-lg">
                  {video.duration}
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-purple-500/80 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase z-20 shadow-lg transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  {video.category}
                </div>

                {/* Central Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-500 shadow-[0_0_40px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_60px_rgba(168,85,247,0.6)]">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-2 transition-transform duration-500 group-hover:scale-110" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              {/* Video Metadata */}
              <div className="px-2">
                <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-500 line-clamp-2 leading-tight mb-3">
                  {video.title}
                </h3>
                <div className="flex items-center text-sm font-medium text-muted-foreground/80 gap-3">
                  <span>{video.views}</span>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                  <span>{video.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
