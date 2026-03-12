export default function DashboardMessagesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Inbox & Messages</h1>
        <p className="text-muted-foreground">Read and reply to messages from visitors.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
        <h3 className="text-lg font-medium mb-2">Inbox is empty</h3>
        <p className="text-muted-foreground">You have no new messages at this time.</p>
      </div>
    </div>
  );
}
