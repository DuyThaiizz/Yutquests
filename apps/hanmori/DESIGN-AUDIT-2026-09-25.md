# Hanmori — Impeccable design audit

Date: 25 September 2026. Website: https://hanmori.vercel.app/
Scope: technical design audit of the existing Hanmori interface, not a redesign. No application files or deployments changed.

## Implementation integrity verdict

**Pass, with usability gaps.** The paper background, ink-green navigation, Korean typography, hanok illustration, book imagery and source attribution form a coherent Korean-learning identity. Preserve this identity. The main problems are accessibility and task ergonomics, not lack of decoration.

Impeccable v4.4.0 context and detector ran successfully. The detector returned four warnings: one width transition and three accent-border warnings. The book-spine stripes are intentional depictions of books, and the left border belongs to an actual quotation. These three warnings are false positives for this product, not three additional defects. The progress-width transition is real but low severity; no dropped frames were measured.

## Audit health score

These are scoped reviewer ratings using the skill's rubric, not Lighthouse scores or a WCAG conformance certification.

| Dimension | Score / 4 | Evidence |
| --- | ---: | --- |
| Accessibility | 2 | Proper labels and focus styles exist, but secondary text misses AA contrast and the mobile drawer leaves focus behind it. |
| Performance | 3 | WebP assets, local fonts and pagination are present; the shared client provider eagerly initializes the vocabulary corpus. |
| Responsive design | 2 | Tested narrow pages fit; key controls are small and reading/answering requires moving between separate scroll areas. |
| Theming | 2 | Base tokens exist, but many component colors bypass them. Light-only design; no promised dark mode treated as missing functionality. |
| Implementation integrity | 3 | Consistent product identity and honest source labels; active navigation loses context on nested learning routes. |
| **Total** | **12 / 20** | **Acceptable — significant targeted work needed** |

**Eight findings: P0 0, P1 2, P2 5, P3 1.** Fix contrast and drawer behavior first, then touch controls and reading ergonomics.

## Findings, in priority order

### 1. [P1] Secondary text falls below AA contrast

- Category: Accessibility.
- Locations: `src/app/globals.css:5` (`--muted`); `globals.css:2656` (`.source-tag`); `src/app/reading.css:79` (type numbers).
- Evidence: live computed colors on the reading page match the source styles. `#72776c` on the paper `#fbf9f4` is **4.37:1**; source labels `#7d8172` on paper are **3.80:1**. Both appear as normal-size text, including 10–12 px instructions and source metadata. Unselected type numbers `#998866` on paper are **3.29:1** and reduce to 19 px on narrow screens.
- Impact: instructions, attribution and secondary information are harder to read for low-vision users. Small typography compounds the contrast problem.
- Standard: WCAG 1.4.3 Contrast (Minimum), AA, requires 4.5:1 for normal text. Large decorative headings are not counted using this normal-text threshold.
- Recommendation: darken the shared muted-text token and add a tested secondary/source-text token. Recheck each real surface instead of changing only one label. Increase metadata sizing where it is needed to complete a task.
- Suggested command: `$impeccable harden`, followed by `$impeccable typeset`.

### 2. [P1] Mobile drawer leaves keyboard focus behind the overlay

- Category: Accessibility.
- Location: `src/components/Shell.tsx:34`, menu trigger at line 120 and conditional overlay at line 109.
- Reproduction at 390 × 844: open “Mở menu”; focus stays on that trigger. Press Escape: `aria-expanded` remains `true`. Press Tab: focus moves to “Bản trải nghiệm”, outside the sidebar and behind the menu overlay.
- Impact: keyboard users can interact with visually obscured content and must navigate backwards to reach the newly opened menu. The menu looks modal but does not behave that way.
- Standard: focus-order and visible-focus concerns under WCAG 2.4.3 and 2.4.11; exact occlusion coverage was not exhaustively certified. Escape dismissal is an expected modal interaction rather than an independent blanket WCAG requirement.
- Recommendation: make the drawer a dialog with a label, move focus inside on opening, keep background content inert while open, close on Escape, and restore focus to the trigger. Keep desktop navigation semantics intact.
- Suggested command: `$impeccable harden`.

