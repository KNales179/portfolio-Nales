import { motion } from "framer-motion";

import { usePreset } from "../PresetContext";
import { usePlayContent } from "../content/usePlayContent";
import { SECTIONS } from "../sections/registry";
import ContactForm from "../sections/ContactForm";
import { Display, Kicker } from "../sections/primitives";


// ============================================================
// PAGE SURFACE
// ============================================================
//
// Renders one dedicated public route through the active preset.
// `preset.layout.pages[page]` is an ordered list of
// [section, variant] pairs; the contact page additionally gets
// the shared message form.
// ============================================================

function PageSurface({ page }) {
    const { livePreset } = usePreset();
    const data = usePlayContent();

    const blocks = livePreset.layout.pages?.[page] || [];

    return (
        <motion.div
            key={`${livePreset.id}-${page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {page === "contact" && (
                <section className="w-full px-6 pt-28 md:px-10 lg:px-16">
                    <div
                        className="mx-auto w-full"
                        style={{
                            maxWidth: "var(--play-maxw)",
                        }}
                    >
                        <Kicker>Send a message</Kicker>
                        <Display
                            as="h2"
                            className="mb-6 mt-3 text-2xl font-bold tracking-tight md:text-3xl"
                        >
                            Tell me about it
                        </Display>
                        <div className="max-w-xl">
                            <ContactForm />
                        </div>
                    </div>
                </section>
            )}

            {blocks.map(([section, variant], index) => {
                const Component =
                    SECTIONS[section]?.[variant];

                if (!Component) {
                    return null;
                }

                return (
                    <Component
                        key={`${section}-${index}`}
                        data={data}
                    />
                );
            })}
        </motion.div>
    );
}

export default PageSurface;
