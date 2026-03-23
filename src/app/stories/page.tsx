import BlogCard from "@/components/BlogCard";
import * as motion from "framer-motion/client";
import { BookOpen, Sparkles } from "lucide-react";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function StoriesPage() {
  const rawStories = await db
    .select()
    .from(submissions)
    .where(eq(submissions.status, "Approved"))
    .orderBy(desc(submissions.createdAt));
  
  // Format the stories for the frontend component
  const stories = rawStories.map(story => ({
    id: story.id,
    title: story.title,
    description: story.story,
    readingTime: `${Math.max(1, Math.ceil(story.story.split(" ").length / 200))} min read`,
    tag: story.category || "Story",
    coverImage: story.images && story.images.length > 0 ? story.images[0] : undefined
  }));

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-32">
      {/* Decorative ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-full h-[50vh] bg-gradient-to-b from-blue-500/10 via-background to-background" />
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-24 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20"
          >
            <BookOpen className="w-8 h-8 text-blue-500" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8"
          >
            Stories & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400 drop-shadow-sm">
              Thoughts.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed flex items-center justify-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-blue-500/50 hidden md:block" />
            Deep dives into the experiences, lessons, and philosophies that drive the journey.
            <Sparkles className="w-5 h-5 text-blue-500/50 hidden md:block" />
          </motion.p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12 relative z-20">
          {stories.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-muted-foreground">
              No approved stories yet. Be the first to share your journey!
            </div>
          ) : stories.map((story, index) => (
            <BlogCard 
              key={story.id}
              index={index}
              id={story.id}
              title={story.title}
              description={story.description}
              readingTime={story.readingTime}
              tag={story.tag}
              coverImage={story.coverImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
