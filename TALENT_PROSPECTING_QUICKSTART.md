# Talent Prospecting: Quick Start Guide

You've built a **data-driven talent prospecting engine** that turns CSV intelligence into 3D cinematic pitch videos. Here's how to use it. 

---

## System Overview

```
Step 1: Intelligence       Step 2: Strategy         Step 3: Production       Step 4: Deploy
━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━━━━━━       ━━━━━━━━━━━━━
CSV Data                   Extract fit angles        HyperFrames renders      Share videos
  ↓                        from research             personalized 60s clips   to recruiters
Target Roles               data (CSV columns)        with 3D animation         ↓
Company Profiles         ↓                           ↓                       Landing pages
Top Targets         Use as variables         Batch render 30–261 videos    Email signatures
  ↓                 in composition            in parallel                  LinkedIn
Research metadata   template                 ↓
                                             MP4 files → CDN
```

---

## Prerequisites

✓ Already installed:
- Node.js 22+ (`npm --version`)
- FFmpeg + FFprobe (`ffmpeg -version`)
- HyperFrames CLI (`npx hyperframes --version`)
- 18 HyperFrames skills (at `.agents/skills/`)

---

## Quick Start: Render Your First 3 Pitch Videos

### 1. Start the HyperFrames preview (optional, for visual debugging)

```bash
npm run hf:dev
```

Opens HyperFrames Studio at `localhost:3000` → preview the talent-pitch composition live as you edit.

### 2. Render the Top 30 A-tier roles (fastest)

```bash
npm run talent:pitch-top30
```

**What happens:**
- Parses CSV data from the research pack
- Generates 30 unique compositions (one per top target role)
- Renders each to `output/videos/[company]-[role].mp4`
- Takes ~30–45 minutes (low-memory container profile)

**Output:**
```
✓ adobe-ai-product-manager.mp4
✓ posh-lead-technical-product-manager.mp4
✓ anthropic-forward-deployed-engineer.mp4
... (27 more)
```

### 3. View generated videos

```bash
ls -lh output/videos/
```

Each video is ~5–15 MB, 60 seconds, personalized to the role + company.

---

## How the System Works

### **The Composition Template** (`hyperframes-studio/talentpitch.html`)

A **60-second HyperFrames HTML composition** with 6 sections:

```
[0:00–0:03]  Intro        → Company wordmark + role title fade-in
[0:03–0:12]  Role Context → Role title, location, comp, 3 key requirements
[0:12–0:25]  Fit Match    → 3 fit cards (Why you're perfect for this)
[0:25–0:45]  Proof        → 3 portfolio projects (Lupi, CreateSuite, alexwelcing)
[0:45–0:55]  CTA          → Call-to-action + button
[0:55–1:00]  Outro        → Brand mark fade
```

Each section uses **GSAP timeline animations** — scale-in, type reveal, glow, pulse — to keep the hiring manager's attention.

### **Data → Video Pipeline**

#### CSV Columns → Template Variables

| CSV Column | Template Use | Animation |
|---|---|---|
| `Company` | Intro wordmark | Fade scale |
| `Role Title` | Hero headline + CTA | Type reveal |
| `Fit to Alex` | 3 fit-card titles | Staggered slide |
| `Key Requirements` | Checklist with ✓ icons | Counter pulse |
| `Comp Benchmark` | Meta display | Highlight |
| `Positioning Angle` | Lead CTA message | Emphasis glow |

#### Example: Rendering one video

```bash
# Raw script call:
npx tsx scripts/generate-pitch-videos.ts --top-targets

# Under the hood:
1. Parse CSVs
2. For each role:
   {
     companyName: "Adobe",
     roleTitle: "Forward Deployed AI Product Manager",
     location: "New York, NY",
     compBenchmark: "~$220K–$320K",
     fitPoint1: "I build production agents, not prototypes",
     fitPoint1Evidence: "CreateSuite: multi-agent platform...",
     ... (more fields)
   }
3. Invoke HyperFrames:
   npx hyperframes render hyperframes-studio \
     --composition talentpitch.html \
     --variables '{ ...above... }' \
     --output output/videos/adobe-forward-deployed-ai-pm.mp4
4. Render → MP4
```

