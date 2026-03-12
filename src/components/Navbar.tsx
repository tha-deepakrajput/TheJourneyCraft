"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Moon, Sun, Menu, X, Compass } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
}, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getThemeClasses = () => {
    if (pathname.startsWith("/timeline")) {
      return {
        nav: "bg-orange-500/10 dark:bg-orange-950/30 border-orange-500/20",
        btn: "bg-orange-600 hover:bg-orange-700 text-white",
        text: "text-orange-600 dark:text-orange-400",
        activeLink: "text-orange-600 dark:text-orange-400 font-semibold"
      };
    }
    if (pathname.startsWith("/stories")) {
      return {
        nav: "bg-blue-500/10 dark:bg-blue-950/30 border-blue-500/20",
        btn: "bg-blue-600 hover:bg-blue-700 text-white",
        text: "text-blue-600 dark:text-blue-400",
        activeLink: "text-blue-600 dark:text-blue-400 font-semibold"
      };
    }
    if (pathname.startsWith("/videos")) {
      return {
        nav: "bg-purple-500/10 dark:bg-purple-950/30 border-purple-500/20",
        btn: "bg-purple-600 hover:bg-purple-700 text-white",
        text: "text-purple-600 dark:text-purple-400",
        activeLink: "text-purple-600 dark:text-purple-400 font-semibold"
      };
    }
    if (pathname.startsWith("/submit-journey") || pathname.startsWith("/contact")) {
      return {
        nav: "bg-emerald-500/10 dark:bg-emerald-950/30 border-emerald-500/20",
        btn: "bg-emerald-600 hover:bg-emerald-700 text-white",
        text: "text-emerald-600 dark:text-emerald-400",
        activeLink: "text-emerald-600 dark:text-emerald-400 font-semibold"
      };
    }
    // Default
    return {
      nav: "bg-background/60 border-border/40",
      btn: "bg-primary text-primary-foreground hover:opacity-90",
      text: "text-primary",
      activeLink: "text-primary font-semibold"
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <nav className={cn("fixed top-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-500", themeClasses.nav)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Compass className={cn("h-6 w-6 transition-colors duration-500", themeClasses.text)} />
              <span className="text-xl font-bold tracking-tight">JourneyCraft</span>
            </Link>
          </div>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className={cn("text-sm transition-colors hover:opacity-70", pathname === "/" ? themeClasses.activeLink : "font-medium")}>Home</Link>
            <Link href="/timeline" className={cn("text-sm transition-colors hover:opacity-70", pathname.startsWith("/timeline") ? themeClasses.activeLink : "font-medium")}>Journey</Link>
            <Link href="/stories" className={cn("text-sm transition-colors hover:opacity-70", pathname.startsWith("/stories") ? themeClasses.activeLink : "font-medium")}>Stories</Link>
            <Link href="/videos" className={cn("text-sm transition-colors hover:opacity-70", pathname.startsWith("/videos") ? themeClasses.activeLink : "font-medium")}>Videos</Link>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/submit-journey" className={cn("text-sm font-medium px-4 py-2 rounded-full transition-all duration-500 shadow-sm", themeClasses.btn)}>
              Share Story
            </Link>
            {session ? (
              <Link href="/dashboard" className="text-sm font-medium hover:opacity-70 transition-opacity">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">Login</Link>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors border border-transparent"
              aria-label="Toggle Dark Mode"
            >
              {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={cn("md:hidden backdrop-blur-xl border-t shadow-lg absolute w-full left-0 top-16", themeClasses.nav)}>
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 text-base rounded-md", pathname === "/" ? themeClasses.activeLink : "font-medium")}>Home</Link>
            <Link href="/timeline" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 text-base rounded-md", pathname.startsWith("/timeline") ? themeClasses.activeLink : "font-medium")}>Journey</Link>
            <Link href="/stories" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 text-base rounded-md", pathname.startsWith("/stories") ? themeClasses.activeLink : "font-medium")}>Stories</Link>
            <Link href="/videos" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 text-base rounded-md", pathname.startsWith("/videos") ? themeClasses.activeLink : "font-medium")}>Videos</Link>
            <div className="border-t border-border/40 my-2 pt-2"></div>
            <Link href="/submit-journey" onClick={() => setIsMenuOpen(false)} className={cn("block px-3 py-2 text-base font-medium rounded-md text-center", themeClasses.btn)}>Share Story</Link>
            {session ? (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-md text-center">Dashboard</Link>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-md text-center">Login</Link>
            )}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-full px-3 py-2 mt-4 border border-border/20 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            >
              {mounted && theme === "dark" ? (
                <><Sun className="h-5 w-5 mr-2" /> Light Mode</>
              ) : (
                <><Moon className="h-5 w-5 mr-2" /> Dark Mode</>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
