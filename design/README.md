# Zaydoun web redesign: implementation guide

This folder is the **visual reference** for the redesign of `zaydoun-dashboard`. Read this file first, then open the screens in a browser.

- `screens/*.html` are static mockups. Each one opens directly in a browser.
- `tokens.css` holds the design tokens as a Tailwind v4 `@theme` block.
- `assets/logo.png` is a 256 px web logo. `assets/logo-1024.png` is the source.

## Rules for implementing

1. **Do not copy the HTML.** The screens use inline styles so they render on their own. Rebuild them with the project's stack: Next.js (App Router), React, Tailwind CSS v4, Lucide icons and Framer Motion. Reuse existing components, hooks and API calls. Restyle, don't rewrite logic.
2. **Use the tokens, never raw hex.** Import `tokens.css` into `globals.css`. That gives you utilities such as `bg-bg-surface`, `text-gold`, `border-border` and `rounded-md`.
3. **Keep all current functionality.** Every form, action and state in the current app must still exist. The mockups only change how things look and the copy.
4. **Work one area at a time** and check each in the browser before moving on. Order:
   1. tokens and fonts
   2. shared components
   3. app shell
   4. Library
   5. Conversation
   6. Admin overview
   7. the rest
5. **Sample data in the mockups is fake.** That covers names, numbers, page numbers and costs. Always render real API data.

## Fonts (next/font)

| Role | Font | Variable | Used for |
|---|---|---|---|
| UI | Inter 400/500/600/700 | `--font-inter` | All interface text, buttons, inputs, tables |
| Display | Newsreader 400/500 + italic | `--font-newsreader` | Page titles (H1/H2), marketing headlines, **Zaydoun's answers in chat**, numerals "01/02/03" |
| Arabic | Amiri 400/700 | `--font-amiri` | Any Arabic text (messages, book titles, chips) |

**Gold italic accent.** Headlines often end with a gold italic phrase, for example: Talk to your *books.* Use `<em class="italic text-gold-light">`.

**Arabic text.** Set `dir="rtl" lang="ar"` on the element that holds Arabic content, not on the whole page. The app chrome stays left-to-right. For user-generated text of unknown language, use `dir="auto"`. The user's own messages stay right-aligned even when they're in Arabic.

## Color usage

- **Gold is reserved for:**
  - primary buttons
  - the active nav item
  - page citation chips
  - the orb
  - focus rings
  - the gold italic in headlines

  Nothing else gets gold.
- **Small text needs `text-text-secondary`.** `text-muted` only reaches about 3.4:1 contrast, so use it only for disabled or decorative text.
- **Status badges always pair a word with a color:**
  - Pending = info
  - Processing = warning, plus a spinner icon
  - Ready = success
  - Failed = error
- **KPI deltas are neutral.** Show an arrow and a percentage in `text-primary`, with no green or red. Cost going up isn't good or bad on its own.

## Components to build (see `00-design-system.html`)

| Component | Notes |
|---|---|
| `Button` | Variants `primary`, `secondary`, `ghost`, `destructive`. Height 44 (52 on marketing CTAs), radius 8. States: hover, pressed, focus ring, disabled. |
| `Input`, `Select`, `Textarea` | Height 44–48, bg-elevated. Focus: gold border plus a 3px gold-muted ring. Error: red border and helper text. Every field has a real `<label>`. |
| `FileDropZone` | Dashed border. Has an idle state and a drag-over state (gold, with the file name). |
| `StatusBadge` | Pending / Processing / Ready / Failed. |
| `PageTag` | Pill with a bookmark icon: "Page 118". In Arabic conversations: "صفحة 118". |
| `Orb` | Gold radial gradient with optional rings and halo. Sizes 22 (avatar), 56, 140, 220. Breathes (`animate-orb-breathe`) only while Zaydoun is thinking or listening. Implement with Framer Motion or CSS. |
| `BookCover` | Generated cover: dark block, gold left spine, title in serif (Amiri if Arabic). Dims to 60% while processing. |
| `BookCard` | Cover, status badge, title, meta (author · language · pages), primary action and a `…` menu. |
| `StatCard` / `KpiCard` | Label, big tabular number, neutral delta. |
| `SidebarNav` + `NavItem` | States: default, hover, active. Active = gold-muted fill, gold text, a 3px gold bar on the left edge. Collapses to a drawer below 768px. |
| `SegmentedControl` | Period switcher and filters. The selected item lifts to bg-overlay; no gold. |
| `Modal` / `ConfirmDialog` | bg-overlay, radius 16. Destructive confirms use a red icon tile. Deleting the account requires typing DELETE. |
| `Toast` | Success, error and info. Bottom-right on desktop, top on mobile, 5 s, pauses on hover. |
| `DataTable` | Header row on border-subtle. Rows 64px. Row actions in a `…` menu. Wraps in a horizontal-scroll box on small screens. |
| `ChatMessage` | **User:** compact bubble (bg-elevated, radius 16/16/4/16, right-aligned). **Zaydoun:** no bubble. A small orb, a "Zaydoun" label in gold, the answer in Newsreader 19px, then page tags and a copy button. |
| `ThinkingIndicator` | Breathing orb plus italic serif "Finding the right passages…" |
| `Composer` | Textarea, disabled mic with a "SOON" tag, gold send button (disabled when empty). Hint row underneath: "Answers come only from this book" · "11 of 15 messages left today". |
| `LimitBanner` | Gold-bordered notice. Variants: shelf full (2 of 2 books) and daily messages used up (replaces the composer). |
| `EmptyState` | Small orb, serif title, one line of copy, optional action. |
| `Skeleton` | Shimmer, switched off under reduced motion. |

