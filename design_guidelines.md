# GRAFTT Skip Hire Marketplace - Design Guidelines

## Design Approach
**Utility-Focused Marketplace** with clear inspiration from best-in-class aggregation platforms:
- Skyscanner/Uber: Frictionless, instant comprehension
- MoneySuperMarket/Lottie: Trust and transparency
- Core principle: Educational simplicity with zero visual noise

## Brand Identity & Locked Copy
**Hero H1:** "The easiest way to hire a skip."
**Hero Subtitle:** "Skip hire you can trust – no cowboys, no fly-tipping, no fines."
**Benchmark:** "UK's No.1 Marketplace for Skip Hire"

## Color System
- **Teal (Primary):** 167 100% 46% - Brand accent, CTAs, selection states
- **Navy (Text):** 240 67% 11% - Primary headings
- **Ink (Text):** 236 47% 11% - Body text
- **Paper (Background):** 0 0% 100% - Primary surface
- **Paper2 (Secondary BG):** 220 25% 98% - Subtle backgrounds
- **Line (Borders):** 220 33% 93% - Hairlines, dividers
- **Good (Success):** 151 78% 44% - Positive states
- **Warn (Alert):** 36 100% 56% - Warnings, hazards

## Typography
**Font Family:** "Cocogoose Pro", Poppins, system-ui
- H1: Navy, bold, generous letter-spacing
- Subheadings: Ink, medium weight
- Body: Ink, regular weight
- Microcopy: 85% opacity for subtle hierarchy

## Layout Principles
- **All-white pages** with generous whitespace (no heavy backgrounds)
- **No scroll on common viewports** - scale content intelligently
- **Tiles over cards** - flat surfaces with subtle shadows only on interaction
- Single-column flow on mobile, intelligent grid on desktop
- Consistent vertical rhythm: py-8 to py-12 between sections

## Spacing & Rhythm
**Tailwind Primitives:** Use units of 2, 4, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Element gaps: gap-4 to gap-6

## Component Design System

### Header
Shallow white bar, bottom hairline (Line color), minimal height, sticky
- Logo left, navigation links right (How it works, Help, Contact)
- Clean, non-competing with page content

### Progress Ribbon
Lives under H1 on each step page
- Labels: Location • Placement • Waste • Items • Size • Providers • Checkout • Done
- Animated teal fill with gentle sheen effect
- Current step emphasized, future steps dimmed

### Tiles (Primary Selection Pattern)
Clean white surfaces with:
- Radius: 12px standard, 20px for hero elements
- Border: 1px Line color default
- Hover: 2px lift with soft shadow (0 10px 30px rgba(0,0,0,.08))
- Selected: Teal 2px border with subtle glow
- Icons/illustrations: Simple line-style, Navy colored
- Typography: Medium weight title, regular body

### Education Pills
Bottom-positioned on each step, subtle presence
- Light Paper2 background, Line border
- Small "Why this matters" label + single educational line
- Icons: small info/lightbulb, Teal accent

### Overlays & Popovers
Portal-based (z-50), no layout shift
- White surface, soft shadow
- 180ms scale+fade animation
- Search suggestions, price breakdowns, date pickers
- Focus trap with Esc to close

### Sticky Summary
Mobile: Bottom bar, white surface, shadow up
Desktop: Right rail, sticky positioning
- Shows: Size, items, placement, running total
- Teal CTA button (disabled state when no selection)

## Page-Specific Design

### Home Page
Clean hero layout:
- Central SearchBar: Large, inviting, teal accent on focus
- Optional toggle below: "On the road?" - minimal switch style
- CTA: Teal button, generous padding
- NO hero image - pure whitespace and clarity

### Location Page (1/8)
- H1 with ribbon below
- Chips: Postcode + Address display with "Change" action
- Map: 16:9 ratio, draggable teal pin, clean Leaflet styling
- Education pill at bottom

### Selection Pages (2-5/8)
Consistent pattern:
- H1 + Progress Ribbon
- Tile grid: 2×2 on desktop, stacked mobile
- Large tap targets (min 120px height)
- Visual sketches/icons for skip sizes (mini line illustrations)
- "Recommended" badge: Teal background, white text, top-right corner

### Interstitial (Before Providers)
1.6-2s duration:
- "Finding providers near {postcode}…" centered
- 3 skeleton tiles with shimmer animation
- Smooth crossfade to results

