---
name: Abdullatif Elmuaqqat — Night Overworld
description: A career laid out as a walkable pixel RPG overworld at night.
colors:
  ground: "#0c1814"
  ground-2: "#10221b"
  panel: "#152c23"
  panel-2: "#1b382c"
  line: "#34634b"
  grass: "#5aa862"
  path: "#d2a06a"
  amber: "#f6c64f"
  amber-lit: "#ffd977"
  amber-deep: "#b8902f"
  amber-ink: "#1d1404"
  cyan: "#74e6d8"
  ink: "#f3ecd8"
  muted: "#bcc8b8"
typography:
  display:
    fontFamily: "Pixelify Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(3.2rem, 8.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Pixelify Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.05
  title:
    fontFamily: "Pixelify Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.05
  body:
    fontFamily: "Atkinson Hyperlegible, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "VT323, ui-monospace, monospace"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.3
  button:
    fontFamily: "Pixelify Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
rounded:
  none: "0px"
spacing:
  px: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "clamp(72px, 10vw, 128px)"
  gutter: "clamp(16px, 4vw, 40px)"
components:
  button:
    backgroundColor: "{colors.panel-2}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "8px 18px"
    height: "44px"
  button-hover:
    backgroundColor: "{colors.line}"
  button-go:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "8px 18px"
    height: "44px"
  button-go-hover:
    backgroundColor: "{colors.amber-lit}"
  button-small:
    padding: "6px 14px"
    height: "40px"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "6px 14px"
    height: "44px"
  tab-selected:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.amber-ink}"
  panel-card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  panel-card-hover:
    backgroundColor: "{colors.panel-2}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  inventory-slot:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.amber}"
    rounded: "{rounded.none}"
    padding: "8px"
    size: "104px"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    padding: "10px 12px"
  nav-link-active:
    textColor: "{colors.amber}"
---

# Design System: Abdullatif Elmuaqqat — Night Overworld

## Overview

**Creative North Star: "The Night Overworld"**

The page is a pixel RPG map seen after dark. A deep green-navy ground carries every surface; panels are slightly lighter clearings framed by stepped, square-cornered pixel borders; one lamp-amber colour marks wherever the visitor can act or has just chosen; server cyan marks focus and things that are live. The palette was sampled from the overworld map art, so the UI and the illustrations read as one place.

Density is moderate and game-like: sections are tall, unhurried bands, but inside each one the content is packed into panels the way a game HUD packs a quest log or inventory. Three typefaces split the work cleanly: a pixel display face for names and headings, a highly legible sans for reading, a terminal face for small labels, stats and tags. Motion is short and springy (a 2px lift on hover, a 2px press on click) plus sprite animation that the visitor can pause.

The system is game-flavoured, never game-illegible: body copy stays in a reading face at 17px, every interactive element is at least 44px tall, and all motion has a pause control and a reduced-motion fallback.

**Key Characteristics:**
- Square corners everywhere; borders are drawn as a 4px pixel frame, never rounded.
- One action colour (amber) on a near-black green ground.
- Selection is shown by lighting: the chosen item's frame turns amber and a pixel wire with an arrowhead joins it to the panel it opened.
- Empty states are drawn on purpose as dashed ghost cells.
- Pixel art is always rendered with `image-rendering: pixelated`.

## Colors

A night palette: deep greens for ground and surfaces, a warm lamp amber for action, a cool cyan for focus, cream for ink.

### Primary
- **Lamp Amber** (amber): the one action colour. Primary button fill, links, the selected tab, the selected item's frame, connector wires, scroll progress bar, list markers, selection highlight. Text on it is always Amber Ink.
- **Lit Amber** (amber-lit): hover fill for the amber button only.
- **Banked Amber** (amber-deep): the pixel frame around amber fills (primary button, toast) and the coin's inner shade.
- **Amber Ink** (amber-ink): text on any amber fill.

### Secondary
- **Server Cyan** (cyan): keyboard focus outline (3px, 3px offset), live indicators (blinking square, log dates), inline code, terminal commands and links, the terminal frame while it has focus.

