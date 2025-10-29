# Cinematic Wedding Website Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from editorial wedding publications and cinematic film stills, with emphasis on thefutureharrisons.wedsites.com aesthetic—handcrafted, intimate, and timeless. Every element should feel personally chosen, not template-generated.

## Core Design Principles
- **Cinematic Storytelling**: Each section unfolds like a scene in a film
- **Editorial Refinement**: Typography and spacing inspired by high-end print invitations
- **Intimate Minimalism**: Intentional whitespace, subtle flourishes, restrained motion
- **Handcrafted Feel**: Organic, personal, avoiding all digital template clichés

## Typography System

**Primary (Body & Content)**
- Modern serif font (e.g., Cormorant Garamond, Lora, Playfair Display)
- Body text: Regular weight, 18-20px, generous line-height (1.8)
- Section headers: Light or Regular weight, 32-40px

**Accent (Names & Special Headers)**
- Handwritten or elegant script font (e.g., Great Vibes, Dancing Script, Allura)
- Couple names in hero: 48-72px
- Section accents: 24-32px
- Use sparingly for maximum impact

**Hierarchy**
- Couple names: Dominant, centered, script
- Section titles: Refined serif, light weight
- Timeline entries: Medium serif, structured rhythm
- Body copy: Comfortable reading size with breathing room

## Color Palette
- **Base**: Soft ivory, warm parchment (#F8F6F2, #FAF8F5)
- **Accents**: Sage green (#A8B5A0), olive (#8B8B6E), muted gold (#D4AF7A)
- **Text**: Deep charcoal (#2C2C2C) for primary, soft gray (#666) for secondary
- **Backgrounds**: Layered neutrals with subtle texture or warm photo tints

## Layout & Spacing System

**Spacing Primitives**: Tailwind units of 4, 8, 12, 16, 24
- Section padding: py-24 to py-32 (desktop), py-16 (mobile)
- Element spacing: mb-8, mb-12 for vertical rhythm
- Content containers: max-w-4xl for text, max-w-6xl for wider sections

**Navigation**
- Fixed top toolbar with transparent background, subtle backdrop blur
- Links: Our Story, Wedding Details, Itinerary, Registry, Local Stays, RSVP
- Active state: subtle underline or weight change, smooth scroll-to-section
- Sticky behavior with slight shadow on scroll

## Section-Specific Designs

### Hero Section
- **Layout**: Full viewport height, centered content
- **Background**: Warm, cinematic photo (soft-focused couple portrait or venue landscape) with subtle overlay
- **Couple Names**: Large script typography, centered
- **Countdown Timer**: Integrated naturally—elegant numbers with refined labels, NOT boxed widget (e.g., "127 days · 14 hours · 23 minutes")
- **Welcome Line**: Simple date and location beneath countdown, serif font
- **CTA**: Soft, blurred-background button if needed

### Our Story
- **Layout**: Single column, max-w-prose, narrative flow
- **Content**: Paragraph-based storytelling with subtle dividers (thin lines or botanical flourishes)
- **Spacing**: Generous margins between paragraphs (mb-12)
- **Embellishments**: Delicate leaf or botanical elements as dividers

### Wedding Details
- **Layout**: Two-column on desktop (Ceremony | Reception), stacked on mobile
- **Content**: Time, venue name, address, attire guidance
- **Typography**: All text-based, no icons—refined alignment and hierarchy
- **Links**: "Get Directions" as subtle text link

### Itinerary
- **Layout**: Vertical timeline flowing down the page
- **Structure**: Each entry (time + description) with fine divider lines
- **Typography**: Time in medium weight, description in light serif
- **Motion**: Gentle fade-in as each entry enters viewport
- **Style**: Like a printed schedule, not digital boxes

### Registry
- **Layout**: Centered list with equal vertical spacing
- **Links**: Plain text buttons with subtle hover states (e.g., Target, Amazon, Honeyfund)
- **No logos or retail graphics**—refined generosity, not commercial noise

### Local Stays
- **Layout**: Curated vertical list, editorial travel-note style
- **Content**: Hotel name, distance from venue, brief note, booking link
- **Typography**: Hotel names in medium weight, details in light serif
- **No card grids**—flowing text layout

### RSVP
- **Layout**: Centered form, max-w-md
- **Inputs**: Transparent backgrounds, bottom borders only, soft focus states
- **Labels**: Subtle, positioned above inputs
- **Submit**: Refined button matching site aesthetic
- **Confirmation**: Gentle fade-in message post-submission

## Motion & Interaction

**Scroll Behavior**
- Smooth scroll to anchored sections with easing
- Subtle parallax on hero background (slow drift)
- Gentle fade-ins as sections enter viewport (opacity 0→1)

**Prohibited**
- No flashy animations, geometric waves, floating blobs
- No boxed countdown widgets or heavy progress bars
- No template-style card grids or icon arrays

**Approved**
- Soft opacity transitions
- Gentle vertical reveals (translateY)
- Delicate parallax effects on backgrounds
- Active nav link highlighting

## Images
- **Hero**: Large, warm, cinematic photo—soft-focused couple portrait or romantic venue landscape with subtle neutral overlay
- **Our Story**: Optional: 1-2 intimate photos integrated into narrative
- **Gallery Section** (if added): Masonry or simple grid layout with elegant spacing
- All images should feel personal, never stock or AI-generated

## Responsive Considerations
- Mobile: Single column, stacked sections, reduced text sizes
- Tablet: Maintain intimacy while utilizing width
- Desktop: Maximum visual impact with generous whitespace
- Navigation collapses to hamburger on mobile with elegant slide-out menu