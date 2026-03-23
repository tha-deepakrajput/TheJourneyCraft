"use client";

import { useState } from "react";
import { Link2, MonitorPlay, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaEmbedProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
}

export default function MediaEmbed({ url, className, autoPlay = false }: MediaEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  if (!url) return null;

  let embedUrl = "";
  let type = "unknown";
  
  // If the user clicked play, we want the iframe to autoplay.
  const shouldAutoPlay = autoPlay || isPlaying;

  if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
    const videoId = url.includes('youtu.be/') 
       ? url.split('youtu.be/')[1].split('?')[0] 
       : url.split('v=')[1].split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoPlay ? 1 : 0}&rel=0`;
    type = "youtube";
  } else if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('/')[0];
    embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=${shouldAutoPlay ? 1 : 0}`;
    type = "vimeo";
  } else if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
      type = "drive";
    }
  } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
    type = "native";
    embedUrl = url;
  }

  return (
    <div className={cn(
      "group relative aspect-video w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black shadow-2xl shadow-black/40 transition-all duration-700 hover:-translate-y-1 hover:shadow-indigo-500/20 border border-white/5",
      className
    )}>
      {/* Decorative premium border overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 mix-blend-overlay pointer-events-none" />
      
      {/* Media Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
        {!isPlaying && type !== "unknown" ? (
          <div 
             onClick={() => setIsPlaying(true)}
             className="absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-center cursor-pointer group/thumb bg-zinc-950 overflow-hidden"
          >
            {/* Animated abstract background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent mix-blend-overlay z-0 transition-transform duration-1000 group-hover/thumb:scale-110" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background/80 to-background pointer-events-none" />
            <div className="absolute inset-0 backdrop-blur-[2px]" />

            {/* Play Button */}
            <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)] flex items-center justify-center transition-all duration-500 group-hover/thumb:scale-110 group-hover/thumb:bg-white/10 group-hover/thumb:border-indigo-500/50 group-hover/thumb:shadow-[0_0_80px_rgba(99,102,241,0.5)]">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-2 transition-transform duration-500 group-hover/thumb:scale-105" />
            </div>
            
            <p className="relative z-10 mt-6 text-white/70 font-bold tracking-widest uppercase text-xs sm:text-sm group-hover/thumb:text-white transition-colors duration-500">
               Click to Watch
            </p>
          </div>
        ) : type === "native" ? (
          <video 
            src={embedUrl} 
            controls 
            autoPlay={shouldAutoPlay}
            className="w-full h-full object-cover"
          />
        ) : type !== "unknown" ? (
          <iframe 
            src={embedUrl}
            title={`${type} video player`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
          ></iframe>
        ) : (
          // Fallback UI for generic links that can't be embedded
          <div className="flex flex-col items-center justify-center p-8 text-center w-full h-full bg-gradient-to-b from-transparent to-black/60">
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <MonitorPlay className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">External Video</h3>
            <p className="text-zinc-400 mb-8 max-w-sm text-sm">This video link cannot be embedded directly, but you can watch it on the original platform.</p>
            <a 
               href={url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-all duration-300 shadow-xl shadow-white/10 hover:scale-105"
            >
              <Link2 className="w-5 h-5" /> Open Link
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