### 3. [P2] Reading tools and mobile header controls have small hit areas

- Category: Responsive design / Accessibility.
- Locations: `src/components/ReadingExercise.tsx:155` (toolbar), `src/app/reading.css:614`, `src/components/Shell.tsx:120`.
- Live measurements at 390 px: “Phóng to” and “Bản chữ nhận dạng” are about **20 px high**, page selection about **36 px**, and the menu trigger **38 × 38 px**. The submission button is about 45 px high and is a positive counterexample.
- Impact: frequently used reading controls demand precise taps, especially while navigating a dense scanned page.
- Standard: 44 × 44 px is the enhanced WCAG target-size criterion (2.5.5, AAA) and the skill's touch target guideline. These measurements alone do not prove an AA 2.5.8 violation because spacing exceptions must also be evaluated.
- Recommendation: expand the actual button hit areas to at least 44 px high; preserve compact icons and typography inside. Check adjacent controls and wrapping together.
- Suggested command: `$impeccable adapt`.

### 4. [P2] Phone reading separates the passage from the answer controls

- Category: Responsive design / Implementation integrity.
- Locations: `src/app/reading.css:515` (single-column workspace), `reading.css:536` (type scroller), `reading.css:571` (70vh paper viewport).
- Evidence: at 390 × 844 the zoomed sheet is 1100 px wide within a 343 px inner scrolling area. The answer panel begins around y=1072, below the initial viewport. The type picker also uses a separate 310 px scrolling region. Outer-page overflow is correctly contained.
- Impact: users read in one scroll area, move down to answer, and return to find the relevant sentence. This is especially cumbersome with zoom. This is a workflow friction finding, not a broken-touch-gesture claim.
- Recommendation: offer an accessible compact question navigator and answer tray, or a deliberate “Đề bài / Trả lời” switch that preserves page/scroll position. Keep the original source image and text mode available. Avoid covering the passage with an always-open panel.
- Suggested command: `$impeccable adapt`.

### 5. [P2] Shared client initialization includes the full vocabulary corpus

- Category: Performance.
- Locations: `src/app/layout.tsx:33`, `src/components/StudyProvider.tsx:43`, `src/lib/learning.ts:3`, `src/lib/catalog.ts:2`, `src/lib/source-catalog.ts:1`.
- Evidence: the provider wraps every route; its initial state imports and constructs the vocabulary seed. The existing local build contains a vocabulary-bearing chunk of **230,800 bytes uncompressed**, about **55,961 bytes gzip**. This is a local build measurement, not a live transferred-byte or Core Web Vitals result.
- Impact: reading-only visitors still pay for parsing and initializing a vocabulary dataset unrelated to opening their first passage. The corpus is currently moderate; this becomes more expensive as learning material grows.
- Recommendation: separate lightweight profile/progress state from course content, load relevant vocabulary groups when needed, and preserve personal notes independently. Measure cold-start behavior on a throttled mobile profile before and after; do not add memoization indiscriminately.
- Suggested command: `$impeccable optimize`.

### 6. [P2] Component colors bypass the shared theme tokens

- Category: Theming.
- Locations: `src/app/globals.css:1`, `src/app/reading.css:14`, `reading.css:344`, and book/source styles in `globals.css:2443` onward.
- Evidence: source scan found **197 hex-color occurrences (186 distinct) in globals.css**, plus **30 occurrences (30 distinct) in reading.css**. The application does have base tokens for paper, ink, muted text, line, green and gold. Literal counts include intentional illustrations; they are not 227 separate defects.
- Impact: contrast repairs and surface changes cannot reliably propagate through all views. Similar semantic roles use separate hard-coded colors.
- Recommendation: consolidate semantic text, border, panel, success and error colors into tokens; leave genuinely illustrative book/hero colors local. Document the light palette before considering an optional dark theme.
- Suggested command: `$impeccable extract`.

