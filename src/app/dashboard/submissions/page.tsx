import { Check, X, Eye } from "lucide-react";

export default function SubmissionsPage() {
  const submissions = [
    { id: 1, name: "Alice", title: "Climbing Everest", status: "Pending", date: "2 hrs ago" },
    { id: 2, name: "Bob", title: "My first marathon", status: "Pending", date: "5 hrs ago" },
  ];

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
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-card">
              {submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{sub.name}</td>
                  <td className="px-6 py-4">{sub.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{sub.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors" title="Review">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors" title="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
