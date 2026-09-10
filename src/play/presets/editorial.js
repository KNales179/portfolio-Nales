// ============================================================
// PRESET — EDITORIAL
// ============================================================
//
// A print magazine. Large serif display type, an asymmetric
// two-column grid, drop caps, rules instead of cards, generous
// margins, warm paper ground. Same content, read like a feature.
// ============================================================

const editorial = {
    id: "editorial",
    name: "Editorial",
    tagline:
        "Magazine spread. Serif display type, asymmetric columns, hairline rules.",

    theme: {
        "--play-bg": "#f6f3ec",
        "--play-surface": "#efe9dd",
        "--play-card": "#fffdf8",
        "--play-text": "#1c1a17",
        "--play-muted": "#6f6656",
        "--play-accent": "#8a2b1b",
        "--play-accent-contrast": "#fffdf8",
        "--play-border": "#d8cfbd",

        "--play-font-head":
            "'Playfair Display', 'Times New Roman', Georgia, serif",
        "--play-font-body":
            "'Source Serif 4', Georgia, 'Times New Roman', serif",

        "--play-radius": "0px",
        "--play-border-width": "1px",
        "--play-maxw": "1240px",
        "--play-section-y": "6.5rem",
        "--play-shadow": "none",
    },

    themeDark: {
        "--play-bg": "#151310",
        "--play-surface": "#1d1a15",
        "--play-card": "#201c16",
        "--play-text": "#f0e9dc",
        "--play-muted": "#a89a80",
        "--play-accent": "#e0765c",
        "--play-accent-contrast": "#151310",
        "--play-border": "#3a342a",
    },

    layout: {
        nav: "editorial",
        order: [
            "hero",
            "about",
            "projects",
            "skills",
            "journey",
            "contact",
        ],
        variants: {
            hero: "masthead",
            about: "leadcolumn",
            skills: "index",
            projects: "feature",
            journey: "ledger",
            contact: "colophon",
        },
        pages: {
            projects: [["projects", "feature"]],
            about: [
                ["about", "leadcolumn"],
                ["hobbies", "margin"],
            ],
            certificates: [["certificates", "gallery"]],
            contact: [["contact", "colophon"]],
        },
    },

    density: "comfortable",
};

export default editorial;
