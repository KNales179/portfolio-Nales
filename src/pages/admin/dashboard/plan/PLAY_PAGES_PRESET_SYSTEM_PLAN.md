# Play Pages — Preset & Layout System Plan

## 1. Overview

The Play Pages are the interactive/explorable part of the portfolio.

The goal is to allow visitors to experience the portfolio through different visual presets while keeping the actual portfolio content consistent.

A preset should NOT simply be a different color theme.

Instead:

> Preset = Design System + Layout System + Interaction Style

This allows the same portfolio data to be presented in completely different ways.

---

# 2. Core Concept

The portfolio has two separate layers:

## Content Layer

Contains the actual portfolio information.

Examples:

- Personal information
- About
- Skills
- Projects
- Experience
- Education
- Contact information
- Social links
- Other portfolio content

The content layer should remain independent from the visual design.

## Presentation Layer

Controls how the content is displayed.

Examples:

- Layout
- Component arrangement
- Typography
- Colors
- Spacing
- Borders
- Shadows
- Blur
- Animations
- Transitions
- Interaction behavior

This separation allows the same portfolio data to work across multiple presets.

---

# 3. Preset System

Each preset represents a complete visual experience.

A preset should define:

- Overall visual identity
- Layout structure
- Component arrangement
- Typography system
- Color system
- Spacing system
- Shape/border system
- Animation behavior
- Interaction style

Example presets:

- Minimal
- Cyberpunk
- Editorial
- Glass
- Terminal
- Retro
- Brutalist
- Futuristic

The exact preset list will be decided later.

prepared to have this:

Core / Modern:
Minimalist — lots of whitespace, restrained elements
Modern — clean, current, balanced
Contemporary — trendy but sophisticated
Clean — uncluttered, highly readable
Refined — polished, deliberate details
Elegant — subtle, premium, graceful
Sophisticated — mature, restrained, high-end
Functional — UI-first, usability focused
Swiss / International — grid, typography, precision
Bauhaus — geometry, function, primary forms

Futuristic / Technology:
Cyberpunk — neon, dark UI, high contrast, dystopian
Futuristic — advanced, experimental, technological
Sci-Fi — interfaces inspired by fictional technology
Neo-Futurist — futuristic but cleaner and more architectural
Techno — digital, mechanical, energetic
Digital Brutalist — raw, unconventional, intentionally rough
Holographic — iridescent, translucent, dimensional
Y2K — early-internet/futuristic nostalgia
Synthwave — neon, retro-futurism, gradients
Cyber Minimal — cyberpunk concepts stripped down
Terminal / Hacker — monospace, command-line aesthetic
AI / Generative — fluid, abstract, computational visuals

Editorial / Typography:
Editorial — magazine-inspired layouts
Typographic — typography is the main visual element
Newspaper — dense columns, information-heavy
Luxury Editorial — serif typography, whitespace, sophisticated imagery
Fashion Editorial — dramatic typography and photography
Art Direction — highly curated, unconventional compositions
Swiss Editorial — strict grids + strong typography
Experimental Typography — oversized, distorted, expressive type
Kinetic Typography — typography that moves and reacts

Glass / Transparency:
Glassmorphism — translucent panels, blur, soft borders
Liquid Glass — fluid translucent surfaces
Frosted Glass — blurred/translucent UI
Crystal — sharp, transparent, reflective surfaces
Neumorphism — soft embossed surfaces
Claymorphism — soft, inflated 3D UI
Acrylic — translucent layered surfaces
Chrome / Metallic — reflective metallic surfaces

Raw / Experimental:
Brutalist — intentionally raw, harsh, unconventional
Neo-Brutalist — bold blocks, thick borders, strong colors
Anti-Design — deliberately breaks conventional design rules
Deconstructed — fragmented layouts and overlapping elements
Collage — layered images, typography, textures
Avant-Garde — artistic, unconventional, high-concept
Organic — irregular shapes and natural composition
Maximalist — dense, expressive, visually rich
Chaos / Experimental — intentionally unpredictable layouts

Retro:
Retro — general nostalgic aesthetic
Vintage — older print/design language
70s — earthy, groovy, organic
80s — neon, geometric, arcade
90s Web — pixel graphics, raw HTML nostalgia
Pixel Art — pixelated graphics
Arcade — game-inspired UI
Vaporwave — surreal retro internet aesthetic
Synthwave — 80s-inspired futuristic neon
Y2K — glossy early-2000s digital aesthetic

Nature / Organic:
Organic Modern — clean design + natural forms
Biophilic — plants, nature, natural materials
Earthy — muted natural palette
Botanical — plants and botanical illustrations
Eco / Sustainable — environmental visual language
Natural Minimalism — minimalist + organic materials
Japandi — Japanese + Scandinavian simplicity
Wabi-Sabi — imperfect, restrained, natural
Zen — calm, spacious, contemplative

