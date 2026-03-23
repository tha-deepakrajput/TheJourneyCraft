import { NextResponse } from "next/server";
import { db } from "@/db";
import { journeys } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allJourneys = await db
      .select()
      .from(journeys)
      .orderBy(asc(journeys.date));
    return NextResponse.json({ success: true, journeys: allJourneys });
  } catch (error: any) {
    console.error("Error fetching journeys:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch journeys" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    const [newJourney] = await db
      .insert(journeys)
      .values({
        title: body.title,
        description: body.description,
        image: body.image || "",
        video: body.video || "",
        date: body.date,
        location: body.location || "",
        category: body.category || "General",
      })
      .returning();

    return NextResponse.json(
      { success: true, journey: newJourney },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating journey:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create journey" },
      { status: 500 }
    );
  }
}
