import Link from "next/link";
import { Compass, Github, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Compass className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">JourneyCraft</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              A premium storytelling platform to document, share, and explore life's greatest journeys through a cinematic lens.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/timeline" className="hover:text-primary transition-colors">Timeline</Link></li>
              <li><Link href="/stories" className="hover:text-primary transition-colors">Stories</Link></li>
              <li><Link href="/videos" className="hover:text-primary transition-colors">Videos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
            </div>
            <div className="mt-6">
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact Us</Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} JourneyCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
