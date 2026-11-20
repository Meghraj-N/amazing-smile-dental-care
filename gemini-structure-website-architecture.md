# Gemini Structure & Website Architecture Master Blueprint
## The Craftvale High-Performance Web Platform Specification
**Target Systems:** Google Antigravity / Gemini / Modern Coding Agents  
**Reference Implementations:** `website_3` (Westside Platform) & `website_4` (Amazing Smile Dental Care)  
**Document Purpose:** Complete, reusable architectural blueprint and generation framework to produce world-class, agency-grade commercial websites with zero boilerplate feel, resilient interactivity, robust backend persistence, and 32-point enterprise security.

---

## 1. Architectural Philosophy & The Craftvale Standard

Most AI-generated websites look generic: they rely on flat stock illustrations, fragile third-party iframes, unstyled form buttons, broken image links, zero persistent data storage, and no security hardening.

The **Craftvale Standard** synthesizes 7 architectural pillars to ensure every generated website looks and functions like an bespoke \$15,000+ digital platform built by a premier design agency:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE CRAFTVALE PLATFORM                          │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. VISUAL SYSTEM  │ 2. INTERACTIVITY  │ 3. CONVERSION ARCHITECTURE     │
│ Apple Minimal UI  │ Pointer Slider    │ Dual-Dispatch Lead Capture     │
│ Responsive Clamp  │ Cal.com Scheduler │ Mobile Floating Action Dock    │
│ Layered Shadows   │ Infinite Marquee  │ Pre-Encoded WhatsApp Handshake │
├───────────────────┴───────────────────┴────────────────────────────────┤
│ 4. RESILIENT FRONTEND RUNTIME (Zero Broken Images, No FOUC/Opacity:0) │
├────────────────────────────────────────────────────────────────────────┤
│ 5. BACKEND ENGINE │ 6. 32-PT SECURITY │ 7. COMPLIANCE & LEGAL SUITE    │
│ Express REST API  │ CSP, HSTS, Fences │ DPDP / HIPAA Privacy Policy    │
│ Atomic JSON Store │ Rate Limiters     │ Clinical Terms & Medical Discl.│
│ Timing-Safe Auth  │ HMAC Anonymizer   │ Cookies, Licenses & Custom 404 │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 2. Design System & Visual Token Architecture

Every project generated must adhere to a strict design token hierarchy defined in `assets/css/styles.css`.

### 2.1 Color Palette Hierarchy
Never use raw arbitrary hex codes scattered across CSS. Always declare standard root tokens:

```css
:root {
  /* Brand Accents */
  --color-primary: #079ED8;          /* Vibrant Primary Accent */
  --color-primary-hover: #087BC1;    /* Deepened Interactive Hover */
  --color-primary-soft: rgba(7, 158, 216, 0.08);

  /* Deep Canvas & Dark Accents */
  --color-dark: #101D3A;             /* Deep Navy Canvas / Headings */
  --color-dark-soft: #1E293B;        /* Muted Dark Elements */

  /* Neutrals & Surfaces */
  --color-bg-light: #F5F9FC;         /* Soft Tinted Section Background */
  --color-white: #FFFFFF;            /* Pure Surface White */
  --color-text-body: #596579;        /* High-Contrast Accessible Body */
  --color-text-muted: #8A99AD;       /* Secondary Muted Labels */
  --color-border: rgba(7, 158, 216, 0.12); /* Subtle Translucent Border */

  /* Conversion Accents */
  --color-accent-gold: #FFC400;      /* Star Ratings & Eyebrow Badges */
  --color-success: #16C784;          /* WhatsApp & Success Confirmation */
  
  /* Elevation Shadows */
  --shadow-sm: 0 2px 8px rgba(16, 29, 58, 0.04);
  --shadow-md: 0 10px 25px rgba(16, 29, 58, 0.06);
  --shadow-lg: 0 20px 45px rgba(16, 29, 58, 0.08);
  --shadow-glow: 0 8px 30px rgba(7, 158, 216, 0.22);
}
```

