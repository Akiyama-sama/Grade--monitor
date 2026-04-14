# Comprehensive Results Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-layout the dashboard's top-center comprehensive results area into one line-divided container with an integrated status-plus-thickness block, a treemap-style level display, and a tighter right radar zone.

**Architecture:** Keep the redesign scoped to `src/components/regions/CenterDashboardRegion.tsx` by removing the current card-style wrappers from `ComprehensiveResults` and rebuilding it as a single horizontally split box. The left side contains an upper summary row where the thickness value is integrated into the status block and the level distribution is shown as a treemap-style rectangle composition using colors allowed by `DESIGN.md`; the lower button row remains separated by a line. The right side holds a tighter radar area with `146kg` preserved as a low-priority visual element. Verify the result with TypeScript, production build, and Playwright at 1920x1080.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Playwright CLI

---

### Task 1: Rebuild the comprehensive results area into one line-divided container

**Files:**
- Modify: `src/components/regions/CenterDashboardRegion.tsx`

- [x] **Step 1: Replace the current card-based layout with one outer split container**

Update `ComprehensiveResults` so its main structure becomes:

```tsx
<div className="grid gap-0 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
  <section>{/* left results zone */}</section>
  <section>{/* right radar zone */}</section>
</div>
```

The left section itself should become:

```tsx
<section className="min-w-0 xl:border-r xl:border-rui-divider/45">
  <div>{/* upper summary row */}</div>
  <div className="border-t border-rui-divider/45">{/* lower button row */}</div>
</section>
```

Do not wrap either side in separate rounded cards.

- [x] **Step 2: Rebuild the left upper summary row without card wrappers**

Create a flat line-divided summary area that places:

- large `判级中` on the left
- `综合厚度 + 智能级别` summary on the right

Use layout like:

```tsx
<div className="grid gap-4 xl:grid-cols-[minmax(260px,0.9fr)_minmax(0,1fr)] xl:items-start">
  {/* status block */}
  <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)]">
    {/* smart thickness */}
    {/* level distribution */}
  </div>
</div>
```

Keep:

- current point badge and warning badge
- plate number
- `智能综合厚度` value `6`, but integrate it into the status block
- `重1 20%` / `重2 70%`

- [x] **Step 3: Move the three buttons into the left lower row**

Use a flat row separated by a top border:

```tsx
<div className="grid gap-2.5 pt-3 lg:grid-cols-3">
  {/* 3 buttons */}
</div>
```

The button row must stay inside the left zone so the combined height of left summary + buttons visually matches the right radar section.

- [x] **Step 4: Replace the level bars with a treemap-style rectangle composition**

Implement the level distribution as a treemap-style rectangle block instead of progress bars.

Requirements:

- use only colors allowed by `DESIGN.md`
- dominant level should occupy more area
- labels and percentages must remain readable inside the rectangles
- the block should fill the available upper-middle space more effectively than the old bars

- [x] **Step 5: Rebuild the right radar section as a tighter flat area**

Replace the current radar card with a flatter section that uses only spacing and dividing lines.

Requirements:

- radar area should be slightly shorter visually than the current version
- no extra boxed summary block for `146kg`
- keep only a small heading and the radar chart itself
- keep the angle labels only

Suggested structure:

```tsx
<section className="min-w-0 xl:pl-5">
  <div className="relative h-full py-2">
    {/* subtle 146kg background */}
    {/* heading */}
    {/* compact radar wrapper */}
  </div>
</section>
```

- [x] **Step 6: Preserve `146kg` as a low-priority visual element**

Keep `146kg`, but change it from a foreground summary card to one of these low-priority treatments:

```tsx
<div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center ...">146</div>
```

or an equally unobtrusive alternative in the same spirit.

- [x] **Step 7: Keep the chart compact and label-led**

Adjust the radar chart props to emphasize the chart itself:

```tsx
<RadarChart cx="50%" cy="54%" outerRadius="70%" data={DEDUCTION_DATA}>
  <PolarGrid stroke={CHART_COLORS.divider} />
  <PolarAngleAxis
    dataKey="name"
    tick={{ fill: CHART_COLORS.gray, fontSize: 10 }}
  />
  <Radar ... />
</RadarChart>
```

Keep only the angle labels around the chart. Do not render any extra explanatory paragraphs alongside it.

- [x] **Step 8: Run type-check after the layout refactor**

Run:

```bash
npm run lint
```

Expected: `tsc --noEmit` exits with code `0`.

### Task 2: Verify the redesign in browser and production build

**Files:**
- Modify: `src/components/regions/CenterDashboardRegion.tsx`

- [x] **Step 1: Build the app after the layout change**

Run:

```bash
npm run build
```

Expected: Vite build exits with code `0`.

- [x] **Step 2: Start the dev server for visual QA**

Run:

```bash
npm run dev
```

Expected: local server available at `http://127.0.0.1:3000/`.

- [x] **Step 3: Capture a Playwright QA screenshot at 1920x1080**

Run:

```bash
playwright-cli open http://127.0.0.1:3000/
playwright-cli resize 1920 1080
playwright-cli screenshot --filename=comprehensive-results-layout-after.png
```

Expected:

- screenshot saved successfully
- top comprehensive results area shows:
  - one outer container split left/right
  - left upper summary row
  - left lower button row
  - right tighter radar section

- [x] **Step 4: Inspect console and layout for regressions**

Run:

```bash
playwright-cli console
playwright-cli snapshot --depth=4
```

Expected:

- no newly introduced runtime errors from the redesign
- no obvious overflow or collapsed layout in the top-center region

- [x] **Step 5: Mark the executed steps in this plan**

Update this plan file so completed steps are checked off.

## Self-Review

- Spec coverage: the plan covers the approved flat split layout, integrated thickness in the status block, treemap-style level display using allowed colors, tighter radar area, preserved but unobtrusive `146kg`, and Playwright self-check.
- Placeholder scan: no `TODO`/`TBD` placeholders remain.
- Type consistency: the plan only modifies `ComprehensiveResults` in `CenterDashboardRegion.tsx` and keeps existing callback/data contracts intact.

## Execution Handoff

User instruction `开始执行` is treated as approval to execute this plan inline in the current session on `main`.
