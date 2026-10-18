@AGENTS.md

# zaydoun-dashboard

This is the Next.js **16** App Router app (React 19, Tailwind v4, TypeScript). It serves the public marketing site, the user web app, and the admin dashboard. See the workspace [../CLAUDE.md](../CLAUDE.md) for the API contract. As AGENTS.md says, check `node_modules/next/dist/docs/` before using Next APIs: v16 differs from older versions. For example, middleware is now `src/proxy.ts` exporting `proxy()`.

## Commands

- `npm run dev`: runs `next dev --webpack`. Webpack is required because of the framer-motion CJS alias in `next.config.ts`.
- `npm run build` / `npm start`: production build with `output: "standalone"`.
- `npx tsc --noEmit` to typecheck, `npm run lint` to lint.

## Languages (next-intl)

- UI languages: `en` (default, no prefix), `fr`, `es`, `ar` (RTL), `zh`, `de`. Config is in `src/i18n/`: `routing.ts` (locales, `localePrefix: "as-needed"`, native names), `request.ts`, `navigation.ts`, `metadata.ts`.
- Every route lives under `src/app/[locale]/`; `[locale]/layout.tsx` is the root layout and sets `<html lang dir>`. `src/proxy.ts` runs the next-intl middleware after the auth-cookie check, which ignores the locale prefix. Changing the proxy `matcher` needs a dev-server restart.
- **Navigation:** always import `Link`, `useRouter`, `usePathname` and `redirect` from `@/i18n/navigation`, never from `next/link` or `next/navigation`. They keep the language prefix, and `usePathname()` returns the path without it.
- **Messages:** `messages/<locale>/<namespace>.json`. The namespaces are listed in `src/i18n/messages.ts` and typed in `src/global.d.ts`, so English is the reference and `t("…")` keys are type-checked. Add a key to all 6 locales, using ICU plurals (`{count, plural, one {# book} other {# books}}`; Arabic also needs `zero/two/few/many`). Use `t.rich` with `<em>`, `<link>` etc. for inline markup. Use ’ rather than `'`, because the apostrophe is ICU's escape character.
- **Zod messages** are message keys, e.g. `"emailInvalid"` → `common.validation`. The page translates `issue.message`.
- **Formatting:** dates go through `useFormatDate()` / `useRelativeTime()` in `lib/time.ts`, and book languages through `languageDisplayName(code, locale)`. Admin numbers use `useAdminFormat()` in `components/Admin/format.ts`. Never call `toLocale*String(undefined)`.
- **Two separate language concepts.** The UI language comes from the URL. Zaydoun's *reply* language (`lib/languages.ts`, 5 codes, no German) is per conversation, and its default (`getReplyLanguagePref(locale)`) follows the UI language when Zaydoun can reply in it.
- **RTL:** use logical utilities (`ms-/me-/ps-/pe-/start-/end-/border-s/rounded-s/text-start`), never `ml-/left-/text-left`. `globals.css` mirrors directional lucide icons, zeroes letter-spacing and italics, and loosens heading leading for `ar`/`zh`. Arabic UI text uses IBM Plex Sans Arabic plus Amiri; Chinese uses system CJK fonts.
- **Static pages:** server pages call `setRequestLocale(await localeOf(props))` so they prerender per language. Public layouts build metadata and hreflang alternates with `pageMetadata()`.
- `LocaleSwitcher` (in `@/components/ui`) appears in the marketing nav and footer, the auth pages, the app sidebar and rail, and Profile.
- API error messages (`err.message`) still arrive in English.

## Route map (src/app/[locale])

