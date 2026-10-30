"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { HelpCircle, Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ question: "", answer: "", category: "General", sortOrder: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchFAQs = async () => {
    const res = await fetch("/api/faqs");
    const data = await res.json();
    if (data.success) setFaqs(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchFAQs(); }, []);

  const resetForm = () => { setForm({ question: "", answer: "", category: "General", sortOrder: 0 }); setError(""); };

  const startCreate = () => { resetForm(); setCreating(true); setEditing(null); };
  const startEdit = (faq: FAQ) => { setEditing(faq); setForm({ question: faq.question, answer: faq.answer, category: faq.category, sortOrder: faq.sortOrder }); setCreating(false); };

  const submitCreate = async () => {
    setSubmitting(true); setError("");
    const res = await fetch("/api/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!data.success) { setError(data.error || "Failed"); setSubmitting(false); return; }
    setCreating(false); resetForm(); fetchFAQs(); setSubmitting(false);
  };

  const submitEdit = async () => {
    if (!editing) return;
    setSubmitting(true); setError("");
    const res = await fetch(`/api/faqs/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!data.success) { setError(data.error || "Failed"); setSubmitting(false); return; }
    setEditing(null); resetForm(); fetchFAQs(); setSubmitting(false);
  };

  const deleteFAQ = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/faqs/${id}`, { method: "DELETE" });
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleActive = async (faq: FAQ) => {
    await fetch(`/api/faqs/${faq.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !faq.isActive }),
    });
    setFaqs((prev) => prev.map((f) => f.id === faq.id ? { ...f, isActive: !f.isActive } : f));
  };

  const FormBlock = ({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) => (
    <div className="bg-card border border-primary/30 rounded-2xl p-6 mb-4">
      {error && <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg">{error}</div>}
      <div className="space-y-3">
        <input
          type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
          placeholder="Question" className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <textarea
          value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
          rows={4} placeholder="Answer"
          className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <div className="flex gap-3">
          <input
            type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            placeholder="Category" className="flex-1 px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: +e.target.value })}
            placeholder="Order" className="w-24 px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition">Cancel</button>
        <button onClick={onSubmit} disabled={submitting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Check className="w-4 h-4" /> Save</>}
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><HelpCircle className="w-8 h-8" /> FAQs</h1>
            <p className="text-muted-foreground mt-1">{faqs.length} frequently asked questions</p>
          </div>
          <button onClick={startCreate} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {creating && <FormBlock onSubmit={submitCreate} onCancel={() => { setCreating(false); resetForm(); }} />}

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-16">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold">No FAQs yet</h3>
            <p className="text-sm text-muted-foreground">Add your first FAQ above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              editing?.id === faq.id ? (
                <FormBlock key={faq.id} onSubmit={submitEdit} onCancel={() => { setEditing(null); resetForm(); }} />
              ) : (
                <div key={faq.id} className={cn("bg-card border rounded-2xl p-6 transition-all", faq.isActive ? "border-border" : "border-border opacity-60")}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{faq.category}</span>
                        {!faq.isActive && <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 rounded-full">Hidden</span>}
                      </div>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => toggleActive(faq)} title={faq.isActive ? "Hide" : "Show"}
                        className="p-2 text-muted-foreground hover:text-primary transition rounded-lg hover:bg-muted">
                        {faq.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                      <button onClick={() => startEdit(faq)} title="Edit"
                        className="p-2 text-muted-foreground hover:text-primary transition rounded-lg hover:bg-muted">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteFAQ(faq.id)} title="Delete"
                        className="p-2 text-muted-foreground hover:text-red-500 transition rounded-lg hover:bg-muted">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
