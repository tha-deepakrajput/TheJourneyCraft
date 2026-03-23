import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const [newSubmission] = await db
      .insert(submissions)
      .values({
        name: body.name,
        email: body.email,
        title: body.title,
        story: body.story,
        category: body.category,
        images: body.images || [],
        video: body.video || "",
        status: "Pending",
      })
      .returning();

    return NextResponse.json(
      { success: true, submission: newSubmission },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
