import { motion } from "framer-motion";
import { ArrowDownRight, Download } from "lucide-react";

import { trackInteraction } from "../../analytics/track";
import {
    PlaySection,
    Display,
    Kicker,
    Rule,
} from "./primitives";
import { panelStyle } from "./styles";


const scrollToId = (id) => {
    document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
};


// ============================================================
// HERO — centered  (minimalist)
// ============================================================

export function HeroCentered({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection id="play-hero" className="min-h-[88vh] flex items-center">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="mx-auto max-w-3xl text-center"
            >
                <Kicker className="justify-center">
                    {hero.greeting}
                </Kicker>

                <Display
                    as="h1"
                    className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
                >
                    {hero.name}
                </Display>

                <Display
                    as="p"
                    className="mt-4 text-xl font-medium md:text-2xl"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.role}
                </Display>

                <p
                    className="mx-auto mt-6 max-w-xl text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            backgroundColor:
                                "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        View work
                        <ArrowDownRight size={16} />
                    </button>

                    <a
                        href={resumeHref}
                        download
                        onClick={() =>
                            trackInteraction(
                                "RESUME_DOWNLOAD",
                                "play-hero"
                            )
                        }
                        className="inline-flex items-center gap-2 border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            borderColor: "var(--play-border)",
                            borderRadius: "var(--play-radius)",
                        }}
                    >
                        Résumé
                        <Download size={16} />
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — masthead  (editorial)
// ============================================================

export function HeroMasthead({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection id="play-hero" className="pt-16 md:pt-24">
            <div className="flex items-center justify-between gap-6">
                <Kicker>The Portfolio</Kicker>
                <span
                    className="text-xs uppercase tracking-[0.28em]"
                    style={{ color: "var(--play-muted)" }}
                >
                    Vol. 01
                </span>
            </div>

            <Rule className="mt-4" />

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid gap-8 py-12 md:grid-cols-[1.4fr_1fr] md:py-16"
            >
                <div>
                    <Display
                        as="h1"
                        className="text-6xl font-black leading-[0.95] tracking-tight md:text-8xl"
                    >
                        {hero.name}
                    </Display>

                    <Display
                        as="p"
                        className="mt-6 text-2xl italic leading-snug md:text-3xl"
                        style={{ color: "var(--play-accent)" }}
                    >
                        {hero.role}
                    </Display>
                </div>

                <div className="flex flex-col justify-end">
                    <p
                        className="text-lg leading-8"
                        style={{ color: "var(--play-text)" }}
                    >
                        <span
                            className="float-left mr-2 mt-1 text-6xl font-bold leading-[0.8]"
                            style={{
                                fontFamily:
                                    "var(--play-font-head)",
                                color: "var(--play-accent)",
                            }}
                        >
                            {(
                                hero.description ||
                                hero.greeting ||
                                "A"
                            )
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                        </span>
                        {(hero.description || "").trim().slice(1)}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                scrollToId("play-projects")
                            }
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition hover:opacity-80"
                            style={{
                                backgroundColor:
                                    "var(--play-accent)",
                                color: "var(--play-accent-contrast)",
                            }}
                        >
                            Read on
                            <ArrowDownRight size={15} />
                        </button>

                        <a
                            href={resumeHref}
                            download
                            onClick={() =>
                                trackInteraction(
                                    "RESUME_DOWNLOAD",
                                    "play-hero"
                                )
                            }
                            className="inline-flex items-center gap-2 border-b-2 pb-0.5 text-sm font-semibold uppercase tracking-wider transition hover:opacity-70"
                            style={{
                                borderColor:
                                    "var(--play-text)",
                            }}
                        >
                            Résumé
                        </a>
                    </div>
                </div>
            </motion.div>

            <Rule />
        </PlaySection>
    );
}


// ============================================================
// HERO — prompt  (terminal)
// ============================================================

const Line = ({ cmd, out, delay }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay }}
        className="leading-7"
    >
        <span style={{ color: "var(--play-accent)" }}>
            ${" "}
        </span>
        <span style={{ color: "var(--play-muted)" }}>
            {cmd}
        </span>
        <div className="whitespace-pre-wrap">{out}</div>
    </motion.div>
);

export function HeroPrompt({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[80vh] items-center"
        >
            <div className="w-full">
                <div
                    className="p-6 text-sm md:text-base"
                    style={panelStyle}
                >
                    <Line
                        cmd="whoami"
                        out={
                            <span className="text-2xl font-bold md:text-3xl">
                                {hero.name}
                            </span>
                        }
                        delay={0.05}
                    />
                    <Line
                        cmd="cat role.txt"
                        out={hero.role}
                        delay={0.35}
                    />
                    <Line
                        cmd="echo $BIO"
                        out={hero.description}
                        delay={0.65}
                    />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                document
                                    .getElementById(
                                        "play-projects"
                                    )
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                    })
                            }
                            className="transition hover:opacity-70"
                        >
                            <span
                                style={{
                                    color: "var(--play-accent)",
                                }}
                            >
                                ${" "}
                            </span>
                            ./view-work
                        </button>

                        <a
                            href={resumeHref}
                            download
                            onClick={() =>
                                trackInteraction(
                                    "RESUME_DOWNLOAD",
                                    "play-hero"
                                )
                            }
                            className="transition hover:opacity-70"
                        >
                            <span
                                style={{
                                    color: "var(--play-accent)",
                                }}
                            >
                                ${" "}
                            </span>
                            wget resume.pdf
                        </a>

                        <span
                            className="inline-block h-4 w-2 animate-pulse"
                            style={{
                                background:
                                    "var(--play-accent)",
                            }}
                            aria-hidden="true"
                        />
                    </motion.div>
                </div>
            </div>
        </PlaySection>
    );
}


