# Comprehensive Results Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-layout the dashboard's top-center comprehensive results area so status, smart thickness, level distribution, radar chart, and action buttons read clearly without overflowing the existing container.

**Architecture:** Keep the redesign scoped to `src/components/regions/CenterDashboardRegion.tsx` by rebuilding the `ComprehensiveResults` section into a two-row composition: top summary row with a left information block and a right lightweight radar card, then a dedicated action-button row below. Keep all data sources and action callbacks unchanged, and verify the new arrangement with TypeScript, production build, and Playwright screenshots at 1920x1080.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Recharts, Playwright CLI

---

### Task 1: Restructure the comprehensive results layout

**Files:**
- Modify: `src/components/regions/CenterDashboardRegion.tsx`

- [x] **Step 1: Replace the current mixed header layout with a two-row shell**

Update `ComprehensiveResults` so its outer content becomes:

```tsx
<div className="space-y-4 xl:space-y-5">
  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)] xl:items-stretch">
    {/* left summary block */}
    {/* right radar card */}
  </div>
  <div className="grid gap-2.5 md:grid-cols-3">
    {/* action buttons */}
  </div>
</div>
```

Keep the existing outer wrapper:

```tsx
<div className="px-6 py-3 border-b border-rui-divider/60 bg-rui-surface shrink-0">
```

- [x] **Step 2: Build the left-side summary block**

Create a left summary card that contains:

```tsx
<div className="min-w-0 rounded-[24px] border border-rui-divider/50 bg-rui-surface-strong/45 p-4 xl:p-5">
  {/* badge row */}
  {/* top summary grid: status, smart thickness, level distribution */}
</div>
```

Inside that card:

- keep current point badge and warning badge
- render `判级中` as the dominant heading
- keep the plate number as a supporting blue label
- add a new `智能综合厚度` block showing a single large value `6`
- add a separate `智能级别分布` block showing `重1 20%` and `重2 70%` with compact progress bars

- [x] **Step 3: Move the three action buttons into the dedicated bottom row**

Replace the current wrapped button row with a fixed layout:

```tsx
<div className="grid gap-2.5 md:grid-cols-3">
  <button className="btn-pill ... w-full justify-center">...</button>
  <button className="btn-pill ... w-full justify-center">...</button>
  <button className="btn-pill ... w-full justify-center">...</button>
</div>
```

Preserve:

- button labels
- icons
- click handlers
- current semantic color treatment

- [x] **Step 4: Simplify the radar area into a lightweight card**

Replace the current radar section and its detail list with a compact card structure:

```tsx
<section className="min-w-0">
  <div className="relative h-full rounded-[24px] border border-rui-divider/50 bg-rui-surface-strong/45 p-4 xl:p-5">
    {/* title */}
    {/* top-right 146kg summary */}
    {/* fixed-size radar wrapper */}
  </div>
</section>
```

Preserve:

- `ResponsiveContainer`
- `RadarChart`
- `PolarGrid`
- `PolarAngleAxis`
- `Radar`

Remove:

- the right-side deduction summary text block
- the 6-item deduction list grid
- the large standalone `146kg` headline treatment

- [x] **Step 5: Make the radar labels lighter and chart-led**

Adjust the radar chart props to emphasize the chart itself:

```tsx
<RadarChart cx="50%" cy="52%" outerRadius="76%" data={DEDUCTION_DATA}>
  <PolarGrid stroke={CHART_COLORS.divider} />
  <PolarAngleAxis
    dataKey="name"
    tick={{ fill: CHART_COLORS.gray, fontSize: 10 }}
  />
  <Radar ... />
</RadarChart>
```

Keep only the angle labels around the chart. Do not render any extra explanatory paragraphs alongside it.

- [x] **Step 6: Run type-check after the layout refactor**

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
  - top-left status/thickness/level block
  - top-right lightweight radar card
  - bottom button row

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

- Spec coverage: the plan covers the approved top summary block, compact radar card, bottom action row, and Playwright self-check.
- Placeholder scan: no `TODO`/`TBD` placeholders remain.
- Type consistency: the plan only modifies `ComprehensiveResults` in `CenterDashboardRegion.tsx` and keeps existing callback/data contracts intact.

## Execution Handoff

User instruction `开始` is treated as approval to execute this plan inline in the current session.
