import { db } from "@/db";
import { submissions, journeys } from "@/db/schema";
import { eq, gte, desc, count } from "drizzle-orm";
import DashboardClient from "./DashboardClient";

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  // Fetch Stats in parallel
  const [
    [{ value: totalStories }],
    [{ value: timelineEvents }],
    [{ value: pendingSubmissions }],
    [{ value: approvedSubmissions }],
    [{ value: rejectedSubmissions }],
  ] = await Promise.all([
    db.select({ value: count() }).from(submissions).where(eq(submissions.status, "Approved")),
    db.select({ value: count() }).from(journeys),
    db.select({ value: count() }).from(submissions).where(eq(submissions.status, "Pending")),
    db.select({ value: count() }).from(submissions).where(eq(submissions.status, "Approved")),
    db.select({ value: count() }).from(submissions).where(eq(submissions.status, "Rejected")),
  ]);

  const submissionsBreakdown = {
    pending: pendingSubmissions,
    approved: approvedSubmissions,
    rejected: rejectedSubmissions,
  };

  // Monthly Engagement for the current year
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  
  const [submissionsThisYear, journeysThisYear] = await Promise.all([
    db.select({ createdAt: submissions.createdAt, status: submissions.status })
      .from(submissions)
      .where(gte(submissions.createdAt, startOfYear)),
    db.select({ createdAt: journeys.createdAt })
      .from(journeys)
      .where(gte(journeys.createdAt, startOfYear)),
  ]);
  
  // Group by month
  const monthlyEngagementInitial = [
    { name: "Jan", submissions: 0, events: 0 }, { name: "Feb", submissions: 0, events: 0 }, { name: "Mar", submissions: 0, events: 0 },
    { name: "Apr", submissions: 0, events: 0 }, { name: "May", submissions: 0, events: 0 }, { name: "Jun", submissions: 0, events: 0 },
    { name: "Jul", submissions: 0, events: 0 }, { name: "Aug", submissions: 0, events: 0 }, { name: "Sep", submissions: 0, events: 0 },
    { name: "Oct", submissions: 0, events: 0 }, { name: "Nov", submissions: 0, events: 0 }, { name: "Dec", submissions: 0, events: 0 },
  ];

  submissionsThisYear.forEach(sub => {
    const monthIndex = new Date(sub.createdAt).getMonth();
    monthlyEngagementInitial[monthIndex].submissions += 1;
  });

  journeysThisYear.forEach(j => {
    const monthIndex = new Date(j.createdAt).getMonth();
    monthlyEngagementInitial[monthIndex].events += 1;
  });

  // Fetch Latest Activity
  const latestSubmissions = await db
    .select({
      id: submissions.id,
      title: submissions.title,
      status: submissions.status,
      createdAt: submissions.createdAt,
      email: submissions.email,
    })
    .from(submissions)
    .orderBy(desc(submissions.createdAt))
    .limit(5);

  const latestJourneys = await db
    .select({
      id: journeys.id,
      title: journeys.title,
      createdAt: journeys.createdAt,
      category: journeys.category,
    })
    .from(journeys)
    .orderBy(desc(journeys.createdAt))
    .limit(5);
  
  const combinedActivities = [
    ...latestSubmissions.map(sub => ({
      id: sub.id,
      type: "submission" as const,
      title: sub.title,
      subtitle: `From ${sub.email}`,
      status: sub.status || "Pending",
      date: new Date(sub.createdAt)
    })),
    ...latestJourneys.map(j => ({
      id: j.id,
      type: "journey" as const,
      title: j.title,
      subtitle: j.category || "Timeline Event",
      status: "Published",
      date: new Date(j.createdAt)
    }))
  ];

  combinedActivities.sort((a, b) => b.date.getTime() - a.date.getTime());
  const finalLatestActivity = combinedActivities.slice(0, 5).map(act => ({
    ...act,
    date: act.date.toISOString()
  }));

  return (
    <DashboardClient 
      totalStories={totalStories} 
      timelineEvents={timelineEvents} 
      submissionsBreakdown={submissionsBreakdown}
      monthlyEngagement={monthlyEngagementInitial}
      latestActivity={finalLatestActivity}
    />
  );
}
