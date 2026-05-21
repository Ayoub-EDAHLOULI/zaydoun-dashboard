"use client";

import { useState, useEffect } from "react";
import { BookOpen, MessageSquare, Pencil, Calendar } from "lucide-react";
import { usersService } from "@/lib/api/services/users.service";
import { UserProfile } from "@/types/users.types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import UserModal from "@/components/Dashboard/Users/UserModal";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div
      className="rounded-xl p-5 flex items-center gap-4"
      style={{
        backgroundColor: "var(--z-bg-elevated)",
        border: "1px solid var(--z-border)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{
          backgroundColor: "var(--z-gold-muted)",
          border: "1px solid var(--z-border-gold)",
        }}
      >
        <Icon className="w-5 h-5" style={{ color: "var(--z-gold)" }} />
      </div>
      <div>
        <p
          className="text-2xl font-bold"
          style={{ color: "var(--z-text-primary)" }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--z-text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const { notify } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    usersService
      .getMe()
      .then(setProfile)
      .catch((err: Error) => notify(err.message, "error"))
      .finally(() => setIsLoading(false));
  }, [notify]);

  const handleSave = async ({ name }: { name: string }) => {
    try {
      const updated = await usersService.updateMe({ name });
      setProfile(updated);
      updateUser({
        id: updated.id,
        name: updated.name ?? "",
        email: updated.email,
      });
      notify("Profile updated", "success");
    } catch (err: unknown) {
      notify(err instanceof Error ? err.message : "Update failed", "error");
      throw err;
    }
  };

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div
          className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{
            borderColor: "var(--z-gold)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <UserModal
        isOpen={isModalOpen}
        currentName={profile.name ?? ""}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />

      <div className="max-w-2xl space-y-6">
        {/* Profile card */}
        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--z-bg-surface)",
            border: "1px solid var(--z-border)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{
                  backgroundColor: "var(--z-gold-muted)",
                  color: "var(--z-gold)",
                  border: "2px solid var(--z-border-gold)",
                }}
              >
                {initials}
              </div>
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "var(--z-text-primary)" }}
                >
                  {profile.name}
                </h2>
                <p className="text-sm" style={{ color: "var(--z-text-muted)" }}>
                  {profile.email}
                </p>
                {joinedDate && (
                  <div
                    className="flex items-center gap-1.5 mt-1.5"
                    style={{ color: "var(--z-text-muted)" }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs">Joined {joinedDate}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: "var(--z-gold-muted)",
                color: "var(--z-gold)",
                border: "1px solid var(--z-border-gold)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(201,168,76,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--z-gold-muted)";
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={BookOpen}
            label="Books in library"
            value={profile.stats.totalBooks}
          />
          <StatCard
            icon={MessageSquare}
            label="Conversations"
            value={profile.stats.totalConversations}
          />
        </div>
      </div>
    </>
  );
}
