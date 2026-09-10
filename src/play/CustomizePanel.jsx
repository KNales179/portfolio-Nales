import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Check,
    Layers,
    Moon,
    Palette,
    RotateCcw,
    Sun,
    Type,
    X,
} from "lucide-react";

import { usePreset } from "./PresetContext";
import {
    contrastGrade,
    contrastRatio,
    derivePalette,
    ensureReadable,
    mix,
    parseColor,
    pickContrast,
    toHex,
} from "./theme/contrast";


// ============================================================
// CUSTOMISE PANEL  (Phase 4)
// ============================================================
//
// A slide-in drawer on the /play preview. Writes visitor
// overrides (accent / type / density / mode) into the preset's
// --play-* tokens via PresetContext. Everything is per-preset
// and saved to localStorage; it carries into "Use on my site"
// because buildScopeVars already merges overrides.
// ============================================================

const ACCENT_SWATCHES = [
    "#7c5cff",
    "#3b82f6",
    "#14b8a6",
    "#22c55e",
    "#f59e0b",
    "#f43f5e",
    "#ec4899",
    "#a855f7",
];

// One click → a full core palette (bg / surface / card / border
// / text / muted are derived from the base colour).
const QUICK_PALETTES = [
    { label: "Paper", bg: "#f5f2e9" },
    { label: "Cloud", bg: "#eef2f8" },
    { label: "Sand", bg: "#e9ddc7" },
    { label: "Slate", bg: "#1f2430" },
    { label: "Ink", bg: "#111214" },
    { label: "Forest", bg: "#122019" },
];

const FONT_PAIRS = [
    { label: "Preset default", head: null, body: null },
    {
        label: "Grotesk · Inter",
        head: "'Space Grotesk', system-ui, sans-serif",
        body: "'Inter', system-ui, sans-serif",
    },
    {
        label: "Playfair · Serif",
        head: "'Playfair Display', Georgia, serif",
        body: "'Source Serif 4', Georgia, serif",
    },
    {
        label: "Mono · Mono",
        head: "'JetBrains Mono', ui-monospace, monospace",
        body: "'JetBrains Mono', ui-monospace, monospace",
    },
    {
        label: "Fredoka · Grotesk",
        head: "'Fredoka', system-ui, sans-serif",
        body: "'Space Grotesk', system-ui, sans-serif",
    },
    {
        label: "Archivo · Grotesk",
        head: "'Archivo Black', system-ui, sans-serif",
        body: "'Space Grotesk', system-ui, sans-serif",
    },
];

const DENSITIES = [
    { label: "Compact", value: "3.25rem" },
    { label: "Default", value: null },
    { label: "Spacious", value: "7.5rem" },
];


function Section({ icon: Icon, title, children }) {
    return (
        <div className="border-t px-5 py-4" style={{ borderColor: "var(--play-border)" }}>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--play-muted)" }}>
                <Icon size={13} />
                {title}
            </p>
            {children}
        </div>
    );
}