### 2.2 Typography Scale (Apple-Inspired Fluid Clamping)
- **Primary Display Font:** Geometric sans with optical weight balance (`Plus Jakarta Sans` or `Sora`).
- **Body Font:** High-legibility grotesque sans (`Outfit` or `Inter`).
- **Headings Rule:** Always utilize CSS `clamp()` so titles scale seamlessly from mobile devices to 4K displays without line-wrapping overflows.

```css
h1, .hero-title {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: clamp(2.25rem, 5vw + 1rem, 3.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  color: var(--color-dark);
}

h2, .section-title {
  font-size: clamp(1.85rem, 3.5vw + 0.5rem, 2.75rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
}
```

### 2.3 Aspect Ratio & Asset Guidelines
Respecting aspect ratios prevents layout shifts (CLS) and visual distortion:

| Asset Type | Optimal Ratio | Display Dimension | Visual Framing |
| :--- | :--- | :--- | :--- |
| **Hero Clinic Showcase** | 4:3 or 16:10 | 640 × 480 / 800 × 500 | Rounded 24px, subtle border, soft drop shadow, floating badge |
| **Doctor / Founder Portrait**| 1:1 or 4:5 | 500 × 500 / 600 × 750 | Professional white clinical coat, direct eye contact, clean background |
| **Before / After Comparison**| 16:9 or 3:2 | 800 × 450 / 900 × 600 | Identical framing, zoom, and lighting between Before and After slides |
| **Service Cards** | 16:10 | 400 × 250 | Clean operatory photography or focused treatment close-up |
| **Logo** | Maintain natural | Max height 48px | Transparent PNG/SVG, never stretched, vertically aligned in navbar |

---

## 3. Master Page Anatomy & Section Blueprints

Every high-performing landing page consists of 12 structured sections:

```
[ 1. TOP UTILITY BAR ]          -> Location, Operating Hours, Google Review Badge
[ 2. GLASS NAVBAR ]             -> Logo, Nav Links, Emergency Call CTA, Book Button
[ 3. ASYMMETRIC HERO ]          -> Eyebrow, Main Pitch, Dual CTAs, Photo + Floating Glass Card
[ 4. STATS & PROOF STRIP ]      -> Counters (Years Exp, Patients Treated, Satisfaction %)
[ 5. DOCTOR / FOUNDER BIO ]     -> Qualifications, Philosophy, Direct WhatsApp Consult
[ 6. TREATMENT / SERVICE GRID ] -> 3-Col Cards with Badges, Feature Bullets & Quick Learn Link
[ 7. BEFORE & AFTER TRANSFORMS] -> Interactive Drag Slider with Real Case Studies
[ 8. SOCIAL PROOF MARQUEE ]     -> Infinite Horizontal Carousel with Pause-on-Hover
[ 9. CAL.COM SCHEDULER ]        -> 3-Column Interactive Date, Slot & Inline Booking System
[ 10. CLINICAL FAQ ACCORDION ]  -> 5-6 Common Patient Questions with Smooth Expansion
[ 11. MAP & CONTACT HUB ]       -> Address, Landmark, Directions, Contact Details
[ 12. FOOTER & MOBILE DOCK ]    -> Legal Links, Accreditation, Sticky Bottom Mobile Action Bar
```

