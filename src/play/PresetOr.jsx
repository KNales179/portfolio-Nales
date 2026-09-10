import { usePreset } from "./PresetContext";
import HomeSurface from "./surfaces/HomeSurface";
import PageSurface from "./surfaces/PageSurface";


// ============================================================
// PresetOr
// ============================================================
//
// Route-level switch: render a public page through the applied
// preset, or fall back to its default implementation.
//
//   <Route path="/projects" element={
//       <PresetOr page="projects" fallback={<Projects />} />
//   } />
// ============================================================

function PresetOr({ page, fallback }) {
    const { livePreset } = usePreset();

    if (!livePreset) {
        return fallback;
    }

    if (page === "home") {
        return <HomeSurface />;
    }

    return <PageSurface page={page} />;
}

export default PresetOr;
