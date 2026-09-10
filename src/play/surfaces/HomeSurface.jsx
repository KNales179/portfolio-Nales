import { motion } from "framer-motion";

import { usePreset } from "../PresetContext";
import { usePlayContent } from "../content/usePlayContent";
import { SECTIONS, NAVS } from "../sections/registry";
import SectionBoundary from "../sections/SectionBoundary";
import MobileNav from "../sections/MobileNav";


// ============================================================
// HOME SURFACE
// ============================================================
//
// The home route rendered through the active preset — the full
// portfolio as one preset-styled scroll. Same content
// (usePlayContent), same section-variant registry as the /play
// preview; only the preset config decides order + variants.
// ============================================================

function HomeSurface() {
    const { livePreset } = usePreset();
    const data = usePlayContent();

    const { order, variants, nav } = livePreset.layout;
    const Nav = NAVS[nav] || NAVS.minimal;

    return (
        <motion.div
            key={livePreset.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Nav order={order} data={data} />

            <div className="pb-16 sm:pb-0">
                <SectionBoundary>
                    {order.map((key) => {
                        const Component =
                            SECTIONS[key]?.[variants[key]];

                        if (!Component) {
                            return null;
                        }

                        return (
                            <Component
                                key={key}
                                data={data}
                            />
                        );
                    })}
                </SectionBoundary>
            </div>

            <MobileNav />
        </motion.div>
    );
}

export default HomeSurface;
