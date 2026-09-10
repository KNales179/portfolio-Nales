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
// Two related pieces of state, both persisted to localStorage
// (no account):
//
//   presetId  — the preset currently selected in the /play
//               picker / preview.
//   applied   — whether that preset is live on the main public
//               site. Default false → the site looks exactly
//               as designed.
//
//   mode      — light / dark, applies to both.
//
//   apply()   — make the selected preset live sitewide.
//   reset()   — back to the default site.
//
// `overrides` is the (empty) seam for Phase 4 visitor colour /
// font customisation.
// ============================================================

const PRESET_KEY = "play_preset";
const MODE_KEY = "play_mode";
const APPLIED_KEY = "play_applied";

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

    const [overrides] = useState({});

    const preset = getPreset(presetId);

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

    // The /play preview always reflects the picker.
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
