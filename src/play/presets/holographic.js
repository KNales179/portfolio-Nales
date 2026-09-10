// ============================================================
// PRESET — HOLOGRAPHIC
// ============================================================
//
// Iridescent foil. Every surface is a holo-sticker: a rainbow
// sheen that shifts with the pointer, a specular highlight that
// tracks the cursor, prism text. Dark base so the colour sings.
// ============================================================

const holographic = {
    id: "holographic",
    name: "Holographic",
    tagline:
        "Iridescent foil that shifts with your pointer. Prism text, holo stickers.",

    theme: {
        "--play-bg": "#0b0b14",
        "--play-surface": "#14141f",
        "--play-card": "rgba(255, 255, 255, 0.045)",
        "--play-text": "#f5f4ff",
        "--play-muted": "#a7a4cc",
        "--play-accent": "#7af5e0",
        "--play-accent-2": "#ff9cf0",
        "--play-accent-contrast": "#0b0b14",
        "--play-border": "rgba(255, 255, 255, 0.16)",

        // the iridescent gradient every holo surface samples
        "--play-iris":
            "conic-gradient(from 200deg at 50% 50%, #ff9cf0, #7af5e0, #a99cff, #ffe29c, #ff9cf0)",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Inter', system-ui, sans-serif",

        "--play-radius": "18px",
        "--play-border-width": "1px",
        "--play-blur": "blur(6px)",
        "--play-sheen":
            "linear-gradient(115deg, rgba(255,255,255,0.26), rgba(255,255,255,0) 42%)",
        "--play-head-glow": "0 0 34px rgba(122, 245, 224, 0.28)",
        "--play-maxw": "1160px",
        "--play-section-y": "5.5rem",
        "--play-shadow":
            "0 12px 44px rgba(120, 90, 255, 0.28)",
    },

    themeDark: {
        "--play-bg": "#07070e",
        "--play-surface": "#0f0f18",
    },

    layout: {
        nav: "holo",
        fx: "holoMesh",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "prism",
            projects: "holo",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "holo"]],
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

export default holographic;
