// ============================================================
// PRESET — MINIMALIST
// ============================================================
//
// The baseline. Mirrors the main portfolio's identity: system
// sans, restrained purple accent, square corners, hairline
// borders, separation by elevation and background contrast.
// ============================================================

const minimal = {
    id: "minimal",
    name: "Minimalist",
    tagline:
        "Whitespace, hairline borders, one restrained accent. The portfolio at rest.",

    // Scoped CSS custom properties, applied on the Play container.
    theme: {
        "--play-bg": "#ffffff",
        "--play-surface": "#fafafa",
        "--play-card": "#ffffff",
        "--play-text": "#111113",
        "--play-muted": "#6b7280",
        "--play-accent": "#7c3aed",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "#e6e6e9",

        "--play-font-head":
            "'Outfit', 'Inter', system-ui, sans-serif",
        "--play-font-body":
            "'Inter', system-ui, sans-serif",

        "--play-radius": "2px",
        "--play-border-width": "1px",
        "--play-maxw": "1180px",
        "--play-section-y": "7rem",
        "--play-shadow":
            "0 1px 2px rgba(17,17,19,0.04), 0 8px 24px rgba(17,17,19,0.05)",
    },

    themeDark: {
        "--play-bg": "#0b0b0d",
        "--play-surface": "#111114",
        "--play-card": "#141417",
        "--play-text": "#f4f4f5",
        "--play-muted": "#9ca3af",
        "--play-accent": "#a78bfa",
        "--play-accent-contrast": "#0b0b0d",
        "--play-border": "#26262b",
        "--play-shadow":
            "0 1px 2px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.4)",
    },

    layout: {
        nav: "minimal",
        // Home route: the whole portfolio as one preset scroll.
        order: [
            "hero",
            "about",
            "skills",
            "projects",
            "journey",
            "contact",
        ],
        variants: {
            hero: "centered",
            about: "stacked",
            skills: "chips",
            projects: "grid",
            journey: "timeline",
            contact: "panel",
        },
        // Dedicated public routes, when this preset is applied.
        // Each key is [section, variant] pairs rendered in order.
        pages: {
            projects: [["projects", "grid"]],
            about: [
                ["about", "stacked"],
                ["hobbies", "grid"],
            ],
            certificates: [["certificates", "plates"]],
            contact: [["contact", "panel"]],
        },
    },

    density: "comfortable",
};

export default minimal;
