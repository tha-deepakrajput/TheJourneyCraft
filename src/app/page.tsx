import Hero from "@/components/Hero";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Journey Highlights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Key moments and featured stories from the path traveled.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map((i) => (
             <div key={i} className="aspect-4/3 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
               <span className="text-muted-foreground">Highlight {i}</span>
             </div>
           ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/timeline" className="inline-flex items-center text-primary font-medium hover:underline">
            View full timeline <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Latest Stories</h2>
              <p className="text-muted-foreground">Deep dives into thoughts and experiences.</p>
            </div>
            <Link href="/stories" className="inline-flex items-center text-primary font-medium hover:underline">
              All stories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
             <div key={i} className="h-64 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center">
               <span className="text-muted-foreground">Story {i}</span>
             </div>
           ))}
          </div>
        </div>
      </section>
    </div>
  );
}
