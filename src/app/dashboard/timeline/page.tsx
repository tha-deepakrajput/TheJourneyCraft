"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Loader2, Calendar, MapPin } from "lucide-react";

interface Journey {
  id: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  date: string;
  location?: string;
  category: string;
}

export default function DashboardTimelinePage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    video: "",
    date: "",
    location: "",
    category: "Milestone",
  });

  const fetchJourneys = async () => {
    try {
      const res = await fetch("/api/journeys");
      const data = await res.json();
      if (data.success) {
        setJourneys(data.journeys);
      }
    } catch (error) {
      console.error("Failed to fetch journeys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, []);

  const handleOpenModal = (journey?: Journey) => {
    if (journey) {
      setEditingJourney(journey);
      setFormData({
        title: journey.title,
        description: journey.description,
        image: journey.image || "",
        video: journey.video || "",
        date: journey.date,
        location: journey.location || "",
        category: journey.category || "Milestone",
      });
    } else {
      setEditingJourney(null);
      setFormData({
        title: "",
        description: "",
        image: "",
        video: "",
        date: "",
        location: "",
        category: "Milestone",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJourney(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = editingJourney
        ? `/api/journeys/${editingJourney.id}`
        : "/api/journeys";
      const method = editingJourney ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        handleCloseModal();
        fetchJourneys();
      } else {
        alert("Failed to save journey.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    try {
      const res = await fetch(`/api/journeys/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchJourneys();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex sm:flex-row flex-col gap-4 justify-between sm:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manage Timeline</h1>
          <p className="text-muted-foreground">Add, edit, or remove milestones from your journey timeline.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Milestone
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : journeys.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <h3 className="text-lg font-medium mb-2">No timeline entries found</h3>
          <p className="text-muted-foreground">Get started by creating your first milestone.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journeys.map((journey) => (
            <div
              key={journey.id}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col hover:border-orange-500/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 w-fit">
                    <Calendar className="w-3 h-3 mr-1" />
                    {journey.date}
                  </span>
                  {journey.location && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 w-fit">
                      <MapPin className="w-3 h-3 mr-1" />
                      {journey.location}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(journey)}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 rounded-lg hover:bg-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(journey.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors bg-secondary/50 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-foreground">{journey.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                {journey.description}
              </p>
              
              {journey.image && (
                <div className="h-32 w-full rounded-xl overflow-hidden mt-auto">
                  <img src={journey.image} alt={journey.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-card z-10">
              <h2 className="text-xl font-semibold">
                {editingJourney ? "Edit Milestone" : "Add New Milestone"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="E.g., The Beginning"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date / Year</label>
                  <input
                    required
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="E.g., 2019 or October 2023"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Describe what happened during this milestone..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location (Optional)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="E.g., Paris, France or Digital"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="E.g., Milestone, Achievement, Challenge"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 text-sm text-green-500">Image URL provided</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL (Optional)</label>
                <input
                  type="text"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="https://youtube.com/... or relative path"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingJourney ? "Save Changes" : "Create Milestone"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
