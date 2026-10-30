"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Settings, Save, Loader2 } from "lucide-react";

const DEFAULT_SETTINGS = [
  { key: "chatbot_name", value: "SupportAI Assistant", description: "Display name for the AI chatbot" },
  { key: "max_tokens", value: "1000", description: "Maximum tokens per AI response" },
  { key: "rag_top_k", value: "5", description: "Number of knowledge chunks to retrieve" },
  { key: "rag_min_similarity", value: "0.7", description: "Minimum cosine similarity for retrieval (0–1)" },
  { key: "rate_limit_chat", value: "30", description: "Max chat requests per user per minute" },
  { key: "fallback_message", value: "I'm not sure about that. Let me connect you with a support agent.", description: "Fallback response when AI cannot answer" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const map: Record<string, string> = {};
          for (const s of data.data) map[s.key] = s.value;
          // Fill in defaults for any missing
          for (const d of DEFAULT_SETTINGS) {
            if (!map[d.key]) map[d.key] = d.value;
          }
          setSettings(map);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSetting = async (key: string) => {
    setSaving(key);
    const setting = DEFAULT_SETTINGS.find((s) => s.key === key);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: settings[key], description: setting?.description }),
    });
    setSaving(null);
    setSaved((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [key]: false })), 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" /> Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure chatbot behavior and platform options.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {DEFAULT_SETTINGS.map(({ key, description }) => (
              <div key={key} className="bg-card border border-border rounded-2xl p-6">
                <label className="block font-semibold mb-1">{key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</label>
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
                <div className="flex gap-3">
                  {key === "fallback_message" ? (
                    <textarea
                      value={settings[key] || ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                      rows={3}
                      className="flex-1 px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[key] || ""}
                      onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  )}
                  <button
                    onClick={() => saveSetting(key)}
                    disabled={saving === key}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60 whitespace-nowrap"
                  >
                    {saving === key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saved[key] ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
