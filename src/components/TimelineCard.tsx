"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon, MapPin, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaEmbed from "@/components/MediaEmbed";

interface TimelineCardProps {
  year: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  index: number;
  location?: string;
}

export default function TimelineCard({ year, title, description, image, video, location, index }: TimelineCardProps) {
  const isEven = index % 2 === 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 20 }}
        className={`relative flex flex-col md:flex-row gap-8 lg:gap-16 items-center w-full group ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      >
        
        {/* Dynamic Connector Line to node */}
        <div className={cn(
          "hidden md:block absolute top-1/2 w-1/4 h-[1px] bg-gradient-to-r via-orange-500/50 from-transparent to-transparent z-0",
          isEven ? "left-1/4 right-1/2" : "right-1/4 left-1/2"
        )} />

        {/* Content Section */}
        <div className={`flex-1 w-full text-center ${isEven ? 'md:text-right' : 'md:text-left'} px-4 relative z-10`}>
          <motion.div 
            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            className={cn("flex flex-wrap items-center gap-2 md:gap-3 mb-4", isEven ? "flex-row-reverse justify-end" : "justify-start")}
          >
            <span className="px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-bold tracking-widest border border-orange-500/20 backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5">
               <Calendar className="w-3.5 h-3.5" />
               {year}
            </span>
            {location && (
               <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-sm font-bold tracking-wide border border-cyan-500/20 backdrop-blur-sm shadow-sm inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
               </span>
            )}
          </motion.div>
          
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4 text-foreground tracking-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 transition-all duration-500">{title}</h3>
          
          <p className="text-muted-foreground/90 font-light leading-relaxed text-lg max-w-xl ml-auto md:ml-0 md:mr-0 inline-block line-clamp-3">
            {description}
          </p>

          <button 
             onClick={() => setIsModalOpen(true)}
             className={`mt-4 text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 transition-colors ${isEven ? 'md:float-right md:ml-auto' : ''}`}
          >
            Read more
          </button>
        </div>
        
        {/* Central Interactive Node */}
        <div className="hidden md:flex flex-col items-center justify-center relative w-16">
          <motion.div 
            whileHover={{ scale: 1.5 }}
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 rounded-full border-4 border-background bg-orange-500 z-20 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer group-hover:shadow-[0_0_30px_rgba(249,115,22,0.8)] transition-shadow duration-500"
          >
            <div className="w-3 h-3 bg-white rounded-full" />
          </motion.div>
        </div>

        {/* Media Section */}
        <div className="flex-1 w-full px-4 relative z-10">
          {image ? (
            <motion.div 
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02, rotateY: isEven ? -5 : 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group/media relative aspect-[4/3] w-full max-w-lg mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-white/5 bg-gradient-to-br from-card to-muted border border-border/50 backdrop-blur-xl flex items-center justify-center cursor-pointer"
              style={{ perspective: 1000 }}
            >
               <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover z-0" />
               <div className="absolute inset-0 bg-black/20 group-hover/media:bg-transparent transition-colors z-10" />
               <div className="w-16 h-16 rounded-full bg-background/50 backdrop-blur-md border border-white/10 z-20 shadow-xl group-hover/media:scale-110 transition-transform duration-500 flex items-center justify-center">
                 <ImageIcon className="w-8 h-8 text-foreground" />
               </div>
               
               {/* Gradient glow overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity z-10 duration-500" />
               <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 translate-y-4 group-hover/media:translate-y-0 text-left">
                 <p className="text-white font-semibold text-lg drop-shadow-md">View Memory</p>
                 <p className="text-white/70 text-sm">Click to expand details</p>
               </div>
            </motion.div>
          ) : video ? (
            <motion.div 
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02, rotateY: isEven ? -5 : 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group/media relative aspect-video w-full max-w-lg mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-white/5 bg-gradient-to-br from-card to-muted border border-border/50 backdrop-blur-xl flex items-center justify-center cursor-pointer"
              style={{ perspective: 1000 }}
            >
              <div className="absolute inset-0 bg-blue-500/5 group-hover/media:bg-transparent transition-colors z-10" />
              <div className="w-20 h-20 rounded-full bg-primary/90 text-primary-foreground backdrop-blur-md flex items-center justify-center border border-white/20 z-20 shadow-xl shadow-primary/30 group-hover/media:scale-110 transition-transform duration-500 pl-1">
                <Play className="w-10 h-10" />
              </div>
              
               {/* Gradient glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity z-10 duration-500" />
               <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 translate-y-4 group-hover/media:translate-y-0 text-left">
                 <p className="text-white font-semibold text-lg drop-shadow-md">Play Video</p>
               </div>
            </motion.div>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>
      </motion.div>

      {/* Detail Modal overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
               className="absolute inset-0 z-0 cursor-pointer"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="relative w-full max-w-5xl max-h-[90dvh] md:max-h-[90vh] overflow-hidden bg-card border border-border/50 rounded-t-3xl md:rounded-3xl shadow-2xl z-10 flex flex-col md:flex-row shadow-orange-500/10 mt-auto md:mt-0"
             >
               <button 
                 onClick={() => setIsModalOpen(false)} 
                 className="absolute top-4 right-4 z-50 p-2.5 bg-background/80 backdrop-blur-md rounded-full text-foreground hover:bg-secondary hover:text-red-500 transition-colors shadow-sm md:top-4 md:right-4"
               >
                 <X className="w-5 h-5" />
               </button>
               
               {/* Modal Media Side */}
               {image && (
                 <div className="md:w-1/2 relative bg-muted/30">
                   <img src={image} alt={title} className="w-full h-full object-cover max-h-[40vh] md:max-h-none" />
                 </div>
               )}
               {video && !image && (
                 <div className="md:w-1/2 relative bg-zinc-900/50 flex flex-col items-center justify-center p-6 md:p-8 shrink-0 border-r border-white/5">
                   <MediaEmbed url={video} autoPlay className="w-full" />
                 </div>
               )}
               
               {/* Modal Text Side */}
               <div className={`p-8 md:p-12 overflow-y-auto pb-safe ${image || video ? 'md:w-1/2' : 'w-full'}`}>
                 <div className="flex flex-wrap items-center gap-3 mb-6">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-bold tracking-widest">{year}</span>
                   </div>
                   {location && (
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-bold tracking-widest">{location}</span>
                     </div>
                   )}
                 </div>
                 
                 <h2 className="text-3xl md:text-5xl font-black mb-6 text-foreground tracking-tight">{title}</h2>
                 
                 <div className="prose prose-orange dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-muted-foreground/90 whitespace-pre-wrap">{description}</p>
                 </div>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
