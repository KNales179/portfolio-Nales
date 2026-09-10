// ============================================================
// PRESET — GLASSMORPHISM
// ============================================================
//
// Frosted glass over a living aurora. Every panel is a
// translucent, blurred, softly-lit pane; rounded corners; a
// drifting colour field behind everything. Beautiful in light
// and dark.
// ============================================================

const glassmorphism = {
    id: "glassmorphism",
    name: "Glassmorphism",
    tagline:
        "Frosted panes over a drifting aurora. Blur, glow, depth.",

    theme: {
        "--play-bg": "#cfd9f0",
        "--play-surface": "rgba(255, 255, 255, 0.42)",
        "--play-card": "rgba(255, 255, 255, 0.28)",
        "--play-text": "#141a30",
        "--play-muted": "#48527a",
        "--play-accent": "#5a6bff",
        "--play-accent-2": "#ff5eb8",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "rgba(255, 255, 255, 0.8)",

        "--play-aurora-1": "rgba(90, 107, 255, 0.34)",
        "--play-aurora-2": "rgba(255, 94, 184, 0.28)",
        "--play-aurora-3": "rgba(120, 200, 255, 0.26)",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Inter', system-ui, sans-serif",

        "--play-radius": "24px",
        "--play-border-width": "1px",
        "--play-blur": "blur(26px) saturate(1.9)",
        "--play-sheen":
            "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.08) 38%, rgba(255,255,255,0) 60%)",
        "--play-maxw": "1160px",
        "--play-section-y": "6rem",
        "--play-shadow":
            "0 14px 48px rgba(24, 32, 84, 0.22), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 0 0 1px rgba(255,255,255,0.18)",
    },

    themeDark: {
        "--play-bg": "#080b1c",
        "--play-surface": "rgba(255, 255, 255, 0.06)",
        "--play-card": "rgba(255, 255, 255, 0.045)",
        "--play-text": "#eff2ff",
        "--play-muted": "#9aa4cc",
        "--play-border": "rgba(255, 255, 255, 0.16)",

        "--play-aurora-1": "rgba(90, 107, 255, 0.3)",
        "--play-aurora-2": "rgba(255, 94, 184, 0.22)",
        "--play-aurora-3": "rgba(120, 200, 255, 0.2)",

        "--play-sheen":
            "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 38%, rgba(255,255,255,0) 60%)",
        "--play-shadow":
            "0 14px 50px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.06)",
    },

    layout: {
        nav: "glass",
        fx: "aurora",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "pane",
            projects: "glasscards",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "glasscards"]],
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

export default glassmorphism;
