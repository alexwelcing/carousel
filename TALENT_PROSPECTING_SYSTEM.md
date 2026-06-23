# Talent Prospecting System: Strategic Architecture

## The Mission
**Break through recruiting noise with personalized, 3D-cinematic pitch videos.** 

Every application looks the same. This system generates **149 unique company videos** and **261 role-specific pitch compositions** that whisper directly to the hiring decision-maker: *"Here's your company. Here's your role. I'm the person who solves this exact problem. Watch me prove it."*

---

## The Three Pillars

### 1. **Intelligence Layer** (Talent Research Data)
The research pack provides the psychological and tactical insight:

```
├─ Target Roles (1,628 rows)
│  ├─ Role title + JD summary
│  ├─ Key requirements
│  ├─ Comp benchmark + equity
│  ├─ Fit-to-Alex analysis (Why this role?)
│  └─ Positioning angle (How to pitch?)
│
├─ Company Profiles (149 companies)
│  ├─ Stage, funding, size
│  ├─ What they do (core mission)
│  ├─ AI focus + recent developments
│  └─ Website + social signals
│
└─ Top Targets (30 A-tier roles)
   └─ Ranked by fit score with lead angle
```

**Strategic use:** Extract the "Why It Fits" and "Lead Angle" fields—these become the **narrative spine** of each video.

---

### 2. **Production Layer** (3D Cinematic Storytelling)
HyperFrames compositions that render Alex as a **decision-maker's dream match**:

#### **Composition Template: The 60-Second Pitch Video**

```
[0:00–0:03]  INTRO CARD
  • Company logo + wordmark fade-in
  • Accent color palette derived from brand
  • "Alex Welcing for [Company Name]"
  ↓ GSAP timeline: scale-in + glow

[0:03–0:12]  ROLE CONTEXT (Establish stakes)
  • Role title: [Forward Deployed Engineer / PM / etc.]
  • Location + comp tier (visual hierarchy)
  • 2-3 key requirements highlighted with animated callouts
  ↓ GSAP: text sweep reveal + underline animation

[0:12–0:25]  THE MATCH (Why you need me)
  • Split-screen or parallax:
    LEFT:  Company need [from JD summary]
    RIGHT: Alex's proof point [from experience/projects]
  • 3–4 fit bridges, each with micro-animation
  ↓ GSAP: slide-in, counter animations, brand accent pulses

[0:25–0:45]  PROOF (Billions-scale credibility)
  • Lupi.Live screenshot: "Materials-science ML at scale"
  • CreateSuite diagram: "Multi-agent platforms I shipped solo"
  • SSO/IAM visual: "Enterprise deployments across 150+ firms"
  • Each proof point: hover-state glow, floating accent elements
  ↓ Three.js: Subtle 3D particle system or morphing geometry behind proofs

[0:45–0:55]  CTA (The handshake)
  • "Let's talk about [specific fit point]"
  • Apply button + direct calendar link
  • Accent gradient fade
  ↓ GSAP: button pulse, link highlight, micro-interactions

[0:55–1:00]  OUTRO (Company values echo)
  • Company wordmark + Alex's brand mark in conversation
  • Fade to dark with accent accent lingering glow
```

---

### 3. **Execution Layer** (Data → Video Pipeline)

#### **Data Flow**

```
LinkedIn CSV data
    ↓
Parse + transform (roles.ts, companies.ts)
    ↓
For each [Role + Company] pair:
    • Extract narrative data:
      - Why It Fits (from Target Roles CSV)
      - Lead Angle (positioning vector)
      - Company intel (from Company Profiles)
      - Comp tier (for visual hierarchy)
    ↓
Generate HyperFrames composition:
    • Inject data into index.html template
    • Assign brand color (company primary or Alex brand)
    • Populate animated callouts with role requirements
    • Map proof points to flagship projects
    ↓
Render → output/videos/[company]-[role-slug].mp4
    ↓
Upload or link to:
    • Tailored landing page: /role/:company-role-slug
    • LinkedIn cold outreach message
    • Email signature
```

---

## Integration Points

### **A. Data Sources → Composition Templates**

| CSV Column | Composition Use | Animation |
|---|---|---|
| `Company` | Header, accent color lookup | Fade-in scale |
| `Role Title` | Hero headline | Typewriter reveal |
| `Fit to Alex` | 3–4 callout cards | Staggered slide-in |
| `Positioning Angle` | Lead narrative (voiceover or text) | Emphasis glow |
| `Key Requirements` | Checklist with proof mapping | Counter animation |
| `AI Focus` (company) | Visual metaphor or 3D element | Morphing geometry |
| `Recent (2025-26)` | Context card or timeline beat | Timeline scrub animation |

### **B. Portfolio Assets → Video Proofs**

Each flagship project gets a **micro-feature in the proof section**:

```javascript
{
  slug: 'lupi',          // Flagship slug
  videoClip: 'lupi.webm', // Screen recording or demo clip
  stat: 'Materials-science ML rendered in real time',
  relevance: ['ML Scale', 'WebGL Performance', 'Physics'],
  fit_tags: ['Forward Deployed Engineer', 'ML Interop', 'High-Performance Systems']
}
```

When rendering a video for an "ML Engineer" role → emphasize Lupi.  
When rendering a video for an "Agent Platform PM" role → feature CreateSuite.

### **C. Existing Portfolio Components → Reusable HyperFrames Blocks**

