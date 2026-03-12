import { Users, BookOpen, Film, Send, Inbox } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { label: "Total Stories", value: "24", icon: BookOpen, trend: "+3 this month" },
    { label: "Timeline Events", value: "15", icon: Film, trend: "+1 this week" },
    { label: "Pending Submissions", value: "5", icon: Send, trend: "Requires review" },
    { label: "Total Visitors", value: "12.4k", icon: Users, trend: "+12% vs last month" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Creator. Here's what's happening with your journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-full text-muted-foreground">{stat.trend}</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-medium mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm min-h-[400px] flex flex-col">
          <h3 className="font-semibold mb-4 text-lg border-b border-border/50 pb-3">Monthly Engagement</h3>
          <div className="flex-1 flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border/60">
            <span className="text-muted-foreground font-medium">Chart visualization will appear here</span>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm min-h-[400px] flex flex-col">
          <h3 className="font-semibold mb-4 text-lg border-b border-border/50 pb-3">Latest Activity</h3>
          <div className="flex-1 flex flex-col gap-4 mt-4">
             {/* Stub items */}
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                     <Inbox className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <p className="font-medium text-sm">New Submission received</p>
                     <p className="text-xs text-muted-foreground">From a community member</p>
                   </div>
                 </div>
                 <span className="text-xs text-muted-foreground">2 hrs ago</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Ensure lucide icon imports are correct. I missed importing Inbox. Let me fix inside the file.
