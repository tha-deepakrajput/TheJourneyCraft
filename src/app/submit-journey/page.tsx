import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function SubmitJourneyPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-background to-background -z-10" />
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Share Your Story</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every journey matters. Submit your own milestone, story, or memory to become part of the community timeline.
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8 md:p-12 shadow-xl shadow-emerald-500/5 animate-in fade-in duration-1000 delay-150">
          <form className="space-y-8">
            {/* General Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold border-b border-emerald-500/20 pb-2 flex items-center"><CheckCircle2 className="mr-2 text-emerald-600 dark:text-emerald-400" /> About You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input type="text" className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none transition-shadow" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none transition-shadow" placeholder="jane@example.com" />
                </div>
              </div>
            </div>

            {/* Story Details */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold border-b border-emerald-500/20 pb-2 flex items-center"><CheckCircle2 className="mr-2 text-emerald-600 dark:text-emerald-400" /> Your Journey</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Journey Title</label>
                <input type="text" className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none transition-shadow" placeholder="The day everything changed" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none appearance-none cursor-pointer transition-shadow">
                  <option>Personal Growth</option>
                  <option>Career</option>
                  <option>Travel</option>
                  <option>Overcoming Challenges</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">The Story</label>
                <textarea rows={8} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none resize-none transition-shadow" placeholder="Tell us what happened..."></textarea>
              </div>
            </div>
            
            {/* Media */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold border-b border-emerald-500/20 pb-2 flex items-center"><CheckCircle2 className="mr-2 text-emerald-600 dark:text-emerald-400" /> Media (Optional)</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Images</label>
                <div className="w-full h-32 border-2 border-dashed border-emerald-500/30 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-emerald-500/5 hover:border-emerald-500/50 transition-colors cursor-pointer bg-background/50 text-center px-4">
                  <UploadCloud className="w-8 h-8 mb-2 text-emerald-600/50" />
                  <span>Drag & drop or click to upload</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Link</label>
                <input type="url" className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none transition-shadow" placeholder="https://youtube.com/..." />
              </div>
            </div>

            <button type="button" className="w-full h-14 bg-emerald-600 text-white font-bold rounded-xl text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
              Submit for Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
