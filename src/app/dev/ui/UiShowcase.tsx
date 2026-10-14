"use client";

import { useState, type ReactNode } from "react";
import {
  BookOpen,
  Coins,
  Home,
  MessageSquare,
  MessagesSquare,
  Search,
  Trash2,
  Upload,
  User,
  Users,
  Cpu,
  AudioLines,
  Play,
  Pencil,
} from "lucide-react";
import {
  ActionMenu,
  Avatar,
  Badge,
  BookCard,
  BookCardSkeleton,
  Button,
  ChatMessage,
  Composer,
  ConfirmDialog,
  DataTable,
  EmptyState,
  FileDropZone,
  Input,
  LimitBanner,
  Modal,
  NavItem,
  Orb,
  PageTag,
  SegmentedControl,
  Select,
  Skeleton,
  StatCard,
  StatusBadge,
  Switch,
  Textarea,
  ThinkingIndicator,
  type DataTableColumn,
} from "@/components/ui";
import { useToast } from "@/contexts/ToastContext";
import { LANGUAGES } from "@/lib/languages";
import type { BookSummary } from "@/types/books.types";

// Sample data — for this preview page only
const now = new Date().toISOString();
const BOOKS: BookSummary[] = [
  { id: "1", title: "المقدمة", author: "ابن خلدون", language: "ar", totalPages: 512, status: "READY", createdAt: now, updatedAt: now },
  { id: "2", title: "Meditations", author: "Marcus Aurelius", language: "en", totalPages: 254, status: "PROCESSING", createdAt: now, updatedAt: now },
  { id: "3", title: "A Little History of Philosophy", author: "Nigel Warburton", language: "en", totalPages: 0, status: "PENDING", createdAt: now, updatedAt: now },
  { id: "4", title: "L'Étranger", author: "Albert Camus", language: "fr", totalPages: 0, status: "FAILED", createdAt: now, updatedAt: now },
];

interface SampleUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  active: boolean;
  books: number;
  chats: number;
  joined: string;
}

