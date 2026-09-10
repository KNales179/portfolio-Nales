import { motion } from "framer-motion";

import { PlaySection, Display, Kicker, Rule } from "./primitives";


// ============================================================
// JOURNEY — timeline  (minimalist)
// ============================================================

export function JourneyTimeline({ data }) {
    const { journey } = data;

    if (journey.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-journey">
            <Kicker>The road so far</Kicker>
            <Display
                as="h2"
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
                Development journey
            </Display>

            <div className="relative mt-10">
                <div
                    className="absolute bottom-2 left-[7px] top-2 w-px"
                    style={{
                        background: "var(--play-border)",
                    }}
                    aria-hidden="true"
                />
                <ol className="relative space-y-8">
                    {journey.map((milestone, index) => (
                        <motion.li
                            key={milestone.id || index}
                            initial={{ opacity: 0, x: -12 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                            }}
                            className="relative pl-8"
                        >
                            <span
                                className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2"
                                style={{
                                    borderColor:
                                        "var(--play-accent)",
                                    background:
                                        "var(--play-bg)",
                                }}
                            />
                            <div className="flex flex-wrap items-baseline gap-x-3">
                                <span
                                    className="text-sm font-bold tracking-wider"
                                    style={{
                                        color: "var(--play-accent)",
                                    }}
                                >
                                    {milestone.year}
                                </span>
                                <Display
                                    as="h3"
                                    className="text-lg font-semibold"
                                >
                                    {milestone.title}
                                </Display>
                            </div>
                            {milestone.description && (
                                <p
                                    className="mt-1.5 max-w-2xl text-sm leading-6"
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    {milestone.description}
                                </p>
                            )}
                        </motion.li>
                    ))}
                </ol>
            </div>
        </PlaySection>
    );
}


// ============================================================
// JOURNEY — ledger  (editorial)
// ============================================================

export function JourneyLedger({ data }) {
    const { journey } = data;

    if (journey.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-journey">
            <Rule />
            <div className="grid gap-10 pt-12 md:grid-cols-[1fr_2fr]">
                <div>
                    <Kicker>The Ledger</Kicker>
                    <Display
                        as="h2"
                        className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
                    >
                        A working record
                    </Display>
                </div>

                <div>
                    {journey.map((milestone, index) => (
                        <motion.div
                            key={milestone.id || index}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.4 }}
                            className="grid gap-2 py-5 sm:grid-cols-[6rem_1fr]"
                            style={{
                                borderTopWidth: 1,
                                borderColor:
                                    "var(--play-border)",
                            }}
                        >
                            <span
                                className="text-lg font-bold"
                                style={{
                                    fontFamily:
                                        "var(--play-font-head)",
                                    color: "var(--play-accent)",
                                }}
                            >
                                {milestone.year}
                            </span>
                            <div>
                                <Display
                                    as="h3"
                                    className="text-xl font-semibold"
                                >
                                    {milestone.title}
                                </Display>
                                {milestone.description && (
                                    <p
                                        className="mt-1 leading-7"
                                        style={{
                                            color: "var(--play-muted)",
                                        }}
                                    >
                                        {
                                            milestone.description
                                        }
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PlaySection>
    );
}
