// ============================================================
// PRESET — MAXIMALISM
// ============================================================
//
// More is more. Clashing colour, Archivo Black at full volume,
// thick outlines, stacked offset shadows, tilted stickers, a
// drifting halftone field. Loud on purpose.
// ============================================================

const maximalism = {
    id: "maximalism",
    name: "Maximalism",
    tagline:
        "More is more. Clashing colour, huge type, stickers, halftone noise.",

    theme: {
        "--play-bg": "#ffe14d",
        "--play-surface": "#ffd6e8",
        "--play-card": "#ffffff",
        "--play-text": "#1a0d2e",
        "--play-muted": "#6b3fa0",
        "--play-accent": "#ff2d6f",
        "--play-accent-2": "#12d6b8",
        "--play-accent-3": "#7c3aed",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "#1a0d2e",

        "--play-font-head":
            "'Archivo Black', 'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Space Grotesk', system-ui, sans-serif",

        "--play-radius": "6px",
        "--play-border-width": "3px",
        "--play-maxw": "1200px",
        "--play-section-y": "5rem",
        "--play-shadow":
            "6px 6px 0 var(--play-border), 12px 12px 0 var(--play-accent-2)",
    },

    themeDark: {
        "--play-bg": "#1a0d2e",
        "--play-surface": "#2a1550",
        "--play-card": "#34206b",
        "--play-text": "#ffe14d",
        "--play-muted": "#dcb8ff",
        "--play-accent": "#ff2d6f",
        "--play-accent-2": "#12d6b8",
        "--play-border": "#ffe14d",
        "--play-shadow":
            "6px 6px 0 var(--play-border), 12px 12px 0 var(--play-accent)",
    },

    layout: {
        nav: "maxi",
        fx: "riso",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "maxi",
            projects: "maxi",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "maxi"]],
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

export default maximalism;