### Section 3 Blueprint: The Asymmetric Hero Section
```html
<section class="hero-section">
  <div class="container hero-grid">
    <!-- Left: Value Proposition -->
    <div class="hero-content">
      <div class="badge eyebrow-badge">
        <span class="badge-dot"></span> TOP-RATED CLINIC IN [LOCATION]
      </div>
      <h1 class="hero-title">
        Your Smile Deserves <span class="gradient-text">Exceptional Care.</span>
      </h1>
      <p class="hero-description">
        Experience gentle, advanced dental treatments with computerized precision, single-sitting root canals, and invisible aligners in a stress-free environment.
      </p>
      <div class="hero-actions">
        <a href="#booking" class="btn btn-primary btn-lg">Book Appointment</a>
        <a href="https://wa.me/[WHATSAPP_NUMBER]" class="btn btn-whatsapp btn-lg">
          <svg>...</svg> WhatsApp Direct
        </a>
      </div>
      <div class="hero-trust-bar">
        <div class="trust-avatar-group">
          <img src="..." alt="Patient">...
        </div>
        <div class="trust-text">
          <strong>4.8 / 5.0 Rating</strong> · Over 10,000+ Happy Patients
        </div>
      </div>
    </div>

    <!-- Right: High-Resolution Photo with Floating Glass Card -->
    <div class="hero-visual">
      <div class="hero-image-card">
        <img src="assets/images/clinic-hero.jpg" alt="Clinic Interior" class="hero-img">
        <div class="floating-card floating-card-bottom">
          <div class="floating-icon">★</div>
          <div class="floating-data">
            <span class="floating-number">12+ Years</span>
            <span class="floating-label">Clinical Excellence</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 4. Four Core Interactive Frontend Engines

To avoid fragile external dependencies, embed these 4 native JavaScript controllers directly into `assets/js/main.js`:

### 4.1 Engine 1: Cal.com-Style 3-Column Interactive Scheduler
Provides an instant, responsive calendar with month navigation, 12h/24h toggle, disabled past dates, and inline form capture:

```javascript
/* Cal.com Interactive 3-Column Scheduler */
function initCalScheduler() {
  const cards = document.querySelectorAll('.cal-scheduler-card');
  cards.forEach(card => {
    // 1. Maintain internal state: selectedDate, displayMonth, timeFormat, selectedSlot
    // 2. Render month grid, muting prior/trailing days, marking today & selected
    // 3. Render time slot pills (morning & evening clinic batches)
    // 4. On slot click: open inline booking confirmation without full page reload
    // 5. Dual-dispatch submit: post to /api/appointments and forward to WhatsApp
  });
}
```

### 4.2 Engine 2: Before & After Smile Comparison Slider
Direct pointer manipulation with pointer capture and dynamic image width synchronization:

```javascript
function initBeforeAfterSlider() {
  const sliders = document.querySelectorAll('.comparison-slider');
  
  function syncImageWidth() {
    sliders.forEach(slider => {
      const beforeImg = slider.querySelector('.comparison-before img');
      if (beforeImg) beforeImg.style.width = slider.offsetWidth + 'px';
    });
  }
  window.addEventListener('resize', syncImageWidth);
  syncImageWidth();

  sliders.forEach(slider => {
    const beforeWrap = slider.querySelector('.comparison-before');
    const handle = slider.querySelector('.comparison-handle');
    let isDragging = false;

    function updatePos(clientX) {
      const rect = slider.getBoundingClientRect();
      let percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      beforeWrap.style.width = percent + '%';
      handle.style.left = percent + '%';
    }

    slider.addEventListener('pointerdown', (e) => {
      isDragging = true;
      slider.setPointerCapture(e.pointerId);
      updatePos(e.clientX);
    });
    slider.addEventListener('pointermove', (e) => {
      if (isDragging) updatePos(e.clientX);
    });
    slider.addEventListener('pointerup', (e) => {
      isDragging = false;
      try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
    });
  });
}
```

### 4.3 Engine 3: Continuous Marquee with Touch/Hover Pause
Smooth continuous marquee scrolling that freezes on hover or touch so patients can read reviews comfortably:

```javascript
function initTestimonialsMarquee() {
  const marquees = document.querySelectorAll('.marquee-track');
  marquees.forEach(track => {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    track.addEventListener('touchstart', () => track.style.animationPlayState = 'paused', { passive: true });
    track.addEventListener('touchend', () => track.style.animationPlayState = 'running', { passive: true });
  });
}
```

### 4.4 Engine 4: Resilient Image Guard (Zero Broken Images Ever)
If any image fails to load or has 0 natural width, it is immediately substituted with a branded gradient SVG. No broken icon or missing box will ever appear:

```javascript
function initImageGuard() {
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23079ED8"/><stop offset="100%" stop-color="%23101D3A"/></linearGradient></defs><rect width="800" height="600" fill="url(%23g)"/><text x="50%" y="50%" font-family="system-ui,sans-serif" font-weight="bold" font-size="28" fill="%23FFFFFF" text-anchor="middle">Amazing Smile Dental Care</text></svg>`;

  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      if (!img.dataset.hasFallback) {
        img.dataset.hasFallback = 'true';
        img.src = fallbackSvg;
      }
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dataset.hasFallback = 'true';
      img.src = fallbackSvg;
    }
  });
}
```

---

## 5. Backend Architecture & Dual-Dispatch Data Flow

```
[PATIENT CLICKS "CONFIRM SLOT"]
             │
             ├──► 1. Async background fetch('/api/appointments', { ... })
             │         │
             │         ▼
             │   [SERVER: Express + Security Suite]
             │         │
             │         ├──► Input Sanitization & Anti-Bot Check
             │         ├──► Salted HMAC IP Anonymization
             │         └──► Atomic Write (data/appointments.json.tmp -> atomic rename)
             │
             └──► 2. Synchronous WhatsApp Deep Link Launch
                       │
                       ▼
                 [Opens WhatsApp with formatted clinic booking message]
