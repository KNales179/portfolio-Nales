// ============================================================
// PRESET — BLUEPRINT
// ============================================================
//
// A drafting sheet. Cyan hairlines on navy, a live graph-paper
// grid, monospace labels, dimension marks and corner ticks.
// Everything annotated like a technical drawing.
// ============================================================

const blueprint = {
    id: "blueprint",
    name: "Blueprint",
    tagline:
        "A drafting sheet. Cyan hairlines on navy, dimension marks, mono labels.",

    theme: {
        "--play-bg": "#0c2947",
        "--play-surface": "#0f3358",
        "--play-card": "rgba(127, 212, 255, 0.06)",
        "--play-text": "#e2eefc",
        "--play-muted": "#8fb5da",
        "--play-accent": "#7fd4ff",
        "--play-accent-2": "#ffd76a",
        "--play-accent-contrast": "#0c2947",
        "--play-border": "rgba(150, 205, 255, 0.42)",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'JetBrains Mono', ui-monospace, monospace",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-maxw": "1160px",
        "--play-section-y": "5rem",
        "--play-shadow": "none",
    },

    themeDark: {
        "--play-bg": "#071c33",
        "--play-surface": "#0a2744",
        "--play-card": "rgba(127, 212, 255, 0.05)",
    },

    layout: {
        nav: "blueprint",
        fx: "blueprintGrid",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "blueprint",
            projects: "blueprint",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "blueprint"]],
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

export default blueprint;
