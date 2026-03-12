"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, FileText, Video, Inbox, MessageSquare, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
    { href: "/dashboard/blogs", label: "Blogs", icon: FileText },
    { href: "/dashboard/videos", label: "Videos", icon: Video },
    { href: "/dashboard/submissions", label: "Submissions", icon: Inbox },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] bg-muted/10 overflow-hidden">
      <aside className={`fixed top-[4rem] bottom-0 left-0 z-40 w-64 bg-card border-r border-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:top-0 md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="p-4 border-t border-border">
            <button onClick={() => signOut()} className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-500/10 transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-card border-b border-border shadow-sm">
          <span className="font-semibold text-lg">Dashboard</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border border-border rounded-md bg-muted/50 hover:bg-muted transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