### 7. [P2] Nested learning routes lose their active navigation context

- Category: Implementation integrity / Accessibility.
- Location: `src/components/Shell.tsx:61`.
- Evidence: active styling and `aria-current` use exact `pathname === href`. `/topik`, `/topik/reading/...` and `/notebook/unknown` do not match their parent navigation entries. On the live TOPIK page, no parent navigation item is marked current; `/library` does show its active item correctly.
- Impact: users lose the visual indication of which part of the learning system they are in, and assistive navigation loses that orientation cue.
- Recommendation: define route groups for the library/TOPIK and notebook subroutes. Use an appropriate current-location indication without claiming the parent URL is the exact current page. Keep the existing back links.
- Suggested command: `$impeccable harden`.

### 8. [P3] Progress fill animates layout width

- Category: Performance.
- Location: `src/app/globals.css:743`.
- Evidence: Impeccable detector correctly identified `transition: width 0.3s` on `.progress-track > span`.
- Impact: width animation incurs layout work. This isolated short progress animation was not observed to cause visible jank; it is not a release blocker.
- Recommendation: if this component is revised, use a fixed-size fill with left-origin `transform: scaleX(...)` and keep progress semantics. Do not spend a separate optimization cycle on this alone.
- Suggested command: `$impeccable animate`.

## Positive findings and caveats

- The visual language is product-specific and consistent across the desktop home and library.
- Clear source attribution and warnings distinguish scanned originals, OCR and authored explanations.
- Native labeled inputs, radio groups/legends, a skip link and focus styling are present.
- Review and notebook empty states explain a useful next action; the notebook has a labeled search and deck-name field.
- Original pages use WebP and explicit dimensions; zoom remains inside the reading container rather than expanding the whole mobile page.
- Vocabulary is paginated; fonts are local rather than fetched from third-party font services.
- Reduced motion disables smooth scrolling and animations. Its global `none` override is blunt, but no lost state feedback was demonstrated in this audit, so it is not counted as a defect.
- Missing PRODUCT.md and DESIGN.md are documentation gaps. Existing code and the user's Korean-inspired reference were treated as design authority; this audit does not require a rebrand or new setup interview.

## Verification and limits

- One Impeccable detector pass: **4 warnings reviewed, 1 retained as P3, 3 contextual false positives; no detector execution error**.
- Six route surfaces inspected across this audit: home, library, TOPIK type picker, a reading exercise, unknown-word notebook, and review entry.
- Desktop screenshots at the normal browser size (approximately 1265 × 712); mobile viewport emulation at 390 × 844. TOPIK, reading and review measured without document-level horizontal overflow. Notebook empty-state structure inspected in the mobile accessibility tree.
- Reproduced menu opening, Escape behavior and subsequent Tab focus; checked reading zoom geometry. No claim of a complete keyboard audit of every control.
- Contrast ratios calculated from live computed/source colors using the standard sRGB relative-luminance formula; imagery and every gradient/background were not exhaustively analyzed.
- Not run: full automated WCAG scanner, Lighthouse/throttled performance benchmark, physical-device touch gestures, screen-reader speech testing, text-only 200% zoom and complete multi-browser coverage. Scores reflect these limits.
- No application code changed; regression tests/build/deployment were not rerun because this was an audit-only task. The earlier release's test totals are not new evidence for this audit.

## Recommended sequence

1. `$impeccable harden`: contrast, mobile drawer keyboard behavior and current-section navigation.
2. `$impeccable adapt`: reading hit areas and passage/answer workflow on phones.
3. `$impeccable extract`: semantic color tokens; `$impeccable optimize` for the shared content-loading boundary after measurement.
4. `$impeccable polish`: final consistency pass after functional fixes.

Commands can be run individually, together, or in another order. Re-run `$impeccable audit` after fixes. Optional later setup: `$impeccable init` to record product context.