const USERS: SampleUser[] = [
  { id: "u1", name: "Amina Benali", email: "amina@reader.ma", role: "USER", active: true, books: 2, chats: 14, joined: "Oct 2, 2026" },
  { id: "u2", name: "Youssef K.", email: "youssef@lab.ma", role: "ADMIN", active: false, books: 0, chats: 0, joined: "Sep 18, 2026" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-[13px] font-medium tracking-[0.14em] text-gold uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <span className="text-xs text-text-secondary">{children}</span>;
}

export default function UiShowcase() {
  const { notify } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [period, setPeriod] = useState<"day" | "week" | "month" | "all">("week");
  const [filter, setFilter] = useState<"all" | "ready" | "progress">("all");
  const [draft, setDraft] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [users, setUsers] = useState(USERS);

  const columns: DataTableColumn<SampleUser>[] = [
    {
      key: "user",
      header: "User",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} highlight={u.role === "USER"} />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-medium">{u.name}</span>
            <span className="truncate text-[13px] text-text-secondary">{u.email}</span>
          </span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) =>
        u.role === "ADMIN" ? (
          <Badge tone="gold">ADMIN</Badge>
        ) : (
          <span className="text-[13px] text-text-secondary">User</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) => (
        <Switch
          checked={u.active}
          label={u.active ? "Active" : "Inactive"}
          ariaLabel={`${u.name} is active`}
          onChange={(v) =>
            setUsers((prev) => prev.map((p) => (p.id === u.id ? { ...p, active: v } : p)))
          }
        />
      ),
    },
    {
      key: "usage",
      header: "Books · Chats",
      cell: (u) => (
        <span className="text-text-secondary tabular-nums">
          {u.books} · {u.chats}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      cell: (u) => <span className="text-text-secondary">{u.joined}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      cell: (u) => (
        <ActionMenu
          appearance="plain"
          ariaLabel={`Actions for ${u.name}`}
          items={[
            { label: "Edit", icon: Pencil, onSelect: () => notify(`Edit ${u.name}`) },
            { label: "Delete user", icon: Trash2, destructive: true, onSelect: () => setConfirmOpen(true) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-18 px-4 py-12 md:px-10 md:py-20">
      <header className="flex flex-col gap-4 border-b border-border pb-10">
        <span className="text-[13px] font-medium tracking-[0.14em] text-gold uppercase">
          Dev preview · not a product page
        </span>
        <h1 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em] md:text-[56px]">
          Zaydoun components, <em className="text-gold-light italic">step 1.</em>
        </h1>
        <p className="max-w-[640px] text-[17px] leading-relaxed text-text-secondary">
          Every shared component from <code className="text-text-primary">src/components/ui</code>,
          built on the design tokens. Sample data only.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-text-secondary">
          <span className="font-sans">Inter: interface</span>
          <span className="font-serif text-base italic">Newsreader: display &amp; Zaydoun&apos;s voice</span>
          <span className="font-arabic text-[17px]" lang="ar">أميري — للعربية</span>
        </div>
      </header>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Start conversation</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete book</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button loading>Uploading…</Button>
          <Button size="sm">
            <MessageSquare size={16} aria-hidden /> Small · 40px
          </Button>
          <Button size="lg">Get started · 52px</Button>
        </div>
        <Caption>Tab through them to see the gold focus ring.</Caption>
      </Section>

      <Section title="Form controls">
        <div className="grid gap-6 md:grid-cols-4">
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" defaultValue="short" error="Use at least 8 characters." />
          <Input label="Email · disabled" defaultValue="amina@reader.ma" disabled />
          <Select label="Reply language" defaultValue="en">
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </Select>
          <Input label="Search your books" hideLabel icon={Search} type="search" placeholder="Search title or author" wrapperClassName="md:col-span-2" />
          <Input label="Full name" hint="Shown in the sidebar and emails." placeholder="Amina Benali" wrapperClassName="md:col-span-2" />
          <Textarea label="Message" placeholder="Tell us what's on your mind" rows={3} wrapperClassName="md:col-span-2" />
          <FileDropZone file={file} onFileSelect={setFile} className="md:col-span-2" />
        </div>
        <Caption>Drag a PDF onto the drop zone to see the gold drag-over state; non-PDFs and files over 50 MB are rejected.</Caption>
      </Section>

      <Section title="Badges & tags">
        <div className="flex flex-wrap gap-2.5">
          <StatusBadge status="PENDING" />
          <StatusBadge status="PROCESSING" />
          <StatusBadge status="READY" />
          <StatusBadge status="FAILED" />
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge>AR · Arabic</Badge>
          <Badge tone="gold">ADMIN</Badge>
          <PageTag page={118} />
          <PageTag page={168} arabic />
          <Switch checked label="Active" onChange={() => {}} />
          <Switch checked={false} label="Inactive" onChange={() => {}} />
          <Avatar name="Amina Benali" highlight />
          <Avatar email="youssef@lab.ma" />
        </div>
      </Section>

      <Section title="The orb">
        <div className="flex flex-wrap items-center gap-14 py-6">
          <div className="flex flex-col items-center gap-3"><Orb size={24} /><Caption>24 · avatar</Caption></div>
          <div className="flex flex-col items-center gap-3"><Orb size={24} breathing /><Caption>24 · thinking</Caption></div>
          <div className="flex flex-col items-center gap-3"><Orb size={56} rings={1} /><Caption>56 · ring</Caption></div>
          <div className="flex flex-col items-center gap-3">
            <Orb size={72} rings={1}><BookOpen size={28} strokeWidth={1.6} /></Orb>
            <Caption>72 · icon</Caption>
          </div>
          <div className="flex flex-col items-center gap-3"><Orb size={140} rings={2} halo breathing /><Caption>140 · rings, halo, breathing</Caption></div>
        </div>
      </Section>

      <div className="grid gap-12 lg:grid-cols-3">
        <Section title="Sidebar nav item">
          <div className="flex flex-col gap-1 rounded-md border border-border bg-bg-surface px-4 py-3">
            <NavItem link={{ href: "#home", label: "Home", icon: Home }} active={false} />
            <NavItem link={{ href: "#conversations", label: "Conversations", icon: MessageSquare }} active={false} />
            <NavItem link={{ href: "#library", label: "Library", icon: BookOpen }} active />
            <NavItem link={{ href: "#users", label: "Users", icon: Users }} active={false} />
          </div>
          <div className="flex w-[72px] flex-col items-center gap-1 rounded-md border border-border bg-bg-surface px-3 py-3">
            <NavItem link={{ href: "#home", label: "Home", icon: Home }} active={false} collapsed />
            <NavItem link={{ href: "#library", label: "Library", icon: BookOpen }} active collapsed />
            <NavItem link={{ href: "#profile", label: "Profile", icon: User }} active={false} collapsed />
          </div>
          <Caption>Collapsed rail (72px) for the chat screen.</Caption>
        </Section>

        <Section title="Segmented control">
          <SegmentedControl
            ariaLabel="Period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "day", label: "Today" },
              { value: "week", label: "7 days" },
              { value: "month", label: "30 days" },
              { value: "all", label: "All time" },
            ]}
          />
          <SegmentedControl
            ariaLabel="Filter by status"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "ready", label: "Ready" },
              { value: "progress", label: "In progress" },
            ]}
          />
          <Caption>Arrow keys move the selection.</Caption>
        </Section>

        <Section title="KPI / stat card">
          <StatCard label="Total cost" value="$4.82" icon={Coins} delta={12} comparison="vs previous 7 days" />
          <StatCard label="Books in library" value={2} icon={BookOpen} />
        </Section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Messages" value={284} icon={MessagesSquare} delta={-8} comparison="vs previous 7 days" />
        <StatCard label="Tokens used" value="412k" icon={Cpu} delta={0} comparison="vs previous 7 days" />
        <StatCard label="Audio processed" value="38 min" icon={AudioLines} delta={23} comparison="vs previous 7 days" />
        <StatCard label="Conversations" value={14} icon={MessageSquare} />
      </div>

      <Section title="Book cards">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          <BookCard
            book={BOOKS[0]}
            detail="3 conversations · last opened today"
            primaryAction={{ label: "Talk to this book", icon: MessageSquare, href: "#" }}
            menuItems={[{ label: "Delete book", icon: Trash2, destructive: true, onSelect: () => setConfirmOpen(true) }]}
          />
          <BookCard
            book={BOOKS[1]}
            detail="Zaydoun is reading it. We'll let you know."
            primaryAction={{ label: "Talk to this book", icon: MessageSquare, disabled: true }}
            menuItems={[{ label: "Delete book", icon: Trash2, destructive: true, onSelect: () => setConfirmOpen(true) }]}
          />
          <BookCard
            book={BOOKS[2]}
            detail="Uploaded, waiting to be read."
            primaryAction={{ label: "Let Zaydoun read it", icon: Play, onClick: () => notify("Processing started", "info") }}
            menuItems={[{ label: "Delete book", icon: Trash2, destructive: true, onSelect: () => setConfirmOpen(true) }]}
          />
          <BookCard
            book={BOOKS[3]}
            detail="Zaydoun couldn't read this PDF."
            primaryAction={{ label: "Try again", onClick: () => notify("Retrying", "info") }}
            menuItems={[{ label: "Delete book", icon: Trash2, destructive: true, onSelect: () => setConfirmOpen(true) }]}
          />
          <BookCardSkeleton />
        </div>
      </Section>

      <div className="grid gap-12 lg:grid-cols-2">
        <Section title="Limit banners">
          <LimitBanner variant="books" limit={2} />
          <LimitBanner variant="messages" limit={15} />
        </Section>
        <Section title="Empty state & skeleton">
          <EmptyState
            title="Your shelf is empty"
            description="Upload a PDF and Zaydoun will read it, page by page, before your first question."
            action={<Button><Upload size={18} aria-hidden /> Upload a book</Button>}
          />
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Section>
      </div>

      <Section title="Table">
        <DataTable
          ariaLabel="Users"
          columns={columns}
          rows={users}
          rowKey={(u) => u.id}
          template="2.2fr 1fr 1fr 1fr 1fr 64px"
        />
        <Caption>Scrolls horizontally on narrow screens. Try the switches and the ··· menu.</Caption>
      </Section>

      <div className="grid gap-12 lg:grid-cols-2">
        <Section title="Chat · messages">
          <div className="flex flex-col gap-7 rounded-lg border border-border bg-bg-base p-7">
            <ChatMessage role="user" content="Is ʿasabiyya just a fancy word for tribalism?" />
            <ChatMessage
              role="assistant"
              content="Not quite, and that's the trap most summaries fall into. Kinship is where it starts, but Ibn Khaldun says shared hardship and alliance can build it too."
              pages={[118, 121]}
            />
            <ThinkingIndicator />
          </div>
        </Section>
        <Section title="Chat · RTL & composer">
          <div className="flex flex-col gap-7 rounded-lg border border-border bg-bg-base p-7">
            <ChatMessage role="user" content="لماذا تسقط الدول بعد ثلاثة أجيال؟" languageCode="ar" />
            <ChatMessage
              role="assistant"
              languageCode="ar"
              content="لأن العصبية تضعف جيلاً بعد جيل، فيرث الأحفاد المُلك دون الخشونة التي صنعته."
              pages={[168]}
            />
            <Composer
              value={draft}
              onChange={setDraft}
              onSend={() => {
                notify(`Would send: ${draft}`, "info");
                setDraft("");
              }}
              hint="Answers come only from this book"
              quota="11 of 15 messages left today"
            />
          </div>
        </Section>
      </div>

      <Section title="Dialogs & toasts">
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
          <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Open confirm</Button>
          <Button variant="secondary" onClick={() => setDeleteAccountOpen(true)}>Delete account (type DELETE)</Button>
          <Button variant="ghost" onClick={() => notify("“Al-Muqaddimah” is ready to talk.", "success")}>Success toast</Button>
          <Button variant="ghost" onClick={() => notify("We couldn't read that PDF. Is it a scan without text?", "error")}>Error toast</Button>
          <Button variant="ghost" onClick={() => notify("Temporary password sent to amina@reader.ma.", "info")}>Info toast</Button>
        </div>
        <Caption>Below 768px the modal becomes a bottom sheet and toasts move to the top.</Caption>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit name"
        description="This is how Zaydoun will greet you."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setModalOpen(false)}>Save</Button>
          </>
        }
      >
        <Input label="Full name" defaultValue="Amina Benali" />
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 800));
          setConfirmOpen(false);
          notify("Book deleted", "success");
        }}
        title="Delete “Meditations”?"
        description="This removes the book and its 3 conversations. It frees one of your two free slots. This can't be undone."
        confirmLabel="Delete book"
        cancelLabel="Keep it"
      />

      <ConfirmDialog
        open={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onConfirm={() => setDeleteAccountOpen(false)}
        title="Delete your account?"
        description="Your books, conversations and settings will be removed for good."
        confirmLabel="Delete account"
        requireText="DELETE"
      />
    </div>
  );
}
