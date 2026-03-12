"use client";

import { motion } from "framer-motion";

interface TimelineCardProps {
  year: string;
  title: string;
  description: string;
  image?: string;
  video?: string;
  index: number;
}

export default function TimelineCard({ year, title, description, image, video, index }: TimelineCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`flex flex-col md:flex-row gap-8 items-center w-full my-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      <div className={`flex-1 w-full text-center ${isEven ? 'md:text-right' : 'md:text-left'} px-4`}>
        <span className="text-sm font-bold tracking-widest text-primary/60 uppercase">{year}</span>
        <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div className="hidden md:flex flex-col items-center justify-center relative">
        <div className="w-4 h-4 rounded-full bg-primary z-10" />
        <div className="w-0.5 h-full bg-border absolute top-4 -bottom-20 z-0 hidden md:block" />
      </div>

      <div className="flex-1 w-full px-4">
        {image ? (
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl bg-muted flex items-center justify-center">
             <span className="text-muted-foreground text-sm">Image: {title}</span>
          </div>
        ) : video ? (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Video placeholder</span>
          </div>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </motion.div>
  );
}
