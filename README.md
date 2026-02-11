# Habit Tracker

A local-first habit tracker without a backend. The project is focused on simple daily usage, low-pressure UX, and quick recovery after missed days.

## Project Idea

`Habit Tracker` helps users build habits with minimal friction:
- one habit = one clear action;
- one-click daily completion;
- consistency and stability matter more than a perfect streak;
- offline-friendly with browser-based persistence.

Approach: `LocalStorage-first`. No API, no auth, no server dependency.

## Core Features

- `Today` screen with active/archived habits.
- `Done / Not done` toggle for the current day.
- Fast creation from ready-to-use habit presets.
- Create/edit habit:
  - `Name`
  - `Schedule`: `Daily` or `Weekly` (selected weekdays)
  - `Start date`
  - `Color`
  - `Note`
- `Habit details` screen:
  - `Current streak`
  - `Best streak`
  - 7/30 day completion rate
  - 30-day heatmap
- `Recovery mode`: `Restart streak` without deleting history.
- `Settings`:
  - JSON export
  - JSON import
  - data reset
  - week-start preference
- Theme switcher (`Light / Dark`) in the top bar.
- Keyboard shortcuts:
  - `1` Today
  - `2` Habit details
  - `3` Settings
  - `N` new habit (on Today screen)
  - `Esc` close modal

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- lucide-react (icons)
- Zustand
- dayjs
- Vitest

## Architecture

- `src/domain` — pure business logic:
  - schedule
  - streak
  - stats
  - heatmap
- `src/storage` — localStorage adapter, versioning, migrations
- `src/state` — Zustand store, actions, state selectors
- `src/ui` — screens and UI components
  - `src/ui/components/common/Button.tsx` — shared button with variants (`primary`, `ghost`, `tab`)
  - `src/ui/components/common/Card.tsx` — shared card with tones (`default`, `soft`, `danger`)
  - `src/ui/components/common/Panel.tsx` — shared screen wrapper

## Data Model

Main entities:
- `Habit`
- `Completion`
- `settings` (including theme)

Completion storage shape:
- `completions: Record<habitId, Record<date, 1>>`

Why this shape works:
- fast lookup by habit/date;
- simple streak and completion-rate calculations;
- easy heatmap rendering.

## Persistence and Migrations

Data is stored in `localStorage` with schema versioning.
Current schema: `v2`.

Older formats are migrated to the latest schema on load.

## Quick Start

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## Scripts

- `npm run dev` — run dev server
- `npm run lint` — run linter
- `npm run test` — run unit tests
- `npm run build` — typecheck + production build

## Testing

Covered domain edge cases:
- weekly schedule behavior;
- startDate boundary;
- streak calculation;
- restart streak logic.

Test file:
- `src/domain/stats.test.ts`

## Design and UX

- Light theme by default.
- Dark theme support via toggle.
- Anti-shame UX: missed days are not highlighted as “failure”.
- Clean visual hierarchy and responsive layout for desktop/mobile.

## SEO Optimization

The project includes a baseline SEO setup:
- `title`, `meta description`, `keywords`, `robots`, `author`
- Open Graph and Twitter Card tags
- `canonical` link
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`
- JSON-LD (`SoftwareApplication` schema)

Dynamic `title/description/og` updates are also implemented for app views (`Today`, `Details`, `Settings`).

After deployment, update `https://your-domain.com` with the real domain in:
- `index.html`
- `public/robots.txt`
- `public/sitemap.xml`

## Site Icons

The project includes themed Habit Tracker icons:
- `public/favicon.svg`
- `public/icon-192.svg`
- `public/icon-512.svg`

They are used for favicon, PWA manifest, and social previews.

## Future Improvements

- Preset categories and favorite templates.
- Accessibility improvements (a11y) and extended keyboard flows.
- Additional consistency charts.
- Clear offline status for PWA mode.

---

Made by Azamat Altymyshev