---

## Rendering Modes

### **Mode 1: Top 30 (A-tier shortlist) — 45 min**
```bash
npm run talent:pitch-top30
```
Best for: Testing, quick turnaround, highest ROI roles.  
Output: 30 personalized videos.

### **Mode 2: Strong Fit (119 A-tier roles) — 2–3 hours**
```bash
npm run talent:pitch-strong
```
Best for: Broader coverage, still high fit.  
Output: 119 personalized videos.

### **Mode 3: All 261 roles — 6–8 hours (use Docker)**
```bash
npm run talent:pitch-all --docker
```
Best for: Comprehensive coverage, batch rendering overnight.  
Output: 261 personalized videos.

### **Mode 4: Docker-backed (faster, deterministic)**
```bash
npm run talent:pitch-docker
```
Same as top-targets, but uses Docker rendering instead of local Chrome.  
Better for: Scheduled batch runs, reproducibility.

---

## Integration: Video → Landing Pages

After rendering videos, wire them into the existing `/role/:slug` landing pages:

### **Before (text-only)**
```tsx
// src/pages/Role.tsx
export default function Role() {
  return (
    <div>
      <h1>{role.headline}</h1>
      <p>{role.intro}</p>
      <ProofPoints proof={role.proof} />
      <button onClick={() => navigate(role.applyUrl)}>Apply</button>
    </div>
  );
}
```

### **After (text + video)**
```tsx
// src/pages/Role.tsx
export default function Role() {
  const videoPath = `/videos/${role.company}-${role.roleTitle.toLowerCase().replace(/\s+/g, '-')}.mp4`;
  
  return (
    <div>
      <div className="video-hero">
        <video autoPlay muted loop width="100%">
          <source src={videoPath} type="video/mp4" />
        </video>
      </div>
      
      <h1>{role.headline}</h1>
      <p>{role.intro}</p>
      <ProofPoints proof={role.proof} />
      <button onClick={() => navigate(role.applyUrl)}>Apply</button>
    </div>
  );
}
```

---

## Integration: Video → Outreach

### **Email Cold Outreach**
```html
<!-- In email body: -->
<video width="400" height="225" controls>
  <source src="https://cdn.welcing.com/videos/adobe-forward-deployed-ai-pm.mp4" type="video/mp4">
</video>

<p>Hey [Hiring Manager],</p>
<p>I built a personalized 60-second video just for this role at Adobe. 
   Watch the first 15 seconds to see why I'm a strong fit for Forward Deployed AI PM.</p>

<a href="[APPLY_URL]">Let's talk</a>
```

### **LinkedIn Cold Outreach**
Link to the video from the tailored landing page:
```
Hi [Name],

I just created a personalized video pitch for the Forward Deployed AI PM role at Adobe.

[Link to /role/adobe-forward-deployed-ai-pm]

Let me know if this aligns with what you're looking for.
```

---

## Customization: Edit the Composition

Want to change the template? Edit `hyperframes-studio/talentpitch.html`:

### **Add a new section**

```html
<!-- [NEW] Between Proof and CTA (at 0:40–0:45) -->
<div id="ai-focus" class="clip" data-start="40" data-duration="5" data-track-index="1">
  <div style="font-size: 28px; text-align: center;">
    <span>{{ companyAiFocus }}</span>
  </div>
</div>
```

Then update your `compositionSchema.ts` to populate `companyAiFocus`:

```typescript
export interface PitchCompositionVariables {
  // ... existing fields
  companyAiFocus: string; // e.g. "Building agent orchestration frameworks"
}
```

### **Change animation timing**

```javascript
// Edit tl.from / tl.to timings in the GSAP script section
// E.g., make the fit cards appear slower:
tl.from('.fit-card', {
  opacity: 0,
  y: 20,
  stagger: 0.3,  // ← increased from 0.2
  duration: 0.7, // ← increased from 0.5
}, 12.2)
```

### **Change colors**

Company accent color is auto-mapped from the CSV. To override:

