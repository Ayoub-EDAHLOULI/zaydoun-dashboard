@AGENTS.md

# zaydoun-dashboard

This is the Next.js **16** App Router app (React 19, Tailwind v4, TypeScript). It serves the public marketing site, the user web app, and the admin dashboard. See the workspace [../CLAUDE.md](../CLAUDE.md) for the API contract. As AGENTS.md says, check `node_modules/next/dist/docs/` before using Next APIs: v16 differs from older versions. For example, middleware is now `src/proxy.ts` exporting `proxy()`.

## Commands

- `npm run dev`: runs `next dev --webpack`. Webpack is required because of the framer-motion CJS alias in `next.config.ts`.
- `npm run build` / `npm start`: production build with `output: "standalone"`.
- `npx tsc --noEmit` to typecheck, `npm run lint` to lint.

## Route map (src/app)

- `/`: landing page, built from `components/Landing/*`.
- `(marketing)/features|pricing|contact`: marketing pages. The contact form uses reCAPTCHA through `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`.
- `/login`, `/register`, `/forgot-password`, `/reset-password`: public auth pages.
- `/app/*`: the **USER** web app (home, library, conversations, `conversations/[id]` chat, profile).
- `/dashboard/*`: the **ADMIN** dashboard (overview with `CostChart`, library, conversations, users, profile). It redirects non-admins to `/login`.
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
- **Notifications:** use `useToast().notify(msg, type)` from `contexts/ToastContext.tsx`, which wraps react-toastify. Confirm dialogs use sweetalert2.

## Redesign (in progress)

- The visual reference is `design/` (README + HTML mockups); it is not committed.
- Order of work: tokens → components → shell → Library → Conversation → Admin overview → the rest. Tokens, components, shell, Library, Conversation (chat), Admin overview, Home, the Conversations list and Profile are done. Still to do: admin Users (+ Add user), auth pages, marketing pages.
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
- Icons come from `lucide-react`. Animations use `framer-motion`.

## Known issues

- The site is English-only; there's no i18n library.
- The SEO JSON-LD in `app/layout.tsx` includes a hardcoded `aggregateRating`.
- When updating the logged-in user, merge into it (`updateUser({ ...user, name })`). Rebuilding the object drops `role`, and admins get bounced to `/login`.
- `next.config.ts` image `remotePatterns` only allows `localhost:5000`.