### Tertiary
- **Path Tan** (path): definition-term labels in quest metadata (Role, Loot). Use sparingly, as the map's dirt-path accent.
- **Grass** (grass): the terminal prompt only.

### Neutral
- **Night Ground** (ground): page background, header (at 92% opacity), map pin labels.
- **Deep Ground** (ground-2): image wells behind portraits and quest art.
- **Clearing** (panel): every card and panel surface at rest.
- **Lit Clearing** (panel-2): default button fill, hovered or selected panels, header and footer rules.
- **Moss Line** (line): the pixel frame, tag borders, dashed dividers. Decorative only; never used as text.
- **Cream Ink** (ink): headings and body text.
- **Lichen** (muted): secondary text, descriptions, nav links at rest, tag text.

### Named Rules
**The One Lamp Rule.** Amber means "act here" or "you chose this". Nothing decorative is amber; if an element is amber, it is clickable or currently selected.

**The Cyan Is State Rule.** Cyan is reserved for focus and live state. It never fills a button or a card.

## Typography

**Display Font:** Pixelify Sans (with ui-sans-serif, system-ui)
**Body Font:** Atkinson Hyperlegible (with ui-sans-serif, system-ui)
**Label/Mono Font:** VT323 (with ui-monospace)

**Character:** A chunky pixel face for anything that names a thing, a sans built for legibility for anything you read, and a CRT terminal face for the small print of the game world.

### Hierarchy
- **Display** (700, clamp(3.2rem, 8.5vw, 6rem), 0.95): the hero name only; the surname line is amber.
- **Headline** (700, clamp(2rem, 4.5vw, 3.25rem), 1.05): section headings, sitting left with a muted one-line instruction aligned right.
- **Title** (500, 1.35rem, 1.05; log titles 1.65rem): card and log titles, kept at medium weight because bold Pixelify fills the c and C counters; the open quest scales to clamp(1.5rem, 2.4vw, 2rem), dialogs to 2rem.
- **Body** (400, 1.0625rem, 1.6): all reading text, kept to 34–68ch. Card names in pickers use the body face at 700.
- **Label** (400, VT323 1.1–1.4rem, 1.2–1.3): stat names, metadata terms, tags, nav links, map pin labels, terminal. VT323 runs small, so it is always set larger than body.
- **Button** (Pixelify 500, 1rem): buttons, toasts, counters, the companion's speech bubble.

### Named Rules
**The Read In Atkinson Rule.** Any sentence a visitor must read is set in Atkinson Hyperlegible. Pixelify is for names and headings, VT323 for labels of a few words.

## Layout

Content sits in a centred 1200px column with a fluid gutter (clamp(16px, 4vw, 40px)). Sections are tall bands with clamp(72px, 10vw, 128px) vertical padding and a head row (heading left, muted instruction right, 40px below). The hero fills the first viewport minus the header.

The recurring layout is **picker + open panel**: a set of choices on one side (map pins, quest tabs, inventory slots) and one open detail panel on the other (asymmetric grids such as 1.6fr/1fr, 300px/1fr, 1fr/320px), with a 32px gap. Spacing steps are multiples of 4px (8, 12, 16, 20, 24, 32, 40).

Responsive: at 1080px the map, inventory and save-point grids stack; at 860px the hero, quest log and about stack, the nav becomes a drop-down menu, and the quest picker turns into a horizontal scroll-snap strip; at 640px the house rules go single column, hero buttons go full width and the inventory locks to 3 columns.

## Elevation & Depth

Depth is a hybrid: a hard, zero-offset 4px pixel frame defines every surface's edge, and a single soft drop shadow under it lifts panels off the ground. Hover lifts by moving the element up 2px, not by changing the shadow.

### Shadow Vocabulary
- **Pixel frame + lift** (`box-shadow: 0 -4px 0 0 var(--line), 0 4px 0 0 var(--line), -4px 0 0 0 var(--line), 4px 0 0 0 var(--line), 0 14px 28px -10px rgb(0 0 0 / .55)`): every button, card, panel, tab, slot, dialog, toast. Recolour the frame by overriding `--line` locally.
- **Map frame** (`box-shadow: 0 0 0 4px var(--line), 0 24px 48px -16px rgb(0 0 0 / .6)`): large framed illustrations.