```typescript
// In compositionSchema.ts, generateCompositionVariables():
companyAccent: company.accentColor || '#FF3366', // fallback
```

Set `accentColor` in the Company Profiles CSV for automatic per-company theming.

---

## Troubleshooting

### **"Protocol timeout" error during render**
The low-memory profile already handles this. If still occurring:
```bash
PRODUCER_PUPPETEER_PROTOCOL_TIMEOUT_MS=900000 npm run talent:pitch-top30
```

### **Videos rendering but audio tracks are silent**
Audio support is in Phase 2 (hyperframes-media skill). Currently videos are visual only.

### **CSV data not appearing in video**
1. Check CSV column names match the template
2. Verify CSV encoding is UTF-8 (no BOM)
3. Run a test render and inspect the generated composition variables

### **Docker render is slow**
Docker render is built for consistency, not speed. For fast iteration:
```bash
npm run talent:pitch-top30  # Uses local low-memory profile
```

---

## Next Steps (Strategic Roadmap)

### **Phase 1: Proof of Concept** (This week)
- [ ] Render top 30 videos
- [ ] Pick 3 best-fit roles for A/B testing
- [ ] Send personalized cold outreach to 3 recruiters with video links
- [ ] Track: open rate, video watch duration, replies

### **Phase 2: Iterate & Add Voice** (Week 2)
- [ ] Based on engagement data, refine the narrative/animation
- [ ] Add voiceover (HeyGen TTS) via `hyperframes-media` skill
- [ ] Test with/without captions
- [ ] Measure: watch-through rate lift

### **Phase 3: Scale** (Week 3)
- [ ] Render all 119 strong-fit roles
- [ ] Embed videos in tailored landing pages
- [ ] Batch email outreach to hiring managers
- [ ] Track pipeline metrics: inbound conversation rate

### **Phase 4: Advanced Personalization** (Week 4+)
- [ ] A/B test two positioning angles per company (variant videos)
- [ ] Add voiceover (TTS) per role
- [ ] Incorporate company recent news (from CSV) into animation
- [ ] Create recruiter-persona variants (startup founder vs. CHRO tone)

---

## Key Commands Reference

| Command | What It Does | Time |
|---|---|---|
| `npm run hf:dev` | Start HyperFrames preview | — |
| `npm run talent:pitch-top30` | Render top 30 roles | ~45 min |
| `npm run talent:pitch-strong` | Render 119 A-tier roles | ~2–3 hr |
| `npm run talent:pitch-all` | Render all 261 roles | ~6–8 hr (use Docker) |
| `npm run talent:pitch-docker` | Docker-backed render (top 30) | ~30–40 min |
| `npm run hf:check` | Lint/validate HyperFrames composition | ~5 sec |

---

## Files You Now Have

```
├─ TALENT_PROSPECTING_SYSTEM.md (← Strategic architecture)
├─ TALENT_PROSPECTING_QUICKSTART.md (← This doc)
├─ src/data/
│  └─ compositionSchema.ts (← Data model + pipeline)
├─ hyperframes-studio/
│  └─ talentpitch.html (← 60s pitch template)
├─ scripts/
│  └─ generate-pitch-videos.ts (← Batch renderer)
├─ output/videos/ (← Generated MP4s)
└─ LinkedIn_Promoted_Roles_RESEARCH-*.csv (← Research data)
```

---

## Success Metrics

Track these as you scale:

| Metric | Baseline | Target |
|---|---|---|
| Video render time | 120 sec/video | < 60 sec |
| Cold outreach open rate | 3–5% | 8–12% |
| Video watch-through (50%+) | 20% of opens | 50%+ |
| Engagement (click/reply) | < 1% | 3–5% |
| Inbound conversation | 1 per 50 videos | 1 per 15 videos |

---

## You're Ready 🚀

1. Run: `npm run talent:pitch-top30`
2. Watch the videos generate in real time
3. Share the top 3 with hiring managers
4. Measure engagement
5. Iterate based on data

**Your competitive edge is not that you can code—it's that you can tell a data-driven, cinematically stunning story at scale.**

Good luck. Go break through the noise.
