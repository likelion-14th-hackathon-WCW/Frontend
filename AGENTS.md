# AGENTS.md — Frontend Contribution Rules

> **Read this before making any change.** If your PR violates these rules, it will be reverted.

---

## Architecture (Do NOT Change)

```
src/
├── api/          # API client & endpoint modules (axios-based)
├── assets/       # Static images & SVG icons
├── components/   # Reusable UI components (one .jsx + one .css per component)
├── hooks/        # Custom React hooks
├── pages/        # Route-level page components (one .jsx + one .css per page)
├── styles/       # Global/shared CSS (common.css = design tokens)
├── store/        # Global state (reserved)
├── services/     # Business logic (reserved)
├── features/     # Feature modules (reserved)
├── types/        # Type definitions (reserved)
└── utils/        # Pure utility functions
```

**Do NOT restructure folders, rename directories, or move files between directories without explicit approval from the project lead.**

---

## Design System & Styling

### CSS Variables Are The Source of Truth

All colors, fonts, spacing, and motion tokens live in `src/styles/common.css`. **Use them.**

```css
/* ✅ Correct */
color: var(--color-accent);
font-family: var(--font-body);

/* ❌ Wrong — hardcoded values */
color: #d48c46;
font-family: 'Noto Sans KR', sans-serif;
```

### Rules

1. **No CSS frameworks or utility-class libraries** (no Tailwind, no Bootstrap, no styled-components). We use plain CSS with BEM-like naming.
2. **One CSS file per component/page.** Co-locate `Component.jsx` and `Component.css` in the same directory.
3. **BEM-like class naming:** `.block__element--modifier` (e.g., `.hero__heading-accent`).
4. **Do NOT override or remove existing CSS variables** in `common.css`. You may ADD new ones with team lead approval.
5. **Respect `prefers-reduced-motion`** — all animations must degrade gracefully (see `Hero.css` for reference).
6. **No inline styles** unless dynamically computed (e.g., `style={{ '--reveal': value }}`).
7. **No global selectors (`*`, `html`, `body`) in per-page CSS files.** Scope every rule under the page's root class (e.g. `.editor-page-container`). A page's `<style>` is never removed on unmount, so an unscoped `*` or `body`/`html` rule leaks into every other page for the rest of the session once that page has been visited once.

---

## Component Conventions

1. **Functional components only.** No class components.
2. **One default export per file.** Named exports only for hooks/utils.
3. **File naming:** PascalCase for components (`Hero.jsx`), camelCase for hooks/utils (`useScrollReveal.js`).
4. **Props:** Destructure in the function signature. No `props.xxx` access.
5. **No new dependencies** without project lead approval. Current stack:
   - React 19 + React Router 7
   - Axios (via `src/api/client.js`)
   - Vite 8
   - Lottie-web (animations only)
6. **Routing lives in `App.jsx` only.** Do not create nested routers or modify route paths without approval.

---

## API Layer

1. **All HTTP requests go through `src/api/client.js`** (the shared Axios instance). Never create a new Axios instance or use raw `fetch`.
2. **Login state standard is `useAuth()` / `localStorage['wcw_user']`** (see `src/hooks/useAuth.js`). This is what `Header.jsx`, `Reservation.jsx`, and `ReservationCompleteMember.jsx` already use — always call `useAuth()` to check login state, never read `localStorage` directly in a page/component.
   - ⚠️ `client.js`'s Authorization interceptor and `EditorPage.jsx` currently check a *different* key (`localStorage['token']`), which is a known bug (an authenticated user with `wcw_user` set still gets shown the guest/login modal in the editor). Do not copy that pattern — if you touch either file, migrate it to `useAuth()`/`wcw_user` instead of adding a third convention.
3. **Error handling pattern:** Return `{ success, data?, message?, status? }` objects. Do not throw from API functions.

---

## Git & PR Workflow

1. **Branch from `main`.** Branch naming: `feature/<scope>`, `fix/<scope>`, `refactor/<scope>`.
2. **Do NOT force-push to `main`.**
3. **Do NOT merge your own PR** without at least one approval.
4. **Do NOT revert or overwrite another team member's merged work** without discussion. If you disagree with a design or logic decision, open an issue or message the team first.
5. **Keep PRs small and focused.** One feature or fix per PR.

---

## What You MUST NOT Do

| ❌ Action | Why |
|-----------|-----|
| Replace CSS variables with hardcoded values | Breaks design consistency |
| Add Tailwind / styled-components / CSS modules | We chose plain CSS deliberately |
| Change route paths in `App.jsx` | Breaks navigation & deep links |
| Remove or rename existing components | Other pages depend on them |
| Change the API client's baseURL or interceptor logic | Breaks all API calls |
| Install new npm packages without approval | Bundle size & compatibility |
| Rewrite logic that was intentionally fixed in a recent PR | Reintroduces bugs |
| Push directly to `main` | Must go through PR review |
| Read `localStorage` directly for login state instead of `useAuth()` | Splits the app into two disconnected login checks (see API Layer §2) |
| Use `*`, `html`, or `body` selectors in a page's own CSS file | Leaks globally and never gets cleaned up on route change |

---

## Before You Push, Verify

```bash
npm run lint     # Must pass with zero errors
npm run build    # Must succeed
```

If either fails, fix it before opening a PR.

---

## Questions?

If you're unsure whether a change is allowed, **ask first**. Open a GitHub Issue or message the team lead. Do not assume silence is approval.
