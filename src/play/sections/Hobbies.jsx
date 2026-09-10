import { motion } from "framer-motion";

import { PlaySection, Display, Kicker, Rule } from "./primitives";


// ============================================================
// HOBBIES — grid  (minimalist)
// ============================================================

export function HobbiesGrid({ data }) {
    const { hobbies } = data;

    if (hobbies.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-hobbies">
            <Kicker>Away from the keyboard</Kicker>
            <Display
                as="h2"
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
                Hobbies
            </Display>

            <div
                className="mt-10 grid overflow-hidden border sm:grid-cols-2 lg:grid-cols-3"
                style={{
                    borderColor: "var(--play-border)",
                    background: "var(--play-border)",
                    gap: "1px",
                }}
            >
                {hobbies.map((hobby, index) => (
                    <motion.div
                        key={hobby.id || index}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.35,
                            delay: index * 0.04,
                        }}
                        className="p-6"
                        style={{
                            background: "var(--play-card)",
                        }}
                    >
                        <span
                            className="text-xs font-semibold tracking-[0.18em]"
                            style={{
                                color: "var(--play-accent)",
                            }}
                        >
                            {String(index + 1).padStart(
                                2,
                                "0"
                            )}
                        </span>
                        <Display
                            as="h3"
                            className="mt-3 text-base font-semibold"
                        >
                            {hobby.title}
                        </Display>
                        <p
                            className="mt-1.5 text-sm leading-6"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            {hobby.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </PlaySection>
    );
}


// ============================================================
// HOBBIES — margin notes  (editorial)
// ============================================================

export function HobbiesMargin({ data }) {
    const { hobbies } = data;

    if (hobbies.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-hobbies">
            <Rule />
            <div className="grid gap-10 pt-12 md:grid-cols-[1fr_2fr]">
                <div>
                    <Kicker>In the margins</Kicker>
                    <Display
                        as="h2"
                        className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
                    >
                        Off the page
                    </Display>
                </div>

                <div className="columns-1 gap-10 sm:columns-2">
                    {hobbies.map((hobby, index) => (
                        <div
                            key={hobby.id || index}
                            className="mb-6 break-inside-avoid"
                        >
                            <Display
                                as="h3"
                                className="text-lg font-semibold"
                            >
                                {hobby.title}
                            </Display>
                            <p
                                className="mt-1 leading-7"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                {hobby.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </PlaySection>
    );
}
