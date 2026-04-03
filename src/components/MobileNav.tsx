"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, BookOpen, PlusSquare, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Timeline", icon: Compass, path: "/timeline" },
  { name: "Share", icon: PlusSquare, path: "/submit-journey", isAction: true },
  { name: "Stories", icon: BookOpen, path: "/stories" },
  { name: "Me", icon: LayoutDashboard, path: "/dashboard" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  if (pathname.startsWith("/dashboard/")) {
    // Optionally hide on dashboard subpages
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-t border-border/50 shadow-[0_-8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]" />
      
      <nav className="relative flex items-center justify-around px-2 py-3 h-16">
        {navItems.map((item) => {
          const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[64px] transition-all duration-300 active:scale-95",
                isActive ? "text-primary" : "text-muted-foreground/60"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={cn(
                "p-1.5 rounded-2xl transition-all duration-300",
                item.isAction ? "bg-primary text-primary-foreground -translate-y-6 shadow-xl shadow-primary/30 border-4 border-background" : ""
              )}>
                <Icon className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    item.isAction ? "w-7 h-7" : isActive ? "scale-110" : ""
                )} />
              </div>

              {!item.isAction && (
                <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
