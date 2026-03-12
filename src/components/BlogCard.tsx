"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  readingTime: string;
  index: number;
}

export default function BlogCard({ id, title, description, coverImage, readingTime, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className="group relative flex flex-col justify-between h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all"
    >
      <div className="aspect-[3/2] w-full bg-muted overflow-hidden relative">
        {coverImage ? (
          <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${coverImage})` }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground transition-transform duration-500 group-hover:scale-105">
            Image Placeholder
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
        <p className="text-muted-foreground line-clamp-3 mb-4 flex-grow text-sm">{description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <Clock className="w-3 h-3 mr-1" />
            {readingTime}
          </div>
          <Link href={`/stories/${id}`} className="text-sm font-semibold text-primary hover:underline">
            Read Story
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