Luxury / Premium:
Luxury — restrained, expensive-looking
High Fashion — editorial, dramatic, typography-heavy
Premium Minimal — extremely clean + sophisticated
Monochromatic Luxury — limited palette + strong typography
Art Deco — geometric, ornamental, glamorous
Classic — traditional typography and proportions
Corporate Luxury — professional but premium
Dark Luxury — black/dark palette + elegant typography

Playful / Creative:
Playful — friendly, colorful, expressive
Whimsical — imaginative, quirky
Cartoon — illustrated, character-driven
Memphis — colorful geometric 80s-inspired design
Pop Art — bold colors, comic influence
Sticker / Scrapbook — layered, informal, youthful
Handmade — hand-drawn elements and imperfections
Doodle — sketches and handwritten elements
Kinetic / Interactive — movement is part of the identity

Spatial / 3D:
3D — dimensional objects and environments
Isometric — angled 3D compositions
Spatial — depth and spatial interfaces
Immersive — full-screen visual experiences
Parallax — layered depth through scrolling
Skeuomorphic — digital objects resembling physical objects
Virtual / Metaverse — digital environments and avatars
Game UI — interfaces inspired by games

Dark / Atmospheric:
Dark Mode — dark surfaces + light content
Noir — cinematic, dramatic, shadow-heavy
Moody — atmospheric and subdued
Gothic — dark, ornate, dramatic
Industrial — steel, concrete, mechanical
Tactical — military/interface-inspired
Stealth — extremely dark, understated
Monochrome — primarily one color family
High Contrast — dramatic light/dark relationship

Soft / Friendly:
Soft UI — gentle surfaces and subtle contrast
Pastel — muted/light colors
Dreamy — gradients, softness, atmospheric visuals
Cozy — warm, approachable
Cute / Kawaii — playful Japanese-inspired aesthetic
Friendly SaaS — approachable modern product UI
Bubble — rounded, inflated visual language
Calm — low visual noise and comfortable spacing

Professional / Product:
Corporate — formal and structured
Enterprise — information-dense, practical
SaaS — product-focused modern UI
Dashboard — data/interface-centric
Developer / DevTool — technical, code-oriented
Fintech — trustworthy, clean, data-focused
Startup — energetic, modern, conversion-oriented
Portfolio — personality + project presentation
Agency — highly art-directed and visual
Consulting — authoritative, structured
Government / Civic — accessible, functional, information-first

Web-native / Internet:
Web 1.0 — raw HTML, links, tiled backgrounds
Web 2.0 — glossy, gradients, rounded interfaces
Indie Web — personal, experimental, handcrafted
Old Internet — forums, badges, pixel graphics
Geocities — maximalist nostalgic web
Terminal Web — CLI-inspired
Blogcore — personal-blog aesthetic
Tumblr — expressive, image-heavy, alternative
Digital Garden — knowledge-oriented, organic navigation
Hypertext — links and typography as the primary interaction

Architectural:
Swiss Grid
Modernist
Postmodern
Minimal Architecture
Brutalist Architecture
Parametric
Industrial
Modular
Geometric
Structural
Grid-based
Asymmetrical



---

# 4. Important Design Rule

Presets must NOT be treated as simple CSS themes.

Bad approach:

