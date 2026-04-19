import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-util";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const userSubmissions = await db
      .select()
      .from(submissions)
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt));

    const formattedSubmissions = userSubmissions.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.story,
      category: s.category || "Story",
      coverImage: s.images && s.images.length > 0 ? s.images[0] : undefined,
      status: s.status,
      readingTime: `${Math.max(1, Math.ceil(s.story.split(" ").length / 200))} min read`,
      createdAt: s.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, submissions: formattedSubmissions });
  } catch (error: any) {
    console.error("Error fetching user submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
