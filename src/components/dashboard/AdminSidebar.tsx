"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, FileText, Video, Inbox, MessageSquare, LogOut, Mountain } from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname() || "";

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
    { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
    { href: "/dashboard/videos", label: "Videos", icon: Video },
    { href: "/dashboard/submissions", label: "Submissions", icon: Inbox },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col h-full",
          "bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-r border-white/20 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-20 shrink-0 items-center px-6 border-b border-white/20 dark:border-white/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
              <Mountain className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-purple-900 dark:from-indigo-100 dark:to-purple-100">
              JourneyCraft
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="relative group block"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/60 dark:bg-white/10 rounded-2xl border border-white/40 dark:border-white/20 shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={cn(
                  "relative flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200",
                  isActive 
                    ? "text-primary font-semibold" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/5"
                )}>
                  <Icon className={cn("w-5 h-5 mr-3 transition-colors", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground")} />
                  {link.label}
                  
                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-white/20 dark:border-white/10 mt-auto">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
