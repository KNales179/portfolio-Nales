// ============================================================
// PRESET — CLAYMORPHISM
// ============================================================
//
// Soft puffy 3D. Thick rounded shapes moulded from the page
// with a double light/shadow — outset to lift, inset to press.
// Candy palette, chunky friendly Fredoka. The opposite of the
// sharp minimalist default.
// ============================================================

const claymorphism = {
    id: "claymorphism",
    name: "Claymorphism",
    tagline:
        "Soft puffy 3D. Rounded clay shapes that lift and press. Candy colours.",

    theme: {
        "--play-bg": "#e0e5f5",
        "--play-surface": "#e8ecfa",
        "--play-card": "#eef1fc",
        "--play-text": "#3b3e5f",
        "--play-muted": "#7c81a8",
        "--play-accent": "#8a9bff",
        "--play-accent-2": "#ffb0c8",
        "--play-accent-contrast": "#ffffff",
        // clay has no border — just light & shadow
        "--play-border": "transparent",

        "--play-font-head":
            "'Fredoka', system-ui, sans-serif",
        "--play-font-body":
            "'Fredoka', system-ui, sans-serif",

        "--play-radius": "30px",
        "--play-border-width": "0px",
        "--play-maxw": "1100px",
        "--play-section-y": "5.5rem",
        "--play-shadow":
            "9px 9px 22px rgba(155, 165, 205, 0.6), -9px -9px 22px rgba(255, 255, 255, 0.9), inset 2px 2px 6px rgba(255, 255, 255, 0.75), inset -3px -3px 10px rgba(155, 165, 205, 0.35)",
    },

    themeDark: {
        "--play-bg": "#2a2d44",
        "--play-surface": "#31344f",
        "--play-card": "#353959",
        "--play-text": "#eef0ff",
        "--play-muted": "#a7abd2",
        "--play-accent": "#8a9bff",
        "--play-accent-2": "#ff9cbf",
        "--play-shadow":
            "9px 9px 22px rgba(0, 0, 0, 0.4), -9px -9px 22px rgba(255, 255, 255, 0.05), inset 2px 2px 6px rgba(255, 255, 255, 0.07), inset -3px -3px 10px rgba(0, 0, 0, 0.35)",
    },

    layout: {
        nav: "clay",
        order: [
            "hero",
            "projects",
            "skills",
            "about",
            "journey",
            "contact",
        ],
        variants: {
            hero: "clay",
            projects: "clay",
            skills: "chips",
            about: "stacked",
            journey: "timeline",
            contact: "panel",
        },
        pages: {
            projects: [["projects", "clay"]],
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

export default claymorphism;
