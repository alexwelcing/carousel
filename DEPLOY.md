# Deploying welc.ing

This is a static Vite + React SPA. It builds to a `dist/` folder of plain HTML/JS/CSS — no server required. Any static host works; configs for the three easiest are already in this repo.

- `vercel.json` — Vercel (SPA rewrite + build)
- `firebase.json` — Firebase Hosting (SPA rewrite + asset caching)
- `public/_redirects` — Cloudflare Pages / Netlify (SPA rewrite)
- `.nvmrc` — pins Node 22

Build locally with: `npm install && npm run build` (output in `dist/`).

---

## Option A — Vercel (recommended: simplest, free, instant SSL)

1. Push this `app/` folder to a GitHub repo (e.g. `alexwelcing/welcing-site`).
2. Go to vercel.com → **Add New → Project** → import the repo.
3. Vercel auto-detects Vite. Confirm: Build = `npm run build`, Output = `dist`. Deploy.
4. In the project → **Settings → Domains** → add `welc.ing` and `www.welc.ing`.
5. Vercel shows the DNS records to set (see Namecheap section below).

CLI alternative (no GitHub): `npm i -g vercel && vercel --prod` from this folder.

---

## Option B — Cloudflare Pages (free, fast, generous limits)

1. Push to GitHub. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
2. Build command `npm run build`, output dir `dist`.
3. **Custom domains** → add `welc.ing`. If the domain's nameservers move to Cloudflare, DNS is automatic.

---

## Option C — Firebase Hosting (Google-family; you already have gcloud)

```bash
npm i -g firebase-tools
firebase login
firebase init hosting     # choose existing/new project; public dir = dist; SPA = yes (already set in firebase.json)
npm run build
firebase deploy --only hosting
firebase hosting:sites     # then add custom domain in console: Hosting → Add custom domain → welc.ing
```

---

## Namecheap DNS for welc.ing

Namecheap → Domain List → `welc.ing` → **Manage → Advanced DNS**. Remove any default parking records, then add what your host specifies. Typical patterns:

**Vercel**
- A record: Host `@` → `76.76.21.21`
- CNAME: Host `www` → `cname.vercel-dns.com`

**Cloudflare Pages**
- CNAME: Host `@` (or use Cloudflare nameservers) → `<project>.pages.dev`
- CNAME: Host `www` → `<project>.pages.dev`

**Firebase**
- Two A records for `@` (IPs shown in the Firebase console)
- Plus a TXT record for domain verification (shown in console)

SSL is provisioned automatically by all three once DNS resolves (can take 10 min–24 h).

---

## Per-role tailored pages

Tailored landing pages live at `welc.ing/role/<slug>` and are listed at `welc.ing/roles`.
To add or edit one, edit `src/data/roles.ts` (one object per role: company, roleTitle, location,
applyUrl, headline, intro, whyFit[], proof[]). Rebuild and redeploy. Current pages:
anthropic, runlayer, harvey, glean, sierra, hebbia, draftwise, keycard.
