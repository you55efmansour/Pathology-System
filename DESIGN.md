---
name: "Histora"
description: "A compact plum-and-teal workspace for demonstration case preparation and reporting."
colors:
  teal: "#16675b"
  teal-hover: "#0f5349"
  teal-strong: "#12554b"
  teal-soft: "#e7f3ef"
  teal-tint: "#d7ebe4"
  plum: "#583652"
  plum-soft: "#f0eaf1"
  canvas: "#f7f6f8"
  paper: "#ffffff"
  ink: "#312834"
  text: "#625867"
  muted-text: "#706475"
  line: "#e5dfe7"
  control-border: "#e2dce4"
  surface-alt: "#f6f4f7"
  track: "#ebe6ed"
  field-border: "#cec4d1"
  field-hover: "#a396a8"
  placeholder: "#7b6f80"
  focus-outline: "#358474"
  field-focus: "#74ab9c"
  action-focus: "#66a396"
  danger: "#a83244"
  danger-hover: "#8f2335"
  field-error: "#a32f47"
  field-invalid: "#ac3d53"
  intake-ink: "#68596e"
  intake-soft: "#f0edf3"
  preparation-ink: "#805b24"
  preparation-soft: "#faf1df"
  draft-ink: "#74507c"
  draft-soft: "#f2eaf5"
  review-ink: "#96501c"
  review-soft: "#fcf0e3"
  approved-ink: "#176251"
  approved-soft: "#e8f4ec"
  finalized-ink: "#565f70"
  finalized-soft: "#edf0f5"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  heading:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "18px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 550
    lineHeight: 1.5
  detail:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.5
  report:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.9
  body-small:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  body-arabic:
    fontFamily: "Tahoma, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  badge: "5px"
  field: "6px"
  navigation: "8px"
  surface: "12px"
  dialog: "13px"
  pill: "9999px"
spacing:
  4: "4px"
  8: "8px"
  10: "10px"
  12: "12px"
  16: "16px"
  20: "20px"
  24: "24px"
  28: "28px"
  32: "32px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.teal-hover}"
  button-outlined:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "40px"
  button-outlined-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.ink}"
  button-ghost:
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.ink}"
  button-destructive:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
    height: "40px"
  button-destructive-hover:
    backgroundColor: "{colors.danger-hover}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.field}"
    padding: "0 12px"
    height: "41px"
  navigation-active:
    backgroundColor: "{colors.plum-soft}"
    textColor: "{colors.plum}"
    rounded: "{rounded.navigation}"
    padding: "10px 12px"
  status-approved:
    backgroundColor: "{colors.approved-soft}"
    textColor: "{colors.approved-ink}"
    rounded: "{rounded.badge}"
    padding: "5px 8px"
  workspace-surface:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.surface}"
  editor-surface:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.surface}"
    padding: "27px"
  workflow-active:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    height: "28px"
    width: "28px"
---

# Design System: Histora

## Overview

**Creative North Star: "The Case Workbench"**

The Case Workbench keeps attention on a case and the next available task. White work surfaces, a quiet warm canvas, plum identity and teal action cues form a compact operating workspace inherited from the Purchase application.

The visual character is restrained and practical: system typography, clear borders, readable tables, persistent navigation and contextual controls. Depth and motion indicate interaction state. English and Arabic share the same spatial system through logical properties and direction-aware controls.

**Key Characteristics:**
- Compact sidebar, header and table workspace.
- Plum identity with teal action and progress cues.
- Flat white surfaces, fine borders and gently curved corners.
- Text and icons reinforce status; keyboard focus remains visible.
- Responsive stacking, contained table scrolling and reduced-motion support.

## Colors

The palette combines muted plum identity, deep teal action cues and warm, lightly tinted neutral surfaces. The frontmatter is the normative value source. Sidecar tonal ramps are synthesized previews, not additional application tokens.

### Primary

- **Working Teal** (`teal`): primary actions, active workflow circles, selected status tabs and form caret. Its hover, strong, soft and tint companions support interactive states.
- **Identity Plum** (`plum`): brand, case links, navigation emphasis and completed-step iconography. Soft Plum supports active navigation and completed steps.

### Secondary

- **Workflow States**: intake uses muted plum-gray; preparation uses ochre; draft uses violet; review uses amber; approved uses green; finalized uses slate. Each ink/soft pair is used by the shared status badge, rather than encoding meaning through color alone.
- **Danger**: destructive actions use the danger pair. Field validation has its own invalid border and readable error text.

### Neutral