// ============================================================
// HERO — slab  (neo-brutalist)
// ============================================================

export function HeroSlab({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[86vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
            >
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em]">
                    {hero.greeting}
                </p>

                <div
                    className="inline-block p-6 md:p-10"
                    style={panelStyle}
                >
                    <Display
                        as="h1"
                        className="text-6xl font-bold uppercase leading-[0.9] tracking-tighter md:text-8xl"
                    >
                        {hero.name}
                    </Display>
                </div>

                <div
                    className="mt-6 inline-block px-4 py-2"
                    style={{
                        background: "var(--play-accent)",
                        color: "var(--play-accent-contrast)",
                        boxShadow: "var(--play-shadow)",
                    }}
                >
                    <p className="text-lg font-bold uppercase md:text-2xl">
                        {hero.role}
                    </p>
                </div>

                <p className="mt-6 max-w-xl text-base font-medium leading-7">
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById(
                                    "play-projects"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition active:translate-x-1 active:translate-y-1"
                        style={{
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            border: "var(--play-border-width) solid var(--play-border)",
                            boxShadow: "var(--play-shadow)",
                        }}
                    >
                        See the work
                        <ArrowDownRight size={16} />
                    </button>

                    <a
                        href={resumeHref}
                        download
                        onClick={() =>
                            trackInteraction(
                                "RESUME_DOWNLOAD",
                                "play-hero"
                            )
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider transition active:translate-x-1 active:translate-y-1"
                        style={{
                            background: "var(--play-card)",
                            border: "var(--play-border-width) solid var(--play-border)",
                            boxShadow: "var(--play-shadow)",
                        }}
                    >
                        Résumé
                        <Download size={16} />
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — glitch  (cyberpunk)
// ============================================================

export function HeroGlitch({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="relative flex min-h-[86vh] items-center"
        >
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 3px)",
                }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full"
            >
                <p
                    className="mb-4 text-xs font-bold uppercase tracking-[0.4em]"
                    style={{
                        color: "var(--play-accent)",
                        textShadow: "0 0 10px var(--play-accent)",
                    }}
                >
                    {hero.greeting}
                </p>

                <Display
                    as="h1"
                    data-text={hero.name}
                    className="play-glitch text-6xl font-bold uppercase leading-[0.9] tracking-tight md:text-8xl"
                >
                    {hero.name}
                </Display>

                <p
                    className="mt-5 text-2xl font-semibold md:text-3xl"
                    style={{
                        color: "var(--play-accent-2)",
                        textShadow:
                            "0 0 14px var(--play-accent-2)",
                    }}
                >
                    {hero.role}
                </p>

                <p
                    className="mt-5 max-w-xl text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById(
                                    "play-projects"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                        className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest transition hover:brightness-125"
                        style={{
                            border: "1px solid var(--play-accent)",
                            color: "var(--play-accent)",
                            boxShadow:
                                "0 0 18px rgba(34,240,255,0.35), inset 0 0 18px rgba(34,240,255,0.12)",
                        }}
                    >
                        &gt; run projects
                    </button>

                    <a
                        href={resumeHref}
                        download
                        onClick={() =>
                            trackInteraction(
                                "RESUME_DOWNLOAD",
                                "play-hero"
                            )
                        }
                        className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold uppercase tracking-widest transition hover:brightness-125"
                        style={{
                            border: "1px solid var(--play-accent-2)",
                            color: "var(--play-accent-2)",
                            boxShadow:
                                "0 0 18px rgba(255,43,209,0.3)",
                        }}
                    >
                        <Download size={15} />
                        resume
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — chrome  (synthwave)
// ============================================================

export function HeroChrome({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[92vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full text-center"
            >
                <p
                    className="mb-5 text-sm font-bold uppercase tracking-[0.4em]"
                    style={{ color: "var(--play-accent-2)" }}
                >
                    {hero.greeting}
                </p>

                <Display
                    as="h1"
                    className="text-6xl font-bold uppercase leading-[0.95] tracking-tight md:text-8xl"
                    style={{
                        backgroundImage:
                            "linear-gradient(180deg, #ffffff 0%, #ffd9ec 42%, var(--play-accent) 60%, var(--play-accent-2) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        filter:
                            "drop-shadow(0 3px 0 rgba(0,0,0,0.35))",
                    }}
                >
                    {hero.name}
                </Display>

                <p
                    className="mx-auto mt-4 max-w-2xl text-xl font-semibold uppercase tracking-wide md:text-2xl"
                    style={{
                        color: "var(--play-accent)",
                        textShadow:
                            "0 0 18px var(--play-accent)",
                    }}
                >
                    {hero.role}
                </p>

                <p
                    className="mx-auto mt-5 max-w-lg text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-9 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById(
                                    "play-projects"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition hover:-translate-y-0.5"
                        style={{
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            boxShadow: "var(--play-shadow)",
                        }}
                    >
                        Enter
                        <ArrowDownRight size={16} />
                    </button>

                    <a
                        href={resumeHref}
                        download
                        onClick={() =>
                            trackInteraction(
                                "RESUME_DOWNLOAD",
                                "play-hero"
                            )
                        }
                        className="inline-flex items-center gap-2 border px-6 py-3 text-sm font-bold uppercase tracking-widest transition hover:-translate-y-0.5"
                        style={{
                            borderColor: "var(--play-accent)",
                            color: "var(--play-accent)",
                        }}
                    >
                        <Download size={15} />
                        Résumé
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}
