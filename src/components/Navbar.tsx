"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const PremiumLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-8 h-8", className)}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
      <linearGradient id="logo-accent" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    
    <motion.path
      d="M50 5 L95 25 L95 75 L50 95 L5 75 L5 25 Z"
      stroke="url(#logo-accent)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    
    <motion.path
      d="M50 15 L80 30 L50 95 Z"
      fill="url(#logo-gradient)"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    />
    <motion.path
      d="M50 15 L20 30 L50 95 Z"
      fill="url(#logo-gradient)"
      style={{ mixBlendMode: 'overlay' }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
  </svg>
);

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || "";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getThemeClasses = () => {
    if (pathname.startsWith("/timeline")) {
      return {
        nav: "bg-orange-50/70 dark:bg-orange-950/40 border-orange-200/50 dark:border-orange-500/20 shadow-orange-500/10",
        btn: "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25",
        text: "text-orange-600 dark:text-orange-400",
        activeBg: "bg-orange-100 dark:bg-orange-900/40"
      };
    }
    if (pathname.startsWith("/stories")) {
      return {
        nav: "bg-blue-50/70 dark:bg-blue-950/40 border-blue-200/50 dark:border-blue-500/20 shadow-blue-500/10",
        btn: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25",
        text: "text-blue-600 dark:text-blue-400",
        activeBg: "bg-blue-100 dark:bg-blue-900/40"
      };
    }
    if (pathname.startsWith("/videos")) {
      return {
        nav: "bg-purple-50/70 dark:bg-purple-950/40 border-purple-200/50 dark:border-purple-500/20 shadow-purple-500/10",
        btn: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25",
        text: "text-purple-600 dark:text-purple-400",
        activeBg: "bg-purple-100 dark:bg-purple-900/40"
      };
    }
    if (pathname.startsWith("/submit-journey") || pathname.startsWith("/contact")) {
      return {
        nav: "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200/50 dark:border-emerald-500/20 shadow-emerald-500/10",
        btn: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25",
        text: "text-emerald-600 dark:text-emerald-400",
        activeBg: "bg-emerald-100 dark:bg-emerald-900/40"
      };
    }
    // Default
    return {
      nav: "bg-background/80 border-border/50 dark:border-white/10 shadow-black/5",
      btn: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
      text: "text-foreground",
      activeBg: "bg-black/5 dark:bg-white/10"
    };
  };

  const themeClasses = getThemeClasses();
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Journey", path: "/timeline" },
    { name: "Stories", path: "/stories" },
    { name: "Videos", path: "/videos" }
  ];

  return (
    <div className="fixed top-0 w-full z-50 flex justify-center px-4 pt-4 pb-2 p-0 sm:px-6 sm:pt-6 pointer-events-none">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={cn(
          "pointer-events-auto w-full max-w-5xl rounded-2xl md:rounded-full backdrop-blur-2xl border transition-all duration-500 shadow-xl",
          themeClasses.nav,
          scrolled ? "py-2 px-4 shadow-2xl" : "py-3 px-6"
        )}
      >
        <div className="flex justify-between items-center h-12">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group relative z-10">
            <PremiumLogo className={cn("transition-transform duration-700 ease-out group-hover:rotate-12", themeClasses.text)} />
            <span className={cn(
              "text-xl font-extrabold tracking-tight transition-all duration-300", 
              themeClasses.text
            )}>
              JourneyCraft
            </span>
          </Link>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex space-x-1 items-center relative z-10">
            {navLinks.map((link) => {
              const isActive = link.path === "/" ? pathname === "/" : pathname.startsWith(link.path);
              return (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full",
                    isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={cn("absolute inset-0 rounded-full -z-10", themeClasses.activeBg)}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-3 z-10">
            {session ? (
              <Link href="/dashboard" className="text-sm font-medium hover:text-foreground/80 transition-colors px-2">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-foreground/80 transition-colors px-2">
                Sign In
              </Link>
            )}
            
            <Link 
              href="/submit-journey" 
              className={cn("text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 transform hover:scale-105", themeClasses.btn)}
            >
              Share Story
            </Link>
            
            <div className="w-[1px] h-5 bg-border mx-1" />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center text-foreground/70 hover:text-foreground"
              aria-label="Toggle Dark Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mounted && theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-10">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-foreground"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "pointer-events-auto absolute top-24 left-4 right-4 rounded-2xl backdrop-blur-3xl border shadow-2xl overflow-hidden md:hidden",
              themeClasses.nav
            )}
          >
            <div className="px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = link.path === "/" ? pathname === "/" : pathname.startsWith(link.path);
                return (
                  <Link 
                    key={link.path}
                    href={link.path} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={cn(
                      "block px-4 py-3 text-base font-medium rounded-xl transition-all", 
                      isActive ? themeClasses.activeBg : "hover:bg-black/5 dark:hover:bg-white/10"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="border-t border-border/50 my-2"></div>
              
              <div className="flex flex-col gap-3 px-2">
                <Link 
                  href="/submit-journey" 
                  onClick={() => setIsMenuOpen(false)} 
                  className={cn("block px-4 py-3 text-base font-semibold rounded-xl text-center shadow-md", themeClasses.btn)}
                >
                  Share Story
                </Link>
                {session ? (
                  <Link 
                    href="/dashboard" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block px-4 py-3 text-base font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-center transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block px-4 py-3 text-base font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-xl text-center transition-colors"
                  >
                    Sign In
                  </Link>
                )}
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-full px-4 py-3 mt-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 font-medium transition-colors"
                >
                  {mounted && theme === "dark" ? (
                    <><Sun className="h-5 w-5 mr-3" /> Light Mode</>
                  ) : (
                    <><Moon className="h-5 w-5 mr-3" /> Dark Mode</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
