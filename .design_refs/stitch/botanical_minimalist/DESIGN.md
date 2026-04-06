# Design System Documentation

## 1. Overview & Creative North Star: "The Botanical Archivist"

This design system is built to evoke the feeling of a high-end, limited-edition botanical journal. It moves away from the "app-like" density of traditional e-commerce and toward a "Digital Gallery" experience. Our Creative North Star is **The Botanical Archivist**: a philosophy that treats every plant as a piece of art and every UI element as a discreet frame.

To break the "template" look, we employ:
*   **Intentional Asymmetry:** Utilizing staggered grids and varying image aspect ratios to mimic a curated scrapbook.
*   **Editorial Scaling:** Drastic contrast between massive, elegant serif headings and tiny, functional labels.
*   **Tonal Depth:** Replacing harsh lines with overlapping "paper" layers and monochromatic transitions.

---

## 2. Colors

The palette is strictly monochromatic, drawing soul from the varying depths of green. Contrast is achieved through luminance rather than hue.

### The Palette
*   **Base Surface:** `surface` (#f8faf5) — A warm, cream-tinted green that serves as our primary "paper."
*   **Headings/Emphasis:** `secondary` (#486730) — Our darkest tone, used for maximum legibility in typography.
*   **Primary UI/Action:** `primary_fixed` (#516448) — The workhorse color for buttons and interactive states.
*   **Sectioning:** `surface_container` (#ecefea) — Used for large background blocks to break up the page flow.

### Core Visual Rules
*   **The "No-Line" Rule:** We strictly prohibit 1px solid borders for sectioning. To separate content, shift the background color (e.g., place a `surface_container_low` section against the `surface` background). Boundaries should be felt, not seen.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of fine paper. Use `surface_container_lowest` for elevated cards sitting on a `surface_container_low` section. This creates a tactile, nested depth.
*   **The "Glass & Gradient" Rule:** For floating navigation or modal overlays, use **Glassmorphism**. Use semi-transparent `surface` colors with a 12px-20px backdrop-blur. 
*   **Signature Textures:** For high-impact areas (Hero CTAs), use a subtle linear gradient from `primary_fixed` (#516448) to `secondary` (#486730). This prevents the UI from looking flat and digital.

---

## 3. Typography

The system relies on the tension between the classic **Noto Serif** and the contemporary **Manrope**.

*   **Display & Headlines (Noto Serif):** Use these for "Moment" typography. They should be set with tight letter-spacing (-2%) to feel like a high-fashion masthead. 
    *   `display-lg`: For hero statements.
    *   `headline-md`: For category titles.
*   **Body & Titles (Manrope):** Clean, utilitarian, and highly readable.
    *   `body-lg`: The standard for product descriptions.
    *   `title-sm`: Used for sub-headers within cards.
*   **Labels (Manrope):** Set in all-caps with increased letter-spacing (+5%) for a premium, archival feel.

---

## 4. Elevation & Depth

We avoid the "shadow-heavy" look of standard Material Design. Instead, we use **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface_container_lowest` (#ffffff) card placed on a `surface_container` (#ecefea) background provides all the "lift" required.
*   **Ambient Shadows:** If a floating element (like a "Back to Top" button) requires a shadow, it must be tinted. Use 6% opacity of the `on_surface` (#191c1a) color with a 32px blur. Never use pure black shadows.
*   **The "Ghost Border" Fallback:** Where a container boundary is technically required (like an input field), use a **Ghost Border**. Apply `outline_variant` at 20% opacity. 100% opaque borders are strictly forbidden.
*   **Glassmorphism:** Apply to the Header/Navigation. Use `surface` at 80% opacity with a `backdrop-filter: blur(10px)`. This integrates the UI into the photography behind it.

---

## 5. Components

### Buttons
*   **Primary:** `primary_fixed` background with `on_primary` text. Shape: `md` (0.375rem). No shadow.
*   **Secondary:** `surface` background with a `primary_fixed` "Ghost Border."
*   **Interaction:** On hover, the primary button should shift to `secondary` (#486730) for a subtle, sophisticated darken.

### Inputs & Selectors
*   **Text Fields:** Use `surface_container_lowest` backgrounds with a bottom-only `outline_variant` (20% opacity). This mimics an elegant stationery form.
*   **Selectors:** Use subtle green outlines (`primary_fixed_dim`) only when focused.

### Cards & Lists
*   **The Card Rule:** No borders. No heavy shadows. Use `surface_container_low` as the card base on a `surface` background.
*   **Spacing over Dividers:** Never use horizontal rules (`<hr>`) to separate list items. Use the **Spacing Scale** (specifically `spacing.6` or `spacing.8`) to create "White Space Dividers."

### Signature Component: The "Archival Tag"
*   **Chips:** Used for plant care levels (e.g., "Low Light"). Use `surface_container_highest` background with `label-sm` typography. Shape: `none` (0px) to maintain the editorial look.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Whitespace:** If a section feels crowded, double the spacing. Use `spacing.20` or `spacing.24` for section margins.
*   **Use Tonal Shifts:** Define content blocks by switching between `surface` and `surface_container`.
*   **Scale Typography:** Use `display-lg` and `body-sm` in close proximity to create visual drama.

### Don't:
*   **No Accent Colors:** Do not introduce red for errors or blue for links. Use tonal shifts of green or bold underlined text for links.
*   **No Hard Lines:** Avoid 100% opaque borders. They break the "organic" flow of the boutique brand.
*   **No Standard Shadows:** Never use the default "Drop Shadow" preset in design tools. Always tint the shadow with a green hue and use high blur values.
*   **No Center Alignment:** For an editorial feel, stick to left-aligned typography or intentional, asymmetrical offsets. 

---

*This document serves as the single source of truth for the visual language. When in doubt, prioritize the "Botanical Archivist" North Star: If it doesn't look like it belongs in a high-end printed book, rethink the execution.*