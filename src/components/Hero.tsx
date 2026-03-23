"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 20 } 
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full pt-20">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-background z-10" />
        {/* Glow orbs */}
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-500/10 dark:bg-orange-600/20 blur-[100px] md:blur-[150px] mix-blend-screen z-20 pointer-events-none"
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, 30, 0, -30, 0],
            scale: [1, 1.1, 1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-[100px] md:blur-[150px] mix-blend-screen z-20 pointer-events-none"
          animate={{
            x: [0, -60, 0, 60, 0],
            y: [0, -40, 0, 40, 0],
            scale: [1, 1.2, 1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 dark:bg-purple-600/20 blur-[100px] md:blur-[150px] mix-blend-screen z-20 pointer-events-none"
          animate={{
            x: [0, -30, 0, 30, 0],
            y: [0, 50, 0, -50, 0]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />
        {/* subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] z-20" />
      </div>
      
      <div className="relative z-30 text-center px-4 max-w-5xl mx-auto flex flex-col items-center mt-[-8vh]">
        <motion.div
           initial="hidden"
           animate="visible"
           variants={containerVariants}
           className="flex flex-col items-center w-full"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wide">A cinematic digital museum</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-8 leading-[1.05]"
          >
            Memories in <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-800 to-neutral-400 dark:from-white dark:to-neutral-500 drop-shadow-sm">
              Motion.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-2xl text-muted-foreground/90 mb-12 max-w-2xl font-light"
          >
            Chronicle your adventures with breathtaking elegance. Explore a curated timeline of journeys that shaped the world.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <Link 
              href="/timeline" 
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:opacity-100 transition-all flex items-center justify-center shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
                Start Exploring
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary -z-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link 
              href="/submit-journey" 
              className="group px-8 py-4 bg-transparent border-2 border-border dark:border-white/10 rounded-full font-semibold text-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center backdrop-blur-sm"
            >
              <span className="flex items-center gap-2 group-hover:gap-4 transition-all w-full justify-center">
                Share a Story <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative floating elements */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-16 bg-gradient-to-b from-primary/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