```text
Preset
 └── CSS Variables
      ├── color
      ├── font
      └── background

This would result in:

Same Layout
Same Components
Same Structure
Different Colors

That makes the presets feel like skins instead of completely different experiences.

5. Desired Architecture

Use:

Portfolio Data
       ↓
Preset Configuration
       ↓
Layout Configuration
       ↓
Page Components
       ↓
Rendered Play Page

The portfolio data should not know how it is displayed.

For example:

portfolio.projects

should remain the same regardless of the selected preset.

The preset determines whether projects are displayed as:

Cards
Horizontal rows
Large feature panels
Grid
Timeline
Magazine-style sections
Other layouts
6. Preset Responsibilities

Each preset should control two major areas.

A. Visual System

Controls the appearance.

Examples:

Colors
Typography
Border radius
Border style
Spacing
Background
Icons
Component styling
B. Layout System

Controls the arrangement.

Examples:

Hero placement
Navigation placement
Section order
Column count
Project arrangement
About section arrangement
Experience layout
Contact layout
Sidebar usage
Grid structure
Alignment
Content density

This is what makes presets genuinely different.

7. Example Layout Differences

The same portfolio content could be displayed as:

Preset A — Traditional
┌──────────────────────────────┐
│            NAV               │
├──────────────────────────────┤
│            HERO              │
├──────────────────────────────┤
│            ABOUT             │
├──────────────────────────────┤
│           PROJECTS           │
├──────────────────────────────┤
│         EXPERIENCE           │
├──────────────────────────────┤
│           CONTACT            │
└──────────────────────────────┘
Preset B — Dashboard
┌──────────┬───────────────────┐
│          │       HERO        │
│ SIDEBAR  ├───────────────────┤
│          │      ABOUT        │
│          ├───────────────────┤
│          │     PROJECTS      │
│          ├───────────────────┤
│          │    EXPERIENCE     │
└──────────┴───────────────────┘
Preset C — Editorial
┌──────────────────────────────┐
│            HERO              │
├──────────────┬───────────────┤
│ ABOUT        │ FEATURED      │
│              │ PROJECT       │
├──────────────┴───────────────┤
│       PROJECT COLLECTION     │
├──────────────────────────────┤
│       EXPERIENCE             │
└──────────────────────────────┘

All three use the same portfolio data.

Only the presentation changes.

8. Visitor Customization

Visitors should be able to customize the selected preset.

However, customization must be limited.

The purpose is to let visitors personalize the experience without destroying the intended design of the preset.

9. Customizable Properties

Visitors may be allowed to change:

Colors

Examples:

Primary color
Accent color
Background color
Surface color
Text color
Muted text color
Typography

Examples:

Font family
Heading font
Body font
Font scale
Minor Visual Preferences

Potential options:

Compact / Comfortable density
Light / Dark variation if supported
Accent intensity
Border intensity

These options should remain within safe limits.

10. Locked Properties

The following should generally remain controlled by the preset:

Core Layout

Visitors should NOT be able to completely rearrange the page.

The preset should determine:

Component placement
Section arrangement
Grid structure
Sidebar behavior
Hero structure
Major spacing relationships
Visual Effects

Visitors should NOT be able to freely modify:

Blur
Shadow style
Contrast
Complex gradients
Major transparency behavior
Core animation style

These properties are part of the preset's identity.

11. Why Layout Must Be Preset-Controlled

If visitors can completely change the layout, the preset system becomes too flexible.

Example:

Preset: Cyberpunk
Visitor changes:
- Layout
- Component positions
- Shadows
- Blur
- Animation
- Typography
- Colors

At that point:

Cyberpunk ≈ Any Other Preset

The identity of the preset disappears.

Therefore:

Preset controls the structure.
Visitor controls selected cosmetic properties.
12. Recommended Configuration Structure

Conceptually, a preset could look like:

const preset = {
    id: "cyberpunk",
    name: "Cyberpunk",

    theme: {
        colors: {},
        typography: {},
        borders: {},
        spacing: {}
    },

    effects: {
        blur: {},
        shadows: {},
        gradients: {},
        animations: {}
    },

    layout: {
        navigation: {},
        hero: {},
        about: {},
        projects: {},
        experience: {},
        contact: {}
    },

    components: {
        projectCard: {},
        buttons: {},
        sections: {}
    }
};

The exact implementation may change during development.

13. Separate Visitor Overrides

Visitor customization should NOT modify the original preset.

Instead:

Preset
  +
Visitor Overrides
  ↓
Final Theme

Example:

const visitorPreferences = {
    colors: {
        accent: "#00ff88"
    },

    typography: {
        fontFamily: "Inter"
    }
};

The preset remains unchanged.

This means switching presets resets the presentation appropriately while visitor preferences can be handled separately if desired.

14. Preset + Override Model

Recommended structure:

DEFAULT PRESET
      ↓
Preset Configuration
      ↓
Visitor Customization
      ↓
Merged Configuration
      ↓
Renderer

Example:

Cyberpunk Preset
    ↓
Cyberpunk Layout
Cyberpunk Effects
Cyberpunk Typography
Cyberpunk Colors
    ↓
Visitor Changes Accent Color
    ↓
Final Render

The visitor changes the accent color, but the Cyberpunk layout and effects remain intact.

15. Play Page Architecture

The Play Pages should be built around reusable components.

Potential structure:

PlayPage
│
├── PresetProvider
│
├── LayoutRenderer
│
│   ├── Navigation
│   ├── Hero
│   ├── About
│   ├── Skills
│   ├── Projects
│   ├── Experience
│   └── Contact
│
└── CustomizationPanel

The components should receive configuration from the active preset rather than hardcoding one visual style.

16. Layout Renderer

The layout renderer is responsible for deciding how components are arranged.

Conceptually:

<LayoutRenderer
    layout={preset.layout}
    data={portfolioData}
/>

The renderer should translate the preset's layout configuration into the appropriate React structure.

17. Component Strategy

Components should remain reusable.

For example:

ProjectCard
ProjectList
ProjectGrid
ProjectFeature

Different presets can choose different presentation components.

Example:

Minimal Preset
    → ProjectGrid

Editorial Preset
    → ProjectFeature + ProjectList

Terminal Preset
    → ProjectList

This avoids creating an entirely separate application for every preset.

18. Avoid Over-Abstraction

Do NOT attempt to make every possible layout configurable.

Too much configurability will make the system:

Difficult to maintain
Difficult to debug
Difficult to design
Difficult to create new presets for

Instead, presets should select from predefined layout patterns.

Example:

hero:
    variant: "centered"

projects:
    variant: "bento"

experience:
    variant: "timeline"

Rather than allowing arbitrary DOM structures.

19. Layout Variants

Create reusable layout variants.

Examples:

Hero
centered
split
fullscreen
minimal
Projects
grid
bento
featured
horizontal
stacked
Experience
timeline
cards
list
split
Navigation
top
sidebar
floating
minimal

This gives presets enough freedom without making the system chaotic.

20. Preset Design Philosophy

Each preset should answer:

"How would this portfolio exist if it were designed as a completely different product?"

Rather than:

"What if the portfolio had a different color?"

The difference should be immediately noticeable.

21. Performance Considerations

Play Pages should remain performant.

Avoid loading unnecessary assets for inactive presets.

Potential strategies:

Lazy-load preset-specific components
Lazy-load heavy animations
Avoid unnecessary re-renders
Keep portfolio data centralized
Use CSS variables for simple theme values
Use React configuration for structural differences
22. Persistence

Visitor customization may optionally be saved locally.

Possible implementation:

localStorage
    ↓
visitor preset
visitor color preferences
visitor font preference
visitor density preference

No visitor account is required.

The customization belongs to the visitor's browser/device.

23. Admin Control

The admin should be able to manage:

Available presets
Preset visibility
Default preset
Preset ordering
Preset metadata
Which customization options are available

Potential future functionality:

Preset Manager
├── Create preset
├── Edit preset
├── Duplicate preset
├── Activate / deactivate
└── Preview
24. Future Preset Builder

A future admin tool could allow presets to be created from predefined building blocks.

For example:

Preset Builder

Layout
├── Navigation: Sidebar
├── Hero: Split
├── Projects: Bento
├── Experience: Timeline
└── Contact: Centered

Theme
├── Primary
├── Accent
├── Background
└── Typography

Effects
├── Shadow
├── Blur
└── Animation

This should only be implemented after the initial preset system is stable.

25. Development Phases
Phase 1 — Foundation

Build:

Portfolio data structure
Preset structure
Theme system
Basic layout renderer
Basic Play Page

Goal:

One preset works completely.

Phase 2 — Layout Variants

Implement:

Hero variants
Project variants
Experience variants
Navigation variants
Section variants

Goal:

Presets can have different structures.

Phase 3 — Multiple Presets

Create several presets with clearly different identities.

Example:

Preset 1 — Minimal
Preset 2 — Cyberpunk
Preset 3 — Editorial
Preset 4 — Terminal

Goal:

Switching presets feels like switching to a different portfolio experience.

Phase 4 — Visitor Customization

Add:

Color customization
Font customization
Limited density customization
Customization UI
Local persistence

Goal:

Visitors can personalize the active preset without breaking its identity.

Phase 5 — Polish

Add:

Animations
Transitions
Preset previews
Loading states
Mobile optimization
Accessibility
Performance optimization
26. Mobile Considerations

The layout system must support responsive behavior.

A preset should define:

Desktop layout
Tablet layout
Mobile layout

Visitors should NOT manually control responsive structure.

Example:

Desktop:
Sidebar + Content

Mobile:
Top navigation + Content

The preset controls this automatically.

27. Accessibility

Customization must not allow visitors to create unreadable combinations.

For example:

Light text
+
Light background
=
Bad

Color customization should ideally include contrast validation or constrained color choices.

Font customization should also avoid breaking readability.

28. Final System Concept

The final architecture should look approximately like:

                 PORTFOLIO DATA
                       │
                       ▼
                ACTIVE PRESET
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
     DESIGN SYSTEM             LAYOUT SYSTEM
          │                         │
          │                    ┌────┴────┐
          │                    │         │
          ▼                    ▼         ▼
      COLORS                SECTIONS  COMPONENTS
      FONTS                 ORDER      VARIANTS
      SPACING               STRUCTURE  ARRANGEMENT
      BORDERS
      EFFECTS
          │                         │
          └────────────┬────────────┘
                       ▼
              VISITOR OVERRIDES
                       │
                       ▼
                FINAL EXPERIENCE
29. Core Rule to Remember

The most important rule of the Play Pages:

The content stays the same. The experience changes.

A visitor should be able to switch from one preset to another and feel like they are exploring a completely different version of the portfolio, even though the underlying information is identical.

Therefore:

Content = Stable
Preset = Structure + Identity
Visitor Customization = Controlled Personalization

This keeps the Play Pages flexible, visually impressive, maintainable, and still recognizable as the same portfolio.