// ============================================================
// PRESET — BENTO
// ============================================================
//
// A layout system more than a skin: everything lives in a tight
// grid of rounded tiles of mixed sizes — a name tile, stat
// tiles, project tiles — like a wall of widgets. Calm, modern,
// light or dark.
// ============================================================

const bento = {
    id: "bento",
    name: "Bento",
    tagline:
        "A wall of rounded tiles in mixed sizes. Stats, projects, widgets.",

    theme: {
        "--play-bg": "#f3f4f7",
        "--play-surface": "#ffffff",
        "--play-card": "#ffffff",
        "--play-text": "#15171d",
        "--play-muted": "#6a7180",
        "--play-accent": "#6d5cff",
        "--play-accent-2": "#ff5ca8",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "#e6e8ec",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Inter', system-ui, sans-serif",

        "--play-radius": "22px",
        "--play-border-width": "1px",
        "--play-maxw": "1180px",
        "--play-section-y": "3.5rem",
        "--play-shadow":
            "0 1px 3px rgba(15, 17, 23, 0.06), 0 10px 28px rgba(15, 17, 23, 0.05)",
    },

    themeDark: {
        "--play-bg": "#0d0e11",
        "--play-surface": "#17181d",
        "--play-card": "#17181d",
        "--play-text": "#f3f4f6",
        "--play-muted": "#9aa1ad",
        "--play-border": "#26282f",
        "--play-shadow":
            "0 1px 3px rgba(0, 0, 0, 0.4), 0 10px 28px rgba(0, 0, 0, 0.3)",
    },

    layout: {
        nav: "bento",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "tile",
            projects: "bento",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "bento"]],
            about: [
                ["about", "stacked"],
                ["hobbies", "grid"],
            ],
            certificates: [["certificates", "plates"]],
            contact: [["contact", "panel"]],
        },
    },

    density: "compact",
};

export default bento;
