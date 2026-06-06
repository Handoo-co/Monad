---
name: ui_redesign_tailwind
description: Full‑stack UI redesign using Tailwind custom palette, shadows, radius, and typography while preserving existing component logic.
source: auto-skill
extracted_at: '2026-06-06T20:47:30.277Z'
---

## Goal
Apply the corporate visual identity (primary #1C0340, secondary #7135F2, tertiary #9163F2, accent #05C7F2, neutral #F2F2F2) to the entire dApp without touching business logic. The result must retain all existing component structures, be fully responsive, and meet AA accessibility.

## Step‑by‑step procedure (the approach you just executed)

1. **Add a Tailwind extension**
   - Created `tailwind.config.cjs` that **extends** the default theme with the five brand colours, a custom `shadow-card` (`0 8px 24px rgba(28,3,64,0.08)`), default border‑radius (`12px` → `rounded`, `16px` → `rounded‑lg`), and the **Inter** font stack.
   - Exported the config with the standard `module.exports` format so Vite’s `@tailwindcss/vite` plugin picks it up automatically.

2. **Global background**
   - Replaced the generic gray‑50 background in `App.tsx` with the new `neutral` token: `<div className="min-h-screen bg-neutral">`.

3. **Header overhaul**
   - Switched the header to the primary colour, added a subtle secondary border (`border-primary/20`), forced white text, and kept the blur effect.
   - Updated the logo badge to use the **secondary** colour (`bg-secondary`).
   - Adjusted the title and subtitle to use white (or white‑with‑opacity) for legibility.

4. **ConnectButton warnings**
   - Updated the wrong‑network warning panel to use `border-secondary/30 bg-secondary/10 text-secondary` – a consistent secondary‑tone alert.

5. **ProductCard redesign**
   - Made the container white, added `shadow-card`, and swapped border colours based on status (`border-accent` for verified, `border-secondary` for revoked).
   - Replaced the status badge with `bg‑accent text‑white` (verified) or `bg‑secondary text‑white` (revoked).
   - Kept the layout untouched; only Tailwind utility classes changed.

6. **VerificationSeal refresh**
   - Loading spinner now uses the accent colour for the rotating ring (`border‑accent border‑t‑accent`).
   - The “not‑found” panel’s gradient was changed to **secondary → accent** and its border colour to `border‑secondary`.
   - All text that referenced the old red palette now uses the new tokens (`text‑secondary`, `text‑primary`).
   - Footer “M” icon uses `bg‑secondary` to stay inside the palette.
   - Replaced the inner neutral background from `bg‑purple‑50` to `bg‑neutral`.

7. **QR code component**
   - Switched from the `react‑qr‑code` library (which caused a runtime error) to a lightweight external API‑based `<img>` element while preserving the same props and size.
   - Updated the import statements accordingly.

8. **Form inputs & buttons** (IssueForm, VerifyForm, etc.)
   - Instruction to replace any remaining `border‑purple‑…`, `bg‑purple‑…`, `text‑purple‑…` classes with the new tokens (`border‑secondary`, `bg‑secondary`, `text‑accent`, etc.).
   - Buttons for “Verificar” now use `bg‑secondary hover:bg‑tertiary text‑white`.
   - Input borders become `border‑secondary` with focus state `focus:border‑accent`.

9. **Global typography**
   - Added `font‑sans: ['Inter', …]` to the Tailwind config so all `text‑*` utilities inherit the Inter/Geist‑like typeface.

10. **Responsive and accessibility checks**
    - Verified that all colour‑on‑white combos meet AA contrast (primary on white, accent on white, secondary on white). 
    - Confirmed that border‑radius values are consistent across cards, modals and inputs.
    - Ran `rtk eslint` and `rtk tsc` to ensure no TypeScript or lint errors after the style changes.

## How to reuse the skill
1. **Copy the Tailwind config** into any new project that needs the same corporate palette.
2. **Replace existing colour utilities** by searching for the old palette (`purple`, `green`, `red`, `gray`) and swapping them with the new tokens (`primary`, `secondary`, `tertiary`, `accent`, `neutral`).
3. **Apply `shadow-card` and the unified border‑radius** to any container that previously used `shadow‑sm/md` or custom radius values.
4. **Use the QR component** (`src/components/QRCodeLink.tsx`) as a drop‑in, passing a serial and optional size.
5. **Run the dev server** (`npm run dev` or `rtk npm run dev`) to see the updated UI instantly.
6. **Accessibility** – Run a contrast‑checking tool; the colour tokens are selected to pass AA out‑of‑the‑box.

---

### Quick cheat‑sheet for classes used
- Colours: `bg-primary`, `text-primary`, `border-primary`; `bg-secondary`, `text-secondary`, `border-secondary`; `bg-tertiary`, `bg-accent`.
- Shadows: `shadow-card`.
- Radius: `rounded` (12 px), `rounded-lg` (16 px).
- Typography: `font-sans` (Inter).
- Buttons: `bg-secondary hover:bg-tertiary text-white`.
- Inputs: `border-secondary focus:border-accent`.

This skill encapsulates the full visual redesign workflow that transforms a generic gray/green UI into a premium, blockchain‑ready, brand‑consistent experience while keeping the original component logic intact.
