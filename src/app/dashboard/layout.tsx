"use client";

import { useState } from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminNavbar from "@/components/dashboard/AdminNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen -mt-16 overflow-hidden bg-gradient-to-br from-indigo-50/30 via-background to-purple-50/30 dark:from-indigo-950/20 dark:via-background dark:to-purple-950/20">
      
      {/* Decorative ambient blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[120px] mix-blend-screen pointer-events-none" />

      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
