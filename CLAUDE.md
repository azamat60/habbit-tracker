# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch mode
npm run preview      # Preview production build
```

Run a single test file: `npx vitest run src/domain/stats.test.ts`

## Stack

React 19 + TypeScript + Vite + Zustand + Tailwind CSS 4 + dayjs + Lucide React. No backend — fully local-first with localStorage persistence.

## Architecture

```
src/
├── domain/      # Pure business logic — no React, no side effects
├── state/       # Zustand store (single source of truth)
├── storage/     # localStorage adapter + import/export
└── ui/          # React components
    └── components/common/   # Button, Card, Panel primitives
```

**Data flow:** UI → Zustand actions → store updates `AppData` → auto-persisted to localStorage. Domain functions compute stats/streaks on demand from stored data.

## Key Types (`src/domain/types.ts`)

- `DateKey` — `YYYY-MM-DD` string, used everywhere for dates
- `Habit` — id, name, color, schedule (`daily` | `weekly` with daysOfWeek), startDate, optional `streakRestartDate`
- `AppData` — versioned (currently v2); holds habits[], completions record, and settings
- `HabitCompletions` — `Record<DateKey, 1>` per habit id

## State (`src/state/store.ts`)

Single `useHabitStore` manages:
- `data: AppData` — all persisted state
- `view` — current screen (`'today' | 'details' | 'settings'`)
- `filter` — `'active' | 'archived'`
- `selectedHabitId` — which habit is open in details view

## Storage (`src/storage/storage.ts`)

localStorage key: `habit-tracker:data`. Includes schema migration logic (v1 → v2). New schema versions need a migration case here.

## Domain Logic

- `stats.ts` — streak calculation, completion rates, 30-day heatmap, recovery suggestions
- `schedule.ts` — whether a date is scheduled for a habit, date range queries
- `date.ts` — thin dayjs wrappers; all date math uses `DateKey` strings

## UI Conventions

- `Button` has 8 variants: `primary`, `ghost`, `info`, `warning`, `success`, `danger`, `tabActive`, `tabIdle`
- Dark mode via Tailwind `dark:` prefix; toggled by `.dark` class on `<html>`
- Hover micro-animation: `-translate-y-0.5` for subtle lift
- `cn()` utility in `src/ui/lib/` for conditional classnames
