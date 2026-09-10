import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AnimatePresence,
    MotionConfig,
    motion,
} from "framer-motion";
import {
    ArrowRight,
    Grid2X2,
    Moon,
    RotateCcw,
    SlidersHorizontal,
    Sun,
} from "lucide-react";

import { usePreset } from "../play/PresetContext";
import LayoutRenderer from "../play/LayoutRenderer";
import PresetGallery from "../play/PresetGallery";
import PresetFx from "../play/fx/PresetFx";
import CustomizePanel from "../play/CustomizePanel";
import { ensurePlayFonts } from "../play/theme/fonts";
import { trackInteraction } from "../analytics/track";


// ============================================================
// PLAY PAGE
// ============================================================
//
// Landing = the preset gallery. Pick a card → full preview of
// that preset (the real portfolio content rendered through it)
// with a bar to apply it to the whole site, flip light/dark, or
// go back to the gallery. Everything here is scoped — the
// --play-* tokens never touch the global stylesheet.
// ============================================================

function PreviewBar({ onExit, onCustomize }) {
    const {
        preset,
        mode,
        toggleMode,
        applied,
        apply,
        reset,
        hasOverrides,
    } = usePreset();

    const navigate = useNavigate();

    const handleApply = () => {
        apply();
        trackInteraction(
            "NAV_CLICK",
            `Play apply: ${preset.id}`
        );
        navigate("/");
    };

    return (
        <div
            className="relative z-50 flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-5 py-2.5 md:px-8"
            style={{
                borderColor: "var(--play-border)",
                background: "var(--play-surface)",
                color: "var(--play-text)",
            }}
        >
            <button
                type="button"
                onClick={onExit}
                className="inline-flex items-center gap-1.5 text-sm font-medium transition hover:opacity-70"
                style={{ color: "var(--play-muted)" }}
            >
                <Grid2X2 size={15} />
                All styles
            </button>

            <span
                className="hidden text-sm font-semibold sm:inline"
                style={{ fontFamily: "var(--play-font-head)" }}
            >
                {preset.name}
            </span>

            <div className="ml-auto flex items-center gap-2">
                <button
                    type="button"
                    onClick={onCustomize}
                    className="relative inline-flex items-center gap-1.5 border px-3 py-1.5 text-sm font-semibold transition hover:opacity-80"
                    style={{
                        borderColor: "var(--play-border)",
                        borderRadius: "var(--play-radius)",
                    }}
                >
                    <SlidersHorizontal size={13} />
                    Customise
                    {hasOverrides && (
                        <span
                            className="absolute -right-1 -top-1 h-2 w-2 rounded-full"
                            style={{
                                background: "var(--play-accent)",
                            }}
                        />
                    )}
                </button>

                <button
                    type="button"
                    onClick={toggleMode}
                    aria-label="Toggle light / dark"
                    className="flex h-8 w-8 items-center justify-center border transition hover:opacity-80"
                    style={{
                        borderColor: "var(--play-border)",
                        borderRadius: "var(--play-radius)",
                    }}
                >
                    {mode === "light" ? (
                        <Moon size={14} />
                    ) : (
                        <Sun size={14} />
                    )}
                </button>

                {applied ? (
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-sm font-semibold transition hover:opacity-80"
                        style={{
                            borderColor: "var(--play-border)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        <RotateCcw size={13} />
                        Reset site
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleApply}
                        className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-semibold transition hover:opacity-90"
                        style={{
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        Use on my site
                        <ArrowRight size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}


function PlayShell() {
    const {
        themeStyle,
        presetId,
        preset,
        mode,
        setPreset,
        overrides,
    } = usePreset();

    const [previewing, setPreviewing] = useState(false);
    const [customizing, setCustomizing] = useState(false);

    useEffect(() => {
        ensurePlayFonts();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [presetId, previewing]);

    if (!previewing) {
        return (
            <MotionConfig reducedMotion="user">
                <PresetGallery
                    onPreview={(id) => {
                        setPreset(id);
                        setPreviewing(true);
                    }}
                />
            </MotionConfig>
        );
    }

    return (
        <MotionConfig reducedMotion="user">
        <div
            className="play-scope relative min-h-screen w-full overflow-x-clip"
            style={themeStyle}
        >
            <PresetFx
                preset={preset}
                mode={mode}
                overrides={overrides}
            />

            <div className="relative z-10">
                <PreviewBar
                    onExit={() => setPreviewing(false)}
                    onCustomize={() => setCustomizing(true)}
                />

                <CustomizePanel
                    open={customizing}
                    onClose={() => setCustomizing(false)}
                />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={presetId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LayoutRenderer />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
        </MotionConfig>
    );
}


function Play() {
    return <PlayShell />;
}

export default Play;
