import { Play } from "lucide-react";

const MOCK_VIDEOS = [
  { id: "v1", title: "My First Solo Trip", duration: "10:45", thumbnail: "v-placeholder.jpg" },
  { id: "v2", title: "Behind the Scenes: JourneyCraft", duration: "18:20", thumbnail: "v-placeholder.jpg" },
  { id: "v3", title: "Reflections on Year One", duration: "05:30", thumbnail: "v-placeholder.jpg" },
];

export default function VideosPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-background to-background -z-10" />
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Video Library</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cinematic vlogs and behind-the-scenes glimpses into the journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-1000 delay-150">
          {MOCK_VIDEOS.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted mb-4 shadow-md group-hover:shadow-xl group-hover:shadow-purple-500/10 transition-all border border-purple-500/10">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-purple-600 dark:text-purple-400 ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-medium z-20">
                  {video.duration}
                </div>
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">Video Thumbnail</div>
              </div>
              <h3 className="text-xl font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{video.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
