import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { RotateCcw } from "lucide-react";

import { usePreset } from "./PresetContext";
import { ensurePlayFonts } from "./theme/fonts";
import PresetFx from "./fx/PresetFx";


// ============================================================
// PRESET SITE THEME
// ============================================================
//
// When a visitor has applied a /play preset, this:
//   - loads the preset web fonts (once),
//   - re-points the site's CSS tokens at the preset palette by
//     setting them inline on :root (reversible on reset — the
//     stylesheet is never touched),
//   - adds `body.preset-active` so the scoped font rule in
//     index.css takes effect,
//   - shows a persistent "PresetName · Reset" badge.
//
// All of this is skipped on /admin, /login and /play (which has
// its own scoped preview container).
// ============================================================

const isPublicRoute = (pathname) =>
    !pathname.startsWith("/admin") &&
    pathname !== "/login" &&
    pathname !== "/play";


function PresetSiteTheme() {
    const {
        applied,
        livePreset,
        scopeVars,
        reset,
        mode,
        overrides,
    } = usePreset();

    const { pathname } = useLocation();

    const active =
        applied &&
        Boolean(livePreset) &&
        isPublicRoute(pathname);

    // Load preset fonts on demand, once.
    useEffect(() => {
        if (applied) {
            ensurePlayFonts();
        }
    }, [applied]);

    // Sitewide token override + body class, fully reversible.
    useEffect(() => {
        if (!active) {
            return undefined;
        }

        const root = document.documentElement;
        const entries = Object.entries(scopeVars);
        const previous = {};

        for (const [key, val] of entries) {
            previous[key] =
                root.style.getPropertyValue(key);
            root.style.setProperty(key, val);
        }

        document.body.classList.add("preset-active");

        return () => {
            for (const [key] of entries) {
                if (previous[key]) {
                    root.style.setProperty(
                        key,
                        previous[key]
                    );
                } else {
                    root.style.removeProperty(key);
                }
            }
            document.body.classList.remove("preset-active");
        };
    }, [active, scopeVars]);

    if (!active) {
        return null;
    }

    return (
        <>
            <PresetFx
                preset={livePreset}
                mode={mode}
                overrides={overrides}
            />

            <div className="fixed bottom-5 left-5 z-[60]">
            <div
                className="flex items-center gap-2 border px-3 py-2 text-xs shadow-lg backdrop-blur"
                style={{
                    borderColor: "var(--play-border)",
                    background:
                        "color-mix(in srgb, var(--play-card) 92%, transparent)",
                    color: "var(--play-text)",
                }}
            >
                <span
                    className="font-semibold"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {livePreset.name}
                </span>
                <span style={{ color: "var(--play-muted)" }}>
                    preset
                </span>
                <button
                    type="button"
                    onClick={reset}
                    className="ml-1 inline-flex items-center gap-1 border-l pl-2 font-semibold transition hover:opacity-70"
                    style={{
                        borderColor: "var(--play-border)",
                        color: "var(--play-accent)",
                    }}
                >
                    <RotateCcw size={12} />
                    Reset
                </button>
            </div>
            </div>
        </>
    );
}

export default PresetSiteTheme;
