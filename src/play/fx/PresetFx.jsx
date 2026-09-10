import MatrixRain from "./MatrixRain";
import GridFloor from "./GridFloor";


// ============================================================
// PRESET FX
// ============================================================
//
// The full-viewport effect layer for presets that have one
// (`preset.layout.fx`). Fixed, behind all content, pointer-
// events-none. Colours are resolved from the preset here so the
// canvas never has to read CSS variables.
// ============================================================

const pick = (preset, mode, token) =>
    (mode === "dark" && preset.themeDark?.[token]) ||
    preset.theme[token];


function PresetFx({ preset, mode = "light" }) {
    const fx = preset?.layout?.fx;

    if (!fx) {
        return null;
    }

    const accent = pick(preset, mode, "--play-accent");
    const bg = pick(preset, mode, "--play-bg");

    let layer = null;

    if (fx === "matrixRain") {
        layer = <MatrixRain accent={accent} bg={bg} />;
    } else if (fx === "gridFloor") {
        layer = (
            <GridFloor
                accent={accent}
                glow={pick(preset, mode, "--play-accent-2") ||
                    accent}
            />
        );
    }

    if (!layer) {
        return null;
    }

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0"
            aria-hidden="true"
        >
            {layer}
        </div>
    );
}

export default PresetFx;
