import TimelineCard from "@/components/TimelineCard";
import * as motion from "framer-motion/client";
import { Compass, Route, Plus } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { journeys } from "@/db/schema";
import { asc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const session = await getServerSession(authOptions);
  
  const allJourneys = await db
    .select()
    .from(journeys)
    .orderBy(asc(journeys.date));

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background" />
      </div>

      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-32 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 shadow-2xl shadow-orange-500/20"
          >
            <Route className="w-8 h-8 text-orange-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8"
          >
            The Journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-400 drop-shadow-sm">
              Timeline.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Explore the milestones, challenges, and beautiful moments that
            shaped this incredible story across time.
          </motion.p>

          {session && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              className="mt-12 relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <Link 
                href="/dashboard/timeline"
                className="relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-background border border-orange-500/30 text-foreground font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 group-hover:from-orange-500/20 group-hover:to-amber-500/20 transition-colors" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-inner relative z-10 group-hover:rotate-90 transition-transform duration-500">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span className="relative z-10 tracking-wide text-lg bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500 font-extrabold pr-2">
                  Add Milestone
                </span>
              </Link>
            </motion.div>
          )}
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          {/* Main vertical line for desktop */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-orange-500/50 via-amber-500/20 to-transparent z-0 rounded-full"
          />

          <div className="space-y-24 md:space-y-32">
            {allJourneys.length > 0 ? (
              allJourneys.map((journey: any, index: number) => (
                <TimelineCard
                  key={journey.id}
                  index={index}
                  year={journey.date}
                  title={journey.title}
                  description={journey.description}
                  image={journey.image}
                  video={journey.video}
                  location={journey.location}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-24 w-full flex justify-center z-10 relative">
                <p className="px-6 py-3 rounded-full bg-secondary/50 border border-border">
                  No milestones have been added to the journey yet.
                </p>
              </div>
            )}
          </div>

          {/* End of timeline indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            className="mt-32 flex justify-center w-full relative z-10"
          >
            <div className="w-12 h-12 rounded-full border-2 border-orange-500/30 bg-background flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.15)]">
              <Compass className="w-5 h-5 text-title text-orange-500/80 animate-[spin_10s_linear_infinite]" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
