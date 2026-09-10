// ============================================================
// PRESET — SYNTHWAVE
// ============================================================
//
// 80s retro-future. Deep purple sunset, hot pink + orange, a
// live neon grid floor receding to a scan-lined sun, chrome
// display type.
// ============================================================

const synthwave = {
    id: "synthwave",
    name: "Synthwave",
    tagline:
        "80s retro-future. Sunset purple, neon grid, chrome type.",

    theme: {
        "--play-bg": "#190a30",
        "--play-surface": "#241141",
        "--play-card": "#2b1550",
        "--play-text": "#ffe9f7",
        "--play-muted": "#bd93da",
        "--play-accent": "#ff5ca8",
        "--play-accent-2": "#ffb257",
        "--play-accent-contrast": "#190a30",
        "--play-border": "#4c2b72",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Space Grotesk', system-ui, sans-serif",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-maxw": "1120px",
        "--play-section-y": "5rem",
        "--play-shadow": "0 0 26px rgba(255, 92, 168, 0.32)",
    },

    themeDark: {
        "--play-bg": "#0d0420",
        "--play-surface": "#180a33",
        "--play-card": "#1e0c42",
        "--play-border": "#3c205e",
    },

    layout: {
        nav: "synth",
        fx: "gridFloor",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "chrome",
            projects: "arcade",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "arcade"]],
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

export default synthwave;
