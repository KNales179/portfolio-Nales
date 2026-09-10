// ============================================================
// PRESET — TERMINAL
// ============================================================
//
// A command line. Monospace everywhere, zero radius, tight
// rhythm, a blinking prompt. Default look is a crisp "light
// terminal"; the dark toggle drops to classic green phosphor.
// ============================================================

const terminal = {
    id: "terminal",
    name: "Terminal",
    tagline:
        "A command line. Monospace, prompts, everything is output.",

    theme: {
        "--play-bg": "#f4f6f4",
        "--play-surface": "#e9ede9",
        "--play-card": "#ffffff",
        "--play-text": "#0d1f0d",
        "--play-muted": "#4c6a4c",
        "--play-accent": "#0a7d32",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "#c0d2c0",

        "--play-font-head":
            "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
        "--play-font-body":
            "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-maxw": "980px",
        "--play-section-y": "3.5rem",
        "--play-shadow": "none",
    },

    themeDark: {
        "--play-bg": "#080b08",
        "--play-surface": "#0e130e",
        "--play-card": "#0c110c",
        "--play-text": "#c9f7c9",
        "--play-muted": "#5f8f5f",
        "--play-accent": "#3dff86",
        "--play-accent-contrast": "#080b08",
        "--play-border": "#20401f",
    },

    layout: {
        nav: "terminal",
        order: [
            "hero",
            "about",
            "skills",
            "projects",
            "journey",
            "contact",
        ],
        variants: {
            hero: "prompt",
            about: "stacked",
            skills: "chips",
            projects: "listing",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "listing"]],
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

export default terminal;
