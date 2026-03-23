import { NextResponse } from "next/server";
import { db } from "@/db";
import { journeys } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const [updatedJourney] = await db
      .update(journeys)
      .set({
        title: body.title,
        description: body.description,
        image: body.image,
        video: body.video,
        date: body.date,
        location: body.location,
        category: body.category,
        updatedAt: new Date(),
      })
      .where(eq(journeys.id, id))
      .returning();

    if (!updatedJourney) {
      return NextResponse.json({ success: false, error: "Journey not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, journey: updatedJourney });
  } catch (error: any) {
    console.error("Error updating journey:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update journey" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const [deletedJourney] = await db
      .delete(journeys)
      .where(eq(journeys.id, id))
      .returning();

    if (!deletedJourney) {
      return NextResponse.json({ success: false, error: "Journey not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Journey deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting journey:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete journey" },
      { status: 500 }
    );
  }
}
