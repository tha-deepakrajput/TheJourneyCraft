import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import StoryClientView from "./StoryClientView";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  const [story] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id));

  if (story && story.status === "Approved") {
    return {
      title: `${story.title} | Story | The Journey Craft`,
      description: story.story.substring(0, 160).trim() + "...",
      openGraph: {
        title: story.title,
        description: story.story.substring(0, 160).trim() + "...",
        images: story.images && story.images.length > 0 ? [story.images[0]] : [],
      }
    }
  }
  return { title: "Story Not Found | The Journey Craft" }
}

export default async function StoryPage({ params }: PageProps) {
  const { id } = await params;

  const [story] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id));
  
  if (!story || story.status !== "Approved") {
    return notFound();
  }

  // Calculate generic reading time (200 words per minute)
  const wordCount = story.story.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const storyData = {
    id: story.id,
    title: story.title,
    content: story.story,
    author: story.name,
    date: new Date(story.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    readingTime: `${readingTime} min read`,
    category: story.category || "Story",
    images: story.images || [],
    video: story.video || null,
  };

  return <StoryClientView story={storyData} />;
}
