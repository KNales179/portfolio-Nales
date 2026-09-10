// ============================================================
// PRESET — NEO-BRUTALIST
// ============================================================
//
// Thick borders, hard offset shadows, flat loud colour, chunky
// Space Grotesk. Nothing soft, nothing subtle.
// ============================================================

const brutalist = {
    id: "brutalist",
    name: "Neo-Brutalist",
    tagline:
        "Thick borders, hard shadows, loud flat colour. No blur, no mercy.",

    theme: {
        "--play-bg": "#ffe14d",
        "--play-surface": "#fff9e6",
        "--play-card": "#ffffff",
        "--play-text": "#111111",
        "--play-muted": "#3a3a3a",
        "--play-accent": "#ff2e63",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "#111111",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Space Grotesk', system-ui, sans-serif",

        "--play-radius": "0px",
        "--play-border-width": "3px",
        "--play-maxw": "1180px",
        "--play-section-y": "5rem",
        "--play-shadow": "6px 6px 0 var(--play-border)",
    },

    themeDark: {
        "--play-bg": "#141414",
        "--play-surface": "#1c1c1c",
        "--play-card": "#202020",
        "--play-text": "#f5f5f5",
        "--play-muted": "#b5b5b5",
        "--play-accent": "#39ff88",
        "--play-accent-contrast": "#111111",
        "--play-border": "#f5f5f5",
        "--play-shadow": "6px 6px 0 var(--play-border)",
    },

    layout: {
        nav: "brutal",
        order: [
            "hero",
            "projects",
            "about",
            "skills",
            "journey",
            "contact",
        ],
        variants: {
            hero: "slab",
            projects: "blocks",
            about: "stacked",
            skills: "chips",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "blocks"]],
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

export default brutalist;
