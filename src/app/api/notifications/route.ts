import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-util";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

// Get notifications based on role
export async function GET(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      console.log("[Notifications API] No valid session for request");
      return NextResponse.json({ error: "Session invalid or missing Authorization header" }, { status: 401 });
    }

    const { user } = session as any;

    if (user.role === "Creator") {
      // Creator sees unread submissions that need review
      const results = await db
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
        .limit(15);

      const notifications = results.map(n => ({
        ...n,
        type: 'new_submission',
        message: `New story submission: "${n.title}" from ${n.name || 'Anonymous'}`
      }));

      return NextResponse.json({ notifications });
    } else {
      // Explorer sees updates to their own submissions
      if (!user.email) {
        return NextResponse.json({ notifications: [] });
      }

      const results = await db
        .select({
          id: submissions.id,
          title: submissions.title,
          name: submissions.name,
          createdAt: submissions.createdAt,
          status: submissions.status,
          updatedAt: submissions.updatedAt,
        })
        .from(submissions)
        .where(
          and(
            eq(submissions.email, user.email),
            eq(submissions.isRead, false)
          )
        )
        .orderBy(desc(submissions.updatedAt))
        .limit(10);

      // Label these for the UI
      const notifications = results.map(n => ({
        ...n,
        type: 'status_update',
        message: n.status === 'Approved' 
          ? `Your story "${n.title}" has been approved and published!`
          : n.status === 'Rejected'
          ? `Your story "${n.title}" was reviewed and declined.`
          : `Your story "${n.title}" is currently pending review.`
      }));

      return NextResponse.json({ notifications });
    }
  } catch (error: any) {
    console.error("[Notifications API] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Mark notifications as read
export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Session invalid or missing Authorization header" }, { status: 401 });
    }

    const { user } = session as any;
    const { id } = await req.json().catch(() => ({ id: null }));

    if (id) {
      // Clear a specific notification if belong to user OR is Creator
      if (user.role === "Creator") {
        await db
          .update(submissions)
          .set({ isRead: true, updatedAt: new Date() })
          .where(eq(submissions.id, id));
      } else {
        await db
          .update(submissions)
          .set({ isRead: true, updatedAt: new Date() })
          .where(and(eq(submissions.id, id), eq(submissions.email, user.email)));
      }
      return NextResponse.json({ message: "Notification cleared" });
    } else {
      // Clear all notifications
      if (user.role === "Creator") {
        await db
          .update(submissions)
          .set({ isRead: true, updatedAt: new Date() })
          .where(eq(submissions.isRead, false));
      } else {
        await db
          .update(submissions)
          .set({ isRead: true, updatedAt: new Date() })
          .where(and(eq(submissions.email, user.email), eq(submissions.isRead, false)));
      }
      return NextResponse.json({ message: "All notifications cleared" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
