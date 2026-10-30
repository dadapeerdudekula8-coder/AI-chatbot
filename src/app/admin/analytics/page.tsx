"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { BarChart3, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");

  useEffect(() => {
    fetch(`/api/analytics?range=${range}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setData(d.data); })
      .finally(() => setLoading(false));
  }, [range]);

  const metrics = data
    ? [
        { label: "Total Conversations", value: data.totalConversations, color: "text-blue-500" },
        { label: "AI Resolved", value: data.aiResolved, color: "text-teal-500" },
        { label: "Escalated", value: data.escalated, color: "text-orange-500" },
        { label: "Open Tickets", value: data.openTickets, color: "text-red-500" },
        { label: "Resolved Tickets", value: data.resolvedTickets, color: "text-green-500" },
        { label: "Satisfaction", value: data.satisfactionRate ? `${data.satisfactionRate}%` : "N/A", color: "text-purple-500" },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-8 h-8" /> Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Platform performance metrics</p>
          </div>
          <select
            value={range}
            onChange={(e) => { setRange(e.target.value); setLoading(true); }}
            className="px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !data ? (
          <div className="text-center py-24 text-muted-foreground">Failed to load analytics.</div>
        ) : (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {metrics.map(({ label, value, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-5">
                  <div className={`text-3xl font-bold mb-1 ${color}`}>{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Conversation volume chart */}
              {data.dailyVolume?.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Conversation Volume</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={data.dailyVolume}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={false} name="Conversations" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Ticket status breakdown */}
              {data.ticketsByStatus?.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Tickets by Status</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={data.ticketsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label={(entry: any) => `${entry.name ?? ""} ${Math.round((entry.percent ?? 0) * 100)}%`}>
                        {data.ticketsByStatus.map((_: any, i: number) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top questions */}
            {data.topQuestions?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Most Frequent Customer Questions</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topQuestions} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="question" width={200} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]} name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
