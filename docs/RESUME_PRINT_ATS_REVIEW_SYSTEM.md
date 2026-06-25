# Resume Print + ATS Review System

This system defines how to review generated resumes with the mindset of a print layout specialist and ATS-aware resume editor.

Use this as a gate before accepting any new resume PDF.

## 1) Review Mindset

Think in layers, in this order:

1. Structural integrity
- Nothing can overlap.
- Nothing can spill outside cards, columns, or page-safe area.
- Spacing rhythm must be consistent.

2. Typographic hierarchy
- Name, section headers, role titles, body copy, and metadata must be visually distinct.
- Visual priority must be obvious in under 3 seconds.

3. Reading flow
- Eye path should be predictable: top header -> left summary/context -> right proof/experience -> page 2 continuity.
- No dead zones or accidental focal points.

4. Print realism
- At 100% zoom and print scale, text is comfortably readable.
- No tiny type that only works on screen.

5. ATS survivability
- Core semantic content is explicit and machine-readable.
- No decorative gimmicks that hide critical role/company/date details.

## 2) Hard Acceptance Gates

A resume FAILS immediately if any one of these is true:

- Any text overlaps another text block.
- Any text is clipped by its container.
- Any card border intersects text.
- Any section extends past page-safe bottom.
- Role title, company, or date becomes ambiguous due to visual treatment.
- Font size drops below 9 pt equivalent for body text.

## 3) ATS-Safe Content Rules

Always preserve these fields as plain, readable text:

- Name
- Role target/title
- Contact line
- Experience entries: company, role, date range
- Education entries
- Skill keywords in plain text (not image-only badges)

Avoid ATS risk patterns:

- Text converted to outlines only
- Over-fragmented text blocks with broken reading order
- Overly stylized punctuation replacing standard separators
- Hidden white text or low-contrast microtext

## 4) Visual QA Pass Sequence

Run these passes in strict sequence.

### Pass A: Geometry Pass (black-and-white logic)

- Hide color mentally; check only box model and spacing.
- Validate vertical rhythm:
  - Header zone
  - Section start offsets
  - Card top/bottom padding
  - Inter-card spacing
- Confirm no card exceeds content bounds.

### Pass B: Type Pass

- Confirm hierarchy:
  - Name > section labels > company > role > bullets > meta
- Check line lengths:
  - Body lines target readable measure (roughly 45-85 characters)
- Check line-height consistency by tier.

### Pass C: Content Density Pass

- Identify crowded zones (usually lower halves of columns).
- If density spikes in one area, rebalance by:
  - Reducing repeated phrasing
  - Tightening list copy
  - Moving non-essential content to page 2 or removing it

### Pass D: ATS Pass

- Verify all critical tokens are present in selectable text.
- Confirm role/company/date fields are explicit and nearby.
- Confirm no section relies only on visual labels without plain words.

### Pass E: Print Pass

- Review at 100% and 125% zoom.
- Review full-page view for composition balance.
- If possible, print-to-paper or print-preview with margins to verify readability.

## 5) Corrective Priority Order

When issues exist, fix in this order:

1. Remove overlap/overflow
2. Preserve semantic clarity for ATS
3. Preserve hierarchy
4. Improve aesthetics

Never trade semantic clarity for visual style.

## 6) Layout Tuning Playbook

When a section is overflowing:

- First: remove optional section content
- Second: reduce inter-card spacing
- Third: tighten card padding (small adjustments)
- Fourth: reduce line-height slightly (within readability bounds)
- Last: reduce font size, but never below body minimum

When a section is too loose:

- Increase spacing rhythm before increasing font size
- Use consistent spacing increments (for example 4, 8, 12)
- Keep column bottoms visually aligned when possible

## 7) Resume-Specific Heuristics

For this project format:

- Page 1 should carry summary plus strongest recent experience without bottom collisions.
- Page 2 should continue experience cleanly; avoid decorative filler in bottom-right if content gets dense.
- If a footer card competes with experience cards, remove footer first.

## 8) Definition of Done

A version is Done only when all conditions pass:

- Zero overlaps
- Zero overflows
- Zero clipped text
- ATS-required fields explicit and readable
- Visual hierarchy obvious at first glance
- No single quadrant appears accidentally crowded or empty

## 9) Review Log Template

Use this quick log for each revision:

- Version:
- Geometry pass: Pass/Fail
- Type pass: Pass/Fail
- Density pass: Pass/Fail
- ATS pass: Pass/Fail
- Print pass: Pass/Fail
- Issues found:
- Fixes applied:
- Final verdict: Accept/Reject

## 10) Non-Negotiable Principle

Every resume is a constrained systems problem, not an art experiment.

If a layout cannot guarantee containment and readability under strict checks, reject and regenerate.
