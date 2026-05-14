# Design Improvement: Linkon — Full System

**Date:** 2026-05-07  
**Screens:** Home `/`, Login/Register, Service pages (Vion/Rion/Taxon), Admin console  
**Method:** Full source-code analysis (no live screenshots — browse tool unavailable)

---

## TL;DR

The biggest opportunity was the **wasted auth split layout** — brand content existed in the DOM but was hidden with `display: none`. Revealing it transforms the login/register pages from generic forms into a branded experience. The second biggest was **visual hierarchy on the home page** — Vion (live) and coming-soon cards were identical in weight, confusing the priority signal.

---

## Improvements Implemented

### 1. Auth Panel Revealed on Desktop ⭐ (highest impact)

**What changed:** `.auth-panel { display: none }` → full two-column grid layout on ≥1100px  
**Files:** `styles/globals.css`, `components/login-form.tsx`, `components/register-form.tsx`

The split layout now shows a dark brand panel on the left with:
- Linkon logo (56×56)
- Brand kicker in teal: "Linkon Account"
- Headline: "하나의 계정으로 필요한 AI 서비스를 시작하세요."
- Supporting copy
- Service logo row: Vion / Rion / Taxon icons

On mobile (≤1100px), the panel hides and the layout reverts to the original centered flex — preserving the existing mobile UX.

```
┌─────────────────────┬─────────────────────┐
│ [Linkon logo]       │   [Linkon wordmark]  │
│ LINKON ACCOUNT      │                      │
│                     │  로그인              │
│ 하나의 계정으로     │  이메일 [_________]  │
│ 필요한 AI 서비스를  │  비밀번호[_________] │
│ 시작하세요.         │    비밀번호 찾기 →   │
│                     │  [로그인]            │
│ [Vion][Rion][Taxon] │  계정 만들기 →       │
│                     │                      │
│  Dark tinted panel  │   White card         │
└─────────────────────┴─────────────────────┘
```

**Background changed** from `#f0fdf8 → #eff6ff → #fdf4ff` (mismatched cool tints) to `#f8f6ff → #f6f3ea` (purple-to-warm, matching brand).

---

### 2. Service Card Visual Tier — Vion Live vs Coming Soon ⭐

**What changed:** Added `.lp-service-card--live` and `.lp-service-card--soon` modifier classes  
**Files:** `styles/globals.css`, `app/page.tsx`

- **Vion (live):** Gets teal-tinted border + elevated box-shadow. Floats forward visually.
- **Rion/Taxon (coming soon):** Service icon at 50% opacity with slight grayscale, CTA footer at 72% opacity.

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ ████ VION  ●LIVE │  │ ░░░░ RION        │  │ ░░░░ TAXON       │
│  Teal border+    │  │  Muted icon      │  │  Muted icon      │
│  elevated shadow │  │  Dim CTA         │  │  Dim CTA         │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

### 3. Hero CTA Hierarchy — Primary Dominance

**What changed:** Second button (로그인하기) changed from `btn--outline btn--lg` to a text link  
**File:** `app/page.tsx`, `styles/globals.css`

```
Before:  [ 통합 계정 만들기 ]   [ 로그인하기 ]   (two equal buttons)
After:   [ 통합 계정 만들기 ]   로그인하기 →      (dominant + subtle)
```

---

### 4. Trust Chips Below Hero CTA

**What changed:** Added `.lp-trust-row` chips below the hero actions  
**File:** `app/page.tsx`

```
[ 통합 계정 만들기 ]   로그인하기 →

  • 무료로 시작   • 가입 2분 소요   • 카드 등록 불필요
```

Reuses the existing `.lp-trust-row` CSS component (was defined but unused on this page).

---

### 5. Forgot Password Link in Login Form

**What changed:** Added "비밀번호 찾기" link to the right of the password label  
**File:** `components/login-form.tsx`

```
비밀번호                     비밀번호 찾기
[________________________]
```

---

### 6. Login Input Disabled During Submission

**What changed:** Email + password inputs gain `disabled={loading}`  
**File:** `components/login-form.tsx`

Prevents confusing state where the button shows "로그인 중..." but fields are still editable.

---

### 7. Admin Background Gradient — Warm/Cool Fix

**What changed:** `#f6f3ea` (warm start) → `#f4f6fc` (cool start) for the admin shell  
**File:** `styles/globals.css`

Before: warm → cool (inconsistent)  
After: consistent cool blue-grey gradient matching the professional admin context.

---

### 8. Admin Stat Card Numbers — Smaller for Scannability

**What changed:** `font-size: var(--text-4xl)` (44px) → `var(--text-3xl)` (32px)  
**File:** `styles/globals.css`

4 stat cards in a row at 44px each is visually loud. 32px still reads as numbers-first but gives more breathing room.

---

### 9. Admin Sidebar — Wider & Email Truncation

**What changed:** `grid-template-columns: 360px …` → `clamp(360px, 32%, 460px) …`  
**File:** `styles/globals.css`

Also added `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on `.admin-user-row strong` to prevent long Korean email addresses from overflowing.

---

### 10. Admin "사용자 관리" Section Divider

**What changed:** Added a section header with border-bottom above the admin toolbar  
**File:** `components/admin/admin-console.tsx`, `styles/globals.css`

Creates a clear visual break between the overview stats section and the user management section.

---

## What Was Not Changed

- Design token system (variables.css) — solid, leave it
- Service color palette — distinctive and works well
- Card border radius system — premium and consistent
- Mobile hamburger drawer — well-implemented
- Launch notification tab UI — good pattern
- Auth form error handling — comprehensive
- Animation variables and hover transitions — smooth

---

## Remaining Suggestions (Not Implemented — Need More Design Work)

- Service pages individual identity (Vion wellness pulse, Rion document motif, Taxon ledger motif) — requires content changes
- Emoji → SVG icons in `sp-who-icon` — requires SVG design for each service's cards  
- Inline notification form on Rion/Taxon hero — requires new component
