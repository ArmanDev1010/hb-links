# HB Links Website Color Rules (hb-links.com)

Prepared by David

**For Claude Code:** this file is the single source of truth for every color on hb-links.com. It comes from a full audit of the live site on Nov 11, 2026: all 24 pages, the header in every state, both dropdowns, the mobile menu, every estimate-form step with its hover, selected, disabled and error states, plus the stylesheet and JS bundles for screens that only appear after an action. **Change colors only.** Do not change layout, spacing, sizes, fonts, copy, images, icons or animations.

## Contents
1. [How to run this](#1-how-to-run-this)
2. [The palette](#2-the-palette)
3. [Phase 1: Theme tokens](#3-phase-1-theme-tokens)
4. [Phase 2: Replace off-palette colors](#4-phase-2-replace-off-palette-colors)
5. [Phase 3: Text colors](#5-phase-3-text-colors)
6. [Phase 4: Component rules](#6-phase-4-component-rules)
7. [States](#7-states)
8. [Contrast: allowed and banned pairs](#8-contrast-allowed-and-banned-pairs)
9. [Do not touch](#9-do-not-touch)
10. [Anything not listed](#10-anything-not-listed)
11. [Verify](#11-verify)

## What the audit found
- Stack: Next.js (app router) + Tailwind CSS v4. Colors come from 4 theme tokens (`third`, `secondary`, `fourth`, `ink`), Tailwind defaults (`black`, `white`, `gray`, `neutral`, `red`) and hex values written into class names.
- About 20 colors outside the brand palette ([section 4](#4-phase-2-replace-off-palette-colors)).
- 7 small text spots below the 4.5:1 contrast minimum, plus brand green used as text on black (2.9:1).
- Grey text used about 15 different shades. They become two: Graphite on light, Silver on dark.

## 1. How to run this
1. Save this file in the repo root (next to `package.json`).
2. Create a branch, e.g. `brand-colors`.
3. Do Phases 1 to 4 in order (sections 3 to 6). Run the build and commit after each phase.
4. Never submit the live estimate form to test colors: it creates a real lead. Preview the "Request received" screen only in local dev (e.g. temporarily force its open state).
5. Finish with [Verify](#11-verify).

Ready-to-paste prompt:
> Read `HB-LINKS-WEBSITE-COLORS.md` and apply it phase by phase on a new branch `brand-colors`. Change colors only. After each phase, run the build and show me the diff. At the end, run the checks in section 11 and list anything you couldn't resolve.

## 2. The palette
| Color | Hex | Token in code | Role on the website |
|---|---|---|---|
| HB Green | `#106B37` | `third` (name kept) | Primary brand color: buttons on light, links, active and selected states, eyebrow squares, brand stripes |
| Forest Green | `#0A4523` | `forest` (new) | Hover and pressed state of green buttons |
| Electric Lime | `#C4E538` | `lime` (new) | Accent on **dark only**: main CTA on dark, accent words, live dots, highlights. Max ~10% of a screen. Text on it is always HB Black |
| HB Black | `#0B0F0D` | `black` (remapped), `secondary`, `ink` | Dark sections, primary text on light |
| White | `#FFFFFF` | `white` | Light sections, text on dark and green |
| Silver | `#C5CCD0` | `silver` (new) | Secondary text and icons on dark |
| Graphite | `#4B5450` | `fourth` (name kept) | Secondary text and icons on light |
| Concrete | `#F4F5F2` | `concrete` (new) | Off-white panels, tabs, form fields |

Not brand colors, allowed only where stated:
- Error `#C81E1E` (`error`): form validation only, always together with a text message.
- Google logo colors and gold review stars: keep as they are ([Do not touch](#9-do-not-touch)).

How a screen should feel (60-30-10):
- Dark sections (hero, dark contact, footer, 404, "Request received"): Black 60 · Green 30 (stripes, details) · Lime 10 (CTA, accents).
- Light sections: White or Concrete 60 · Black text 30 · Green 10.

## 3. Phase 1: Theme tokens
In the global stylesheet, find the `@theme` block that defines `--color-third`, `--color-secondary`, `--color-fourth` and `--color-ink`. Make its color lines exactly:

```css
@theme {
  /* HB Links website palette: see HB-LINKS-WEBSITE-COLORS.md */
  --color-third: #106B37;      /* HB Green (name kept) */
  --color-forest: #0A4523;     /* Forest Green: hover/pressed on green */
  --color-lime: #C4E538;       /* Electric Lime: dark surfaces only, black text on it */
  --color-black: #0B0F0D;      /* HB Black: replaces Tailwind's pure black everywhere */
  --color-black-soft: color-mix(in oklab, var(--color-black) 95%, white); /* tint of HB Black, not a new color */
  --color-secondary: #0B0F0D;  /* HB Black */
  --color-ink: #0B0F0D;        /* HB Black */
  --color-fourth: #4B5450;     /* Graphite */
  --color-silver: #C5CCD0;     /* Silver */
  --color-concrete: #F4F5F2;   /* Concrete */
  --color-white: #FFFFFF;
  --color-error: #C81E1E;      /* functional: form errors only */
}
```

Why remap `black`: the site uses `text-black`, `bg-black` and `border-black/…` hundreds of times. Remapping the token turns all of them into HB Black without touching those classes.

Then, in the same stylesheet:

```css
body { color: var(--color-black); background-color: var(--color-white); } /* body text was #222 */

::selection { background-color: var(--color-lime); color: var(--color-black); }

.legal-prose { color: color-mix(in oklab, var(--color-black) 80%, transparent); }
.legal-prose h3, .legal-prose strong, .legal-prose a:hover { color: var(--color-black); }
/* .legal-prose a and li::marker stay var(--color-third) */
```

In the root layout (`app/layout.tsx`), add the mobile browser bar color (merge into an existing `viewport` export if there is one):

```ts
export const viewport = { themeColor: '#0B0F0D' };
```

## 4. Phase 2: Replace off-palette colors

### 4A. Hex values in class names
| Find | Replace with | Where |
|---|---|---|
| `bg-[#090b0a]` | `bg-black` | Hero on home + 8 location pages |
| `bg-[#111111]` | `bg-black` | Dark contact section, footer, "Request received" step circles |
| `bg-[#111111]/40` | `bg-black/40` | Mobile menu backdrop |
| `bg-[#121212]` | `bg-black` | Page-transition panels (even) |
| `bg-[#161616]` | `bg-black-soft` | Page-transition panels (odd) |
| `bg-[#F7F7F7]` | `bg-concrete` | Services tabs, FAQ number badges |
| `bg-[#fafafa]` | `bg-concrete` | Service-area panels, legal tab bar, service-page sections |
| `bg-[#f5f4f1]` | `bg-concrete` | Estimate form background and inputs, `/contact` light section, light contact icon chips, service-area strip |
| `bg-[#f7f7f5]` | `bg-concrete` | Estimate form "Your picks" bar |
| `text-[#3fbf74]` | `text-lime` | "Open now" in the dark contact section |
| `bg-[#3fbf74]` | `bg-lime` | "Open now" dot |
| `group-hover:text-[#3fbf74]` | `group-hover:text-lime` | Dark contact icons, arrows, social icons |
| `hover:bg-[#0c5a2e]` | `hover:bg-forest` | Compact header "Request a free estimate" button |
| `bg-[#ffe45c]` | `bg-lime` (keep `text-black`) | "Request received": "3 business hours" highlight |

### 4B. Tailwind default colors
| Find | Replace with | Where |
|---|---|---|
| `text-neutral-50` | `text-white` | Hero headline |
| `text-neutral-200` | `text-silver` | Hero paragraph |
| `text-neutral-300` | `text-silver` | Hero eyebrow line (Licensed & Insured / CSLB / Los Angeles) |
| `text-gray-500` | `text-fourth` | Review dates |
| `text-red-600` | `text-error` | Form error messages |
| `border-red-400` | `border-error` | Inputs with an error |

### 4C. Colors outside class names (CSS, inline styles, SVG)
| Find | Replace with | Where |
|---|---|---|
| `body` color `#222` | `var(--color-black)` | Default text, most `h2`s, icons using `currentColor` ([Phase 1](#3-phase-1-theme-tokens)) |
| `.legal-prose` `rgba(0,0,0,.78)` and `rgb(17,17,17)` | see [Phase 1](#3-phase-1-theme-tokens) | Legal pages |
| 404 numeral `linear-gradient(137deg, #fff 50%, rgb(11,133,64) 50%)` | `linear-gradient(137deg, var(--color-white) 50%, var(--color-lime) 50%)` | 404 page "404" |
| Hard-coded `#6b6b6b` (icon fill in the reviews section) | `var(--color-fourth)` | Reviews |
| Logo fills inheriting `ink` | see [Header](#61-header-and-menus) | Logo |

## 5. Phase 3: Text colors
First decide which surface the element sits on, then use only these:

| Surface | Primary text | Secondary text | Small labels / meta | Accent |
|---|---|---|---|---|
| Light (White, Concrete, light translucent panels) | `text-black` | `text-fourth` | `text-fourth` | `text-third` |
| Dark (HB Black, photos with dark overlay) | `text-white` | `text-silver` | `text-silver/70` | `text-lime` |
| HB Green (buttons, tags) | `text-white` | n/a | n/a | n/a |
| Lime | `text-black` | n/a | n/a | n/a |

Long legal paragraphs may use `text-black/80` (10.7:1). Inactive or decorative items on dark may use `text-silver/50`; decorative icons on light may use `text-fourth/60`. On photo heroes, if Silver text sits over a bright part of the photo, use `text-white`.

### 5A. Light surfaces: replace faint tints
| Find | Replace with |
|---|---|
| `text-black/45` · `/50` · `/55` · `/60` · `/65` · `/70` · `/75` | `text-fourth` |
| `text-black/25` · `/30` · `/35` · `/40` (text or meaningful icons) | `text-fourth` |
| `text-black/25` on decorative arrows | `text-fourth/60` |
| `group-hover:text-black/75` | `group-hover:text-black` |
| `text-secondary/60` | `text-fourth` (keep `group-hover:text-secondary`) |
| `text-fourth/60` · `text-fourth/85` | `text-fourth` |
| `text-third/60` | `text-third` |
| `text-ink/55` | `text-fourth` |
| `placeholder:text-black/30` | `placeholder:text-fourth/85` |
| `text-black/80`, `text-black` | keep |

### 5B. Dark surfaces: replace white tints
| Find | Replace with |
|---|---|
| `text-white/60` · `/65` · `/70` · `/75` · `/80` · `/85` | `text-silver` |
| `text-white/40` · `/45` · `/50` | `text-silver/70` |
| `text-white/25` · `/35` (inactive or decorative) | `text-silver/50` |
| `text-third` (text on dark) | `text-lime` |
| `hover:text-third` (on dark) | `hover:text-lime` |
| `text-white` | keep |

Borders and fills with white or black alpha (`border-white/10`, `bg-white/[0.04]`, `border-black/10`, `bg-black/[0.06]` …) are neutral tints: keep them.

## 6. Phase 4: Component rules

### 6.1 Header and menus
The header has three looks. Use the existing flags (e.g. the over-hero flag that switches `border-white/50 text-white` and `border-ink/25 text-ink`); don't merge them. If one button component renders CTAs on both dark and light surfaces, add a tone prop instead of changing the light version.

**Over the hero (transparent, on dark):**
- Logo white; nav links `text-white`; "License #1144057" `text-silver`; divider stays `bg-white/40`.
- Instagram and phone buttons: keep `border-white/50 text-white hover:bg-white hover:text-black`.
- "Get a Free Estimate": `bg-lime text-black border-lime hover:bg-white hover:border-white hover:text-black` (was green with a white border).
- Mobile menu button: keep `border-white/50 text-white`.

**Light (after scrolling, light pages, mobile panel):**
- Logo: dark parts pure `#000000` (brand rule), green part HB Green. Don't let the logo inherit HB Black or Graphite.
- Links `text-black`; "License #1144057" `text-fourth`; divider `bg-ink/15`.
- Instagram and phone: keep `border-ink/25 text-ink hover:bg-ink hover:text-white`.
- "Get a Free Estimate": `bg-third text-white hover:bg-forest` (the mobile panel uses `hover:bg-black` today; change it to `hover:bg-forest`).

**Compact floating header (white bar, search `Request a free estimate`):** keep `bg-white border-ink/15`, phone `text-ink hover:bg-ink/[0.04]`; estimate button `bg-third text-white hover:bg-forest`. Socials popover: keep `bg-white/95 border-black/10`.

**Services dropdown (desktop, light):** "What we build" `text-third`; numbers `text-third` (were `/60`); titles `text-black`, hover `text-third`; descriptions `text-fourth`; footer line `text-fourth`; "Get a free estimate" link `text-third`.

**Service Areas dropdown (desktop, light):** row icon boxes `border-black/10 text-fourth`, row hover `border-third/40 text-third`; arrows `text-fourth/60`, hover `text-third`; current page `text-third`; "See all service areas" keep `border-third/30 bg-third/[0.06] text-third hover:bg-third hover:text-white`.

**Mobile menu:** backdrop `bg-black/40`; panel keep `bg-white/85`; links `text-black`; submenu `bg-black/[0.03]`; numbers `text-third`; descriptions `text-fourth`; area links `text-black/80`, current `text-third`; area icons `text-fourth`, hover `text-black`; close button keep `bg-ink border-ink text-white`; social squares and phone keep `border-black/25 text-black hover:bg-black hover:text-white`.

### 6.2 Hero (home, 8 service pages, 8 location pages)
- Section `bg-black` (from `#090b0a`; service heroes already use `!bg-black`); headline `text-white`.
- Black overlays on the scene and photos (`rgba(0,0,0,…)` gradients, `from-black/75`): keep.
- Eyebrow line `text-silver`; the "/" separators `text-lime`.
- Paragraph `text-silver`.
- "Get a Free Quote": `bg-lime text-black border-lime hover:bg-white hover:border-white hover:text-black`.
- Scroll-story UI drawn in HTML (active progress segment, label dots and borders): Lime instead of green. Anything baked into the 3D render or images: leave.

### 6.3 Light sections
- **Section eyebrows** (small square + label + line): square `bg-third`, label `text-fourth`, line `from-fourth/20` (keep).
- **Who We Are** (`#about`): keywords `text-third`; small labels `text-fourth` (were `/85`); cards `border-black/10`.
- **Services** (`#services`, home + location pages): tabs `bg-concrete`, border `border-secondary/15`, hover `/40`, active `border-third`; numbers `text-fourth`; inactive labels `text-fourth`, hover and active `text-secondary`; square `bg-secondary/30`, hover and active `bg-third`. Card `bg-white border-secondary/15`; meta and description `text-fourth`; title `text-secondary`; "Learn More" keep `bg-black text-white hover:bg-third`.
- **Process** (`#process`): keep `border-black/15 hover:border-third`.
- **Reviews**: gold stars and Google logo unchanged; dates `text-fourth`; quote mark `text-third/30` (decorative, keep); active avatar keep `ring-third`.
- **Service areas** (`#service_areas`): panels and strip `bg-concrete`; city chips keep `border-third bg-third/5 text-third`; dashed box keep `border-third/50 bg-third/5`.
- **FAQ** (`#faq`): number badges `bg-concrete border-black/25 text-third`; open item `border-black/40`; open icon `bg-third text-white`; "Call (818) 303-3555" `bg-third border-third text-white hover:bg-forest`; "Get a free on-site estimate" link keep `text-third decoration-third/40 hover:decoration-third`.
- **Service-page sections** (`#guide`, `#options`, `#included`, `#related`): `#fafafa` backgrounds `bg-concrete`; icons inherit HB Black; numbers `text-third`.

### 6.4 Contact sections
**Dark contact section** (home "Let's Talk About Your Project", service pages "Ready to Build Your ADU?" and siblings, location pages): `bg-black`; heading `text-white`, accent word (e.g. "ADU?") `text-lime`; eyebrow square `bg-lime`, eyebrow text `text-silver/70`; paragraphs `text-silver`. The embedded estimate card stays light ([6.5](#65-estimate-form-modal-and-embedded)).

The contact block has a tone object with `dark` and `light` keys (search `closedDot`). Replace it with:

```js
dark: {
  rule: "border-white/10", body: "text-silver",
  accent: "text-lime", dot: "bg-lime",
  closed: "text-silver/70", closedDot: "bg-white/30",
  cell: "border-white/[0.06] bg-white/[0.04]",
  cellHover: "hover:border-white/15 hover:bg-white/[0.08]",
  icon: "border-white/15 bg-white/[0.06] text-silver group-hover:text-lime",
  label: "text-silver/70", value: "text-white",
  arrow: "text-silver/50 group-hover:text-lime",
  socialIcon: "text-silver group-hover:text-lime",
},
light: {
  rule: "border-black/10", body: "text-fourth",
  accent: "text-third", dot: "bg-third",
  closed: "text-fourth", closedDot: "bg-black/30",
  cell: "border-black/10 bg-white", cellHover: "hover:border-black/25",
  icon: "border-black/10 bg-concrete text-fourth group-hover:text-third",
  label: "text-fourth", value: "text-black",
  arrow: "text-fourth/60 group-hover:text-third",
  socialIcon: "text-fourth group-hover:text-third",
},
```

**`/contact` light section:** `bg-concrete`, uses the `light` tone.

**"Contact us" dark block** (`#contact-us`, legal pages): `bg-black`; text `text-silver`; borders keep `border-white/15`; icon chips keep `border-white/20 bg-white/5`.

### 6.5 Estimate form (modal and embedded)
Light surface. Keep the black primary button (it sits on white).
- Backdrop keep `bg-black/55`; panel `bg-white`; header `border-black/10`, square `bg-third`, title `text-black`; close button keep `border-black/15 hover:bg-black hover:text-white hover:border-black`.
- Body `bg-concrete`; card `bg-white border-black/10`.
- "Step X of 4" `text-third`; question `text-black`; "(optional)" `text-fourth`; progress track `bg-black/[0.06]`, fill `bg-third`.
- Option cards and city pills: default `border-black/15 bg-white hover:border-black/40`; icon `border-black/10 text-fourth` (cards) or `text-fourth` (pills); selected `border-third bg-third/[0.04] text-third`, icon `border-third/40 text-third`.
- Descriptions, "— type it in below", "Tap to continue", field labels, consent text and Back: `text-fourth`; Back hover `text-black`.
- Inputs `bg-concrete border-transparent focus:border-black placeholder:text-fourth/85`; with an error `border-error` plus a `text-error` message.
- Consent: checkbox `accent-third`; "Text me about my request." `text-black/80`; links underlined, hover `text-third`.
- Continue: keep `bg-black text-white hover:bg-third disabled:opacity-35 disabled:hover:bg-black`.
- "Your picks" bar `bg-concrete border-black/10`; label and hint `text-fourth`; picks `decoration-black/30`, current and hover `text-third decoration-third`.
- Blueprint: keep line art and grid; dimension and city labels Graphite (`var(--color-fourth)`); pin `bg-third ring-third/20`; tag `border-third bg-third text-white`; "Your blueprint" tag `bg-white/90 text-fourth`.

### 6.6 "Request received" (after submit, dark)
Search `3 business hours`.
- Panel `bg-black`; title `text-white`; body `text-silver`; "Boris" `text-white`.
- Highlight `bg-lime text-black` (was `#ffe45c`).
- Phone link keep `text-white decoration-white/30 hover:decoration-white`; close button keep `border-white/20 hover:bg-white hover:text-black`.
- Step circles: done keep `bg-white text-black`; current `bg-black border border-lime text-lime shadow-[0_0_20px_2px_rgba(196,229,56,0.3)]`, its pulse `bg-lime/30`; upcoming `bg-black border border-white/15 text-silver/50`.
- Step labels: done `text-silver`, current `text-white`, upcoming `text-silver/70`. Connectors keep `bg-white/[0.12]` and `bg-white/60`.
- "Up next" `text-silver/70`; its dot `bg-lime shadow-[0_0_8px_2px_rgba(196,229,56,0.55)]`.

### 6.7 Footer
- `bg-black`; top stripe keep `border-third`.
- Column titles and bottom bar `text-silver/70`; body text `text-silver`; links `text-white`, hover `text-lime`.
- "Get a Free Quote": Lime button, same classes as the hero.
- Social squares keep `border-white/25 bg-white/10 hover:border-white/60 hover:bg-white/20`; dividers keep.

### 6.8 Page transition and loader
- Panels `bg-black` and `bg-black-soft` ([4A](#4a-hex-values-in-class-names)); top and bottom bars keep `bg-third`.
- Loader: track keep `bg-white/15`, laser line keep `bg-third`.

### 6.9 Legal pages (5)
- "Legal" label `text-fourth`; title `text-black`.
- Tab bar `bg-concrete border-black/10`; tabs `bg-white border-black/15 text-fourth hover:border-black hover:text-black`; current tab keep `bg-black border-black text-white`.
- "On this page": label `text-fourth`; items `text-fourth hover:text-black`; numbers `text-fourth group-hover:text-third`; current item keeps its existing current style.
- Body text per `.legal-prose` ([Phase 1](#3-phase-1-theme-tokens)); links `text-third`.
- "Contact us" block: see [6.4](#64-contact-sections).

### 6.10 404 page
- Section `bg-black`; eyebrow square `bg-lime`, eyebrow text `text-silver/70`; heading `text-white`; paragraph `text-silver`.
- "404" numeral: white + Lime split ([4C](#4c-colors-outside-class-names-css-inline-styles-svg)).
- "Our services" label `text-silver/70`; its links `text-silver hover:text-white`.
- Outline buttons keep `border-white/40 text-white hover:bg-white hover:text-black`; phone link keep `decoration-white/40`. Any primary CTA here is a Lime button.

## 7. States
| State | On light | On dark |
|---|---|---|
| Hover, green button | `bg-forest` | n/a |
| Hover, Lime button | n/a | `bg-white text-black` |
| Hover, black button | `bg-third` | n/a |
| Hover, outline button | `bg-black text-white` | `bg-white text-black` |
| Hover, text link | `text-third` or `text-black` | `text-lime` or `text-white` |
| Focus ring (`focus-visible:outline-…`) | `outline-third` | `outline-lime` |
| Input focus | `border-black` | n/a |
| Selected / current | `border-third text-third` (+ `bg-third/[0.04]`) | `text-lime` / `border-lime` |
| Disabled | `opacity-35`, no color change on hover | same |
| Error | `border-error` + `text-error` message | n/a (no forms on dark) |
| Placeholder | `text-fourth/85` | n/a |
| Text selection | Lime with HB Black text | same |

## 8. Contrast: allowed and banned pairs
Minimum 4.5:1 for normal text; 3:1 for large text (24px+, or 19px+ bold) and for icons.

| Text / icon | On | Ratio |
|---|---|---|
| HB Black | White · Concrete | 19.3 · 17.6 |
| Graphite | White · Concrete | 7.8 · 7.2 |
| HB Green | White · Concrete | 6.6 · 6.0 |
| Error | White · Concrete | 5.7 · 5.2 |
| White | HB Black · HB Green · Forest | 19.3 · 6.6 · 11.1 |
| Silver | HB Black · Forest | 11.9 · 6.8 |
| Silver/70 | HB Black | 6.2 |
| Lime | HB Black · Forest · HB Green | 13.4 · 7.7 · 4.6 |
| HB Black | Lime | 13.4 |
| Silver | HB Green | 4.1 (large text and icons only) |

Banned:
- Lime or Silver on White or Concrete (1.4 / 1.6), including Lime buttons on light sections.
- HB Green text on HB Black, or HB Black text on HB Green (2.9). Decorative green stripes on black are fine.
- Lime on Silver (1.1); Graphite on HB Black (2.5).
- White text on Lime.

## 9. Do not touch
- Google logo colors (`#FFC107`, `#FF3D00`, `#4CAF50`, `#1976D2`).
- Gold review stars `oklch(75% 0.18 80)`: approved exception, they are real Google ratings.
- Photos, the 3D hero render, any raster image, the favicon and `/seo/logo.png`.
- Shadows and photo overlays built from `rgba(0,0,0,…)`.
- Blueprint line art (black and white alpha strokes) and the custom scrollbars.
- Everything that is not a color.

## 10. Anything not listed
1. Find the surface: light (White, Concrete, light panels), dark (HB Black, darkened photos) or green.
2. Pick the text color from [section 5](#5-phase-3-text-colors) and check the pair in [section 8](#8-contrast-allowed-and-banned-pairs).
3. Accent: HB Green on light, Lime on dark. Primary button: green on light, Lime on dark. Secondary button: outline.
4. Never add a new hex. Tints only as `/opacity` of a palette token.
5. If unsure, take the higher-contrast option and leave `/* COLOR-CHECK: reason */` for review.

## 11. Verify
Run from the repo root. Each search should return nothing except the expected items noted.

```bash
# Old hex colors
rg -n -i --glob '!node_modules' --glob '!.next' --glob '!*.md' \
  -e '#(090b0a|111(111)?|121212|161616|f7f7f7|fafafa|f5f4f1|f7f7f5|3fbf74|0c5a2e|ffe45c|0b8540|222(222)?|6b6b6b|1c1a17)\b' \
  -e 'rgb\(\s*11,\s*133,\s*64' .

# Tailwind default color scales
rg -n --glob '!node_modules' --glob '!.next' \
  -e '\b(text|bg|border|fill|stroke|ring|outline|decoration|from|via|to)-(gray|neutral|zinc|slate|stone|red|green|emerald|yellow|amber)-\d{2,3}\b' .

# Faint text tints
rg -n --glob '!node_modules' --glob '!.next' --glob '!*.md' \
  -e 'text-white/\d+' -e 'text-black/[1-7]\d\b' -e 'text-(third|fourth|secondary|ink)/\d+' .
```
Expected leftovers in the last search: `text-third/30` (decorative quote mark), `text-fourth/60` (decorative arrows), `placeholder:text-fourth/85`.

**Pages** (check at 1440px and 390px wide):
- [ ] https://hb-links.com/
- [ ] /contact
- [ ] Services: /adu-builder-los-angeles, /garage-conversion-los-angeles, /home-remodel-los-angeles, /kitchen-remodel-los-angeles, /bathroom-remodel-los-angeles, /home-additions-los-angeles, /deck-and-patio-los-angeles, /design-build-los-angeles
- [ ] Locations: /general-contractor-woodland-hills, /general-contractor-encino, /general-contractor-tarzana, /general-contractor-calabasas, /general-contractor-canoga-park, /general-contractor-sherman-oaks, /general-contractor-reseda, /general-contractor-northridge
- [ ] Legal: /terms-of-service, /privacy-policy, /sms-terms, /disclaimer, /accessibility
- [ ] 404 (any unknown URL)

**States:**
- [ ] Header: over the hero, after scrolling, compact floating bar, light pages
- [ ] Services and Service Areas dropdowns (hover each row)
- [ ] Mobile menu: open, both submenus, close button
- [ ] Estimate form: steps 1 to 3, hover, selected, Continue disabled and enabled, input focus, empty-field errors (local dev for anything past step 3)
- [ ] "Request received" (local dev only)
- [ ] Services tabs, FAQ open and closed, footer hovers, legal tabs, 404
- [ ] Tab through header, form and footer with the keyboard: focus ring visible on light and dark
- [ ] Lighthouse or axe: no color-contrast failures on /, one service page, one location page, /contact, one legal page and the 404

**Done when** all searches are clean (except the expected leftovers), every page and state above is checked, the build passes, and before/after screenshots differ only in color.
