// ============================================================
// PRESET — VINTAGE
// ============================================================
//
// Aged paper and letterpress. Warm sepia stock, cut serifs
// (Playfair / Source Serif), a restless film grain, catalogue
// cards with ruled headers and small-caps labels.
// ============================================================

const vintage = {
    id: "vintage",
    name: "Vintage",
    tagline:
        "Aged paper and letterpress. Warm sepia, cut serifs, catalogue cards.",

    theme: {
        "--play-bg": "#efe4cf",
        "--play-surface": "#f6eedd",
        "--play-card": "#fbf5e7",
        "--play-text": "#3a2f22",
        "--play-muted": "#7c6a50",
        "--play-accent": "#9a3324",
        "--play-accent-2": "#3f6b4f",
        "--play-accent-contrast": "#fbf5e7",
        "--play-border": "#c8b590",

        "--play-font-head":
            "'Playfair Display', Georgia, serif",
        "--play-font-body":
            "'Source Serif 4', Georgia, serif",

        "--play-radius": "2px",
        "--play-border-width": "1px",
        "--play-maxw": "1080px",
        "--play-section-y": "5rem",
        "--play-shadow":
            "0 1px 0 rgba(58, 47, 34, 0.12), 0 14px 30px rgba(58, 47, 34, 0.12)",
    },

    themeDark: {
        "--play-bg": "#241d15",
        "--play-surface": "#2c241a",
        "--play-card": "#332a1e",
        "--play-text": "#efe2c9",
        "--play-muted": "#b7a482",
        "--play-border": "#5c4c34",
    },

    layout: {
        nav: "vintage",
        fx: "grain",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "vintage",
            projects: "vintage",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "vintage"]],
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

export default vintage;
