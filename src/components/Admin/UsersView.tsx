"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Power, Search, ShieldCheck, ShieldOff, Trash2, UserPlus } from "lucide-react";
import {
  ActionMenu,
  Avatar,
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Input,
  SegmentedControl,
  Skeleton,
  Switch,
  type DataTableColumn,
} from "@/components/ui";
import { UserFormDialog } from "./UserFormDialog";
import { usersService } from "@/lib/api/services/users.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type {
  CreateAdminUserFormData,
  EditAdminUserFormData,
} from "@/validations/users.validations";
import type { AdminUserRow } from "@/types/users.types";

const PAGE_SIZE = 10;

type RoleFilter = "all" | "ADMIN" | "USER";
type StatusFilter = "any" | "active" | "inactive";

// A pending confirmation — role changes and deletes ask first
type Pending =
  | { kind: "role"; user: AdminUserRow }
  | { kind: "delete"; user: AdminUserRow };

const displayName = (u: AdminUserRow) => u.name?.trim() || u.email;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export default function UsersView() {
  const { user: me } = useAuth();
  const { notify } = useToast();

  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("any");
  const [page, setPage] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    usersService
      .listUsers()
      .then(setUsers)
      .catch((err: unknown) =>
        notify(err instanceof Error ? err.message : "Couldn't load users", "error"),
      );
  }, [notify]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (users ?? []).filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter === "active" && !u.isActive) return false;
      if (statusFilter === "inactive" && u.isActive) return false;
      return !q || u.email.toLowerCase().includes(q) || !!u.name?.toLowerCase().includes(q);
    });
  }, [users, query, roleFilter, statusFilter]);

  // Filters change the result set — clamp instead of resetting in an effect
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const admins = users?.filter((u) => u.role === "ADMIN").length ?? 0;
  const inactive = users?.filter((u) => !u.isActive).length ?? 0;

  const patchUser = (id: string, patch: Partial<AdminUserRow>) =>
    setUsers((prev) => prev?.map((u) => (u.id === id ? { ...u, ...patch } : u)) ?? prev);

  // ── Actions ─────────────────────────────────────────────────────────────
  const createUser = async (data: CreateAdminUserFormData) => {
    try {
      const created = await usersService.createUser(data);
      setUsers((prev) => (prev ? [created, ...prev] : [created]));
      notify(`Invite sent to ${created.email}`, "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't add the user", "error");
      throw err;
    }
  };

  const editUser = async (data: EditAdminUserFormData) => {
    if (!editing) return;
    try {
      await usersService.updateUser(editing.id, data);
      patchUser(editing.id, { name: data.name || null, email: data.email });
      notify("Details updated", "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't update the user", "error");
      throw err;
    }
  };

  const toggleActive = async (u: AdminUserRow) => {
    setBusyId(u.id);
    try {
      const { isActive } = await usersService.toggleActive(u.id);
      patchUser(u.id, { isActive });
      notify(
        isActive ? `${displayName(u)} can log in again` : `${displayName(u)} was deactivated`,
        "success",
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : "Couldn't change the status", "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirmPending = async () => {
    if (!pending) return;
    const u = pending.user;
    try {
      if (pending.kind === "role") {
        const role = u.role === "ADMIN" ? "USER" : "ADMIN";
        await usersService.updateRole(u.id, role);
        patchUser(u.id, { role });
        notify(
          role === "ADMIN" ? `${displayName(u)} is now an admin` : `${displayName(u)} is now a reader`,
          "success",
        );
      } else {
        await usersService.adminDeleteUser(u.id);
        setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? prev);
        notify(`${displayName(u)} was deleted`, "success");
      }
      setConfirmOpen(false);
    } catch (err) {
      notify(err instanceof Error ? err.message : "Something went wrong", "error");
    }
  };

  const ask = (p: Pending) => {
    setPending(p);
    setConfirmOpen(true);
  };

  // ── Table ───────────────────────────────────────────────────────────────
  const columns: DataTableColumn<AdminUserRow>[] = [
    {
      key: "user",
      header: "User",
      cell: (u) => {
        const self = u.id === me?.id;
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={u.name} email={u.email} highlight={self} />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-medium">
                {displayName(u)}
                {self && <span className="font-normal text-text-secondary"> (you)</span>}
              </span>
              {u.name && <span className="truncate text-13 text-text-secondary">{u.email}</span>}
            </span>
          </div>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      cell: (u) =>
        u.role === "ADMIN" ? (
          <Badge tone="gold">ADMIN</Badge>
        ) : (
          <span className="text-text-secondary">Reader</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) =>
        u.id === me?.id ? (
          // You can't deactivate yourself
          <span className="inline-flex items-center gap-2 text-13 text-text-secondary">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            Active
          </span>
        ) : (
          <Switch
            checked={u.isActive}
            label={u.isActive ? "Active" : "Inactive"}
            ariaLabel={`${displayName(u)} is ${u.isActive ? "active" : "inactive"}`}
            disabled={busyId === u.id}
            onChange={() => toggleActive(u)}
          />
        ),
    },
    {
      key: "books",
      header: "Books",
      className: "text-right tabular-nums",
      cell: (u) => u.stats.totalBooks,
    },
    {
      key: "conversations",
      header: "Conversations",
      className: "text-right tabular-nums",
      cell: (u) => u.stats.totalConversations,
    },
    {
      key: "joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-text-secondary">
          {new Date(u.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      cell: (u) =>
        u.id === me?.id ? (
          <span className="flex size-10 items-center justify-center text-text-muted" aria-label="No actions on your own account">
            —
          </span>
        ) : (
          <ActionMenu
            appearance="plain"
            ariaLabel={`Actions for ${displayName(u)}`}
            items={[
              {
                label: "Edit details",
                icon: Pencil,
                onSelect: () => {
                  setEditing(u);
                  setFormOpen(true);
                },
              },
              {
                label: u.role === "ADMIN" ? "Make reader" : "Make admin",
                icon: u.role === "ADMIN" ? ShieldOff : ShieldCheck,
                onSelect: () => ask({ kind: "role", user: u }),
              },
              {
                label: u.isActive ? "Deactivate" : "Activate",
                icon: Power,
                disabled: busyId === u.id,
                onSelect: () => toggleActive(u),
              },
              {
                label: "Delete user…",
                icon: Trash2,
                destructive: true,
                onSelect: () => ask({ kind: "delete", user: u }),
              },
            ]}
          />
        ),
    },
  ];

  // ── Confirm text ────────────────────────────────────────────────────────
  const confirmProps = (() => {
    if (!pending) return { title: "", confirmLabel: "" };
    const u = pending.user;
    if (pending.kind === "delete") {
      return {
        title: `Delete ${displayName(u)}?`,
        description: `Their account, ${plural(u.stats.totalBooks, "book")} and ${plural(
          u.stats.totalConversations,
          "conversation",
        )} will be removed for good.`,
        confirmLabel: "Delete user",
        tone: "destructive" as const,
      };
    }
    return u.role === "ADMIN"
      ? {
          title: `Make ${displayName(u)} a reader?`,
          description: "They'll lose access to users, usage and costs, and become subject to the free limits.",
          confirmLabel: "Make reader",
          tone: "default" as const,
          icon: ShieldOff,
        }
      : {
          title: `Make ${displayName(u)} an admin?`,
          description: "They'll be able to see every user, the usage and costs, and manage accounts.",
          confirmLabel: "Make admin",
          tone: "default" as const,
          icon: ShieldCheck,
        };
  })();

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
            Users
          </h1>
          {users && (
            <p className="text-sm text-text-secondary">
              {users.length} {users.length === 1 ? "person" : "people"} ·{" "}
              {plural(admins, "admin")} · {inactive} inactive
            </p>
          )}
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <UserPlus size={18} aria-hidden />
          Add user
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          label="Search users"
          hideLabel
          icon={Search}
          type="search"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          wrapperClassName="flex-[1_1_280px] max-w-[420px]"
          surface
        />
        <SegmentedControl
          ariaLabel="Role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: "all", label: "Everyone" },
            { value: "ADMIN", label: "Admins" },
            { value: "USER", label: "Readers" },
          ]}
        />
        <SegmentedControl
          ariaLabel="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "any", label: "Any status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      {users === null ? (
        <Skeleton className="h-[320px] rounded-md" />
      ) : (
        <div className="flex flex-col gap-3">
          <DataTable
            ariaLabel="Users"
            columns={columns}
            rows={pageRows}
            rowKey={(u) => u.id}
            template="2.4fr 0.9fr 1.1fr 0.6fr 0.9fr 1fr 48px"
            minWidth={860}
            empty={
              <EmptyState
                bordered={false}
                title="No one matches"
                description="Try another name, or clear the filters."
              />
            }
          />
          {filtered.length > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-13 text-text-secondary">
              <span className="tabular-nums">
                Showing {currentPage * PAGE_SIZE + 1}–
                {Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <UserFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode={
          editing
            ? { kind: "edit", user: editing, onSubmit: editUser }
            : { kind: "create", onSubmit: createUser }
        }
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmPending}
        cancelLabel="Cancel"
        {...confirmProps}
      />
    </div>
  );
}
