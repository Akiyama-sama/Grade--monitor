# Dashboard Region Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the scrap grading dashboard into region-based React components while keeping the current layout, styles, and interactions unchanged.

**Architecture:** Move page-level JSX out of `src/App.tsx` into six region components under `src/components/regions/`, and extract shared dashboard data/types/helpers into focused support modules so `App` only owns state and region assembly. Reuse the existing class names and DOM roots for each region to avoid visual regressions.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Lucide React, Motion

---

### Task 1: Extract shared dashboard support modules

**Files:**
- Create: `src/components/dashboard/types.ts`
- Create: `src/components/dashboard/constants.ts`
- Create: `src/components/dashboard/common.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: Create shared type definitions**

Add the current dashboard data interfaces to `src/components/dashboard/types.ts`, including:

```ts
export interface AlarmItem { /* id, name, system, review, status, category */ }
export interface MessagePrompt { /* id, time, content, type */ }
export interface GradingData { /* name, value, color, subItems? */ }
export interface DeductionItem { /* name, value, unit */ }
export type DashboardActionType = 'abnormal' | 'end' | 'leave';
```

- [x] **Step 2: Create shared constants/data module**

Move mock data and display constants from `src/App.tsx` into `src/components/dashboard/constants.ts`, including:

```ts
export const CHART_COLORS = { ... } as const;
export const ALARM_DATA = [ ... ];
export const PROMPT_MESSAGES = [ ... ];
export const THICKNESS_DATA = [ ... ];
export const MATERIAL_DATA = [ ... ];
export const DEDUCTION_DATA = [ ... ];
export const DEDUCTION_TOTAL = { ... };
export const GALLERY_DATA = [ ... ];
export const BASIC_INFO = { ... };
export const MONITORING_POINTS = [ ... ];
```

- [x] **Step 3: Create shared dashboard UI helpers**

Move reusable UI pieces into `src/components/dashboard/common.tsx`, including:

```tsx
export const SectionHeader = memo(...)
export const AlarmItemCard = memo(...)
export const InfoStreamItem = memo(...)
export const PinnedAlert = memo(...)
export const VideoFeed = memo(...)
```

Keep the JSX and class names identical to the current implementation.

- [x] **Step 4: Remove duplicated local definitions from `src/App.tsx`**

Delete the moved type/data/helper declarations from `src/App.tsx` and replace them with imports from the new support modules.

- [x] **Step 5: Verify support-module extraction**

Run:

```bash
npm run lint
```

Expected: `tsc --noEmit` exits with code `0`.

### Task 2: Create region components

**Files:**
- Create: `src/components/regions/TopBarRegion.tsx`
- Create: `src/components/regions/LeftSidebarRegion.tsx`
- Create: `src/components/regions/CenterDashboardRegion.tsx`
- Create: `src/components/regions/RightAnalysisRegion.tsx`
- Create: `src/components/regions/ModalLayer.tsx`
- Create: `src/components/regions/FloatingActionRegion.tsx`

- [x] **Step 1: Build the top bar region**

Create `TopBarRegion.tsx` containing the current top-bar rendering plus its local helper pieces:

```tsx
export const TopBarRegion = memo(({ activePointId, onPointSelect }) => ...)
```

Keep `DigitalClock` and `MonitoringSwitcher` inside this file because they are only used by the top bar.

- [x] **Step 2: Build the left sidebar region**

Create `LeftSidebarRegion.tsx` with the current left-column root node:

```tsx
export const LeftSidebarRegion = memo(({ sortedAlarms }) => ...)
```

Render the existing alarm block and info-stream block without changing the container class names.

- [x] **Step 3: Build the center dashboard region**

Create `CenterDashboardRegion.tsx` and move the current middle-column rendering into it, including:

```tsx
const ComprehensiveResults = memo(...)
const ImageSidebar = memo(...)
export const CenterDashboardRegion = memo(({ activePointId, onAction, onImageClick }) => ...)
```

Keep `VideoFeed` imported from `common.tsx`.

- [x] **Step 4: Build the right analysis region**

Create `RightAnalysisRegion.tsx` and move the current right-column rendering into it:

```tsx
const AnalysisPanel = memo(...)
export const RightAnalysisRegion = memo(({ onShowDetails, onAction }) => ...)
```

Reuse `SectionHeader` and dashboard constants from shared modules.

- [x] **Step 5: Build modal and floating-action regions**

Create `ModalLayer.tsx` and `FloatingActionRegion.tsx`:

```tsx
export const ModalLayer = memo(({ ...modalProps }) => ...)
export const FloatingActionRegion = memo(() => ...)
```

Move `DetailsModal`, `ImageCarouselModal`, and `ConfirmationModal` into `ModalLayer.tsx`. Keep all current `z-index`, animation, and overlay classes intact.

- [x] **Step 6: Verify region creation**

Run:

```bash
npm run lint
```

Expected: `tsc --noEmit` exits with code `0`.

### Task 3: Simplify `App.tsx` into a page-state shell

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: Reduce `App.tsx` imports to state + region assembly**

Update `src/App.tsx` so it imports:

```tsx
import { useCallback, useMemo, useState } from 'react';
import { ALARM_DATA, GALLERY_DATA } from './components/dashboard/constants';
import { BackgroundAccents } from './components/dashboard/common-or-local';
import { TopBarRegion } from './components/regions/TopBarRegion';
import { LeftSidebarRegion } from './components/regions/LeftSidebarRegion';
import { CenterDashboardRegion } from './components/regions/CenterDashboardRegion';
import { RightAnalysisRegion } from './components/regions/RightAnalysisRegion';
import { ModalLayer } from './components/regions/ModalLayer';
import { FloatingActionRegion } from './components/regions/FloatingActionRegion';
```

- [x] **Step 2: Keep page state and callbacks unchanged**

Preserve the current state logic for:

```tsx
activePointId
showDetails
showImageModal
currentSlide
confirmModal
handleShowDetails / handleCloseDetails
handleOpenImageModal / handleCloseImageModal
handlePrevSlide / handleNextSlide
handleAction
sortedAlarms
```

- [x] **Step 3: Replace large inline JSX blocks with region components**

Render:

```tsx
<ModalLayer ... />
<TopBarRegion ... />
<main ...>
  <LeftSidebarRegion sortedAlarms={sortedAlarms} />
  <CenterDashboardRegion ... />
  <RightAnalysisRegion ... />
