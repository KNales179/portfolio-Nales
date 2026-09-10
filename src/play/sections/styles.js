// ============================================================
// PLAY — SHARED INLINE STYLE FRAGMENTS
// ============================================================

// A framed panel / card. Border weight, radius, fill, shadow and
// backdrop blur all come from the preset — so one style covers
// minimal hairlines, brutalist slabs and frosted glass alike.
export const panelStyle = {
    borderWidth: "var(--play-border-width, 1px)",
    borderStyle: "solid",
    borderColor: "var(--play-border)",
    borderRadius: "var(--play-radius)",
    backgroundColor: "var(--play-card)",
    // Optional light-sheen layer (glass); "none" elsewhere.
    backgroundImage: "var(--play-sheen, none)",
    boxShadow: "var(--play-shadow)",
    backdropFilter: "var(--play-blur, none)",
    WebkitBackdropFilter: "var(--play-blur, none)",
};
