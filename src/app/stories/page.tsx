import BlogCard from "@/components/BlogCard";

const MOCK_STORIES = [
  { id: "1", title: "Embracing the Unknown", description: "A deep dive into the fears and excitement of starting a new chapter in life without a clear map.", readingTime: "5 min read" },
  { id: "2", title: "The Power of Consistency", description: "How showing up every single day, even when it feels pointless, compounds into massive results.", readingTime: "8 min read" },
  { id: "3", title: "Finding Inspiration in Silence", description: "Stepping away from the noisy world to discover what truly matters from within.", readingTime: "4 min read" },
  { id: "4", title: "Building a Digital Museum", description: "The architectural thoughts and design philosophies behind creating this exact platform.", readingTime: "12 min read" },
  { id: "5", title: "Why We Need more Stories", description: "Numbers tell you what happened, but stories tell you why it matters. A reflection on human connection.", readingTime: "6 min read" },
];

export default function StoriesPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-background to-background -z-10" />
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Stories & Thoughts</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Deep dives into the experiences, lessons, and philosophies that drive the journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_STORIES.map((story, index) => (
            <BlogCard 
              key={story.id}
              index={index}
              id={story.id}
              title={story.title}
              description={story.description}
              readingTime={story.readingTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
