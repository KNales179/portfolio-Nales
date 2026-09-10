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
        "--play-bg": "#1c0b36",
        "--play-surface": "#2a1550",
        "--play-card": "#321a5e",
        "--play-text": "#fff4fb",
        "--play-muted": "#dcc2ef",
        "--play-accent": "#ff77bd",
        "--play-accent-2": "#ffc46b",
        "--play-accent-contrast": "#1c0b36",
        "--play-border": "#6b3fa0",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Space Grotesk', system-ui, sans-serif",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-head-glow": "0 0 16px rgba(255, 119, 189, 0.5)",
        "--play-kicker-glow":
            "0 0 12px rgba(255, 119, 189, 0.6)",
        "--play-maxw": "1120px",
        "--play-section-y": "5rem",
        "--play-shadow": "0 0 26px rgba(255, 119, 189, 0.35)",
    },

    themeDark: {
        "--play-bg": "#100428",
        "--play-surface": "#1c0a3e",
        "--play-card": "#230d4c",
        "--play-muted": "#cbb0e6",
        "--play-border": "#4d2a7d",
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
