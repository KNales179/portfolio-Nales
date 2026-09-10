import { createElement } from "react";
import { motion } from "framer-motion";

import { resolveIcon } from "../../components/edit/iconMap";
import { PlaySection, Display, Kicker, Rule } from "./primitives";


// ============================================================
// SKILLS — chips  (minimalist)
// ============================================================

export function SkillsChips({ data }) {
    const { skills } = data;

    if (skills.length === 0) {
        return null;
    }

    return (
        <PlaySection
            id="play-skills"
            className="border-y"
        >
            <Kicker>Toolkit</Kicker>
            <Display
                as="h2"
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
                What I work with
            </Display>

            <div className="mt-10 space-y-6">
                {skills.map((group, index) => (
                    <motion.div
                        key={group.id || index}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                            duration: 0.35,
                            delay: index * 0.05,
                        }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="flex w-44 shrink-0 items-center gap-2.5">
                            <span
                                className="flex h-8 w-8 items-center justify-center"
                                style={{
                                    background:
                                        "color-mix(in srgb, var(--play-accent) 12%, transparent)",
                                    color: "var(--play-accent)",
                                }}
                            >
                                {createElement(
                                    resolveIcon(group.icon),
                                    { size: 16 }
                                )}
                            </span>
                            <span className="text-sm font-semibold">
                                {group.name}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(group.items || []).map(
                                (item) => (
                                    <span
                                        key={item}
                                        className="border px-2.5 py-1 text-xs"
                                        style={{
                                            borderColor:
                                                "var(--play-border)",
                                            color: "var(--play-muted)",
                                            borderRadius:
                                                "var(--play-radius)",
                                        }}
                                    >
                                        {item}
                                    </span>
                                )
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </PlaySection>
    );
}


// ============================================================
// SKILLS — index  (editorial)
// ============================================================

export function SkillsIndex({ data }) {
    const { skills } = data;

    if (skills.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-skills">
            <Rule />
            <div className="grid gap-10 pt-12 md:grid-cols-[1fr_2fr]">
                <div>
                    <Kicker>The Index</Kicker>
                    <Display
                        as="h2"
                        className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
                    >
                        Craft &amp; tools
                    </Display>
                </div>

                <dl className="divide-y" style={{ borderColor: "var(--play-border)" }}>
                    {skills.map((group, index) => (
                        <div
                            key={group.id || index}
                            className="grid gap-2 py-5 sm:grid-cols-[auto_1fr]"
                            style={{
                                borderColor:
                                    "var(--play-border)",
                                borderTopWidth:
                                    index === 0 ? 0 : 1,
                            }}
                        >
                            <dt className="flex items-baseline gap-3">
                                <span
                                    className="text-sm"
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    {String(
                                        index + 1
                                    ).padStart(2, "0")}
                                </span>
                                <Display
                                    as="span"
                                    className="text-xl font-semibold"
                                >
                                    {group.name}
                                </Display>
                            </dt>
                            <dd
                                className="text-sm leading-7 sm:text-right"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                {(group.items || []).join(
                                    " · "
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </PlaySection>
    );
}