## Screen → route map

The routes below are what I expect. Match them to the routes that already exist in the codebase.

| Screen file | Route |
|---|---|
| `marketing-home.html` (+ `.mobile`) | `/` |
| `marketing-features.html` | `/features` |
| `marketing-contact.html` | `/contact` |
| `auth-login.html` | `/login`, including the "account deactivated" alert |
| `auth-register.html` | `/register` |
| `auth-password-recovery-states.html` | `/forgot-password` (form + sent) and `/reset-password` (form + success + expired). Each card is a separate state of a centred page. |
| `app-home.html` | `/app` |
| `app-library.html` (+ `.mobile`, which includes the upload sheet) | `/app/library` |
| `app-conversations.html` | `/app/conversations` |
| `app-new-conversation-modal.html` | The "New conversation" dialog, opened from Conversations, Home and the book cards |
| `app-conversation-chat.html` (+ `.mobile-arabic`) | `/app/conversations/[id]` |
| `app-profile.html` | `/app/profile` and `/dashboard/profile`. The dialogs on the right are its Edit name and Delete account modals. |
| `admin-overview.html` (+ `.mobile`) | `/dashboard` |
| `admin-users.html` | `/dashboard/users` |
| `admin-add-user-modal.html` | The "Add user" dialog on Users |
| Admin Library / Conversations | Reuse the reader screens inside the admin shell, with an extra "Owner" column. |

## Key decisions and changes from the current app

- **Pricing is removed.** Delete the `/pricing` route or redirect it to `/`. Also remove it from the nav and footer and drop every "Premium" mention. The free limits (2 books, 15 messages a day) still apply and still show in the app.
- **Marketing nav:** Features · How it works (`/#how`) · FAQ (`/#faq`) · Contact · Log in · Get started.
- **Home page sections, in order:**
  1. hero
  2. at-a-glance strip
  3. "Explain / Debate / Find / Connect", an interactive tab demo (client component)
  4. page citations
  5. five languages
  6. voice on mobile
  7. Meet Zaydoun
  8. who it's for
  9. how it works
  10. privacy
  11. FAQ (`<details>` accordion)
  12. final CTA
  13. footer
- **Tech jargon lives only on Features**, in an "Under the hood" table: pgvector, Whisper, JWT, bcrypt.
- **App header shows the real page title.** The current app says "Overview" on every page, which is a bug.
- **No notification bell.** Add it back only if a real notifications feature exists.
- **Chat layout:** the sidebar collapses to a 72px icon rail. A right-hand panel shows the book and a running list of the pages cited in the conversation (derived from the messages). The reply language can be changed from the header.
- **Book cards:**
  - The primary action is "Talk to this book" when Ready.
  - It's disabled while Processing.
  - Pending books get "Let Zaydoun read it", which triggers processing.
  - Delete lives in the `…` menu and asks for confirmation.
- **Overview:** the "Where the money goes" card needs cost broken down by source (answers, indexing, Whisper, TTS). If the API doesn't provide that, leave the card out.

## Copy to verify before shipping

These lines are in the mockups but I couldn't confirm them from the codebase:

- "Never used for training" (taken from the old FAQ).
- The iOS and Android download buttons. Do the store links exist?
- "Answers come only from this book".
- Scanned PDFs without a text layer don't work. Is that true?
- "Made in Casablanca" in the footer.

## Responsive

- Breakpoints: mobile 390, tablet 768, desktop 1280–1440.
- Below 768px:
  - The sidebar becomes a drawer opened from a menu button in a 60px top bar.
  - Card grids drop to one column and tables scroll horizontally.
  - Dialogs become bottom sheets (see the upload sheet in `app-library.mobile.html`).
- Touch targets are at least 44×44.
- The secondary pages only have desktop mockups. Build them responsive using the same patterns as the mobile mockups.
