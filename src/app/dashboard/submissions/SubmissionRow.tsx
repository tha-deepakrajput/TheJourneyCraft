"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Check, X, Eye, Trash2 } from "lucide-react";
import { updateSubmissionStatus, deleteSubmission } from "./actions";

interface SubmissionProps {
  _id: string;
  name: string;
  email: string;
  title: string;
  category: string;
  story: string;
  status: string;
  createdAt: string;
  images?: string[];
  video?: string;
}

export default function SubmissionRow({ sub }: { sub: SubmissionProps }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStatusUpdate = async (status: "Approved" | "Rejected") => {
    setIsUpdating(true);
    await updateSubmissionStatus(sub._id, status);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this submission?")) {
      setIsUpdating(true);
      await deleteSubmission(sub._id);
    }
  };

  return (
    <>
      <tr className="hover:bg-muted/20 transition-colors">
        <td className="px-6 py-4 font-medium">{sub.name}</td>
        <td className="px-6 py-4">{sub.title}</td>
        <td className="px-6 py-4">{sub.category || "Uncategorized"}</td>
        <td className="px-6 py-4 text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            sub.status === "Approved" ? "bg-green-500/10 text-green-600 dark:text-green-400" :
            sub.status === "Rejected" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
            "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          }`}>
            {sub.status}
          </span>
        </td>
        <td className="px-6 py-4 text-right space-x-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors" 
            title="Review"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleStatusUpdate("Approved")}
            disabled={isUpdating}
            className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50" 
            title="Approve"
          >
            <Check className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleStatusUpdate("Rejected")}
            disabled={isUpdating}
            className="p-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 rounded-lg transition-colors disabled:opacity-50" 
            title="Reject"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDelete}
            disabled={isUpdating}
            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50" 
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>

      {mounted && isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-lg border border-border flex flex-col max-h-[90vh] z-10">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-border shrink-0">
              <div>
                <h2 className="text-2xl font-bold">{sub.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">By {sub.name} ({sub.email})</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category</h3>
                <p className="font-medium">{sub.category || "Uncategorized"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">The Story</h3>
                <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-xl text-foreground/90 border border-border/50">
                  {sub.story}
                </div>
              </div>

              {sub.video && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Video Link</h3>
                  <a href={sub.video} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline break-all">
                    {sub.video}
                  </a>
                </div>
              )}

              {sub.images && sub.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Cover Image</h3>
                  <div className="rounded-xl overflow-hidden border border-border bg-muted/20">
                    <img src={sub.images[0]} alt="Cover" className="w-full h-auto object-cover max-h-80" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Sticky Footer */}
            <div className="p-6 border-t border-border flex justify-end gap-3 shrink-0 bg-card rounded-b-2xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
              >
                Close
              </button>
              {sub.status !== "Approved" && (
                <button 
                  onClick={() => {
                    handleStatusUpdate("Approved");
                    setIsModalOpen(false);
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
