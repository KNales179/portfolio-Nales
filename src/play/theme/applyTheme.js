// ============================================================
// applyTheme
// ============================================================
//
// Turns an active preset (+ light/dark mode + visitor
// overrides) into CSS custom properties.
//
//  - buildThemeStyle  → an inline style object for a scoped
//    container (used by the /play preview).
//  - buildScopeVars   → the same --play-* tokens PLUS a bridge
//    that re-points the main site's own tokens (--bg, --accent,
//    …) at the preset palette, so applying a preset re-colours
//    the whole public site. Set at runtime on :root, reversible
//    on reset — the global stylesheet is never edited.
// ============================================================

// Main-site token -> preset token. Only the visible surface
// tokens are bridged; structural ones (grid line, work-bg…) are
// left alone.
const SITE_TOKEN_BRIDGE = {
    "--bg": "var(--play-bg)",
    "--surface": "var(--play-surface)",
    "--surface-soft": "var(--play-surface)",
    "--card": "var(--play-card)",
    "--border": "var(--play-border)",
    "--accent": "var(--play-accent)",
    "--accent-soft":
        "color-mix(in srgb, var(--play-accent) 10%, transparent)",
    "--text": "var(--play-text)",
    "--muted": "var(--play-muted)",
};


const playVars = (preset, mode) => {
    const base = preset?.theme || {};
    const dark =
        mode === "dark" ? preset?.themeDark || {} : {};

    return { ...base, ...dark };
};


export const buildThemeStyle = (
    preset,
    { mode = "light", overrides = {} } = {}
) => {
    return {
        ...playVars(preset, mode),
        ...overrides,
        color: "var(--play-text)",
        backgroundColor: "var(--play-bg)",
        fontFamily: "var(--play-font-body)",
    };
};


export const buildScopeVars = (
    preset,
    { mode = "light", overrides = {} } = {}
) => {
    return {
        ...playVars(preset, mode),
        ...SITE_TOKEN_BRIDGE,
        ...overrides,
        // Keeps form controls / scrollbars in step with the
        // preset's light or dark palette.
        "color-scheme": mode === "dark" ? "dark" : "light",
    };
};
