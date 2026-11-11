# Histora

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
The user explicitly requested the architecture and technologies of `25/sotaTech/Purchase/frontend`: React 19, JavaScript/JSX, Vite, Tailwind 3, Radix/shadcn-style primitives, React Router, MobX, React Hook Form, Zod, Lucide, i18next, Sonner, and react-to-print. Dependencies are the relevant subset of that project, not a new framework.

## Users
Assumption from the supplied brief: laboratory staff preparing and reviewing demonstration pathology reports, primarily on desktop.

## Product Purpose
Demonstrate the complete case intake → slide upload → Normal or Custom report → review → simulated approval → finalization → browser PDF workflow.

## Capabilities and Constraints
Frontend only; no API, external database, real authorization, signatures or compliance claims. Locally saved demonstration data. Finalized reports are immutable through the service and UI. No real patient data. Arabic and English navigation and controls.

## Brand Commitments
Preserve Purchase's feature folders, sidebar/header workspace, clear tables, compact shared form controls and responsive behavior. The user authorized a pathology-appropriate replacement palette and UI improvements with Impeccable. Histora is a provisional prototype name.

## Evidence on Hand
The attached MVP task is the only supplied specification. No separate patient schema, laboratory report sections, or approved normal templates were supplied. The user confirmed `26/pathology-frontend` as the target. The reference app is read-only source material.

## Open Decisions and Assumptions
Patient name and patient ID, specimen type and optional specimen identifier are the minimum intake demonstration fields. A single Report text section is used until an exact clinical schema is supplied. The Normal template contains explicitly nonclinical demonstration text. These fields and templates are not asserted to be laboratory specifications.

## Product Principles
Keep the next task clear. Preserve draft work. Show status in text as well as color. Never imply a template is a diagnosis or a simulated approval is real authorization.