The site already has directorial assets:
- **AmbientField** → Background glow during intro
- **GlitchText** → Accent emphasis on key fit points
- **ParticleGlobe** → 3D context visualization during "About the company" beat
- **NeuralMesh** → Connective tissue between proof points (showing relationships)
- **GradientBlobs** → Brand color wash between sections

These can be **ported to HyperFrames as registry blocks** and reused across video compositions.

---

## The Strategic Advantage

### **Noise Breaker**
- 261 applications × 1% open rate = 3–5 inbound conversations.
- 261 applications × 3D cinematic personalization × targeted fit narrative = 12–15 inbound conversations (3–4× multiplier).

### **Speed**
- 1 CSV = 261 composable videos
- HyperFrames CLI + Copilot skills = semi-automated rendering
- Bulk render in a weekend, deploy throughout month

### **Credibility**
- Video = **human attention investment**. Most applicants send text; you send cinema.
- 60-second deep-dive into "why you're built for *this specific company*" → signals research + respect.
- Proof points baked in → no "trust me, check my GitHub" moment.

### **Scalability**
- New company? Add one CSV row.
- New proof point? Update the flagship projects data; existing videos auto-inherit.
- Hiring season spike? Render videos 24/7 with `npm run hf:render --batch`.

---

## Build Roadmap (Next Steps)

### **Phase 1: Pipeline Foundation** (This week)
- [ ] Parse CSVs into TypeScript types (roles.ts, companies.ts)
- [ ] Design the **60-second composition template** (index.html for hyperframes-studio/)
- [ ] Create a **Copilot skill** that maps CSV rows → HyperFrames prompt
- [ ] Render 1 test video (Anthropic or Posh) and A/B refine

### **Phase 2: Bulk Rendering** (Week 2)
- [ ] Build a **batch renderer script** (render Top 30 targets in parallel)
- [ ] Wire video URLs into tailored landing pages (/role/:slug)
- [ ] Set up output storage (GCS or CDN link)

### **Phase 3: Deployment & Outreach** (Week 3)
- [ ] Update email templates with video embeds
- [ ] LinkedIn cold outreach with video link
- [ ] Gather metrics: open rate, watch duration, message replies

### **Phase 4: Iteration & Scaling** (Ongoing)
- [ ] Track which videos get highest engagement
- [ ] A/B test narrative angles (Positioning Angle 1 vs. 2)
- [ ] Add voiceover + captions (TTS via hyperframes-media skill)
- [ ] Scale to the full 261-role shortlist

---

## Key Decisions

### **Q: Should each video be unique per role or per company?**
**A:** Start **per role** (company context + role fit + comp tier). Once proven, layer **per recruiter persona** (tailor tone for startup founder vs. enterprise CHRO).

### **Q: Video length—60s or 3m?**
**A:** **60 seconds.** You're breaking into inbox noise, not replacing a full pitch deck. 60s = digestible, shareable, not a commitment. If they reply, *then* you get 20 minutes.

### **Q: Voiceover or text-only?**
**A:** **Text-first, voiceover optional.** Hiring manager may watch muted (on mobile, at desk). Text + animation should tell the full story. Add voiceover (HeyGen TTS) in Phase 2 if A/B data shows lift.

### **Q: How do we avoid "spammy" feeling?**
**A:** **Personalization depth.** The more specific the fit angle, the more credible it feels. A generic "I like AI" video to 261 companies = spam. A company-specific, role-requirements-specific, 3D-cinematic video = art.

---

## Success Metrics

| Metric | Target | Data Source |
|---|---|---|
| **Video render time** | < 30s per composition | HyperFrames telemetry |
| **Open rate** (in cold outreach) | 8–12% | Email platform |
| **Video watch-through** | 50%+ complete | Vimeo/YT analytics |
| **Engagement (clicks/replies)** | 3–5% of watches | CRM |
| **Inbound conversation rate** | 1 per 20 videos sent | Pipeline tracking |

---

## Files to Create / Update

```
├─ TALENT_PROSPECTING_SYSTEM.md (this doc)
├─ src/
│  ├─ data/
│  │  ├─ roles.ts (← import Target Roles CSV)
│  │  ├─ companies.ts (← import Company Profiles CSV)
│  │  └─ topTargets.ts (← import Top Targets CSV, ranked)
│  ├─ lib/
│  │  ├─ csvParser.ts (← parse the research pack)
│  │  └─ videoCompositionGenerator.ts (← data → HyperFrames HTML)
│  └─ pages/
│     └─ Role.tsx (← updated to embed video)
├─ hyperframes-studio/
│  ├─ index.html (← base template with {{variables}})
│  ├─ blocks/
│  │  ├─ company-intro.html
│  │  ├─ role-context.html
│  │  ├─ fit-match.html
│  │  ├─ proof-portfolio.html
│  │  └─ cta-outro.html
│  └─ compositions/
│     └─ tailored-pitch.html (← root composition)
├─ scripts/
│  ├─ generate-pitch-videos.ts (← batch render from CSV)
│  └─ upload-video-manifest.ts (← push to CDN)
└─ output/
   └─ videos/ (← [company]-[role].mp4 files)
```

---

## Next Immediate Action

**Start with Phase 1 Step 1:** Parse the CSVs and validate the data model.

```bash
# From repo root:
npm run hf:skills  # ensure HyperFrames skills are live
cd hyperframes-studio
npm run dev         # start preview
```

Then build the **composition template** in `index.html` that accepts CSV data as variables. This becomes the reusable **factory for all 261 videos**.

---

**Your competitive edge is not that you can code—it's that you can tell a data-driven, cinematically stunning story at scale. This system is that story.**
