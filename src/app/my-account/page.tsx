"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as motion from "framer-motion/client";
import {
  Grid3X3, Clock, CheckCircle2, XCircle, BookOpen, PenLine,
  LogOut, Camera, Mail, Save, Edit3, MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  coverImage?: string;
  status: string;
  readingTime: string;
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  image: string | null;
  role: string;
}

export default function MyAccountPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", image: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setShowMenu(false);
    if (showMenu) window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [showMenu]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subsRes, profRes] = await Promise.all([
        fetch("/api/user/submissions"),
        fetch("/api/user/profile"),
      ]);
      if (subsRes.ok) {
        const data = await subsRes.json();
        setSubmissions(data.submissions || []);
      }
      if (profRes.ok) {
        const data = await profRes.json();
        setProfile(data.user);
        setEditForm({ name: data.user.name || "", image: data.user.image || "" });
      }
    } catch (err) {
      console.error("Error loading account data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile((prev) =>
        prev ? { ...prev, name: data.user.name, image: data.user.image } : null
      );
      await update({ name: data.user.name });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const filtered =
    filter === "all"
      ? submissions
      : submissions.filter((s) => s.status === filter);

  const stats = {
    total: submissions.length,
    approved: submissions.filter((s) => s.status === "Approved").length,
    pending: submissions.filter((s) => s.status === "Pending").length,
    rejected: submissions.filter((s) => s.status === "Rejected").length,
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Approved": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Rejected": return "text-red-400 bg-red-500/10 border-red-500/20";
      default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Approved": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "Rejected": return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-5xl mx-auto pt-28 md:pt-36 px-4 sm:px-6">

        {/* ─── Profile Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10"
        >
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
              {(isEditing ? editForm.image : profile?.image) ? (
                <img
                  src={isEditing ? editForm.image : profile?.image!}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl md:text-4xl font-bold text-foreground/60">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3 max-w-sm">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-lg font-semibold focus:ring-1 focus:ring-foreground/20 outline-none"
                  placeholder="Your name"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {profile?.email}
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
                  {profile?.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">{profile?.email}</p>
                <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                  {profile?.role}
                </span>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: profile?.name || "", image: profile?.image || "" });
                  }}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={isSaving || !editForm.name.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? "Saving…" : "Save"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit profile
                </button>
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    className="p-2 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-11 w-48 bg-card border border-border rounded-xl shadow-xl py-1.5 z-50">
                      <Link href="/submit-journey" className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors">
                        <PenLine className="w-4 h-4 text-muted-foreground" /> Share Story
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* ─── Stats Row ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-6 md:gap-10 mb-8 border-b border-border pb-6"
        >
          {[
            { label: "Posts", value: stats.total },
            { label: "Approved", value: stats.approved },
            { label: "Pending", value: stats.pending },
            { label: "Rejected", value: stats.rejected },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ─── Filter Tabs ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex border-b border-border mb-8"
        >
          {["all", "Approved", "Pending", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                filter === f
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground/70"
              }`}
            >
              {f === "all" ? "All" : f}
              {filter === f && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* ─── Posts Grid ─── */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-7 h-7 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {filter === "all" ? "No posts yet" : `No ${filter.toLowerCase()} posts`}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                {filter === "all"
                  ? "Share your first journey to see it here."
                  : `Nothing matches this filter right now.`}
              </p>
              <Link
                href="/submit-journey"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                <PenLine className="w-4 h-4" /> Share Story
              </Link>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-1.5"
            >
              {filtered.map((post, i) => (
                <motion.div
                  layout
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.03 * i }}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="text-center px-3">
                        <p className="text-white text-sm font-semibold line-clamp-2 mb-1">{post.title}</p>
                        <p className="text-white/60 text-xs">{post.category}</p>
                      </div>
                    </div>
                    {/* Status dot */}
                    <div className="absolute top-2 right-2">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border backdrop-blur-sm ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        {post.status}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
