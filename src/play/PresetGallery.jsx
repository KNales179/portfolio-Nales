import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { usePreset } from "./PresetContext";
import { buildThemeStyle } from "./theme/applyTheme";
import { ensurePlayFonts } from "./theme/fonts";
import { panelStyle } from "./sections/styles";


// ============================================================
// PRESET GALLERY
// ============================================================
//
// The /play landing view: a grid of preset cards, each one
// rendered in its own design system (its colours, type, radius,
// borders, shadow). Click a card to preview that preset, then
// apply it to the whole site.
// ============================================================

function CardMock() {
    return (
        <div className="pointer-events-none select-none">
            <div className="mb-3 flex items-center gap-1.5">
                <div
                    className="h-2 w-9"
                    style={{
                        background: "var(--play-accent)",
                        borderRadius: "var(--play-radius)",
                    }}
                />
                <div
                    className="h-1.5 w-5"
                    style={{
                        background: "var(--play-muted)",
                        opacity: 0.55,
                    }}
                />
                <div
                    className="h-1.5 w-5"
                    style={{
                        background: "var(--play-muted)",
                        opacity: 0.55,
                    }}
                />
            </div>

            <div
                className="h-5 w-3/4"
                style={{
                    background: "var(--play-text)",
                    opacity: 0.85,
                    borderRadius: "var(--play-radius)",
                }}
            />
            <div
                className="mt-1.5 h-2 w-1/2"
                style={{
                    background: "var(--play-accent)",
                    borderRadius: "var(--play-radius)",
                }}
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
                {[0, 1].map((i) => (
                    <div
                        key={i}
                        className="h-16"
                        style={panelStyle}
                    />
                ))}
            </div>
        </div>
    );
}


function PresetGallery({ onPreview }) {
    const { presets, applied, presetId, overridesFor } =
        usePreset();

    useEffect(() => {
        ensurePlayFonts();
    }, []);

    return (
        <div className="play-scope min-h-screen bg-[#0a0a0f] px-6 py-14 text-white md:px-10 lg:px-16">
            <div className="mx-auto max-w-[1200px]">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
                >
                    <ArrowLeft size={15} />
                    Back to site
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                >
                    <h1 className="heading-font text-4xl font-bold tracking-tight md:text-6xl">
                        Play.
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                        The same portfolio, {presets.length}{" "}
                        completely different vibes. 
                        Pick one, preview it, and watch the whole site transform.
                    </p>
                </motion.div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {presets.map((preset, index) => {
                        const isActive =
                            applied && presetId === preset.id;
                        const isTweaked =
                            Object.keys(
                                overridesFor(preset.id)
                            ).length > 0;

                        return (
                            <motion.button
                                key={preset.id}
                                type="button"
                                onClick={() =>
                                    onPreview(preset.id)
                                }
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: Math.min(
                                        index * 0.05,
                                        0.4
                                    ),
                                }}
                                className="group overflow-hidden border border-white/10 text-left transition hover:-translate-y-1 hover:border-white/30"
                            >
                                <div
                                    className="p-5"
                                    style={buildThemeStyle(
                                        preset,
                                        { mode: "light" }
                                    )}
                                >
                                    <CardMock />
                                </div>

                                <div className="border-t border-white/10 bg-white/[0.02] p-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span
                                            className="font-bold"
                                            style={{
                                                fontFamily:
                                                    preset
                                                        .theme[
                                                    "--play-font-head"
                                                    ],
                                            }}
                                        >
                                            {preset.name}
                                        </span>
                                        {preset.layout.fx && (
                                            <span className="border border-white/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white/45">
                                                live fx
                                            </span>
                                        )}
                                        {isActive && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                                                · active
                                            </span>
                                        )}
                                        {isTweaked && (
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                                                · customised
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-white/45">
                                        {preset.tagline}
                                    </p>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PresetGallery;
