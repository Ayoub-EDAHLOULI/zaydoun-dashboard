"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
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
import { useFormatDate } from "@/lib/time";

const PAGE_SIZE = 10;

type RoleFilter = "all" | "ADMIN" | "USER";
type StatusFilter = "any" | "active" | "inactive";

// A pending confirmation — role changes and deletes ask first
type Pending =
  | { kind: "role"; user: AdminUserRow }
  | { kind: "delete"; user: AdminUserRow };

const displayName = (u: AdminUserRow) => u.name?.trim() || u.email;

export default function UsersView() {
  const t = useTranslations("admin.users");
  const tc = useTranslations("common");
  const formatDate = useFormatDate();
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
        notify(err instanceof Error ? err.message : t("toast.loadFailed"), "error"),
      );
  }, [notify, t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return (users ?? []).filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter === "active" && !u.isActive) return false;
      if (statusFilter === "inactive" && u.isActive) return false;
      return (
        !q ||
        u.email.toLocaleLowerCase().includes(q) ||
        !!u.name?.toLocaleLowerCase().includes(q)
      );
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
      notify(t("toast.invited", { email: created.email }), "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : t("toast.addFailed"), "error");
      throw err;
    }
  };

  const editUser = async (data: EditAdminUserFormData) => {
    if (!editing) return;
    try {
      await usersService.updateUser(editing.id, data);
      patchUser(editing.id, { name: data.name || null, email: data.email });
      notify(t("toast.updated"), "success");
    } catch (err) {
      notify(err instanceof Error ? err.message : t("toast.updateFailed"), "error");
      throw err;
    }
  };

  const toggleActive = async (u: AdminUserRow) => {
    setBusyId(u.id);
    try {
      const { isActive } = await usersService.toggleActive(u.id);
      patchUser(u.id, { isActive });
      notify(
        isActive
          ? t("toast.activated", { name: displayName(u) })
          : t("toast.deactivated", { name: displayName(u) }),
        "success",
      );
    } catch (err) {
      notify(err instanceof Error ? err.message : t("toast.statusFailed"), "error");
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
          role === "ADMIN"
            ? t("toast.nowAdmin", { name: displayName(u) })
            : t("toast.nowReader", { name: displayName(u) }),
          "success",
        );
      } else {
        await usersService.adminDeleteUser(u.id);
        setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? prev);
        notify(t("toast.deleted", { name: displayName(u) }), "success");
      }
      setConfirmOpen(false);
    } catch (err) {
      notify(err instanceof Error ? err.message : t("toast.failed"), "error");
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
      header: t("col.user"),
      cell: (u) => {
        const self = u.id === me?.id;
        return (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={u.name} email={u.email} highlight={self} />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-medium">
                {displayName(u)}
                {self && (
                  <span className="font-normal text-text-secondary"> {t("you")}</span>
                )}
              </span>
              {u.name && (
                <span dir="ltr" className="truncate text-start text-13 text-text-secondary">
                  {u.email}
                </span>
              )}
            </span>
          </div>
        );
      },
    },
    {
      key: "role",
      header: t("col.role"),
      cell: (u) =>
        u.role === "ADMIN" ? (
          <Badge tone="gold">{t("adminBadge")}</Badge>
        ) : (
          <span className="text-text-secondary">{t("reader")}</span>
        ),
    },
    {
      key: "status",
      header: t("col.status"),
      cell: (u) =>
        u.id === me?.id ? (
          // You can't deactivate yourself
          <span className="inline-flex items-center gap-2 text-13 text-text-secondary">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            {t("active")}
          </span>
        ) : (
          <Switch
            checked={u.isActive}
            label={u.isActive ? t("active") : t("inactive")}
            ariaLabel={
              u.isActive
                ? t("isActive", { name: displayName(u) })
                : t("isInactive", { name: displayName(u) })
            }
            disabled={busyId === u.id}
            onChange={() => toggleActive(u)}
          />
        ),
    },
    {
      key: "books",
      header: t("col.books"),
      className: "text-end tabular-nums",
      cell: (u) => u.stats.totalBooks,
    },
    {
      key: "conversations",
      header: t("col.conversations"),
      className: "text-end tabular-nums",
      cell: (u) => u.stats.totalConversations,
    },
    {
      key: "joined",
      header: t("col.joined"),
      cell: (u) => (
        <span className="text-text-secondary">
          {formatDate(u.createdAt, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("col.actions"),
      srOnlyHeader: true,
      cell: (u) =>
        u.id === me?.id ? (
          <span className="flex size-10 items-center justify-center text-text-muted" aria-label={t("noSelfActions")}>
            —
          </span>
        ) : (
          <ActionMenu
            appearance="plain"
            ariaLabel={t("actionsFor", { name: displayName(u) })}
            items={[
              {
                label: t("menu.edit"),
                icon: Pencil,
                onSelect: () => {
                  setEditing(u);
                  setFormOpen(true);
                },
              },
              {
                label: u.role === "ADMIN" ? t("menu.makeReader") : t("menu.makeAdmin"),
                icon: u.role === "ADMIN" ? ShieldOff : ShieldCheck,
                onSelect: () => ask({ kind: "role", user: u }),
              },
              {
                label: u.isActive ? t("menu.deactivate") : t("menu.activate"),
                icon: Power,
                disabled: busyId === u.id,
                onSelect: () => toggleActive(u),
              },
              {
                label: t("menu.delete"),
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
        title: t("confirm.deleteTitle", { name: displayName(u) }),
        description: t("confirm.deleteBody", {
          books: u.stats.totalBooks,
          conversations: u.stats.totalConversations,
        }),
        confirmLabel: t("confirm.delete"),
        tone: "destructive" as const,
      };
    }
    return u.role === "ADMIN"
      ? {
          title: t("confirm.readerTitle", { name: displayName(u) }),
          description: t("confirm.readerBody"),
          confirmLabel: t("menu.makeReader"),
          tone: "default" as const,
          icon: ShieldOff,
        }
      : {
          title: t("confirm.adminTitle", { name: displayName(u) }),
          description: t("confirm.adminBody"),
          confirmLabel: t("menu.makeAdmin"),
          tone: "default" as const,
          icon: ShieldCheck,
        };
  })();

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-32 leading-[1.1] font-normal tracking-[-0.02em] md:text-40">
            {t("title")}
          </h1>
          {users && (
            <p className="text-sm text-text-secondary">
              {t("summary", { people: users.length, admins, inactive })}
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
          {t("add")}
        </Button>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          label={t("search.label")}
          hideLabel
          icon={Search}
          type="search"
          placeholder={t("search.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          wrapperClassName="flex-[1_1_280px] max-w-[420px]"
          surface
        />
        <SegmentedControl
          ariaLabel={t("col.role")}
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: "all", label: t("filter.everyone") },
            { value: "ADMIN", label: t("filter.admins") },
            { value: "USER", label: t("filter.readers") },
          ]}
        />
        <SegmentedControl
          ariaLabel={t("col.status")}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "any", label: t("filter.anyStatus") },
            { value: "active", label: t("active") },
            { value: "inactive", label: t("inactive") },
          ]}
        />
      </div>

      {users === null ? (
        <Skeleton className="h-[320px] rounded-md" />
      ) : (
        <div className="flex flex-col gap-3">
          <DataTable
            ariaLabel={t("title")}
            columns={columns}
            rows={pageRows}
            rowKey={(u) => u.id}
            template="2.4fr 0.9fr 1.1fr 0.6fr 0.9fr 1fr 48px"
            minWidth={860}
            empty={
              <EmptyState
                bordered={false}
                title={t("empty.title")}
                description={t("empty.body")}
              />
            }
          />
          {filtered.length > PAGE_SIZE && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-13 text-text-secondary">
              <span className="tabular-nums">
                {t("showing", {
                  from: currentPage * PAGE_SIZE + 1,
                  to: Math.min((currentPage + 1) * PAGE_SIZE, filtered.length),
                  total: filtered.length,
                })}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                >
                  {t("previous")}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage >= pageCount - 1}
                  onClick={() => setPage(currentPage + 1)}
                >
                  {t("next")}
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
        cancelLabel={tc("cancel")}
        {...confirmProps}
      />
    </div>
  );
}
