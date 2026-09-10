// ============================================================
// PRESET — COSMOS
// ============================================================
//
// Deep space. The hero is a real WebGL galaxy you orbit with
// the mouse; each project is a star you can fly to and open.
// Below it, the rest of the portfolio in a calm dark cosmos.
//
// (Named "Cosmos" for visitors; the internal id stays "spatial"
// so stored preferences and layout keys don't need migrating —
// and to avoid the clash with "spatial design" as a UI term.)
// ============================================================

const spatial = {
    id: "spatial",
    name: "Cosmos",
    tagline:
        "A WebGL galaxy you orbit. Each project is a star — fly to it.",

    theme: {
        "--play-bg": "#03040c",
        "--play-surface": "#080b1a",
        "--play-card": "rgba(18, 24, 52, 0.55)",
        "--play-text": "#e9efff",
        "--play-muted": "#8b93c4",
        "--play-accent": "#7ba4ff",
        "--play-accent-2": "#c88bff",
        "--play-accent-contrast": "#03040c",
        "--play-border": "rgba(123, 164, 255, 0.24)",

        "--play-font-head":
            "'Space Grotesk', system-ui, sans-serif",
        "--play-font-body":
            "'Inter', system-ui, sans-serif",

        // Real galaxy backdrop for the hero. The particle layer
        // (interactive project "stars") is drawn on top. Bundled in
        // /public/play/ — other options: milkyway-panorama.jpg,
        // nebula-carina.jpg, pillars-of-creation.jpg. "none" = the
        // fully procedural galaxy. Credit: Andromeda Galaxy —
        // Adam Evans, CC BY 2.0.
        "--play-hero-image": `url('${import.meta.env.BASE_URL}play/galaxy-andromeda.jpg')`,

        "--play-radius": "12px",
        "--play-border-width": "1px",
        "--play-blur": "blur(8px) saturate(1.3)",
        "--play-head-glow":
            "0 0 22px rgba(123, 164, 255, 0.45)",
        "--play-sheen":
            "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 55%)",
        "--play-maxw": "1160px",
        "--play-section-y": "5.5rem",
        "--play-shadow":
            "0 0 34px rgba(123, 164, 255, 0.18)",
    },

    themeDark: {
        "--play-bg": "#01010a",
        "--play-surface": "#050713",
    },

    layout: {
        nav: "spatial",
        order: [
            "hero",
            "projects",
            "about",
            "skills",
            "journey",
            "contact",
        ],
        variants: {
            hero: "galaxy",
            projects: "glasscards",
            about: "stacked",
            skills: "chips",
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

export default spatial;
