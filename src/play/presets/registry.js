import minimal from "./minimal";
import editorial from "./editorial";
import terminal from "./terminal";
import brutalist from "./brutalist";
import cyberpunk from "./cyberpunk";
import synthwave from "./synthwave";


// ============================================================
// PRESET REGISTRY
// ============================================================
//
// The presets available on the Play pages, in display order.
// Adding a preset = drop a config here + provide its section
// variants under src/play/sections/.
// ============================================================

export const PRESETS = [
    minimal,
    editorial,
    terminal,
    brutalist,
    cyberpunk,
    synthwave,
];

export const PRESET_MAP = Object.fromEntries(
    PRESETS.map((preset) => [preset.id, preset])
);

export const DEFAULT_PRESET_ID = "minimal";

export const getPreset = (id) =>
    PRESET_MAP[id] || PRESET_MAP[DEFAULT_PRESET_ID];