## 🚀 Providers Page - World-Class Aggregation UI (6/8)

### Layout Architecture
**Tabs (Pills):** Recommended | Cheapest | Earliest
- Clean pill design, teal active state, smooth transition

**Filter Row (Compact):**
- Distance, Ratings, Recycling rate, Delivery window chips
- Price range slider (teal accent)
- "Permit-ready only" toggle (if road placement)
- Active filter count badge
- "Clear filters" pill when filters active

**Results Grid:**
- Desktop: 3-up grid with 16px gap
- Tablet: 2-up
- Mobile: 1-up stacked
- 6-12 providers shown (no pagination)

### Provider Cards (Dense & Delightful)
**Card Structure:**
- White surface, 12px radius, Line border
- Selected: Teal 2px border with subtle glow
- Hover: 2px lift, soft shadow

**Top Row:**
- Logo (40px circle) + Provider name (medium weight)
- ⭐ Rating + review count microtext

**Price Display (Hero):**
- Large, bold, Navy - "£XXX all-in"
- "Zero hidden fees" microtext below
- Click "Breakdown" → PricePopover (table format)

**Earliest Slot:**
- "Earliest: Tue AM (8–11)" with small clock icon
- Ink color, regular weight

**Trust Badges (4 max):**
- Small icons + labels in 2×2 micro-grid
- Licensed Operator (shield), Permit-ready (badge), High Recycling (leaf), On-time (clock)
- Icons: 16px, Navy with Teal accent

**What's Included:**
- 3 bulleted items, concise
- Good color for checkmarks

**Select Button:**
- Full-width, Teal, medium padding
- Active selection shows "Selected" with checkmark

### Compare Drawer
Slides up from bottom (mobile) or right (desktop):
- 3-column comparison table
- Price, Earliest, Rating, Recycling, On-time rows
- Striped subtle background for readability
- Teal "Choose {Name}" CTAs per column

### Map View Toggle
Small toggle to switch view:
- Pins colored by price gradient (green=cheap → amber=expensive)
- Clicking pin highlights corresponding card
- Leaflet clean styling, teal accent

### Micro-interactions
- Cards enter with 40ms stagger on load
- Hover: 2px lift with 200ms ease
- Select: Teal ring animates in with scale (120ms)
- Price popover: scale+fade 180ms
- Filter changes: instant with count badge animation

## Checkout Page (7/8)
Two-column layout (desktop), stacked mobile:

**Left Column - Payment Panel:**
- Apple/Google Pay button (if available) - prominent, top
- Card payment element below
- Compact inputs: Name, Email, Phone (stacked, minimal spacing)
- Driver notes textarea
- Collection date picker (inline calendar)

**Right Column - Order Summary:**
- Card surface with all selections
- Line items with pricing breakdown
- Permit line (if road) with explanation icon
- Subtotal + VAT + Total (bold, Navy)

**Compliance Strip (Above CTA):**
- Paper2 background, icons + text in row
- "Licensed operator • Waste transfer note • GPS drop • Chain of custody"

**CTA:** "Confirm & Pay" - Teal, full-width on mobile

## Confirmation Page (8/8)
- Success Lottie animation (1.2s subtle celebration)
- Clean order card: Reference number (large), provider details, windows
- Action buttons: Download PDF, Add to calendar, Book another
- All secondary buttons (outline style, Navy border)

## Motion & Transitions
- Page transitions: Crossfade + 16px slide (220-260ms, ease [0.16,1,0.3,1])
- Overlays: Scale+fade 180ms
- Card interactions: 200ms ease
- **Respect prefers-reduced-motion:** Disable animations, maintain usability

## Accessibility
- H1 receives focus on each step
- Tiles/cards as proper radio buttons (arrow key navigation)
- All filters keyboard accessible with aria-labels
- Popovers trap focus, Esc to close
- Text contrast: AA compliance on white (Navy/Ink pass WCAG)
- Teal accent passes contrast for interactive elements

## Images
**NO hero images** - the design relies on whitespace and clarity
**Provider logos only** - 40px circles, contained within cards
**Skip size illustrations** - Minimal line drawings showing scale (4yd, 6yd, 8yd, 12yd)
**Trust badge icons** - 16px vector icons (shield, leaf, clock, badge)