function Segmented({ options, active, onChange }) {
    return (
        <div
            className="flex overflow-hidden rounded-lg border text-xs font-medium"
            style={{ borderColor: "var(--play-border)" }}
        >
            {options.map((opt) => {
                const on = opt.key === active;
                return (
                    <button
                        key={opt.key}
                        type="button"
                        onClick={() => onChange(opt.key)}
                        className="flex-1 px-3 py-2 transition"
                        style={{
                            background: on
                                ? "var(--play-accent)"
                                : "transparent",
                            color: on
                                ? "var(--play-accent-contrast)"
                                : "var(--play-muted)",
                        }}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}


function CustomizePanel({ open, onClose }) {
    const {
        preset,
        mode,
        toggleMode,
        overrides,
        setOverride,
        setOverrides,
        resetOverrides,
        hasOverrides,
    } = usePreset();

    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const onKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", onKey);
        return () =>
            window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const resolve = (token) =>
        overrides[token] ||
        (mode === "dark" && preset.themeDark?.[token]) ||
        preset.theme[token];

    const accent = resolve("--play-accent");
    const accent2 = resolve("--play-accent-2");
    const bg = resolve("--play-bg");
    const text = resolve("--play-text");
    const headFont = resolve("--play-font-head");
    const sectionY = overrides["--play-section-y"] || null;

    const hex = (value, fallback) => {
        const rgb = parseColor(value);
        return rgb ? toHex(rgb) : fallback;
    };

    const accentHex = hex(accent, "#7c5cff");
    const accent2Hex = hex(accent2, "#ec4899");
    const bgHex = hex(bg, "#111111");
    const textHex = hex(text, "#f4f4f5");

    const ratio = contrastRatio(accent, bg);
    const grade = contrastGrade(ratio);
    const weak = grade === "Fail" || grade === "AA Large";

    const textRatio = contrastRatio(text, bg);
    const textGrade = contrastGrade(textRatio);
    const textWeak =
        textGrade === "Fail" || textGrade === "AA Large";

    // --- write helpers --------------------------------------
    const applyAccent = (value) =>
        setOverrides({
            "--play-accent": value,
            "--play-accent-contrast": pickContrast(value),
        });

    const applyPalette = (baseBg) =>
        setOverrides(
            derivePalette(baseBg, {
                text: overrides["--play-text"],
            })
        );

    const applyText = (value) =>
        setOverrides({
            "--play-text": value,
            "--play-muted": mix(value, bg, 0.42),
        });

    const activeDensity =
        DENSITIES.find((d) => d.value === sectionY)?.label ||
        "Default";

    const activePair =
        FONT_PAIRS.find((p) => p.head === headFont)?.label ||
        (overrides["--play-font-head"]
            ? null
            : "Preset default");

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="customise"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[70]"
                >
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30"
                    />
                    <motion.aside
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 34,
                        }}
                        className="play-scope absolute right-0 top-0 flex h-full w-[340px] max-w-[88vw] flex-col overflow-y-auto shadow-2xl"
                        style={{
                            background: "var(--play-surface)",
                            color: "var(--play-text)",
                            fontFamily: "var(--play-font-body)",
                        }}
                    >
                        <div className="flex items-center justify-between px-5 py-4">
                            <span
                                className="text-sm font-semibold"
                                style={{
                                    fontFamily:
                                        "var(--play-font-head)",
                                }}
                            >
                                Customise · {preset.name}
                            </span>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="transition hover:opacity-60"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <Section icon={Sun} title="Appearance">
                            <Segmented
                                active={mode}
                                onChange={(next) => {
                                    if (next !== mode) {
                                        toggleMode();
                                    }
                                }}
                                options={[
                                    {
                                        key: "light",
                                        label: (
                                            <span className="flex items-center justify-center gap-1.5">
                                                <Sun
                                                    size={12}
                                                />
                                                Light
                                            </span>
                                        ),
                                    },
                                    {
                                        key: "dark",
                                        label: (
                                            <span className="flex items-center justify-center gap-1.5">
                                                <Moon
                                                    size={12}
                                                />
                                                Dark
                                            </span>
                                        ),
                                    },
                                ]}
                            />
                        </Section>

                        <Section
                            icon={Layers}
                            title="Colour palette"
                        >
                            <p
                                className="mb-2 text-[11px] leading-4"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                Pick a base — background, surface,
                                text and borders re-derive from it.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_PALETTES.map((p) => (
                                    <button
                                        key={p.label}
                                        type="button"
                                        onClick={() =>
                                            applyPalette(p.bg)
                                        }
                                        className="h-7 w-7 rounded-md border transition hover:scale-110"
                                        style={{
                                            background: p.bg,
                                            borderColor:
                                                bgHex.toLowerCase() ===
                                                p.bg
                                                    ? "var(--play-accent)"
                                                    : "var(--play-border)",
                                        }}
                                        aria-label={p.label}
                                        title={p.label}
                                    />
                                ))}
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2">
                                <label
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs"
                                    style={{
                                        borderColor:
                                            "var(--play-border)",
                                    }}
                                >
                                    <span
                                        className="h-4 w-4 rounded border"
                                        style={{
                                            background: bgHex,
                                            borderColor:
                                                "var(--play-border)",
                                        }}
                                    />
                                    Background
                                    <input
                                        type="color"
                                        value={bgHex}
                                        onChange={(e) =>
                                            applyPalette(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                </label>
                                <label
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs"
                                    style={{
                                        borderColor:
                                            "var(--play-border)",
                                    }}
                                >
                                    <span
                                        className="h-4 w-4 rounded border"
                                        style={{
                                            background: textHex,
                                            borderColor:
                                                "var(--play-border)",
                                        }}
                                    />
                                    Text
                                    <input
                                        type="color"
                                        value={textHex}
                                        onChange={(e) =>
                                            applyText(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                </label>
                            </div>

                            <div className="mt-2 flex items-center gap-2 text-[11px]">
                                <span
                                    className="rounded px-1.5 py-0.5 font-semibold"
                                    style={{
                                        background: textWeak
                                            ? "#f43f5e"
                                            : "#16a34a",
                                        color: "#fff",
                                    }}
                                >
                                    {textRatio.toFixed(1)}:1 ·{" "}
                                    {textGrade}
                                </span>
                                <span
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    text on background
                                </span>
                            </div>
                        </Section>

                        <Section
                            icon={Palette}
                            title="Accent colour"
                        >
                            <div className="flex flex-wrap gap-2">
                                {ACCENT_SWATCHES.map((swatch) => (
                                    <button
                                        key={swatch}
                                        type="button"
                                        onClick={() =>
                                            applyAccent(swatch)
                                        }
                                        className="h-7 w-7 rounded-full border-2 transition hover:scale-110"
                                        style={{
                                            background: swatch,
                                            borderColor:
                                                accentHex.toLowerCase() ===
                                                swatch
                                                    ? "var(--play-text)"
                                                    : "transparent",
                                        }}
                                        aria-label={swatch}
                                    />
                                ))}
                                <label
                                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed"
                                    style={{
                                        borderColor:
                                            "var(--play-border)",
                                    }}
                                >
                                    <Palette size={12} />
                                    <input
                                        type="color"
                                        value={accentHex}
                                        onChange={(e) =>
                                            applyAccent(
                                                e.target.value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                </label>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs">
                                <span
                                    className="rounded px-1.5 py-0.5 font-semibold"
                                    style={{
                                        background: weak
                                            ? "#f43f5e"
                                            : "#16a34a",
                                        color: "#fff",
                                    }}
                                >
                                    {ratio.toFixed(1)}:1 ·{" "}
                                    {grade}
                                </span>
                                <span
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    accent on background
                                </span>
                                {weak && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            applyAccent(
                                                ensureReadable(
                                                    accentHex,
                                                    bg,
                                                    4.5
                                                )
                                            )
                                        }
                                        className="ml-auto rounded px-2 py-0.5 text-[11px] font-semibold underline"
                                    >
                                        Auto-fix
                                    </button>
                                )}
                            </div>
                        </Section>

                        <Section
                            icon={Palette}
                            title="Secondary accent"
                        >
                            <div className="flex flex-wrap gap-2">
                                {ACCENT_SWATCHES.map((swatch) => (
                                    <button
                                        key={swatch}
                                        type="button"
                                        onClick={() =>
                                            setOverride(
                                                "--play-accent-2",
                                                swatch
                                            )
                                        }
                                        className="h-7 w-7 rounded-full border-2 transition hover:scale-110"
                                        style={{
                                            background: swatch,
                                            borderColor:
                                                accent2Hex.toLowerCase() ===
                                                swatch
                                                    ? "var(--play-text)"
                                                    : "transparent",
                                        }}
                                        aria-label={swatch}
                                    />
                                ))}
                                <label
                                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed"
                                    style={{
                                        borderColor:
                                            "var(--play-border)",
                                    }}
                                >
                                    <Palette size={12} />
                                    <input
                                        type="color"
                                        value={accent2Hex}
                                        onChange={(e) =>
                                            setOverride(
                                                "--play-accent-2",
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </Section>

                        <Section
                            icon={Type}
                            title="Typography"
                        >
                            <div className="flex flex-col gap-1.5">
                                {FONT_PAIRS.map((pair) => {
                                    const on =
                                        activePair ===
                                        pair.label;
                                    return (
                                        <button
                                            key={pair.label}
                                            type="button"
                                            onClick={() =>
                                                setOverrides(
                                                    {
                                                        "--play-font-head":
                                                            pair.head,
                                                        "--play-font-body":
                                                            pair.body,
                                                    }
                                                )
                                            }
                                            className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition"
                                            style={{
                                                borderColor:
                                                    on
                                                        ? "var(--play-accent)"
                                                        : "var(--play-border)",
                                                fontFamily:
                                                    pair.head ||
                                                    "var(--play-font-head)",
                                            }}
                                        >
                                            {pair.label}
                                            {on && (
                                                <Check
                                                    size={
                                                        14
                                                    }
                                                    style={{
                                                        color: "var(--play-accent)",
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </Section>

                        <Section
                            icon={Palette}
                            title="Density"
                        >
                            <Segmented
                                active={activeDensity}
                                onChange={(label) => {
                                    const d =
                                        DENSITIES.find(
                                            (x) =>
                                                x.label ===
                                                label
                                        );
                                    setOverride(
                                        "--play-section-y",
                                        d ? d.value : null
                                    );
                                }}
                                options={DENSITIES.map(
                                    (d) => ({
                                        key: d.label,
                                        label: d.label,
                                    })
                                )}
                            />
                        </Section>

                        <div className="mt-auto px-5 py-4">
                            <button
                                type="button"
                                onClick={resetOverrides}
                                disabled={!hasOverrides}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-semibold transition disabled:opacity-40"
                                style={{
                                    borderColor:
                                        "var(--play-border)",
                                }}
                            >
                                <RotateCcw size={13} />
                                Reset customisation
                            </button>
                            <p
                                className="mt-2 text-center text-[11px] leading-4"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                Saved on this device. Kept when
                                you use this style on the site.
                            </p>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CustomizePanel;
