"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Menu, Sun, Moon, LogOut, Settings, User, X, Check, Image as ImageIcon, ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

interface AdminNavbarProps {
  toggleSidebar: () => void;
}

export default function AdminNavbar({ toggleSidebar }: AdminNavbarProps) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  // States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  
  // Profile Form States
  const [displayName, setDisplayName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [editName, setEditName] = useState("");
  const [editImageBase64, setEditImageBase64] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProfile();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session?.user && !displayName) {
      setDisplayName(session.user.name || "");
      if (!editName) setEditName(session.user.name || "");
    }
  }, [session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/user/profile?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setDisplayName(data.user.name || session?.user?.name || "");
          setEditName(data.user.name || session?.user?.name || "");
          setProfileImage(data.user.image || "");
          setEditImageBase64(data.user.image || "");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.notifications?.length || 0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      const page = segments[1];
      return page.charAt(0).toUpperCase() + page.slice(1);
    }
    return "Dashboard";
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleClearNotifications = async (id?: string) => {
    try {
      if (id) {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
          // Resize the image using a canvas
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(image, 0, 0, width, height);
          
          // Export back to base64 with jpeg compression
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setEditImageBase64(dataUrl);
        };
        image.src = readerEvent.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, image: editImageBase64 }),
      });
      if (res.ok) {
        setDisplayName(editName);
        setProfileImage(editImageBase64);
        setIsEditProfileModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const searchOptions = [
    { label: "Overview", path: "/dashboard" },
    { label: "Timeline Events", path: "/dashboard/timeline" },
    { label: "Blogs", path: "/dashboard/blogs" },
    { label: "Videos", path: "/dashboard/videos" },
    { label: "Submissions", path: "/dashboard/submissions" },
    { label: "Messages", path: "/dashboard/messages" },
  ];

  const filteredSearch = searchOptions.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()));

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-4 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/10 px-6 shadow-sm">
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <div className="flex-1">
          <motion.h1 
            key={pathname}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight"
          >
            {getPageTitle()}
          </motion.h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Command Palette Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex items-center px-4 py-2 bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-full text-sm text-muted-foreground shadow-inner hover:bg-white/80 dark:hover:bg-white/10 transition-colors w-64"
          >
            <Search className="w-4 h-4 mr-2 opacity-50" />
            <span className="flex-1 text-left">Search...</span>
            <kbd className="hidden lg:inline-flex items-center justify-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-black/5 dark:bg-white/10 text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
              className="relative p-2.5 rounded-full bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-80 lg:w-96 rounded-3xl bg-white/80 dark:bg-black/80 backdrop-blur-3xl border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
                >
                  <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    <button 
                      onClick={() => handleClearNotifications()}
                      className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 hide-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                        <Check className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm">You are all caught up!</p>
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-3 mb-1 rounded-2xl hover:bg-muted/50 transition-colors flex gap-3 relative group cursor-pointer">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                            <span className="text-indigo-500 text-xs font-bold">{notif.name?.[0]}</span>
                          </div>
                          <div className="flex-1 pr-6">
                            <p className="text-sm font-medium line-clamp-1">{notif.name} submitted a journey</p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">"{notif.title}"</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleClearNotifications(notif.id); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-muted/80 hover:bg-rose-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white/50 dark:bg-white/5 border border-white/30 dark:border-white/10 text-muted-foreground hover:text-foreground transition-colors overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {mounted && theme === "dark" ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* User Profile Avatar */}
          <div className="relative flex items-center gap-3 ml-2">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-bold leading-tight">{displayName || session?.user?.name || "Admin"}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{(session?.user as any)?.role || "Creator"}</span>
            </div>
            <button 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
              className="h-10 w-10 rounded-full border-2 border-indigo-500/50 p-0.5 overflow-hidden shadow-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shrink-0 hover:scale-105 transition-transform"
            >
              <img 
                src={profileImage || `https://api.dicebear.com/7.x/notionists/svg?seed=${session?.user?.name || 'Admin'}&backgroundColor=transparent`} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full bg-white/50 dark:bg-black/50"
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-56 rounded-3xl bg-white/80 dark:bg-black/80 backdrop-blur-3xl border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden z-50 py-2"
                >
                  <button onClick={() => { setIsProfileOpen(false); setIsEditProfileModalOpen(true); }} className="w-full text-left px-5 py-3 text-sm font-medium hover:bg-muted/50 transition-colors flex items-center gap-3">
                    <Settings className="w-4 h-4 text-muted-foreground" /> Edit Profile
                  </button>
                  <div className="h-[1px] bg-border/50 my-1 mx-3" />
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-5 py-3 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card w-full max-w-sm rounded-[2rem] border shadow-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
              <button onClick={() => setIsEditProfileModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
              
              <div className="space-y-6 relative z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24 rounded-full border-4 border-muted overflow-hidden bg-muted group cursor-pointer">
                    <img src={editImageBase64 || `https://api.dicebear.com/7.x/notionists/svg?seed=${editName}&backgroundColor=transparent`} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <p className="text-xs text-muted-foreground">Click to upload image</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full bg-muted/50 border-0 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="E.g. Creative Admin"
                  />
                </div>

                <button 
                  onClick={saveProfile} 
                  disabled={isSavingProfile || !editName.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-3 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search / Command Palette */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh] sm:p-6 sm:pt-[15vh] bg-background/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-card/90 w-full max-w-xl rounded-[2rem] border shadow-2xl overflow-hidden backdrop-blur-3xl"
            >
              <div className="flex items-center px-6 py-4 border-b border-border/50">
                <Search className="w-5 h-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground/50"
                />
                <kbd className="hidden sm:inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded bg-muted/50 text-muted-foreground">
                  ESC
                </kbd>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-3 custom-scrollbar">
                {filteredSearch.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No results found.</div>
                ) : (
                  filteredSearch.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => { router.push(option.path); setIsSearchOpen(false); }}
                      className="w-full text-left px-5 py-4 rounded-2xl hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
                    >
                      <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors">{option.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