- **Warm Canvas** (`canvas`): the application background.
- **White Paper** (`paper`): sidebar, header, forms, worklist and report surfaces.
- **Ink**, **Text** and **Muted Text**: principal content, supporting copy and secondary metadata respectively.
- **Line**: workspace borders and dividers. **Control Border** belongs to outlined shared buttons; **Field Border** belongs to text fields.
- **Surface Alt** and **Track**: neutral action hover and secondary fills.
- **Focus Outline**, **Field Focus** and **Action Focus**: the global outline, field outline and shared button focus ring. Their distinct values are retained from the shipped controls.

### Named Rules

**The Identity and Action Rule.** Use plum for identity and case emphasis; use teal for primary actions, active workflow steps and selected filters.

**The Text with State Rule.** Pair every workflow status color with its translated status label and an icon.

## Typography

**Display Font:** No separate display face; headings use the system stack.
**Body Font:** The platform system stack, with Segoe UI and sans-serif fallbacks.
**Label/Mono Font:** Labels use the same stack. Dates and identifiers use tabular numerals where implemented; there is no separate monospace role.
**Arabic Font:** Tahoma, Arial, sans-serif on Arabic content.

**Character:** Compact, familiar and work-oriented. Hierarchy comes from size, weight and spacing rather than decorative typefaces.

### Hierarchy

- **Headline**: page headings; mobile headings reduce in context.
- **Heading**: section headings.
- **Title**: smaller section titles.
- **Body**: workspace copy, with paragraph leading expanded to (1.65).
- **Label**: form labels. **Body Small**: table content and field text. Shared button text inherits the workspace font with medium weight.
- **Detail**: recurring table metadata and supporting control copy.
- **Report**: editable report text has a more spacious reading rhythm. The read-only document uses (12px) with (1.9) leading and a maximum width of (74ch); print uses (11pt) and (1.8) leading.

Sizes, weights and line heights are defined in the frontmatter. The root stays at (16px); its rem-based shared button sizes therefore resolve correctly. Fields and report text become (16px) at the narrow-screen breakpoint to preserve mobile usability. The smaller incidental footer, attachment-caption and auxiliary timestamps are not a reusable type scale.

### Named Rules

**The Shared Scale Rule.** Keep the root at 16px and the workspace body at 13px. Size shared controls through their component variants and retain the 16px mobile field override.

## Layout

A fixed sidebar (232px) and sticky header (69px) frame the desktop workspace. The content region has a maximum width of (1800px), with desktop inset (32px) and vertical inset (31px / 36px). The collapsed sidebar is (78px). A (1200px) breakpoint reduces the sidebar to (212px) and content inset to (24px); wide screens at (1600px) increase inline content inset to (44px).

The case form pairs a flexible main area with a contextual summary (228px) across a (28px) gap. At (1050px), the summary moves below the main area. At (800px), navigation becomes a focus-managed drawer (275px), the header becomes (62px), and the content fills the viewport. At (580px), form columns stack, headings and actions wrap, and content inset becomes (16px).

The worklist uses status tabs, a search/filter toolbar and a six-row paginated table. Its minimum table width is (850px); horizontal overflow stays in a named, keyboard-focusable table region. Cells use comfortable vertical padding (16px), increasing at wide screens. This is a table-first work surface rather than a collection of elevated panels.

Spacing follows the reused frontmatter steps, with contextual intermediate values retained in the source. Shared controls use (8px) icon gaps. Form fields use (8px) label gaps and form grids use (20px) gaps. Logical inline/block properties preserve the same hierarchy in both reading directions.

## Elevation & Depth

Workspace panels are flat at rest, separated by fine borders and warm neutral layers. Filled action buttons have a restrained colored shadow; dialogs use the largest soft shadow over a translucent plum-black overlay. Outlined and ghost buttons remain flat.

### Shadow Vocabulary

- **Primary action**: a small teal-tinted shadow under filled actions.
- **Destructive action**: the same small shadow silhouette, tinted with danger.
- **Dialog**: a broad soft shadow behind the modal surface, with a dark translucent scrim.

Exact shadow values live in the sidecar because they do not fit the frontmatter component schema. Buttons transition over (200ms); navigation and field states over (150ms). Dialogs settle from (10px) above into place over (210ms), using the existing emphasized easing. Reduced-motion preference collapses animation and transition duration.

### Named Rules

**The Flat Surface Rule.** Keep resting work surfaces flat and separated by borders. Reserve soft elevation for action buttons and dialogs.

## Shapes