### Named Rules
**The Frame Is The Border Rule.** Surfaces get their edge from the 4-sided pixel frame, not from `border`. To mark state, change the frame colour (amber for selected, cyan for focus within), never add a second outline.

## Shapes

Every corner is square (0 radius). The four-sided box-shadow leaves the corners notched, which reads as a pixel-stepped edge. Small marks are solid squares: the live dot and terminal window buttons (10px), the map pin stem (8px), connector arrowheads built from 4px cells. Dashed lines (2px dashed, or 3px dashed outline) mark dividers and empty, not-yet-filled slots.

## Components

### Buttons
Tactile and stepped, like pressing a game menu button.
- **Shape:** square corners (0), pixel frame, min height 44px.
- **Default:** Lit Clearing fill, Cream Ink text, Pixelify 500, 8px 18px padding, optional 20px line icon.
- **Go (primary):** amber fill, Amber Ink text, Banked Amber frame. One per view.
- **Hover / Active:** lifts 2px (default fill goes to Moss Line, Go goes to Lit Amber); presses down 2px on active. 0.18s on the springy ease.
- **Small:** 40px tall, 6px 14px. **Icon:** 44px square.
- **Text link:** amber, 2px underline at 0.2em offset, turns cream on hover.

### Chips (tags and category tabs)
- **Tag:** VT323, Lichen text, 2px Moss Line border, 2px 8px padding, no fill.
- **Category tab:** body face 700, 2px Moss Line border, no fill, Lichen text; selected tab fills amber with Amber Ink text.

### Cards / Containers
- **Corner Style:** square.
- **Background:** Clearing at rest, Lit Clearing on hover or when selected.
- **Shadow Strategy:** pixel frame + lift (see Elevation).
- **Border:** the frame only; turns amber on the selected picker item and on the open detail panel.
- **Internal Padding:** 16px (small cards), 20–24px (detail panels).

### Inputs / Fields
- **Style:** the terminal and the command palette use borderless, transparent inputs inside a framed panel; the terminal is set in VT323 on a darker well with an amber caret.
- **Focus:** the whole terminal frame turns cyan while it has focus.

### Navigation
- Sticky header on Night Ground at 92% opacity with a 4px Lit Clearing bottom rule; monogram in Pixelify on a Lit Clearing block; links in VT323 1.4rem, Lichen at rest, amber on hover and for the current section. Under 860px the links drop into a full-width panel behind a menu button.

### Picker Connector (signature)
When a picker item is selected, its frame turns amber, a dashed 4px amber wire leaves its edge, and a pixel arrowhead (built from 4px cells) on the open panel points back at it. When stacked, the wire and arrowhead rotate to point up/down.

### Inventory Slot (signature)
Square cells (min 104px) with a two-letter abbreviation in VT323 2.2rem amber over a small Lichen caption. Selected slots get an amber frame. Empty slots are dashed outlines with no fill, drawn on purpose to show room to grow.

### Sprites
Pixel character sprites from one 8-column sprite sheet, stepped with `steps(8)`, paused by the global motion toggle and stopped under reduced motion.

## Do's and Don'ts

### Do:
- **Do** draw every surface edge with the 4px pixel frame and keep corners square.
- **Do** keep amber for actions and selection only, with Amber Ink text on it.
- **Do** use cyan only for focus (3px outline, 3px offset) and live state.
- **Do** set reading text in Atkinson Hyperlegible at 1.0625rem / 1.6 and keep it under about 68ch.
- **Do** keep interactive targets at least 44px and give motion a pause control and a reduced-motion fallback.
- **Do** render pixel art with `image-rendering: pixelated`.
- **Do** show selection by lighting the chosen item and wiring it to the panel it opened.

### Don't:
- **Don't** round corners or use `border-radius` on any surface.
- **Don't** use Moss Line as a text colour; it is a border colour.
- **Don't** set paragraphs in Pixelify Sans or VT323.
- **Don't** introduce violet or other new hues outside the map-sampled palette.
- **Don't** fill buttons or cards with cyan.
