"use server";
import { db } from "@/db";
import { submissions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateSubmissionStatus(id: string, status: "Approved" | "Rejected") {
  try {
    await db
      .update(submissions)
      .set({ status, updatedAt: new Date(), isRead: false })
      .where(eq(submissions.id, id));
    revalidatePath("/dashboard/submissions");
    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteSubmission(id: string) {
  try {
    await db
      .delete(submissions)
      .where(eq(submissions.id, id));
    revalidatePath("/dashboard/submissions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete submission:", error);
    return { success: false, error: "Failed to delete submission" };
  }
}
