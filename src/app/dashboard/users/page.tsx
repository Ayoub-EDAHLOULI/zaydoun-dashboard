"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Shield,
  ShieldOff,
  Trash2,
  Users,
  BookOpen,
  MessageSquare,
  UserPlus,
  Pencil,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { usersService } from "@/lib/api/services/users.service";
import { AdminUserRow } from "@/types/users.types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import AdminUserModal from "@/components/Dashboard/Users/AdminUserModal";
import DeleteUserModal from "@/components/Dashboard/Users/DeleteUserModal";
import {
  CreateAdminUserFormData,
  EditAdminUserFormData,
} from "@/validations/users.validations";

function RoleBadge({ role }: { role: "USER" | "ADMIN" }) {
  const isAdmin = role === "ADMIN";
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isAdmin
          ? "var(--z-gold-muted)"
          : "var(--z-bg-elevated)",
        color: isAdmin ? "var(--z-gold)" : "var(--z-text-muted)",
        border: `1px solid ${isAdmin ? "var(--z-border-gold)" : "var(--z-border)"}`,
      }}
    >
      {isAdmin ? (
        <Shield className="w-3 h-3" />
      ) : (
        <ShieldOff className="w-3 h-3" />
      )}
      {role}
    </span>
  );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: isActive
          ? "rgba(74,197,130,0.1)"
          : "var(--z-bg-elevated)",
        color: isActive ? "#4ac582" : "var(--z-text-disabled)",
        border: `1px solid ${isActive ? "rgba(74,197,130,0.3)" : "var(--z-border)"}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          backgroundColor: isActive ? "#4ac582" : "var(--z-text-disabled)",
        }}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function UserInitials({ name, email }: { name: string | null; email: string }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email[0].toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
      style={{
        backgroundColor: "var(--z-gold-muted)",
        color: "var(--z-gold)",
        border: "1px solid var(--z-border-gold)",
      }}
    >
      {initials}
    </div>
  );
}

type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "edit"; user: AdminUserRow }
  | { type: "delete"; user: AdminUserRow };

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { notify } = useToast();

  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersService.listUsers();
      setUsers(data);
    } catch {
      notify("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    const run = async () => {
      await load();
    };
    void run();
  }, [load]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreate = async (data: CreateAdminUserFormData) => {
    const newUser = await usersService.createUser(data);
    setUsers((prev) => [newUser, ...prev]);
    notify(`${newUser.name ?? newUser.email} created`, "success");
  };

  const handleEdit = async (data: EditAdminUserFormData) => {
    if (modal.type !== "edit") return;
    const target = modal.user;
    await usersService.updateUser(target.id, data);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === target.id
          ? { ...u, name: data.name || u.name, email: data.email }
          : u,
      ),
    );
    notify("User updated", "success");
  };

  const handleDelete = async (userId: string) => {
    await usersService.adminDeleteUser(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    notify("User deleted", "success");
  };

  const handleRoleToggle = async (target: AdminUserRow) => {
    const newRole = target.role === "ADMIN" ? "USER" : "ADMIN";
    setActionLoading(target.id);
    try {
      await usersService.updateRole(target.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === target.id ? { ...u, role: newRole } : u)),
      );
      notify(`${target.name ?? target.email} is now ${newRole}`, "success");
    } catch {
      notify("Failed to update role", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (target: AdminUserRow) => {
    setActionLoading(target.id);
    try {
      const { isActive } = await usersService.toggleActive(target.id);
      setUsers((prev) =>
        prev.map((u) => (u.id === target.id ? { ...u, isActive } : u)),
      );
      notify(
        `${target.name ?? target.email} ${isActive ? "activated" : "deactivated"}`,
        "success",
      );
    } catch {
      notify("Failed to update status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--z-text-primary)" }}
            >
              Users
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--z-text-muted)" }}
            >
              {users.length} total · {adminCount} admin
              {adminCount !== 1 ? "s" : ""} · {userCount} user
              {userCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setModal({ type: "create" })}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all"
            style={{
              backgroundColor: "var(--z-gold)",
              color: "#0d0d0d",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--z-gold-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--z-gold)")
            }
          >
            <UserPlus className="w-4 h-4" />
            New user
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--z-text-disabled)" }}
            />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg outline-none transition-all"
              style={{
                backgroundColor: "var(--z-bg-surface)",
                border: "1px solid var(--z-border)",
                color: "var(--z-text-primary)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--z-gold)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--z-border)")
              }
            />
          </div>
          <div className="flex gap-2">
            {(["ALL", "ADMIN", "USER"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setRoleFilter(f)}
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all"
                style={{
                  backgroundColor:
                    roleFilter === f
                      ? "var(--z-gold-muted)"
                      : "var(--z-bg-surface)",
                  color:
                    roleFilter === f ? "var(--z-gold)" : "var(--z-text-muted)",
                  border: `1px solid ${roleFilter === f ? "var(--z-border-gold)" : "var(--z-border)"}`,
                }}
              >
                {f === "ALL" ? "All" : f === "ADMIN" ? "Admins" : "Users"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--z-border)" }}
        >
          {loading ? (
            <div
              className="flex items-center justify-center py-20"
              style={{ backgroundColor: "var(--z-bg-surface)" }}
            >
              <div
                className="w-7 h-7 rounded-full border-2 animate-spin"
                style={{
                  borderColor: "var(--z-gold)",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 gap-3"
              style={{ backgroundColor: "var(--z-bg-surface)" }}
            >
              <Users
                className="w-10 h-10"
                style={{ color: "var(--z-text-disabled)" }}
              />
              <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
                {search || roleFilter !== "ALL"
                  ? "No users match your filters"
                  : "No users yet"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--z-bg-elevated)",
                    borderBottom: "1px solid var(--z-border)",
                  }}
                >
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    User
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    Role
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    Status
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    Stats
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    Joined
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody style={{ backgroundColor: "var(--z-bg-surface)" }}>
                {filtered.map((u, i) => {
                  const isSelf = u.id === currentUser?.id;
                  const isActing = actionLoading === u.id;
                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderTop:
                          i > 0
                            ? "1px solid var(--z-border-subtle)"
                            : undefined,
                        opacity: isActing ? 0.6 : 1,
                      }}
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <UserInitials name={u.name} email={u.email} />
                          <div className="min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "var(--z-text-primary)" }}
                            >
                              {u.name ?? "—"}
                              {isSelf && (
                                <span
                                  className="ml-2 text-xs"
                                  style={{ color: "var(--z-text-muted)" }}
                                >
                                  (you)
                                </span>
                              )}
                            </p>
                            <p
                              className="text-xs truncate"
                              style={{ color: "var(--z-text-muted)" }}
                            >
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <StatusBadge isActive={u.isActive} />
                      </td>

                      {/* Stats */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-4">
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "var(--z-text-muted)" }}
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            {u.stats.totalBooks}
                          </span>
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: "var(--z-text-muted)" }}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {u.stats.totalConversations}
                          </span>
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span
                          className="text-xs"
                          style={{ color: "var(--z-text-muted)" }}
                        >
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {!isSelf && (
                            <>
                              {/* Edit */}
                              <div className="relative group/tip">
                                <button
                                  onClick={() =>
                                    setModal({ type: "edit", user: u })
                                  }
                                  disabled={isActing}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed"
                                  style={{ color: "var(--z-text-muted)" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "var(--z-gold-muted)";
                                    e.currentTarget.style.color =
                                      "var(--z-gold)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                    e.currentTarget.style.color =
                                      "var(--z-text-muted)";
                                  }}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <span
                                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                                  style={{
                                    backgroundColor: "var(--z-bg-elevated)",
                                    color: "var(--z-text-secondary)",
                                    border: "1px solid var(--z-border)",
                                  }}
                                >
                                  Edit user
                                </span>
                              </div>

                              {/* Toggle role */}
                              <div className="relative group/tip">
                                <button
                                  onClick={() => handleRoleToggle(u)}
                                  disabled={isActing}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed"
                                  style={{ color: "var(--z-text-muted)" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "var(--z-gold-muted)";
                                    e.currentTarget.style.color =
                                      "var(--z-gold)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                    e.currentTarget.style.color =
                                      "var(--z-text-muted)";
                                  }}
                                >
                                  {u.role === "ADMIN" ? (
                                    <ShieldOff className="w-3.5 h-3.5" />
                                  ) : (
                                    <Shield className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <span
                                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                                  style={{
                                    backgroundColor: "var(--z-bg-elevated)",
                                    color: "var(--z-text-secondary)",
                                    border: "1px solid var(--z-border)",
                                  }}
                                >
                                  {u.role === "ADMIN"
                                    ? "Demote to User"
                                    : "Promote to Admin"}
                                </span>
                              </div>

                              {/* Toggle active */}
                              <div className="relative group/tip">
                                <button
                                  onClick={() => handleToggleActive(u)}
                                  disabled={isActing}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed"
                                  style={{ color: "var(--z-text-muted)" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      u.isActive
                                        ? "rgba(224,92,92,0.08)"
                                        : "rgba(74,197,130,0.08)";
                                    e.currentTarget.style.color = u.isActive
                                      ? "var(--z-error)"
                                      : "#4ac582";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                    e.currentTarget.style.color =
                                      "var(--z-text-muted)";
                                  }}
                                >
                                  {u.isActive ? (
                                    <ToggleRight className="w-3.5 h-3.5" />
                                  ) : (
                                    <ToggleLeft className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <span
                                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                                  style={{
                                    backgroundColor: "var(--z-bg-elevated)",
                                    color: "var(--z-text-secondary)",
                                    border: "1px solid var(--z-border)",
                                  }}
                                >
                                  {u.isActive ? "Deactivate" : "Activate"}
                                </span>
                              </div>

                              {/* Delete */}
                              <div className="relative group/tip">
                                <button
                                  onClick={() =>
                                    setModal({ type: "delete", user: u })
                                  }
                                  disabled={isActing}
                                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed"
                                  style={{ color: "var(--z-text-muted)" }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "rgba(224,92,92,0.08)";
                                    e.currentTarget.style.color =
                                      "var(--z-error)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "transparent";
                                    e.currentTarget.style.color =
                                      "var(--z-text-muted)";
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <span
                                  className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150"
                                  style={{
                                    backgroundColor: "var(--z-bg-elevated)",
                                    color: "var(--z-text-secondary)",
                                    border: "1px solid var(--z-border)",
                                  }}
                                >
                                  Delete user
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <AdminUserModal
        isOpen={modal.type === "create"}
        mode="create"
        onClose={() => setModal({ type: "none" })}
        onSave={handleCreate}
      />

      <AdminUserModal
        isOpen={modal.type === "edit"}
        mode="edit"
        user={modal.type === "edit" ? modal.user : ({} as AdminUserRow)}
        onClose={() => setModal({ type: "none" })}
        onSave={handleEdit}
      />

      <DeleteUserModal
        isOpen={modal.type === "delete"}
        user={modal.type === "delete" ? modal.user : null}
        onClose={() => setModal({ type: "none" })}
        onConfirm={handleDelete}
      />
    </>
  );
}
