import TimelineCard from "@/components/TimelineCard";

// Mock data to demonstrate the premium UI until database integration
const MOCK_JOURNEYS = [
  {
    year: "2019",
    title: "The Beginning",
    description: "Started the long journey towards building something meaningful. Everything was new and challenging.",
    image: "/placeholder-1.jpg",
  },
  {
    year: "2020",
    title: "First Achievement",
    description: "Hit our first major milestone. It felt like all the hard work was finally paying off.",
    video: "placeholder-vid",
  },
  {
    year: "2021",
    title: "Biggest Challenge",
    description: "Encountered a massive roadblock that forced me to rethink the entire strategy. It was a period of immense growth.",
    image: "/placeholder-2.jpg",
  },
  {
    year: "2023",
    title: "Turning Point",
    description: "The moment everything clicked. The connections made here changed the trajectory forever.",
    image: "/placeholder-3.jpg",
  },
  {
    year: "Today",
    title: "Where I Am Today",
    description: "Continuing to explore, build, and share stories with the world. The journey is far from over.",
    image: "/placeholder-4.jpg",
  }
];

export default function TimelinePage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-background -z-10" />
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">The Journey Timeline</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore the milestones, challenges, and beautiful moments that shaped this story.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-orange-500/20 -translate-x-1/2 z-0" />
          {MOCK_JOURNEYS.map((journey, index) => (
            <TimelineCard 
              key={index}
              index={index}
              year={journey.year}
              title={journey.title}
              description={journey.description}
              image={journey.image}
              video={journey.video}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
