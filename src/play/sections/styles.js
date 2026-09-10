// ============================================================
// PLAY — SHARED INLINE STYLE FRAGMENTS
// ============================================================

// A framed panel / card. Border weight, radius, fill and shadow
// all come from the preset — so one style covers minimal
// hairlines through brutalist slabs.
export const panelStyle = {
    borderWidth: "var(--play-border-width, 1px)",
    borderStyle: "solid",
    borderColor: "var(--play-border)",
    borderRadius: "var(--play-radius)",
    background: "var(--play-card)",
    boxShadow: "var(--play-shadow)",
};