- `/`: marketing home (`components/Marketing/HomeSections.tsx`, with the interactive `AskDemo`).
- `(marketing)/features|how-it-works|faq|contact`: marketing pages. FAQ content lives in `src/lib/faq.ts`; the `/faq` page and its FAQPage JSON-LD both read it, so edit answers there. Every marketing page gets the `ScrollToTop` button from `MarketingShell`. The nav's "How it works" points to `/how-it-works`; its copy mirrors the real pipeline in `zaydoun-api`, so update it if the pipeline changes (chunk size, top-5 search, model, history length). All of them wrap in `components/Marketing/MarketingShell.tsx` (nav, footer, `Eyebrow`, `SectionTitle`, `Container`).
- The contact form uses reCAPTCHA through `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
- `/pricing` was removed; `next.config.ts` redirects it to `/`.
- `/login`, `/register`, `/forgot-password`, `/reset-password`: public auth pages.
- `/app/*`: the **USER** web app (home, library, conversations, `conversations/[id]` chat, profile).
- `/dashboard/*`: the **ADMIN** dashboard (overview with `CostPerDayChart`, library, conversations, users, profile). It redirects non-admins to `/login`.
- Admins can switch between `/app` and `/dashboard` from the bottom of either sidebar.
- Both areas use one shell, `components/Shell/AppShell.tsx` (`area="reader" | "admin"`):
  - On desktop it shows a 256px sidebar; on `/app/conversations/[id]` that becomes a 72px icon rail.
  - Below 768px it shows a 60px top bar with a drawer instead.
  - Nav links and mobile page titles live in `components/Shell/navigation.ts`.
  - There is **no desktop header**: each page renders its own serif `<h1>`.
  - The shell already pads `<main>` (16px sides on mobile, 48px on desktop), so pages don't add outer padding. The rail/chat route gets no padding.
- After login, `lib/routes.ts > getDashboardPath(role)` sends USER to `/app` and ADMIN to `/dashboard`.
- Each route folder has a `layout.tsx` whose only job is to export `metadata` for SEO. Pages themselves are `"use client"`.

## Auth & data flow

- **Route gate:** `src/proxy.ts` only checks that the `refreshToken` cookie exists for `/app` and `/dashboard`. The real check happens client-side in the layout components, using `useAuth()`.
- **Auth state:** `contexts/AuthContext.tsx` does a silent refresh on mount, then `getProfile`. It keeps the access token in memory (`setAccessTokenStore`) and exposes `user`, `isAdmin`, `login`, `logout` and `updateUser`.
- **API calls:**
  - Every call goes through `lib/api/client.ts` (`apiClient.get/post/patch/delete`), which wraps `lib/api/fetchWithAuth.ts`. That wrapper attaches the Bearer token, refreshes once on a 401, retries, and unwraps `data`.
  - Domain calls live in `lib/api/services/*.service.ts`, with their types in `src/types/*.types.ts`.
  - The base URL is `NEXT_PUBLIC_API_URL`, which defaults to `http://localhost:5000/api/v1`.
- **Validation:** zod schemas live in `src/validations/`.
- **Notifications:** use `useToast().notify(msg, type)` from `contexts/ToastContext.tsx`, which wraps react-toastify. Confirmations use `ConfirmDialog` from `@/components/ui`.

## Redesign

- The visual reference is `design/` (README + HTML mockups); it is not committed.
- Order of work: tokens → components → shell → Library → Conversation → Admin overview → the rest. **All steps are done** (as of 2026-10-15).
- Password rules live in `src/validations/password.ts` and must mirror the API's `passwordSchema`.
- Never pass a positioning or display class to a component that sets its own (e.g. `<Orb className="absolute">`); wrap it instead. `cn` doesn't merge conflicting classes. `sweetalert2` and `recharts` are no longer imported anywhere (left installed).
- Tokens are copied into `src/styles/tokens.css`, which generates utilities like `bg-bg-surface`, `text-gold`, `rounded-md`, `font-serif`. Never use raw hex values.
- Fonts (Inter, Newsreader, Amiri) load via next/font in `app/layout.tsx`.
- **Font sizes** all derive from `--font-scale` in `src/styles/tokens.css`, which is currently 0.93, a bit smaller than the mockups at Ayoub's request.
  - Use the scaled sizes: `text-xs`…`text-5xl`, or the design's pixel sizes as `text-13`, `text-15`, etc.
  - Never use raw `text-[13px]`: it would ignore the scale.
  - Line heights and spacing are not scaled.
- Shared components live in `src/components/ui`, imported via `@/components/ui`. A dev-only preview is at `/dev/ui`.
- `contexts/LimitsContext.tsx` (`useLimits()`) exposes `GET /users/me/limits` for free-tier usage. Call `refreshLimits()` after an upload, delete or message.

## Styling

- **New code** uses the token utilities and `@/components/ui`.
- Old pages still use the legacy `--z-*` CSS variables through inline `style={{ … }}`. Replace that as each page gets redesigned.
- Base element styles in `globals.css` must stay inside `@layer base`. Unlayered CSS overrides every Tailwind utility in v4.
- Icons come from `lucide-react`.

## Motion

- The tokens and primitives live in `src/components/motion`:
  - `EASE_OUT`, `DURATION` (fast / base / slow) and `RISE`.
  - `Reveal`: fade and rise on scroll, once.
  - `Stagger` / `StaggerItem`: children follow each other.
  - `MotionProvider`: honours the OS "reduce motion" setting.
- **Above-the-fold entrances use `RiseIn`** (`components/motion/RiseIn.tsx`), a pure-CSS `animate-rise`. It starts at first paint. Never hide hero content behind Framer `initial={{ opacity: 0 }}`: it stays blank until JS hydrates.
- Animate only `transform` and `opacity`. Height animations (FAQ, menus) are the one exception.
- Keep collapsible content in the DOM, `inert` when closed, so search engines can still read it.
- Framer Motion is aliased to its CJS build in `next.config.ts`; import from `"framer-motion"`.
- Done so far: the marketing pages (home, features, contact). The app and auth pages come next.

## Known issues

- When updating the logged-in user, merge into it (`updateUser({ ...user, name })`). Rebuilding the object drops `role`, and admins get bounced to `/login`.
- `next.config.ts` image `remotePatterns` only allows `localhost:5000`.
