import { createElement } from "react";
import { motion } from "framer-motion";

import { resolveIcon } from "../../components/edit/iconMap";
import {
    PlaySection,
    Display,
    Kicker,
    Rule,
} from "./primitives";
import { panelStyle } from "./styles";


// ============================================================
// ABOUT — stacked  (minimalist)
// ============================================================

export function AboutStacked({ data }) {
    const { about, strengths, awards } = data;

    return (
        <PlaySection id="play-about">
            <Kicker>{about.label}</Kicker>

            <Display
                as="h2"
                className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl"
            >
                {about.title}
            </Display>

            {about.description && (
                <p
                    className="mt-5 max-w-2xl text-base leading-8"
                    style={{ color: "var(--play-muted)" }}
                >
                    {about.description}
                </p>
            )}

            {strengths.length > 0 && (
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {strengths.map((strength, index) => (
                        <motion.div
                            key={strength.id || index}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.05,
                            }}
                            className="p-5"
                            style={{
                                ...panelStyle,
                                boxShadow: "none",
                            }}
                        >
                            <div
                                className="mb-3 flex h-9 w-9 items-center justify-center"
                                style={{
                                    background:
                                        "color-mix(in srgb, var(--play-accent) 12%, transparent)",
                                    color: "var(--play-accent)",
                                }}
                            >
                                {createElement(
                                    resolveIcon(strength.icon),
                                    { size: 18 }
                                )}
                            </div>
                            <Display
                                as="h3"
                                className="text-base font-semibold"
                            >
                                {strength.title}
                            </Display>
                            <p
                                className="mt-1.5 text-sm leading-6"
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                {strength.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}

            {awards.length > 0 && (
                <div className="mt-14">
                    <Kicker>Recognition</Kicker>
                    <ul className="mt-4 divide-y" style={{ borderColor: "var(--play-border)" }}>
                        {awards.map((award, index) => (
                            <li
                                key={award.id || index}
                                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                                style={{
                                    borderColor:
                                        "var(--play-border)",
                                    borderTopWidth:
                                        index === 0 ? 0 : 1,
                                }}
                            >
                                <span className="font-medium">
                                    {award.title}
                                </span>
                                <span
                                    className="text-sm"
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    {award.category}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </PlaySection>
    );
}


// ============================================================
// ABOUT — lead column  (editorial)
// ============================================================

export function AboutLeadColumn({ data }) {
    const { about, strengths, awards } = data;

    return (
        <PlaySection id="play-about">
            <Rule />
            <div className="grid gap-10 pt-12 md:grid-cols-[1fr_2fr]">
                <div>
                    <Kicker>{about.label}</Kicker>
                    <Display
                        as="h2"
                        className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
                    >
                        {about.title}
                    </Display>
                </div>

                <div>
                    <p
                        className="text-lg leading-9 first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8]"
                        style={{
                            color: "var(--play-text)",
                        }}
                    >
                        {about.description ||
                            "This portfolio is written as a story of practical building — one project, one lesson, one iteration at a time."}
                    </p>

                    {strengths.length > 0 && (
                        <ol className="mt-10 space-y-5">
                            {strengths.map(
                                (strength, index) => (
                                    <li
                                        key={
                                            strength.id ||
                                            index
                                        }
                                        className="flex gap-4"
                                    >
                                        <span
                                            className="shrink-0 text-2xl font-bold"
                                            style={{
                                                fontFamily:
                                                    "var(--play-font-head)",
                                                color: "var(--play-accent)",
                                            }}
                                        >
                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>
                                        <div>
                                            <Display
                                                as="h3"
                                                className="text-lg font-semibold"
                                            >
                                                {
                                                    strength.title
                                                }
                                            </Display>
                                            <p
                                                className="mt-1 leading-7"
                                                style={{
                                                    color: "var(--play-muted)",
                                                }}
                                            >
                                                {
                                                    strength.description
                                                }
                                            </p>
                                        </div>
                                    </li>
                                )
                            )}
                        </ol>
                    )}
                </div>
            </div>

            {awards.length > 0 && (
                <div className="mt-16">
                    <Rule />
                    <p
                        className="mt-6 text-xs uppercase tracking-[0.28em]"
                        style={{ color: "var(--play-muted)" }}
                    >
                        Recognition
                    </p>
                    <div className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
                        {awards.map((award, index) => (
                            <div key={award.id || index}>
                                <Display
                                    as="p"
                                    className="text-lg font-semibold"
                                >
                                    {award.title}
                                </Display>
                                <p
                                    className="text-sm italic"
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    {award.category}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PlaySection>
    );
}
