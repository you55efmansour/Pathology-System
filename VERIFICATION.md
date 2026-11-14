# Verification record

## Final-report PDF viewer — 14 November 2026

- ESLint, all 15 unit tests and the Vite production build passed.
- All eight Chromium browser journeys passed. The three PDF-viewer journeys passed again after the final capture-spacing and resize fixes.
- Verified actual multi-page PDF download, page navigation, zoom, fit-to-width, matching page counts, retained browser printing and readable print content.
- Verified mobile Arabic rendering, language switching, reload, route cleanup and no outer overflow at 390px.
- A missing selected image blocks download with an actionable error. Retry succeeds when the image becomes available; the test checks its color in the rendered PDF pixels.
- Production preview loaded the bundled PDF worker and downloaded the report with no browser errors.
- Desktop and Arabic mobile captures were inspected. The finish review requested a footer capture fix; its verdict pass scored that fix resolved and returned `ship`. Confirmed captures: `.impeccable/review/desktop-confirmed.png` and `.impeccable/review/mobile-fixed.png`.
- The viewer preserves the last rendered page while resizing or changing zoom. Initial loading, failure and retry states remain available.
- The design detector reported no primary findings; incumbent CSS token advisories remain. Documentation review confirmed the existing system is inherited; PRODUCT.md, DESIGN.md and `.impeccable/design.json` are unchanged.

The preview and direct download use the same locally generated image-based A4 PDF. Text selection/search is available through the retained browser print output rather than the direct download. PDF generation and viewing are lazy-loaded on finalized reports; their compatibility bundle and worker add approximately 320 kB gzip and 1.3 MB uncompressed respectively. The build retains chunk-size and upstream Zod comment advisories.

## Original workflow

Verified on 11 November 2026 (Africa/Cairo).

| Check | Result |
| --- | --- |
| ESLint | Passed, no warnings or errors |
| Jest service and localization tests | 15 passed |
| Playwright browser journeys | 5 passed, Chromium |
| Vite production build | Passed |
| Production preview smoke check | HTTP 200; case table, intake form and finalized export action loaded with no JavaScript errors |
| Desktop captures | Worklist, editor and final document at 1440px |
| Mobile captures | Worklist, editor and final document at 390px; Arabic worklist at 320px |
| Document overflow | No outer overflow in the inspected viewports; wide tables scroll within their own region |
| Normal report PDF | Generated; selected image included and unselected image excluded from the print frame |
| Custom report PDF | Generated; multiple PDF pages asserted |
| Arabic localization | Translation key coverage, localized templates, example records, numbers, file sizes and notifications passed |
| Arabic editing and print | Generated text follows language changes; authored text survives switching and reload; Arabic print frame retains RTL and language |
| GitHub Pages build | Passed under `/Pathology-System/`; repository asset paths, hash routes, Arabic intake/templates, saved-report reload, mobile navigation and direct-route reload verified without browser errors |

The service tests cover both report types, persisted drafts, review/approval transition restrictions, immutable finalized records, missing selected images, rejected image files, corrupt data recovery, failed local-storage writes and nonclinical template substitution.

The browser journeys cover intake validation, incomplete drafts, image persistence after reload, preview sources, selected attachments, image removal confirmation, both report editors, unsaved-change protection, return for edits, resubmission, simulated approval, finalization, direct editor-route restrictions, final print content, actual PDF rendering, search, exact status filters, visible/accessibility sorting state, empty results, mobile navigation, persisted Arabic RTL and reset cancellation.

Screenshots are under `.impeccable/review/`; current Arabic desktop/mobile screenshots and generated PDFs are under `test-results/` after `npm run test:e2e`. These test outputs are demonstration artifacts.

Arabic verification also covers existing English demonstration records without rewriting browser storage, Arabic search, mirrored navigation arrows, the mobile drawer opening on the right, translated template previews and report branding, required-field errors, persisted generated Arabic text, and a complete intake → review → finalization → print journey. Desktop and mobile captures were visually inspected. User-entered patient/specimen values, identifiers, filenames and edited report text are preserved.

Impeccable's finish reviewer scored the three requested final fixes resolved: reference-sized shared controls, persistent mobile Demo labeling, and visible/accessible sort direction. Its verdict was `ship` for that fix list. The single design-detector run reported a sidebar width transition; that transition was removed. No second detector run was performed.

The build emits upstream Zod purity-comment advisories and a main JavaScript chunk-size advisory (532.30 kB minified, 164.68 kB gzip). These do not fail the build. Runtime verification used the actual browser workflow, not only compilation.

Clinical wording, real authorization, signatures, backend durability, multiuser conflict handling and compliance remain outside the frontend demonstration. See README.md for assumptions and integration boundaries.
