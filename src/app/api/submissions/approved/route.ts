import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const approvedSubmissions = await db
      .select()
      .from(submissions)
      .where(eq(submissions.status, "Approved"))
      .orderBy(desc(submissions.createdAt));

    // Format consistently for both web and mobile consumers
    const stories = approvedSubmissions.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.story,
      readingTime: `${Math.max(1, Math.ceil(s.story.split(" ").length / 200))} min read`,
      tag: s.category || "Story",
      coverImage: s.images && s.images.length > 0 ? s.images[0] : undefined,
      author: s.name,
      createdAt: s.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, stories });
  } catch (error: any) {
    console.error("Error fetching approved submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
