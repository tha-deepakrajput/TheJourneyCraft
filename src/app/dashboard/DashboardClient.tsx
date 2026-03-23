"use client";

import { motion, Variants } from "framer-motion";
import { BookOpen, Film, Send, Inbox, Activity, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DashboardClientProps {
  totalStories: number;
  timelineEvents: number;
  submissionsBreakdown: {
    pending: number;
    approved: number;
    rejected: number;
  };
  monthlyEngagement: Array<{
    name: string;
    submissions: number;
    events: number;
  }>;
  latestActivity: Array<{
    id: string;
    type: "submission" | "journey";
    title: string;
    subtitle: string;
    status: string;
    date: string;
  }>;
}

export default function DashboardClient({
  totalStories,
  timelineEvents,
  submissionsBreakdown,
  monthlyEngagement,
  latestActivity,
}: DashboardClientProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const totalSubmissions = submissionsBreakdown.pending + submissionsBreakdown.approved + submissionsBreakdown.rejected;

  const stats = [
    { label: "Total Stories", value: totalStories.toString(), icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Timeline Events", value: timelineEvents.toString(), icon: Film, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Total Submissions", value: totalSubmissions.toString(), icon: Inbox, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Creator. Here's real-time data on your journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants} className={`bg-card p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}>
              {/* Subtle background glow effect */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity ${stat.bg}`} />
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${stat.bg} ${stat.border}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-3xl font-black">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Monthly Engagement Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex flex-col mb-6">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Monthly Engagement
            </h3>
            <p className="text-sm text-muted-foreground">Stories and timeline events over the year.</p>
          </div>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEngagement} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "12px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ fontSize: "14px", fontWeight: "500" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}/>
                <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSubmissions)" />
                <Area type="monotone" dataKey="events" name="Events" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Submissions Breakdown */}
        <motion.div variants={itemVariants} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-500" />
            Submissions
          </h3>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="font-medium">Pending</span>
                </div>
                <span className="font-bold">{submissionsBreakdown.pending}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalSubmissions ? (submissionsBreakdown.pending / totalSubmissions) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-amber-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Approved</span>
                </div>
                <span className="font-bold">{submissionsBreakdown.approved}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalSubmissions ? (submissionsBreakdown.approved / totalSubmissions) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span className="font-medium">Rejected</span>
                </div>
                <span className="font-bold">{submissionsBreakdown.rejected}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${totalSubmissions ? (submissionsBreakdown.rejected / totalSubmissions) * 100 : 0}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="h-full bg-rose-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <motion.div variants={itemVariants} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <h3 className="font-bold text-xl">Latest Activity</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-muted rounded-full text-muted-foreground">Recent</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestActivity.length === 0 ? (
            <p className="text-muted-foreground col-span-2 text-center py-4">No recent activity found.</p>
          ) : latestActivity.map((activity, i) => (
            <div key={activity.id + i} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.type === 'submission' ? 'bg-indigo-500/10' : 'bg-purple-500/10'}`}>
                  {activity.type === 'submission' ? <Inbox className="w-5 h-5 text-indigo-500" /> : <Film className="w-5 h-5 text-purple-500" />}
                </div>
                <div>
                  <p className="font-medium text-sm line-clamp-1">{activity.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{activity.subtitle}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span className={`font-medium ${
                      activity.status === 'Approved' || activity.status === 'Published' ? 'text-emerald-500' :
                      activity.status === 'Pending' ? 'text-amber-500' :
                      'text-rose-500'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
