"use client";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Users, Search, ChevronDown, Shield, Loader2 } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  CUSTOMER: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  AGENT: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  ADMIN: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.data.items);
      setTotal(data.data.total);
      setTotalPages(data.data.totalPages);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const updateUser = async (id: string, patch: Record<string, unknown>) => {
    setUpdatingId(id);
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (data.success) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.data } : u)));
    }
    setUpdatingId(null);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" /> User Management
            </h1>
            <p className="text-muted-foreground mt-1">{total} total users</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </form>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Roles</option>
            <option value="CUSTOMER">Customer</option>
            <option value="AGENT">Agent</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-6 py-4 text-left font-semibold">User</th>
                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Activity</th>
                    <th className="px-6 py-4 text-left font-semibold">Joined</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{user.name || "—"}</div>
                        <div className="text-muted-foreground text-xs">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUser(user.id, { role: e.target.value })}
                          disabled={updatingId === user.id}
                          className={cn("px-2.5 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary cursor-pointer", ROLE_COLORS[user.role])}
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="AGENT">Agent</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                          disabled={updatingId === user.id}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium transition",
                            user.isActive
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          )}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {user._count.conversations} chats · {user._count.tickets} tickets
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        {updatingId === user.id && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
