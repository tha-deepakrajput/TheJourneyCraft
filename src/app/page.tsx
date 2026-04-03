import Hero from "@/components/Hero";
import Link from "next/link";
import { ArrowRight, Sparkles, Image as ImageIcon, BookOpen } from "lucide-react";
import * as motion from "framer-motion/client";
import { db } from "@/db";
import { journeys, submissions } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Rotating color palette for journey highlight cards
const cardStyles = [
  { color: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", tag: "bg-blue-500/20 text-blue-600 dark:text-blue-400" },
  { color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/30", tag: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
  { color: "from-purple-500/20 to-pink-500/20", border: "border-purple-500/30", tag: "bg-purple-500/20 text-purple-600 dark:text-purple-400" },
];

export default async function Home() {
  // Fetch latest 3 journeys
  const latestJourneys = await db
    .select()
    .from(journeys)
    .orderBy(desc(journeys.date))
    .limit(3);

  // Fetch latest 3 approved stories
  const rawStories = await db
    .select()
    .from(submissions)
    .where(eq(submissions.status, "Approved"))
    .orderBy(desc(submissions.createdAt))
    .limit(3);

  const latestStories = rawStories.map(story => ({
    id: story.id,
    title: story.title,
    description: story.story,
    readingTime: `${Math.max(1, Math.ceil(story.story.split(" ").length / 200))} min read`,
    tag: story.category || "Story",
    coverImage: story.images && story.images.length > 0 ? story.images[0] : undefined,
  }));

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden relative">
      <Hero />
      
      {/* Journey Highlights Section */}
      <section className="relative py-12 md:py-32 px-4 sm:px-6 lg:px-8 w-full z-10 overflow-hidden">
        {/* Aurora / Northern Lights Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Aurora blob 1 — warm orange */}
          <div
            className="absolute rounded-full blur-[130px]"
            style={{
              width: '800px',
              height: '800px',
              top: '-20%',
              left: '5%',
              background: 'radial-gradient(circle, rgba(249,115,22,0.6), rgba(251,191,36,0.35), transparent 70%)',
              opacity: 0.5,
              animation: 'aurora-drift 15s ease-in-out infinite'
            }}
          />
          {/* Aurora blob 2 — cool blue */}
          <div
            className="absolute rounded-full blur-[120px]"
            style={{
              width: '700px',
              height: '700px',
              top: '10%',
              right: '0%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.6), rgba(139,92,246,0.4), transparent 70%)',
              opacity: 0.45,
              animation: 'aurora-drift-reverse 18s ease-in-out infinite 2s'
            }}
          />
          {/* Aurora blob 3 — emerald accent */}
          <div
            className="absolute rounded-full blur-[110px]"
            style={{
              width: '600px',
              height: '600px',
              bottom: '-10%',
              left: '35%',
              background: 'radial-gradient(circle, rgba(16,185,129,0.5), rgba(59,130,246,0.3), transparent 70%)',
              opacity: 0.4,
              animation: 'aurora-drift 20s ease-in-out infinite 4s'
            }}
          />
          {/* Top and bottom fade to blend into page */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide uppercase">Curated Collections</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter"
            >
              Journey Highlights
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground/80 text-lg md:text-xl max-w-2xl mx-auto font-light"
            >
              Immerse yourself in spectacular moments frozen in time, capturing the essence of global exploration and personal discovery.
            </motion.p>
          </div>
          
          {latestJourneys.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {latestJourneys.map((journey, i) => {
                const style = cardStyles[i % cardStyles.length];
                return (
                  <motion.div 
                    key={journey.id} 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
                    className={`group aspect-[4/5] rounded-3xl bg-gradient-to-br ${style.color} ${style.border} border backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black/5 dark:shadow-white/5 cursor-pointer`}
                  >
                    {/* Background image if available */}
                    {journey.image && (
                      <img 
                        src={journey.image} 
                        alt={journey.title} 
                        className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700" 
                      />
                    )}
                    <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500 z-[1]" />
                    <div className="absolute inset-0 flex flex-col justify-between p-8 z-[2]">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <ImageIcon className="w-6 h-6 text-foreground/70" />
                        </div>
                        {journey.category && (
                          <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md border border-white/10 ${style.tag}`}>
                            {journey.category}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-foreground/50 mb-1 font-medium">{journey.date}</p>
                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:-translate-y-1 transition-transform duration-500">{journey.title}</h3>
                        <p className="text-sm text-foreground/60 line-clamp-2 mb-3">{journey.description}</p>
                        <span className="text-sm font-medium text-foreground/60 flex items-center gap-2 group-hover:text-foreground/90 transition-colors">
                          View Details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6 border border-border/50">
                <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground/70 text-lg">No journey highlights yet. Start documenting your journey!</p>
            </motion.div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.2 }}
            className="mt-20 text-center"
          >
            <Link 
              href="/timeline" 
              className="inline-flex items-center px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all hover:-translate-y-1 hover:shadow-xl shadow-secondary/20"
            >
              View Full Timeline <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="relative py-12 md:py-32 px-4 sm:px-6 lg:px-8 w-full z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Animated Dot Grid + Glow Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute inset-0 dot-grid-bg"
            style={{ animation: 'grid-shift 8s linear infinite' }}
          />
          {/* Accent glow orb — blue */}
          <div
            className="absolute rounded-full blur-[100px]"
            style={{
              width: '500px',
              height: '500px',
              top: '5%',
              right: '10%',
              background: 'radial-gradient(circle, rgba(59,130,246,0.45), transparent 70%)',
              opacity: 0.6,
              animation: 'orb-pulse 6s ease-in-out infinite'
            }}
          />
          {/* Accent glow orb — indigo */}
          <div
            className="absolute rounded-full blur-[90px]"
            style={{
              width: '450px',
              height: '450px',
              bottom: '0%',
              left: '5%',
              background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
              opacity: 0.5,
              animation: 'orb-pulse 8s ease-in-out infinite 3s'
            }}
          />
          {/* Edge fades */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                className="text-4xl md:text-5xl font-bold tracking-tighter mb-4"
              >
                Latest Stories
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground/80 text-lg font-light"
              >
                Intimate narratives and deep reflections from the roads less traveled.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              <Link href="/stories" className="group inline-flex items-center text-primary font-semibold hover:opacity-80 transition-opacity">
                Browse All Stories 
                <span className="bg-primary/10 ml-2 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </motion.div>
          </div>
          
          {latestStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
              {latestStories.map((story, i) => (
                <motion.div 
                  key={story.id} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: 0.1 * i }}
                  className="group relative h-80 md:h-[400px] rounded-3xl bg-card border border-border/50 shadow-sm overflow-hidden"
                >
                  <Link href={`/stories/${story.id}`} className="absolute inset-0 z-40" />
                  
                  {/* Cover image background */}
                  {story.coverImage && (
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-700" 
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-muted/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-20" />
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full z-30 transform group-hover:-translate-y-2 transition-transform duration-500">
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary backdrop-blur-md">{story.tag}</span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary/50 text-secondary-foreground backdrop-blur-md">{story.readingTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{story.title}</h3>
                    <p className="text-sm text-foreground/60 line-clamp-2">{story.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6 border border-border/50">
                <BookOpen className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground/70 text-lg">No stories shared yet. Be the first to share your journey!</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
