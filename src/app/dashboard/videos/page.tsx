import { Plus } from "lucide-react";

export default function DashboardVideosPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex sm:flex-row flex-col gap-4 justify-between sm:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Videos</h1>
          <p className="text-muted-foreground">Upload and organize your vlog and video library.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4 mr-2" /> Add Video
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium mb-2">No videos found</h3>
        <p className="text-muted-foreground">Get started by linking your first video.</p>
      </div>
    </div>
  );
}
