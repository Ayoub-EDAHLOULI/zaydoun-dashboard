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
- `/app/*`: the **USER** web app (home, library, conversations, `conversations/[id]` chat, profile). Its shell is `components/App/AppLayout.tsx` + `AppSidebar` + `AppHeader`.
- `/dashboard/*`: the **ADMIN** dashboard (overview with `CostChart`, library, conversations, users, profile). Its shell is `components/Dashboard/Layout.tsx`, and it redirects non-admins to `/login`. Sidebar items come from `lib/admin-config.ts` (`NAV_ITEMS`, `adminOnly`).
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

## Styling

- Use the CSS variables defined in `app/globals.css` (`--z-bg-base`, `--z-gold`, `--z-text-primary`, …). The codebase usually applies them through inline `style={{ … "var(--z-…)" }}`, mixed with Tailwind utility classes for layout.
- Icons come from `lucide-react`. Animations use `framer-motion`.

## Known issues

- **Broken chat reply handling.** `conversationsService.chat()` is typed to return `{ userMessage, aiMessage }`, but the API returns `{ userText, aiMessage }`. As a result, `app/app/conversations/[id]/page.tsx` pushes `undefined` into `messages`. Fix the type and keep the optimistic user message instead.
- `next-intl` is installed but unused, despite what the README says. The site is English-only.
- The SEO copy in `app/layout.tsx` says "powered by … Claude", but the backend uses OpenAI. It also includes a hardcoded `aggregateRating`.
- `next.config.ts` image `remotePatterns` only allows `localhost:5000`.
