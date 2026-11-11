# Histora · Pathology Reporting MVP

A frontend-only, interactive pathology reporting prototype created in `26/pathology-frontend`, as requested. It follows the architecture and UI patterns of `25/sotaTech/Purchase/frontend`. The Purchase source remains unchanged.

## Run

Requires Node.js 20.19+ (or a supported newer LTS).

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:4175**. For production: `npm run build`, then `npm run preview`. A static host must rewrite application routes to `index.html`.

## GitHub Pages

The client demo is published at **https://you55efmansour.github.io/Pathology-System/**.

The workflow in `.github/workflows/pages.yml` checks and builds every push to `main`, then publishes the result to GitHub Pages. Pages uses the **GitHub Actions** publishing source. The build uses Pages' repository base path and hash-based routes so links and page refreshes work on static hosting. Local development retains browser-based routes.

## Included

- Searchable, sortable, paginated case list with status filters, review queue and finalized reports.
- New and existing case intake, required-field validation and incomplete drafts.
- Browser-native multiple-image upload, drag-and-drop, preview, removal confirmation and per-image report inclusion.
- Normal path that populates a clearly labeled nonclinical template; Custom path with manual report entry.
- Shared editor, draft persistence and warnings before leaving unsaved edits.
- Review → return for edits → resubmit → simulated approval → confirmed finalization.
- Finalized records are read-only in both the UI and service mutation methods. Direct editor URLs redirect to their final view.
- A4 browser printing / Save as PDF, gated on finalization and image availability, with patient/specimen metadata, report text, selected images, status and clearly labeled simulated approval information.
- English and Arabic controls with RTL layout, mobile navigation, keyboard focus and reduced-motion support.
- Eight fictional sample cases covering every workflow state. No real patient data or clinical findings.

## Architecture and created files

The feature decomposition follows Purchase's `pages / components / hooks / services` convention, its `src/app` entry, shared theme and i18n, centralized MobX stores, and `@/` imports.

```text
src/
  app/                 index.jsx, App.jsx, AppLayout.jsx, routes.jsx
  components/ui/       button, input, textarea, field, dialog, confirm-dialog, brand
  features/
    cases/
      components/      CaseTable, StatusBadge, SlideImage
      config/          caseConfig.js (fields, schemas, states, navigation)
      data/            demoCases.js
      hooks/           useCaseAction.js, useImageUrl.js
      pages/           CaseListPage, CaseWorkspace, IntakePage, SlidesPage
      services/        caseService.js and service tests
    reports/
      components/      ReportDocument.jsx
      config/          reportTemplates.js
      pages/           ReportEditorPage, ReviewPage, TemplatesPage
    shared/
      components/      WorkspaceState.jsx
      pages/           WorkspacePage.jsx
      theme/           appPalette.js
      i18n.js
  hooks/               useUnsavedChanges.jsx
  lib/                 utils.js, format.js
  services/            imageRepository.js
  stores/              CaseStore.js
  styles/              index.css
tests/                 workflow.spec.js
public/                favicon.svg
```

Also created: Vite, Tailwind, PostCSS, ESLint, Babel, Jest and Playwright configuration; `package.json` and lockfile; `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json` and the surface brief under `.agents/`.

`button.jsx`, `textarea.jsx`, and `lib/utils.js` are reused directly from Purchase. Input and dialog primitives keep its patterns while removing dependencies on purchasing-specific localization and date hooks. Relevant dependencies retain the reference framework families: React 19 + JSX, Vite, Tailwind 3, Radix, MobX, React Hook Form + Zod, TanStack Table, React Router, i18next, Lucide, Sonner and react-to-print. Unrelated purchasing dependencies and backend integrations are omitted.

## Mock data and persistence

Components call the feature hook → `CaseStore` → the async `caseService` interface. Screens never write directly to mock data or browser storage. The service owns validation, generated identifiers and valid workflow transitions.

- Case records and text drafts: `localStorage`, key `histora:cases:v1`, versioned and schema-checked.
- Images: original `File`/`Blob` objects in the `histora-images-v1` IndexedDB database. Case records store only metadata and inclusion flags. Object URLs are created for previews and revoked when an image is removed.
- If IndexedDB is unavailable, uploads remain in an in-memory session store and a visible warning explains that they will not survive closing/reloading the page. Missing selected images block finalization and export.
- Local-storage failures are reported without claiming that a save succeeded. Corrupt records are not silently replaced. An explicit confirmed reset is available under **About this workspace**.
- Data is local to the browser profile and origin. Clearing browser data removes it. This is not multiuser storage; simultaneous tabs have no conflict resolution.

Image limits: PNG/JPEG/WebP, 8 MB per image, 12 per case. Images must decode successfully. No file is uploaded to a server. No API requests, backend, external database, remote fonts or patient services are used.

## Assumptions where clinical Specs are missing

The supplied document describes a workflow, but contains no separate clinical schema, report section definitions or approved Normal-report wording. This implementation therefore uses only:

- Required patient name and patient ID.
- Required specimen type, with optional specimen identifier.
- One generic **Report text** section for both paths.

These fields are provisional demonstration choices, not asserted clinical requirements. No age, sex, diagnosis, clinical findings, gross/microscopic sections or signatures are invented. The Normal template contains a nonclinical explanation and populates patient/specimen values; it performs no diagnosis. Replace the schema and templates with your laboratory-approved Specs before any clinical use.

All approvals, activity entries and timestamps are frontend demonstrations. There is no authentication, real authorization, electronic signature or audit-compliance implementation. Finalization has no reopen action. A user who edits browser storage manually is outside this prototype's protection model.

The executed checks and verification artifacts are recorded in [VERIFICATION.md](VERIFICATION.md).

## Verify

```sh
npm run lint
npm test
npm run build
```

For end-to-end tests, install Playwright's browser if it is not already cached:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright starts or reuses the local server at port 4175. The tests cover both complete report paths, intake/report validation, incomplete drafts, persisted image selection and previews, image removal, return-to-edit, unsaved-change protection, simulated approval, finalization restrictions, print iframe content, an actual generated sample PDF, search/filter/empty states, Arabic RTL, mobile navigation and reset confirmation. Service tests additionally exercise corrupt storage, quota failures, image validation, missing attachments, persistence, transition rules and immutable finalized records.

Manual walkthrough:

1. **New case** → fill patient name/ID and specimen type → **Save & continue**.
2. Add images, preview them, and choose which belong in the report → **Continue to report**.
3. Choose **Normal** to populate the demonstration template, or **Custom** for blank text. Edit and **Save draft**; reload to verify persistence.
4. **Save & send for review** → **Return for edits** → revise → resubmit.
5. **Approve report** → confirm simulation → **Finalize report** → confirm locking.
6. **Print / Save as PDF** → select your browser's PDF destination. Verify only selected images appear.

## Connecting a backend later

Replace the exported `caseService` implementation with an API adapter exposing the same async methods (`list`, `saveIntake`, `addImages`, `removeImage`, `selectImage`, `saveReport`, `returnToDraft`, `approve`, `finalize`, `canExport`). Replace `imageRepository` with authenticated blob access. `CaseStore`, feature hooks and screens can retain their interface.

The real backend must own identifiers, schema validation, version/conflict handling, immutable finalization, authorization, storage, audit requirements and export eligibility. Browser-only checks are demonstration behavior, not a security boundary.
