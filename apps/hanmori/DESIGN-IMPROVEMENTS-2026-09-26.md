# Hanmori design improvements

Implemented from the 25 September Impeccable audit, preserving the paper, green ink, Korean typography, and illustrated books.

## Changes

- Darker secondary text, source attribution, and reading-type numbers. Shared semantic colors now cover focus, supporting text, success, and error states.
- Native modal mobile navigation protects keyboard focus, closes with Escape, restores focus, and closes when switching to desktop. Nested TOPIK and notebook routes retain their parent navigation highlight.
- Reading controls and answer choices have a minimum 44px target. Mobile reading has a persistent passage/answer switch; both views remain mounted to retain answers and passage state. Restored submissions open the results view.
- A native mobile category selector replaces the nested scrolling list. Listening and writing remain explicitly labeled as upcoming. Narrow exercise headings have room to wrap naturally.
- Corpus-independent learning utilities are separate from vocabulary initialization. The shared provider downloads the corpus after hydration, validates stored data before writing, and prevents edits before restoration finishes. Existing storage format and migration behavior are preserved.
- Progress indicators animate with transforms instead of layout-changing widths; the existing reduced-motion override remains in place.

## Verification

Final application build: successful, 89 static pages generated. TypeScript validation passed during the build.

| Check | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Hanmori unit/integration tests, including database, reading, storage, navigation and contrast | 92 | 0 | 0 |
| Shared engine tests | 14 | 0 | 0 |
| Built-server HTTP smoke: 143 exercises, 143 graded submissions, 178 image checksums, 7 other routes | 471 | 0 | 0 |

Reproduce the smoke check with `node apps/hanmori/scripts/smoke.mjs` while the built server runs on port 3100, or pass an explicit deployment URL. Two earlier Python-client runs stopped on connection resets during image transfers; the completed Node-client run above checks every image against the source checksum without retries.

Browser verification used the built application: desktop and mobile layouts, 320/390/768/1366px widths, mobile category changes, keyboard focus containment/Escape/return, active parent navigation, passage/answer switching, zoom without page overflow, four selected answers, submission with explanations, result restoration after reload, preserved personal notes, and a personal flashcard session/flip. Final browser error log was empty. The first visual pass found narrow heading and upcoming-skill wrapping issues; one corrective batch and one confirmation pass resolved them.

The initial script set on `/topik` decreased from 910,485 to 687,237 raw bytes, and from 263,665 to 211,204 gzip bytes (19.9% compressed reduction). This measures initial script assets, not total session downloads or field Core Web Vitals; vocabulary still downloads separately after hydration.

Impeccable's final detector scan reported three retained warnings: two intentional illustrated book-spine stripes and one actual quotation border. The width-animation warning is resolved. Critical/required code-review findings: none remaining.

## Limits

No physical-device touch test, assistive-screen-reader certification, Safari/Firefox matrix, Lighthouse run, or field performance measurement was performed. These checks do not establish complete WCAG conformance or absolute perfection. Artwork pigments remain intentional literal colors; this is a focused semantic-token improvement rather than a wholesale palette rewrite. Learning data remains device-local as before.
