import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

import {
    PRESETS,
    DEFAULT_PRESET_ID,
    getPreset,
} from "./presets/registry";
import {
    buildThemeStyle,
    buildScopeVars,
} from "./theme/applyTheme";


// ============================================================
// PRESET CONTEXT
// ============================================================
//
// State persisted to localStorage (no account):
//
//   presetId   — the preset selected in the /play picker.
//   applied    — whether that preset is live on the public site.
//   mode       — light / dark.
//   overrides  — per-preset visitor customisation (accent, type,
//                density …) as a map of --play-* tokens. Shape in
//                storage: { [presetId]: { "--play-accent": "#…" } }
//                so tweaks to one preset never leak into another.
//
//   apply()          — make the selected preset live sitewide.
//   reset()          — back to the default site (keeps overrides).
//   setOverride()    — set / clear one token for the current preset.
//   resetOverrides() — clear the current preset's customisation.
// ============================================================

const PRESET_KEY = "play_preset";
const MODE_KEY = "play_mode";
const APPLIED_KEY = "play_applied";
const OVERRIDES_KEY = "play_overrides";

const EMPTY = {};

const read = (key) => {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // storage disabled — preference just won't persist
    }
};

const readOverrides = () => {
    try {
        const parsed = JSON.parse(
            localStorage.getItem(OVERRIDES_KEY) || "{}"
        );
        return parsed && typeof parsed === "object"
            ? parsed
            : {};
    } catch {
        return {};
    }
};


const PresetContext = createContext(null);


export const PresetProvider = ({ children }) => {
    const [presetId, setPresetId] = useState(
        () => read(PRESET_KEY) || DEFAULT_PRESET_ID
    );
    const [mode, setMode] = useState(() =>
        read(MODE_KEY) === "dark" ? "dark" : "light"
    );
    const [applied, setApplied] = useState(
        () => read(APPLIED_KEY) === "1"
    );
    const [allOverrides, setAllOverrides] =
        useState(readOverrides);

    const preset = getPreset(presetId);
    const activeId = preset.id;

    const overrides = allOverrides[activeId] || EMPTY;

    const setPreset = useCallback((id) => {
        setPresetId(id);
        write(PRESET_KEY, id);
    }, []);

    const toggleMode = useCallback(() => {
        setMode((current) => {
            const next =
                current === "light" ? "dark" : "light";
            write(MODE_KEY, next);
            return next;
        });
    }, []);

    const apply = useCallback(() => {
        setApplied(true);
        write(APPLIED_KEY, "1");
    }, []);

    const reset = useCallback(() => {
        setApplied(false);
        write(APPLIED_KEY, "0");
    }, []);

    // Merge a map of token → value for the current preset.
    // A null / undefined / "" value removes that token.
    const setOverrides = useCallback(
        (patch) => {
            setAllOverrides((current) => {
                const forPreset = {
                    ...(current[activeId] || {}),
                };
                for (const [token, value] of Object.entries(
                    patch
                )) {
                    if (
                        value === null ||
                        value === undefined ||
                        value === ""
                    ) {
                        delete forPreset[token];
                    } else {
                        forPreset[token] = value;
                    }
                }

                const next = { ...current };
                if (Object.keys(forPreset).length === 0) {
                    delete next[activeId];
                } else {
                    next[activeId] = forPreset;
                }
                write(
                    OVERRIDES_KEY,
                    JSON.stringify(next)
                );
                return next;
            });
        },
        [activeId]
    );

    const setOverride = useCallback(
        (token, value) => setOverrides({ [token]: value }),
        [setOverrides]
    );

    const resetOverrides = useCallback(() => {
        setAllOverrides((current) => {
            if (!current[activeId]) {
                return current;
            }
            const next = { ...current };
            delete next[activeId];
            write(OVERRIDES_KEY, JSON.stringify(next));
            return next;
        });
    }, [activeId]);

    const overridesFor = useCallback(
        (id) => allOverrides[id] || EMPTY,
        [allOverrides]
    );

    // The /play preview always reflects the picker + overrides.
    const themeStyle = useMemo(
        () => buildThemeStyle(preset, { mode, overrides }),
        [preset, mode, overrides]
    );

    // Sitewide CSS variables — only meaningful while `applied`.
    const scopeVars = useMemo(
        () => buildScopeVars(preset, { mode, overrides }),
        [preset, mode, overrides]
    );

    const value = useMemo(
        () => ({
            preset,
            presetId: preset.id,
            presets: PRESETS,
            setPreset,

            mode,
            toggleMode,

            applied,
            apply,
            reset,
            // The preset that is actually live on the main site,
            // or null when the default site is showing.
            livePreset: applied ? preset : null,

            overrides,
            setOverride,
            setOverrides,
            resetOverrides,
            hasOverrides:
                Object.keys(overrides).length > 0,
            overridesFor,

            themeStyle,
            scopeVars,
        }),
        [
            preset,
            setPreset,
            mode,
            toggleMode,
            applied,
            apply,
            reset,
            overrides,
            setOverride,
            setOverrides,
            resetOverrides,
            overridesFor,
            themeStyle,
            scopeVars,
        ]
    );

    return (
        <PresetContext.Provider value={value}>
            {children}
        </PresetContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const usePreset = () => {
    const context = useContext(PresetContext);

    if (!context) {
        throw new Error(
            "usePreset must be used inside a PresetProvider"
        );
    }

    return context;
};
