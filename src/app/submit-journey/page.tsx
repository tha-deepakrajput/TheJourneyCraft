"use client";

import { UploadCloud, CheckCircle2, Send, PenLine, Sparkles, Image as ImageIcon, Video } from "lucide-react";
import * as motion from "framer-motion/client";
import { useState } from "react";

export default function SubmitJourneyPage() {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    category: "Personal Growth",
    story: "",
    video: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let base64Image = "";
      if (coverImage) {
        // Convert image to base64
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(coverImage);
        });
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images: base64Image ? [base64Image] : [],
        }),
      });

      if (!res.ok) throw new Error("Failed to submit story");

      setIsSubmitted(true);
      setCoverImage(null);
      setFormData({
        name: "",
        email: "",
        title: "",
        category: "Personal Growth",
        story: "",
        video: ""
      });
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-32">
      {/* Cinematic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[60vh] bg-gradient-to-b from-emerald-900/10 via-background to-background" />
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-600/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-teal-600/5 blur-[140px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <PenLine className="w-8 h-8 text-emerald-500" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6"
          >
            Share Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400 drop-shadow-sm">
              Legend.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-emerald-500/50 hidden md:block" />
            Every journey matters. Submit your own milestone, story, or memory to become part of the community timeline.
            <Sparkles className="w-5 h-5 text-emerald-500/50 hidden md:block" />
          </motion.p>
        </div>

        {/* Premium Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative bg-card/60 dark:bg-card/40 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-emerald-500/10"
        >
          {/* Inner ambient glow for form container */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 dark:via-emerald-500/30 to-transparent z-20" />
          
          <form className="space-y-12" onSubmit={handleSubmit}>
            
            {/* Section 1: General Info */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">1</div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">Author Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                    Name <span className="text-emerald-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-14 px-5 rounded-2xl bg-background/50 border border-border/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50 shadow-inner" 
                    placeholder="Jane Doe" 
                  />
                </div>
                <div className="space-y-3 group">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                    Email <span className="text-emerald-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-14 px-5 rounded-2xl bg-background/50 border border-border/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50 shadow-inner" 
                    placeholder="jane@example.com" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Story Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">2</div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">The Narrative</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3 group md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                    Journey Title <span className="text-emerald-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full h-14 px-5 rounded-2xl bg-background/50 border border-border/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50 shadow-inner text-lg" 
                    placeholder="e.g. The day everything changed" 
                  />
                </div>
                
                <div className="space-y-3 group md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                    Category <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full h-14 px-5 rounded-2xl bg-background/50 border border-border/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none cursor-pointer transition-all text-foreground shadow-inner pr-12"
                    >
                      <option value="Personal Growth">Personal Growth</option>
                      <option value="Career">Career</option>
                      <option value="Travel">Travel</option>
                      <option value="Overcoming Challenges">Overcoming Challenges</option>
                    </select>
                    <div className="absolute top-0 right-0 h-full flex items-center pr-5 pointer-events-none text-muted-foreground">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 group md:col-span-2">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                    The Story <span className="text-emerald-500">*</span>
                  </label>
                  <textarea 
                    rows={8} 
                    required
                    value={formData.story}
                    onChange={(e) => setFormData({...formData, story: e.target.value})}
                    className="w-full p-5 rounded-2xl bg-background/50 border border-border/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none resize-y transition-all text-foreground placeholder:text-muted-foreground/50 shadow-inner" 
                    placeholder="Pour your thoughts here. Be as descriptive as you like..."
                  />
                </div>
              </div>
            </div>
            
            {/* Section 3: Media */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold">3</div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">Visuals (Optional)</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Cover Image</label>
                  <label htmlFor="cover-image-upload" className="relative group/upload w-full h-40 border-2 border-dashed border-emerald-500/30 dark:border-emerald-500/20 rounded-[2rem] flex flex-col items-center justify-center text-muted-foreground hover:bg-emerald-500/5 hover:border-emerald-500/60 transition-all cursor-pointer bg-background/30 text-center overflow-hidden block">
                    <input 
                      id="cover-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCoverImage(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 opacity-0 group-hover/upload:opacity-100 transition-opacity" />
                    
                    {coverImage ? (
                      <div className="flex flex-col items-center justify-center z-10 w-full px-4 text-center">
                        <div className="w-14 h-14 mb-3 rounded-full bg-emerald-500/20 flex items-center justify-center transition-all">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <span className="font-semibold text-foreground/80 truncate w-full max-w-[200px]">{coverImage.name}</span>
                        <span className="text-xs text-emerald-500 mt-1">Image selected successfully</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center z-10 w-full px-4 text-center">
                        <div className="w-14 h-14 mb-3 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:bg-emerald-500/20 transition-all">
                          <ImageIcon className="w-6 h-6 text-emerald-600/80 dark:text-emerald-400" />
                        </div>
                        <span className="font-semibold text-foreground/80">Click or Drag & Drop</span>
                        <span className="text-xs text-muted-foreground mt-1">High-res JPG, PNG, or WEBP</span>
                      </div>
                    )}
                  </label>
                </div>
                
                <div className="space-y-3 group">
                  <label className="text-sm font-semibold text-muted-foreground tracking-wide uppercase flex items-center gap-2">
                    <Video className="w-4 h-4 text-emerald-500/70" /> Video Link
                  </label>
                  <input 
                    type="url" 
                    value={formData.video}
                    onChange={(e) => setFormData({...formData, video: e.target.value})}
                    className="w-full h-14 px-5 rounded-2xl bg-background/50 border border-border/50 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-foreground placeholder:text-muted-foreground/50 shadow-inner" 
                    placeholder="https://youtube.com/..." 
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group relative w-full h-16 flex items-center justify-center gap-3 bg-emerald-600 dark:bg-emerald-500 text-white font-bold rounded-2xl text-lg hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">{isSubmitting ? "Submitting..." : isSubmitted ? "Submitted Successfully!" : "Submit for Review"}</span>
                {!isSubmitting && !isSubmitted && <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                {isSubmitted && <CheckCircle2 className="w-5 h-5 relative z-10" />}
              </button>
              {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}
              <p className="text-center text-sm text-muted-foreground mt-4">
                Your story will be reviewed by our team before publishing.
              </p>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
