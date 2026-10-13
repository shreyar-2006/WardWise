# WardWise

WardWise is a small community issue reporting and tracking prototype for a college Community Engagement Project. It lets visitors record local concerns, browse reports, and follow status history. It is not an official municipal service.

## Technology

- React, TypeScript, and Vite
- Tailwind CSS (Vite plugin) with a small editorial design system
- React Router, Lucide React, and Radix Alert Dialog primitives
- Browser `localStorage`; no server, account system, or external API

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```sh
npm run build
```

Preview the production build with `npm run preview`.

## Architecture

- `src/types.ts` defines the shared report, category, status, and history types.
- `src/data/samples.ts` is the original fictional demonstration dataset.
- `src/context/ReportsContext.tsx` owns the single report list, initialization, updates, and versioned persistence (`wardwise.reports.v1`).
- `src/pages/` contains the overview, report submission, report management, and report detail route.
- `src/components/` contains shared layout, report rows, status markers, and a Radix-based accessible confirmation dialog.
- `src/utils/reports.ts` contains report validation helpers, counts, ID generation, and date formatting.

The first visit seeds eight fictional examples. Creating or clearing reports writes a valid JSON list to local storage; clearing writes an empty list, so sample data does not reappear on refresh. Storage errors are surfaced in the interface and failed writes do not report success.

## Local storage limitations

Data stays in this browser profile on this device. It is not sent to municipal authorities, synchronized to other devices, backed up, or protected by authentication. Anyone who can open the management page can change report statuses. Clearing browser data removes the saved reports.

## Manual testing

1. On `/`, review the sample totals, search by title/location, combine category and status filters, and reset filters.
2. Submit a valid issue at `/reports/new`; open its confirmation link and verify the generated reference and pending history.
3. Open `/admin`, change a status, and inspect the detail history and overview counts.
4. Refresh and verify the new report and status remain.
5. Use **Clear all reports**, confirm the dialog, refresh to verify the empty state persists, then restore the original sample set.
6. Open an unknown `/reports/:id` route and verify the not-found state.
7. Check the layout at mobile, tablet, and desktop viewport widths.
