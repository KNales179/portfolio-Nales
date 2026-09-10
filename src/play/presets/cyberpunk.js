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
        "--play-bg": "#05060f",
        "--play-surface": "#0b0d1e",
        "--play-card": "rgba(13, 17, 38, 0.72)",
        "--play-text": "#eafcff",
        "--play-muted": "#8fa2c8",
        "--play-accent": "#12f5ff",
        "--play-accent-2": "#ff2d9c",
        "--play-accent-contrast": "#05060f",
        "--play-border": "rgba(18, 245, 255, 0.35)",

        "--play-font-head":
            "'JetBrains Mono', ui-monospace, monospace",
        "--play-font-body":
            "'Space Grotesk', system-ui, sans-serif",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-blur": "blur(3px)",
        "--play-head-glow": "0 0 18px rgba(18, 245, 255, 0.55)",
        "--play-kicker-glow":
            "0 0 12px rgba(18, 245, 255, 0.7)",
        "--play-maxw": "1120px",
        "--play-section-y": "5rem",
        "--play-shadow":
            "0 0 0 1px rgba(18,245,255,0.15), 0 0 30px rgba(18, 245, 255, 0.28)",
    },

    themeDark: {
        "--play-bg": "#010208",
        "--play-surface": "#06070f",
        "--play-card": "rgba(6, 9, 22, 0.78)",
        "--play-border": "rgba(18, 245, 255, 0.4)",
    },

    layout: {
        nav: "cyber",
        fx: "neonGrid",
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