```

### Why Dual-Dispatch Matters:
In high-intent businesses, 30-40% of mobile users click WhatsApp, view the app opening, and close it before pressing send (due to low battery, distraction, or hesitation). Dual-dispatch ensures the clinic database captures their name, phone number, requested service, and slot *regardless*, allowing the reception team to call and confirm.

---

## 6. The 32-Point Enterprise Security Checklist

When building or reviewing the backend (`server/index.js`, `server/security.js`, `server/auth.js`, `server/db.js`), verify all 32 controls:

### Layer 1: HTTP Hardening & Response Headers
1. `Content-Security-Policy`: Default `'self'`, trusted fonts & scripts only.
2. `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`.
3. `X-Frame-Options`: `SAMEORIGIN` (neutralizes Clickjacking).
4. `X-Content-Type-Options`: `nosniff` (neutralizes MIME confusion).
5. `Referrer-Policy`: `strict-origin-when-cross-origin`.
6. `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`.
7. `Cross-Origin-Opener-Policy`: `same-origin-allow-popups`.
8. `Cross-Origin-Resource-Policy`: `same-origin`.
9. `X-XSS-Protection`: `1; mode=block`.
10. `X-Powered-By`: Suppressed (`app.disable('x-powered-by')`).

### Layer 2: Rate Limiting & DoS Mitigation
11. Global Rate Limiter: 150 requests / 60 seconds per IP.
12. Form Submission Limiter: 12 requests / 15 minutes per IP.
13. Admin Login Limiter: 5 attempts / 15 minutes per IP.
14. Payload Size Clamping: `express.json({ limit: '500kb' })`.

### Layer 3: Input Sanitization & Threat Neutralization
15. Recursive Deep Object Sanitization.
16. HTML & Script Tag Stripping (`<` and `>` escaping).
17. `javascript:`, `vbscript:`, `data:` URI Scheme Neutralization.
18. Inline DOM Event Stripping (`onload=`, `onerror=`, `onclick=`).

### Layer 4: Anti-Bot Honeypot Defense
19. Hidden Form Traps: Off-screen fields (`_gotcha`, `patient_fax`, `website_url`).
20. Zero-Feedback Bot Absorption: Returns fake `200 OK` without persisting spam.

### Layer 5: Cryptographic Auth & Session Security
21. Timing-Safe Credential Verification (`crypto.timingSafeEqual`).
22. HMAC-SHA256 Signed Session Tokens (`SESSION_SECRET`).
23. Stateless Base64URL Signature Verification.
24. Session Expiration (8-Hour Hard TTL).
25. Triple-Guarded Cookies: `HttpOnly`, `SameSite=Lax`, `Secure`.

### Layer 6: Sensitive File & Path Traversal Fencing
26. Null-Byte (`%00`) & Path Traversal (`..`) Rejection.
27. Sensitive File Regex Blacklist (`.env*`, `.git/`, `server/`, `data/`, `package.json`).
28. HTTP Method Whitelist: Rejects `TRACE` and `TRACK`.

### Layer 7: Concurrency-Safe Atomic Persistence
29. Atomic File-Swap Persistence: Writes to `.tmp.XXXXXX` + atomic `fs.renameSync()`.
30. Sequential Write Queue: In-memory lock chain eliminating concurrent write races.

### Layer 8: Medical Privacy & Error Masking
31. DPDP/HIPAA Anonymized IP Hashes: HMAC-SHA256 with daily dynamic salt.
32. Production Error Masking: Suppresses stack traces and file paths in production.

---

## 7. Legal, Compliance & Setup File Hierarchy

A complete deployment must include these 5 essential legal and operational files:

1. **`404.html`**: Branded 404 error page with clinic branding, emergency phone link, and direct button back to homepage.
2. **`privacy.html`**: Medical and digital data privacy policy covering purpose limitation, non-disclosure to data brokers, and DPDP Act / HIPAA adherence.
3. **`terms.html`**: Clinical terms of service, appointment cancellation windows (4-12 hours), and medical diagnostic disclaimers.
4. **`cookies.html`**: Minimalist cookie policy explaining essential security cookies and `localStorage` UI preferences.
5. **`licenses.html`**: Open-source attribution for fonts (SIL Open Font License) and icons (MIT License).

---

## 8. Master Generation Prompt for Gemini / AI Agents

When prompting an AI agent to build or refactor a website, use this turnkey prompt:

````markdown
# MASTER PROMPT: AGENCY-GRADE WEBSITE GENERATION

Act as an elite full-stack web engineer, conversion optimization specialist, and cybersecurity architect.
Your task is to build a high-performance website for the following business:

## 1. PROJECT INPUTS
- BUSINESS_NAME: [e.g. Amazing Smile Dental Care]
- BUSINESS_TYPE: [e.g. Modern Dental Clinic & Implant Center]
- FOUNDER_LEAD: [e.g. Dr. Manish Gangwani, BDS]
- LOCATION: [e.g. Gol Maidan, Ulhasnagar - 421002]
- PRIMARY_PHONE: [e.g. +919975999529] (Display: +919975999529, Link: tel:+919975999529)
- WHATSAPP_NUM: [e.g. 919975999529]
- PRIMARY_COLOR: [e.g. #079ED8]
- DARK_COLOR: [e.g. #101D3A]
- SECONDARY_COLOR: [e.g. #087BC1]

## 2. STRICT REQUIREMENTS
1. Architecture: Single-page or multi-page static frontend backed by a Node.js Express API.
2. Frontend Polish:
   - Implement the Cal.com 3-column interactive appointment scheduler.
   - Implement the Before & After interactive drag comparison slider.
   - Implement the infinite testimonials marquee with hover/touch pause.
   - Include the resilient Image Guard so broken images never show.
   - Ensure the page renders fully if JS is disabled (never leave elements at opacity: 0).
3. Dual-Dispatch Lead System:
   - Form submissions must asynchronously POST to `/api/appointments` and `/api/leads` before launching WhatsApp.
4. Backend & Security:
   - Build `server/index.js`, `server/security.js`, `server/auth.js`, `server/db.js`.
   - Implement the 32-point security checklist (CSP, HSTS, timingSafeEqual, atomic temp-swap JSON writes, rate limiting, and sensitive file fencing).
5. Legal Suite:
   - Generate `404.html`, `privacy.html`, `terms.html`, `cookies.html`, and `licenses.html` styled with the project design system.
6. Environment & Docker:
   - Provide `.env`, `.env.example`, multi-stage non-root `Dockerfile`, and `.dockerignore`.
````

---

## 9. Verification & Audit Runbook

Run this one-line command to verify any generated platform:

```powershell
python -c "
import urllib.request, json
base = 'http://localhost:8123'
print('Health:', urllib.request.urlopen(f'{base}/api/health').getcode())
for p in ['/', '/about.html', '/privacy.html', '/404.html']:
    print(f'Page {p}:', urllib.request.urlopen(f'{base}{p}').getcode())
for blocked in ['/.env', '/server/index.js', '/data/appointments.json']:
    try: urllib.request.urlopen(f'{base}{blocked}')
    except urllib.error.HTTPError as e: print(f'Fence {blocked}: {e.code} (Protected)')
"
```

---
*Craftvale Architecture System · High-Performance Web Engineering · Version 2.0.0*
