import MatrixRain from "./MatrixRain";
import NeonGrid from "./NeonGrid";
import GridFloor from "./GridFloor";
import Aurora from "./Aurora";
import HoloMesh from "./HoloMesh";
import RisoDots from "./RisoDots";
import MeshGradient from "./MeshGradient";
import BlueprintGrid from "./BlueprintGrid";
import Grain from "./Grain";


// ============================================================
// PRESET FX
// ============================================================
//
// The full-viewport effect layer for presets that have one
// (`preset.layout.fx`). Fixed, behind all content, pointer-
// events-none. Colours are resolved from the preset here so the
// canvas never has to read CSS variables.
// ============================================================

const pick = (preset, mode, token, overrides) =>
    overrides?.[token] ||
    (mode === "dark" && preset.themeDark?.[token]) ||
    preset.theme[token];


function PresetFx({ preset, mode = "light", overrides }) {
    const fx = preset?.layout?.fx;

    if (!fx) {
        return null;
    }

    const get = (token) =>
        pick(preset, mode, token, overrides);

    const accent = get("--play-accent");
    const bg = get("--play-bg");

    let layer = null;

    const accent2 = get("--play-accent-2") || accent;

    if (fx === "matrixRain") {
        layer = <MatrixRain accent={accent} bg={bg} />;
    } else if (fx === "neonGrid") {
        layer = (
            <NeonGrid
                accent={accent}
                accent2={accent2}
                bg={bg}
            />
        );
    } else if (fx === "gridFloor") {
        layer = <GridFloor accent={accent} glow={accent2} />;
    } else if (fx === "aurora") {
        layer = (
            <Aurora
                colors={[
                    get("--play-aurora-1") || accent,
                    get("--play-aurora-2") || accent2,
                    get("--play-aurora-3") || accent,
                ]}
            />
        );
    } else if (fx === "holoMesh") {
        layer = <HoloMesh />;
    } else if (fx === "riso") {
        layer = (
            <RisoDots
                accent={accent}
                accent2={accent2}
                bg={bg}
            />
        );
    } else if (fx === "mesh") {
        layer = (
            <MeshGradient
                colors={[
                    get("--play-mesh-1") || accent,
                    get("--play-mesh-2") || accent2,
                    get("--play-mesh-3") || accent,
                ]}
            />
        );
    } else if (fx === "blueprintGrid") {
        layer = <BlueprintGrid accent={accent} bg={bg} />;
    } else if (fx === "grain") {
        layer = <Grain tint={get("--play-text")} />;
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
