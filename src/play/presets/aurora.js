// ============================================================
// PRESET — AURORA
// ============================================================
//
// A slow-drifting gradient sky. Soft light, generous space,
// almost no chrome — the colour field does the work. Frosted
// cards float over it. Calm in light and dark.
// ============================================================

const aurora = {
    id: "aurora",
    name: "Aurora",
    tagline:
        "A slow-drifting gradient sky. Soft light, calm space, barely any chrome.",

    theme: {
        "--play-bg": "#f5f3ff",
        "--play-surface": "#ffffff",
        "--play-card": "rgba(255, 255, 255, 0.72)",
        "--play-text": "#221d38",
        "--play-muted": "#6b6690",
        "--play-accent": "#7b5cff",
        "--play-accent-2": "#ff8fc7",
        "--play-accent-contrast": "#ffffff",
        "--play-border": "rgba(123, 92, 255, 0.16)",

        "--play-mesh-1": "#c9b8ff",
        "--play-mesh-2": "#ffc7e6",
        "--play-mesh-3": "#b8e0ff",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Inter', system-ui, sans-serif",

        "--play-radius": "22px",
        "--play-border-width": "1px",
        "--play-blur": "blur(12px) saturate(1.4)",
        "--play-sheen":
            "linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%)",
        "--play-maxw": "1080px",
        "--play-section-y": "6rem",
        "--play-shadow":
            "0 22px 70px rgba(123, 92, 255, 0.16)",
    },

    themeDark: {
        "--play-bg": "#141122",
        "--play-surface": "#1b1730",
        "--play-card": "rgba(255, 255, 255, 0.055)",
        "--play-text": "#efecff",
        "--play-muted": "#a49dc9",
        "--play-border": "rgba(255, 255, 255, 0.12)",

        "--play-mesh-1": "#4b2fa0",
        "--play-mesh-2": "#8a2f74",
        "--play-mesh-3": "#22506e",
    },

    layout: {
        nav: "aurora",
        fx: "mesh",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "aurora",
            projects: "soft",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "soft"]],
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

export default aurora;