</main>
<FloatingActionRegion />
<BackgroundAccents />
```

The `main` wrapper and the three direct column roots must keep the exact existing layout classes.

- [x] **Step 4: Verify app-shell refactor**

Run:

```bash
npm run lint
npm run build
```

Expected:

- `tsc --noEmit` exits with code `0`
- `vite build` exits with code `0`

### Task 4: Final regression verification

**Files:**
- Modify: `docs/superpowers/plans/2026-04-13-dashboard-region-split.md`

- [x] **Step 1: Re-read the approved design spec**

Check `docs/superpowers/specs/2026-04-13-dashboard-region-split-design.md` against the finished code and confirm:

- six region components exist
- `App.tsx` is state-focused
- no layout/style changes were introduced intentionally

- [x] **Step 2: Run final verification commands**

Run:

```bash
npm run lint
npm run build
git status --short
git diff -- src/App.tsx src/components/dashboard src/components/regions
```

Expected:

- type-check passes
- production build passes
- diff is limited to the planned refactor files

- [x] **Step 3: Mark completed steps in this plan**

Update this plan file checkboxes as execution proceeds so the plan remains an accurate handoff artifact.

## Self-Review

- Spec coverage: this plan covers the approved six-region split, App state retention, and no-visual-change constraints.
- Placeholder scan: no `TODO`/`TBD` placeholders remain.
- Type consistency: shared dashboard types are defined once and reused across region components.

## Execution Handoff

User instruction `执行` is treated as selecting inline execution in the current session.
