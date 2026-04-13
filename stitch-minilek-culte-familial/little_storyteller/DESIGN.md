# Design System Strategy: The Illuminated Fable

## 1. Overview & Creative North Star
This design system is built to transform a standard educational quiz into a high-end, immersive storytelling experience. Moving away from the rigid, "boxed-in" nature of traditional ed-tech, our Creative North Star is **"The Illuminated Fable."** 

We treat the digital interface as a curated collection of light and paper. The aesthetic is defined by **Organic Editorialism**: a combination of sophisticated typography scales, intentional asymmetry, and "breathable" layouts. Instead of standard grids, we use overlapping elements and varying surface depths to guide the child’s journey through a narrative, making the quiz feel like an interactive storybook rather than an assessment tool.

---

## 2. Color & Chromatic Depth
The palette transitions from the soft warmth of `surface` (#fbf9f8) to the vibrant, energetic `primary` (#006a60) and `secondary` (#795900). 

*   **The "No-Line" Rule:** To maintain a premium, organic feel, designers are **prohibited from using 1px solid borders** for sectioning. Boundaries must be defined solely through background color shifts. For example, a "Story" section should sit on `surface`, while the "Quiz" area transitions to `surface-container-low`.
*   **Surface Hierarchy & Nesting:** Treat the UI as a series of physical layers. Use the `surface-container` tiers (Lowest to Highest) to create depth. A card should not have a stroke; it should be a `surface-container-lowest` shape sitting on a `surface-container-low` background, creating a soft, natural distinction.
*   **The "Glass & Gradient" Rule:** For floating elements or "Impossible Question" modals, use **Glassmorphism**. Apply a semi-transparent `surface` color with a `backdrop-blur` (12px–20px). 
*   **Signature Textures:** Main CTAs and Hero sections should use a subtle linear gradient from `primary` (#006a60) to `primary_container` (#3ecdbb) at a 135-degree angle to provide "visual soul" and a tactile, glowing quality.

---

## 3. Typography
We use a high-contrast pairing to balance playfulness with editorial authority.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Voice" tokens. Used for titles and big question moments. The rounded terminals of Plus Jakarta Sans provide a "friendly-premium" look that feels accessible but expensive.
*   **Body & Titles (Lexend):** Chosen for its exceptional readability in educational contexts. Use `body-lg` (1rem) for story text with an increased line-height (1.6) to ensure the reading experience feels like a luxury publication.
*   **The "Impossible" Scale:** For 'The Impossible Question', break the standard scale. Use `display-lg` but with a tight letter-spacing (-0.02em) to create a bold, monumental visual moment that signifies a shift in gameplay.

---

## 4. Elevation & Depth
In this system, hierarchy is conveyed through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** Stack `surface-container-lowest` cards on `surface-container-low` sections. This creates a "soft lift" that feels like heavy-weight paper resting on a desk.
*   **Ambient Shadows:** If an element must float (like a "Prayer" modal), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(27, 28, 28, 0.06)`. The shadow is never black; it is a low-opacity tint of `on-surface`.
*   **The "Ghost Border" Fallback:** If a boundary is strictly required for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "hint" of a container without breaking the organic flow.
*   **Depth through Blur:** Use background blurs behind navigation bars to allow the colors of the quiz content to bleed through, maintaining a sense of place within the story.

---

## 5. Components

### Interactive Surfaces (Buttons)
*   **Primary Action:** Rounded `xl` (2rem). Background: Gradient of `primary` to `primary_container`. Text: `on_primary`. 
*   **Secondary Action:** Rounded `xl`. Background: `secondary_container`. Text: `on_secondary_container`. No border.
*   **State Change:** On press, the element should slightly scale down (0.98) and increase in tonal depth (shift from `low` to `high` container tokens).

### Quiz Choice Tiles
*   **Style:** Forbid the use of standard radio buttons. Use large, tactile tiles using `surface-container-low`.
*   **Interaction:** Upon selection, the tile morphs to `primary_fixed_dim` with a "Ghost Border" of `primary`.
*   **Spacing:** Use `md` (1.5rem) vertical white space between options instead of dividers.

### The Impossible Question Section
*   **Styling:** This section should invert the app's brightness. Use `inverse_surface` as the background with `inverse_primary` typography. 
*   **Effect:** Apply a very subtle inner glow (box-shadow inset) using `primary_container` at 10% opacity to make the screen feel like it's vibrating with importance.

### The Prayer Section
*   **Styling:** Centered, editorial layout. Use `headline-sm` for the text content to give it a reverent, rhythmic pace.
*   **Visual Cue:** Use a `surface-bright` background with an increased `xl` (3rem) corner radius to create a "sanctuary" space within the app.

---

## 6. Do’s and Don’ts

### Do:
*   **Use Asymmetry:** Place illustrations slightly off-center or overlapping container edges to create a "storybook" feel.
*   **Prioritize Breathing Room:** If in doubt, add 8px more padding. The high-end feel comes from the abundance of negative space.
*   **Use Tonal Transitions:** Transition the background color slightly as the user progresses through the story.

### Don’t:
*   **Never use 100% opaque black (#000000) for text.** Use `on_surface` (#1b1c1c) to maintain a soft, premium look.
*   **Avoid "Floating" Borders:** Never use a border to separate a header from a body. Use a `surface` to `surface-container-low` transition instead.
*   **No Sharp Corners:** Every interactive element must use at least a `sm` (0.5rem) radius; buttons and major cards should lean toward `lg` (2rem) or `xl` (3rem).