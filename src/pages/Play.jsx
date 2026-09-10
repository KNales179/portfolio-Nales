import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { usePreset } from "../play/PresetContext";
import LayoutRenderer from "../play/LayoutRenderer";
import PresetSwitcher from "../play/PresetSwitcher";
import PresetFx from "../play/fx/PresetFx";
import { ensurePlayFonts } from "../play/theme/fonts";


// ============================================================
// PLAY PAGE
// ============================================================
//
// The explorable portfolio. The same live content, rendered
// through a chosen preset (design system + layout system +
// interaction style). Everything is scoped to this container —
// the --play-* tokens never touch the global stylesheet.
// ============================================================

function PlayShell() {
    const { themeStyle, presetId, preset, mode } =
        usePreset();

    // The preview needs every preset's web fonts up front.
    useEffect(() => {
        ensurePlayFonts();
    }, []);

    // Reset scroll when the whole presentation swaps.
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [presetId]);

    return (
        <div
            className="relative min-h-screen w-full overflow-x-clip"
            style={themeStyle}
        >
            <PresetFx preset={preset} mode={mode} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={presetId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                >
                    <LayoutRenderer />
                </motion.div>
            </AnimatePresence>

            <PresetSwitcher />
        </div>
    );
}


function Play() {
    return <PlayShell />;
}

export default Play;