Work surfaces use gently curved corners; shared actions use full pills. Inputs are tighter and more rectangular, navigation is softly rounded, and status badges use compact corners. The frontmatter names these recurring radii. Dialogs retain their own shared radius, and workflow step numbers use circles. Borders are generally (1px). The upload target alone uses a dashed boundary to signal its drop interaction.

Iconography is Lucide SVG with consistent strokes; icons accompany text or have accessible names. The brand mark and favicon use simple geometric SVG. No decorative bitmap asset is required by the shipped system.

## Components

### Buttons

Compact pill actions communicate priority through fill.

- **Shape:** fully rounded; shared default height (40px), horizontal padding (24px), vertical padding (8px), and icon gap (8px). Small and large variants are (32px) and (48px) high.
- **Primary:** teal with white text, a soft teal shadow and a darker hover fill.
- **Outlined:** white with a neutral border and supporting text; hover adds the alternate surface and principal ink.
- **Ghost:** transparent with supporting text; hover adds the alternate surface.
- **Destructive:** danger fill with white text and darker hover fill, used by confirmation actions.
- **Focus / Disabled:** a (2px) action focus ring with a (2px) white offset; shared disabled actions stop pointer events and use (0.4) opacity.
- **Context:** form actions reduce inline padding to (16px); mobile page-heading actions use (37px) height. These are contextual adjustments, not a new global button scale.

### Chips

Compact status labels combine a tinted fill, an icon and translated text. Padding is (5px / 8px), type is (11px), weight is (550) and leading is (1.3). The six status ink/fill pairs are defined in frontmatter. Finalized uses a lock and approved uses a check.

### Cards / Containers

White worklist and editor surfaces use the shared surface radius, fine Line borders and no resting shadow. Editor padding is (27px), reducing to (23px) and then (22px / 17px) at narrower layouts. The worklist keeps toolbar, tabs, table and pagination in one bordered container with internal dividers.

### Inputs / Fields

White fields use the Field radius, a (1px) Field Border, height (41px) and inline padding (12px). Hover strengthens the border; focus changes it to teal and adds the Field Focus outline (2px) with offset (2px). Invalid fields use the invalid border and an adjacent error message. Search uses the same shared input with a leading SVG, compact contextual height (37px) and room for a clear action.

The report textarea keeps the same field language with expanded leading, internal padding (16px) and vertical resize. Disabled normal-template content remains fully opaque on a muted surface.

### Navigation

Sidebar links have a minimum height of (44px), (10px / 12px) padding and medium-weight body type. Active navigation uses Soft Plum, Plum and stronger weight; hover uses a light plum-neutral surface. Counts remain compact, separate from the label. The collapsed desktop sidebar retains icons; mobile uses the shared Radix dialog drawer and returns focus on dismissal.

### Case Table

Case links are plum and gain underlines on hover. Secondary identifiers sit beneath primary cell text. Dates use tabular figures. Rows use subtle horizontal dividers and a pale hover fill. Sortable header buttons expose their current direction through an arrow, teal emphasis and `aria-sort` on the header. Pagination keeps text and disabled previous/next controls visible.

### Connected Workflow Rail

Four connected steps retain the case context as the user moves through the workspace. Current steps use a filled teal circle and underline; completed steps use a plum-tinted circle and check. The current step has `aria-current="step"`. Unavailable steps render without links, and finalized cases retain the completed rail while editing actions disappear.

### Dialogs and Final Document

Dialogs use Radix title/description semantics, managed focus, an accessible close control and the single settling motion described above. Confirmation actions preserve the same primary, outlined or destructive button hierarchy.

The final document is a white bordered reading surface in the workspace. Print removes workspace navigation, controls, border and rounding; it uses A4 with margins (16mm / 14mm), preserves readable report text and keeps image proportions. Only finalized documents are printable through this surface. Demonstration labels remain explicit.

## Do's and Don'ts

### Do:

- Do reuse the shared pill buttons, bordered inputs and flat white surfaces.
- Do keep plum identity and teal action roles consistent.
- Do pair status color with text and an icon, and expose active sort and workflow state semantically.
- Do preserve logical spacing, bidirectional identifiers and Arabic font fallbacks.
- Do contain table overflow and stack form fields on narrow screens.
- Do retain visible focus, focus-managed dialogs and reduced-motion handling.

### Don't:

- Don't use color alone to communicate status or the current task.
- Don't apply dialog or action-button shadows to every workspace panel.
- Don't replace compact operational controls with oversized promotional styling.
- Don't treat the existing tiny footer and ancillary metadata text as a reusable typography scale.
- Don't add diagnostic or authorization meaning to demonstration labels, templates or status treatments.
