import { db } from "@/db";
import { submissions } from "@/db/schema";
import { desc } from "drizzle-orm";
import SubmissionRow from "./SubmissionRow";

export default async function SubmissionsPage() {
  const allSubmissions = await db
    .select()
    .from(submissions)
    .orderBy(desc(submissions.createdAt));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Submissions</h1>
        <p className="text-muted-foreground">Review and manage stories submitted by the community.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Story Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {allSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No submissions found.</td>
                </tr>
              ) : allSubmissions.map((sub) => (
                <SubmissionRow 
                  key={sub.id} 
                  sub={{
                    _id: sub.id,
                    name: sub.name,
                    email: sub.email,
                    title: sub.title,
                    category: sub.category || "General",
                    story: sub.story,
                    status: sub.status || "Pending",
                    createdAt: sub.createdAt.toISOString(),
                    images: sub.images || [],
                    video: sub.video || undefined
                  }} 
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
