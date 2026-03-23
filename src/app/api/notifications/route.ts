import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Get latest unread submissions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session as any).user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await db
      .select({
        id: submissions.id,
        title: submissions.title,
        name: submissions.name,
        createdAt: submissions.createdAt,
        status: submissions.status,
      })
      .from(submissions)
      .where(eq(submissions.isRead, false))
      .orderBy(desc(submissions.createdAt))
      .limit(10);

    return NextResponse.json({ notifications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Mark notifications as read
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session as any).user.role !== "Creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json().catch(() => ({ id: null }));

    if (id) {
      // Clear a specific notification
      await db
        .update(submissions)
        .set({ isRead: true, updatedAt: new Date() })
        .where(eq(submissions.id, id));
      return NextResponse.json({ message: "Notification cleared" });
    } else {
      // Clear all notifications
      await db
        .update(submissions)
        .set({ isRead: true, updatedAt: new Date() })
        .where(eq(submissions.isRead, false));
      return NextResponse.json({ message: "All notifications cleared" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
