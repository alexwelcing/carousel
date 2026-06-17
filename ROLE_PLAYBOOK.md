# Role Application Playbook

How to stage a tailored application for a new target company. The site is **data-driven**:
add one entry and the build generates everything — the landing page, both résumé PDFs, and
the download links. No component edits required.

---

## TL;DR — add a new target in 3 steps

1. Open `src/data/roles.ts` and append one `TailoredRole` object to the `roles` array.
2. Commit and push to `main`.
3. Netlify rebuilds (~30s). The new assets are live:
   - Page:        `https://welc.ing/role/<slug>`  *(unlisted — not in nav, blocked in robots.txt)*
   - Résumé:      `https://welc.ing/resumes/<slug>.pdf`        (dark / brand)
   - Print résumé:`https://welc.ing/resumes/<slug>-light.pdf`  (light / ATS)

Share the `/role/<slug>` link 1:1 with the company. It is never listed publicly.

---

## The `TailoredRole` schema

```ts
{
  slug: 'company-name',        // url-safe, lowercase, hyphens. Becomes /role/<slug>
  company: 'Company Name',
  roleTitle: 'Exact Posting Title',
  location: 'NYC / Remote',
  applyUrl: 'https://...',      // the live job posting (or mailto:)
  accent: '#33CCFF',           // brand accent for the page + tailored PDF banner
  tagline: '[ TRACK · FOCUS ]',// short eyebrow, e.g. '[ AGENT IDENTITY · MCP GATEWAY ]'
  headline: 'One-sentence pitch in Alex's voice.',
  intro: '1–2 sentences. Also becomes the SUMMARY line of the tailored PDF.',
  whyFit: [                    // EXACTLY 3 for a clean one-page PDF
    { point: 'Short claim', detail: 'Evidence from Alex's experience that backs it.' },
    { point: '...',         detail: '...' },
    { point: '...',         detail: '...' },
  ],
  proof: [                     // 3 punchy metrics (web page only)
    'Billions of monthly requests ...',
    '150+ enterprise SSO integrations ...',
    'Multi-agent system built end-to-end',
  ],
}
```

### Writing guidance (keep the bar high)
- **headline / intro:** speak as Alex, present tense, lead with the company's actual problem.
- **whyFit:** each `point` is the claim; each `detail` is concrete proof. Map to the real
  pillars — LBR (identity/SSO at billions-scale), Obsess (agent/3D platform), Manatt
  (document AI / legal), CreateSuite (multi-agent), High Era / NextDocsSearch (full-stack + AI).
- **Keep it to 3 whyFit items.** The tailored PDF is tuned to fit ONE page with exactly 3.
  More than 3 risks a second page.
- **accent:** use the company's brand color when recognizable, else a site accent
  (`#FF3366` magenta, `#33CCFF` cyan, `#41B883` green, `#3178C6` blue).

---

## What the build does automatically

`pnpm run build` runs `tsc` → `scripts/generate-resumes.tsx` → `vite build`. The generate step
renders, for the base résumé **and every role**, a dark and a light PDF into `public/`
(copied into `dist/`). PDFs are git-ignored — they're regenerated on every deploy, so editing
`roles.ts` keeps every résumé in sync automatically.

The tailored PDF = the standard résumé with the role's `intro` as the summary plus a
**"Why <Company>"** section built from `whyFit`. The base résumé (no role) is the generic version.

---

## Local preview before pushing

```bash
pnpm install                 # first time only
pnpm generate:resumes        # writes PDFs into public/
pnpm dev                     # http://localhost:3000  → open /role/<slug>
```

To eyeball the PDFs without a browser:
```bash
pnpm generate:resumes && open public/resumes/<slug>.pdf
```

---

## Conventions & guardrails
- **One page.** The PDF `Page` is set to not paginate; if content overflows it clips. If you
  add long content, shorten elsewhere. 3 whyFit items + the standard experience always fit.
- **Privacy.** Target pages are intentionally unlisted: not in the navbar, no public index,
  and `public/robots.txt` disallows `/role/`. Only people you send the link to will see it.
- **Editing core résumé content** (experience, skills, summary): `src/components/ResumePDF.tsx`.
  Changing it updates the base and every tailored PDF at once.
- **Hosting:** Netlify project `welcing`, auto-deploys from `main` on `github.com/alexwelcing/carousel`,
  pnpm + Node 22 (see `netlify.toml`).
