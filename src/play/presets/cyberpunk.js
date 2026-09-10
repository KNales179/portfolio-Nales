// ============================================================
// PRESET — CYBERPUNK
// ============================================================
//
// Dystopian neon UI. Near-black ground, cyan / magenta, a
// live "matrix rain" canvas behind everything, scanlines and
// glitch on the headline. Always dark.
// ============================================================

const cyberpunk = {
    id: "cyberpunk",
    name: "Cyberpunk",
    tagline:
        "Neon dystopia. Cyan on black, scanlines, glitch, code rain.",

    theme: {
        "--play-bg": "#070510",
        "--play-surface": "#0d0a1c",
        "--play-card": "#100c22",
        "--play-text": "#e8f2ff",
        "--play-muted": "#7c7ca6",
        "--play-accent": "#22f0ff",
        "--play-accent-2": "#ff2bd1",
        "--play-accent-contrast": "#070510",
        "--play-border": "#211d44",

        "--play-font-head":
            "'JetBrains Mono', ui-monospace, monospace",
        "--play-font-body":
            "'Space Grotesk', system-ui, sans-serif",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-maxw": "1120px",
        "--play-section-y": "5rem",
        "--play-shadow": "0 0 24px rgba(34, 240, 255, 0.22)",
    },

    themeDark: {
        "--play-bg": "#020104",
        "--play-surface": "#08060f",
        "--play-card": "#0a0716",
        "--play-border": "#181436",
    },

    layout: {
        nav: "cyber",
        fx: "matrixRain",
        order: [
            "hero",
            "projects",
            "about",
            "skills",
            "journey",
            "contact",
        ],
        variants: {
            hero: "glitch",
            projects: "panels",
            about: "stacked",
            skills: "chips",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "panels"]],
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

export default cyberpunk;
