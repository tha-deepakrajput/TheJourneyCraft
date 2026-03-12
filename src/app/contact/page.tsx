import { Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-background to-background -z-10" />
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Let's Connect</h1>
          <p className="text-lg text-muted-foreground">
            Have a question, feedback, or just want to say hi? Drop a message below.
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-emerald-500/20 rounded-3xl p-8 md:p-12 shadow-xl shadow-emerald-500/5 animate-in fade-in duration-1000 delay-150">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input id="name" type="text" className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input id="email" type="email" className="w-full h-12 px-4 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea id="message" rows={6} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none transition-shadow" placeholder="Your message here..." />
            </div>
            <button type="button" className="w-full h-14 bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
              Send Message <Send className="ml-2 w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
