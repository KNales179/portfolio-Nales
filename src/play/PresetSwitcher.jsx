import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Check,
    Moon,
    Palette,
    RotateCcw,
    Sun,
    X,
} from "lucide-react";

import { usePreset } from "./PresetContext";
import { trackInteraction } from "../analytics/track";


// ============================================================
// PRESET SWITCHER
// ============================================================
//
// The visitor's control for the Play experience: pick a preset,
// toggle light/dark. Styled from the active preset's own tokens
// so it always belongs to the current look. Phase 4 will grow
// this into the full customisation panel.
// ============================================================

function PresetSwitcher() {
    const {
        preset,
        presets,
        setPreset,
        mode,
        toggleMode,
        applied,
        apply,
        reset,
    } = usePreset();

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleApply = () => {
        apply();
        trackInteraction(
            "NAV_CLICK",
            `Play apply: ${preset.id}`
        );
        setOpen(false);
        navigate("/");
    };

    const choose = (id) => {
        if (id !== preset.id) {
            setPreset(id);
            trackInteraction(
                "NAV_CLICK",
                `Play preset: ${id}`
            );
        }
        setOpen(false);
    };

    return (
        <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
            <AnimatePresence mode="wait">
                {open ? (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md border p-4 shadow-2xl backdrop-blur"
                        style={{
                            borderColor: "var(--play-border)",
                            background:
                                "color-mix(in srgb, var(--play-card) 92%, transparent)",
                            color: "var(--play-text)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <p
                                className="text-xs font-semibold uppercase tracking-[0.2em]"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                Experience
                            </p>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                <X size={15} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {presets.map((option) => {
                                const active =
                                    option.id === preset.id;

                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        onClick={() =>
                                            choose(option.id)
                                        }
                                        className="flex w-full items-start gap-3 border p-3 text-left transition"
                                        style={{
                                            borderColor: active
                                                ? "var(--play-accent)"
                                                : "var(--play-border)",
                                            background: active
                                                ? "color-mix(in srgb, var(--play-accent) 8%, transparent)"
                                                : "transparent",
                                            borderRadius:
                                                "var(--play-radius)",
                                        }}
                                    >
                                        <span
                                            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border"
                                            style={{
                                                borderColor: active
                                                    ? "var(--play-accent)"
                                                    : "var(--play-border)",
                                                color: "var(--play-accent)",
                                            }}
                                        >
                                            {active && (
                                                <Check
                                                    size={12}
                                                />
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span
                                                className="block text-sm font-semibold"
                                                style={{
                                                    fontFamily:
                                                        "var(--play-font-head)",
                                                }}
                                            >
                                                {option.name}
                                            </span>
                                            <span
                                                className="mt-0.5 block text-xs leading-5"
                                                style={{
                                                    color: "var(--play-muted)",
                                                }}
                                            >
                                                {
                                                    option.tagline
                                                }
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={toggleMode}
                            className="mt-3 flex w-full items-center justify-center gap-2 border py-2 text-xs font-semibold uppercase tracking-wider transition"
                            style={{
                                borderColor:
                                    "var(--play-border)",
                                borderRadius:
                                    "var(--play-radius)",
                            }}
                        >
                            {mode === "light" ? (
                                <>
                                    <Moon size={13} />
                                    Dark
                                </>
                            ) : (
                                <>
                                    <Sun size={13} />
                                    Light
                                </>
                            )}
                        </button>

                        <div
                            className="mt-3 border-t pt-3"
                            style={{
                                borderColor:
                                    "var(--play-border)",
                            }}
                        >
                            <button
                                type="button"
                                onClick={handleApply}
                                className="flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold transition hover:opacity-90"
                                style={{
                                    background:
                                        "var(--play-accent)",
                                    color: "var(--play-accent-contrast)",
                                    borderRadius:
                                        "var(--play-radius)",
                                }}
                            >
                                Use {preset.name} on my whole site
                                <ArrowRight size={15} />
                            </button>

                            {applied && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        reset();
                                        setOpen(false);
                                    }}
                                    className="mt-2 flex w-full items-center justify-center gap-1.5 text-xs font-semibold transition hover:opacity-70"
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    <RotateCcw size={12} />
                                    Currently applied — reset to
                                    the default site
                                </button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="pill"
                        type="button"
                        onClick={() => setOpen(true)}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 border px-4 py-2.5 text-sm font-medium shadow-xl backdrop-blur"
                        style={{
                            borderColor: "var(--play-border)",
                            background:
                                "color-mix(in srgb, var(--play-card) 92%, transparent)",
                            color: "var(--play-text)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        <Palette
                            size={15}
                            style={{
                                color: "var(--play-accent)",
                            }}
                        />
                        <span
                            style={{
                                fontFamily:
                                    "var(--play-font-head)",
                            }}
                        >
                            {preset.name}
                        </span>
                        <span
                            className="text-xs"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            · change
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PresetSwitcher;
