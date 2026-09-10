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
import { HoloSurface } from "./HoloSurface";


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
                            "linear-gradient(180deg, #ffffff 0%, #ffe6f3 55%, var(--play-accent) 88%, var(--play-accent-2) 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextStroke:
                            "1px rgba(255,255,255,0.25)",
                        filter:
                            "drop-shadow(0 2px 10px rgba(255,92,168,0.4))",
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


// ============================================================
// HERO — pane  (glassmorphism)
// ============================================================

export function HeroPane({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[92vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="mx-auto w-full max-w-2xl p-8 text-center md:p-12"
                style={panelStyle}
            >
                <p
                    className="text-xs font-semibold uppercase tracking-[0.32em]"
                    style={{ color: "var(--play-accent)" }}
                >
                    {hero.greeting}
                </p>

                <Display
                    as="h1"
                    className="mt-5 text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl"
                    style={{
                        backgroundImage:
                            "linear-gradient(120deg, var(--play-text), var(--play-accent) 70%, var(--play-accent-2))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    {hero.name}
                </Display>

                <p
                    className="mt-3 text-xl font-medium md:text-2xl"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.role}
                </p>

                <p
                    className="mx-auto mt-5 max-w-md text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
                        className="rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            boxShadow: "var(--play-shadow)",
                        }}
                    >
                        Explore
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
                        className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            borderColor: "var(--play-border)",
                            background: "var(--play-card)",
                            backdropFilter: "var(--play-blur)",
                            WebkitBackdropFilter:
                                "var(--play-blur)",
                        }}
                    >
                        Résumé
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — prism  (holographic)
// ============================================================

export function HeroPrism({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[92vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full"
            >
                <Kicker>{hero.greeting}</Kicker>

                <h1
                    className="mt-5 text-6xl font-bold leading-[0.92] tracking-tight md:text-8xl"
                    style={{
                        fontFamily: "var(--play-font-head)",
                        backgroundImage: "var(--play-iris)",
                        backgroundSize: "180% 180%",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        filter:
                            "drop-shadow(0 0 30px rgba(122,245,224,0.25))",
                    }}
                >
                    {hero.name}
                </h1>

                <p
                    className="mt-4 text-xl font-medium md:text-2xl"
                    style={{ color: "var(--play-text)" }}
                >
                    {hero.role}
                </p>
                <p
                    className="mt-5 max-w-xl text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                    <HoloSurface
                        as="button"
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            borderRadius: "var(--play-radius)",
                            border: "1px solid var(--play-border)",
                            background: "var(--play-card)",
                            color: "var(--play-text)",
                        }}
                    >
                        View work
                    </HoloSurface>

                    <a
                        href={resumeHref}
                        download
                        onClick={() =>
                            trackInteraction(
                                "RESUME_DOWNLOAD",
                                "play-hero"
                            )
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            borderRadius: "var(--play-radius)",
                            border: "1px solid var(--play-border)",
                            color: "var(--play-text)",
                        }}
                    >
                        Résumé
                        <Download size={15} />
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — clay  (claymorphism)
// ============================================================

export function HeroClay({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[90vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="mx-auto w-full max-w-2xl p-9 text-center md:p-14"
                style={panelStyle}
            >
                <span
                    className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{
                        ...panelStyle,
                        borderRadius: "999px",
                        color: "var(--play-accent)",
                    }}
                >
                    {hero.greeting}
                </span>

                <Display
                    as="h1"
                    className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl"
                >
                    {hero.name}
                </Display>

                <p
                    className="mt-3 text-xl font-medium md:text-2xl"
                    style={{ color: "var(--play-accent)" }}
                >
                    {hero.role}
                </p>
                <p
                    className="mx-auto mt-5 max-w-md text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="px-7 py-3.5 text-sm font-semibold transition active:scale-95"
                        style={{
                            borderRadius: "999px",
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            boxShadow:
                                "6px 6px 16px rgba(155,165,205,0.5), -5px -5px 14px rgba(255,255,255,0.85)",
                        }}
                    >
                        View work
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
                        className="px-7 py-3.5 text-sm font-semibold transition active:scale-95"
                        style={{
                            ...panelStyle,
                            borderRadius: "999px",
                        }}
                    >
                        Résumé
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — tile  (bento)
// ============================================================

export function HeroBento({ data }) {
    const {
        hero,
        projects,
        certificates,
        journey,
        resumeHref,
    } = data;

    const stats = [
        { label: "Projects", value: (projects || []).length },
        {
            label: "Milestones",
            value: (journey || []).length,
        },
        {
            label: "Certificates",
            value: (certificates || []).length,
        },
    ];

    return (
        <PlaySection id="play-hero" className="pt-24">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[168px]"
            >
                <div
                    className="flex flex-col justify-between gap-6 p-6 sm:col-span-2 lg:col-span-2 lg:row-span-2"
                    style={panelStyle}
                >
                    <Kicker>{hero.greeting}</Kicker>
                    <div>
                        <Display
                            as="h1"
                            className="text-4xl font-bold tracking-tight md:text-6xl"
                        >
                            {hero.name}
                        </Display>
                        <p
                            className="mt-2 text-lg"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            {hero.role}
                        </p>
                    </div>
                </div>

                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="flex flex-col justify-center p-6"
                        style={panelStyle}
                    >
                        <span
                            className="text-4xl font-bold"
                            style={{
                                fontFamily:
                                    "var(--play-font-head)",
                                color: "var(--play-accent)",
                            }}
                        >
                            {s.value}
                        </span>
                        <span
                            className="mt-1 text-sm"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            {s.label}
                        </span>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() =>
                        scrollToId("play-projects")
                    }
                    className="flex items-center justify-between p-6 text-left transition hover:-translate-y-0.5"
                    style={{
                        ...panelStyle,
                        background: "var(--play-accent)",
                        color: "var(--play-accent-contrast)",
                    }}
                >
                    <span className="text-lg font-semibold">
                        View work
                    </span>
                    <ArrowDownRight size={20} />
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
                    className="flex items-center justify-between p-6 transition hover:-translate-y-0.5"
                    style={panelStyle}
                >
                    <span className="text-lg font-semibold">
                        Résumé
                    </span>
                    <Download size={18} />
                </a>

                <div
                    className="p-6 sm:col-span-2"
                    style={panelStyle}
                >
                    <p
                        className="text-sm leading-6"
                        style={{ color: "var(--play-muted)" }}
                    >
                        {hero.description}
                    </p>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — maxi  (maximalism)
// ============================================================

export function HeroMaxi({ data }) {
    const { hero, resumeHref } = data;

    const parts = String(hero.name || "").split(" ");
    const first = parts[0];
    const restName = parts.slice(1).join(" ");

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[88vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                <span
                    className="inline-block -rotate-3 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] md:text-sm"
                    style={{
                        background: "var(--play-accent-2)",
                        color: "var(--play-text)",
                        border: "3px solid var(--play-border)",
                        boxShadow: "var(--play-shadow)",
                    }}
                >
                    {hero.greeting}
                </span>

                <h1
                    className="mt-7 break-words text-[clamp(2.75rem,13vw,4rem)] font-black uppercase leading-[0.82] tracking-tight md:text-[8.5rem]"
                    style={{
                        fontFamily: "var(--play-font-head)",
                        color: "var(--play-text)",
                        WebkitTextStroke:
                            "2px var(--play-border)",
                    }}
                >
                    <span style={{ color: "var(--play-accent)" }}>
                        {first}
                    </span>{" "}
                    {restName}
                </h1>

                <p
                    className="mt-6 inline-block max-w-full rotate-1 break-words px-4 py-2 text-lg font-bold uppercase sm:text-xl md:text-3xl"
                    style={{
                        background: "var(--play-accent)",
                        color: "var(--play-accent-contrast)",
                        border: "3px solid var(--play-border)",
                        boxShadow: "var(--play-shadow)",
                    }}
                >
                    {hero.role}
                </p>

                <p
                    className="mt-7 max-w-xl text-base font-semibold leading-7"
                    style={{ color: "var(--play-text)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="px-6 py-3 text-sm font-bold uppercase tracking-widest transition active:translate-x-1 active:translate-y-1"
                        style={{
                            background: "var(--play-text)",
                            color: "var(--play-bg)",
                            border: "3px solid var(--play-border)",
                            boxShadow: "var(--play-shadow)",
                        }}
                    >
                        See the work
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
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition active:translate-x-1 active:translate-y-1"
                        style={{
                            background: "var(--play-card)",
                            color: "var(--play-text)",
                            border: "3px solid var(--play-border)",
                            boxShadow: "var(--play-shadow)",
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


// ============================================================
// HERO — aurora  (aurora)
// ============================================================

export function HeroAurora({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[94vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="mx-auto max-w-3xl text-center"
            >
                <Kicker className="justify-center">
                    {hero.greeting}
                </Kicker>

                <h1
                    className="mt-6 text-5xl font-bold leading-[1.03] tracking-tight md:text-7xl"
                    style={{
                        fontFamily: "var(--play-font-head)",
                        backgroundImage:
                            "linear-gradient(120deg, var(--play-text) 20%, var(--play-accent) 70%, var(--play-accent-2))",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    {hero.name}
                </h1>

                <p
                    className="mt-4 text-xl font-medium md:text-2xl"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.role}
                </p>
                <p
                    className="mx-auto mt-6 max-w-xl text-base leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                            boxShadow: "var(--play-shadow)",
                        }}
                    >
                        View work
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
                        className="rounded-full border px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                        style={{
                            borderColor: "var(--play-border)",
                            background: "var(--play-card)",
                            backdropFilter: "var(--play-blur)",
                            WebkitBackdropFilter:
                                "var(--play-blur)",
                        }}
                    >
                        Résumé
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — blueprint  (blueprint)
// ============================================================

export function HeroBlueprint({ data }) {
    const { hero, resumeHref } = data;

    const tick = {
        borderColor: "var(--play-accent)",
    };

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[88vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full border p-8 md:p-12"
                style={{ borderColor: "var(--play-border)" }}
            >
                {/* corner ticks */}
                <span
                    className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2"
                    style={tick}
                />
                <span
                    className="absolute -right-px -top-px h-4 w-4 border-r-2 border-t-2"
                    style={tick}
                />
                <span
                    className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2"
                    style={tick}
                />
                <span
                    className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2"
                    style={tick}
                />

                <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: "var(--play-accent)" }}
                >
                    FIG. 01 — {hero.greeting}
                </p>

                <h1
                    className="mt-4 text-5xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {hero.name}
                </h1>

                <div
                    className="mt-3 flex items-center gap-3 text-sm"
                    style={{ color: "var(--play-muted)" }}
                >
                    <span
                        className="h-px flex-1"
                        style={{
                            background: "var(--play-border)",
                        }}
                    />
                    <span>{hero.role}</span>
                    <span
                        className="h-px flex-1"
                        style={{
                            background: "var(--play-border)",
                        }}
                    />
                </div>

                <p
                    className="mt-6 max-w-xl text-sm leading-7"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="border px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-[var(--play-accent)] hover:text-[var(--play-accent-contrast)]"
                        style={{
                            borderColor: "var(--play-accent)",
                            color: "var(--play-accent)",
                        }}
                    >
                        [ view work ]
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
                        className="inline-flex items-center gap-2 border px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition hover:bg-[var(--play-border)]"
                        style={{
                            borderColor: "var(--play-border)",
                        }}
                    >
                        <Download size={13} />
                        resume.pdf
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}


// ============================================================
// HERO — vintage  (vintage)
// ============================================================

export function HeroVintage({ data }) {
    const { hero, resumeHref } = data;

    return (
        <PlaySection
            id="play-hero"
            className="flex min-h-[88vh] items-center"
        >
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mx-auto w-full max-w-3xl text-center"
            >
                <p
                    className="text-xs uppercase tracking-[0.4em]"
                    style={{ color: "var(--play-accent)" }}
                >
                    {hero.greeting}
                </p>

                <div
                    className="mx-auto my-4 h-px w-24"
                    style={{ background: "var(--play-border)" }}
                />

                <Display
                    as="h1"
                    className="text-6xl leading-[1.05] tracking-tight md:text-8xl"
                    style={{
                        fontWeight: 700,
                        textShadow:
                            "0 1px 0 rgba(255,255,255,0.5), 0 2px 3px rgba(58,47,34,0.18)",
                    }}
                >
                    {hero.name}
                </Display>

                <p
                    className="mt-4 text-xl italic md:text-2xl"
                    style={{ color: "var(--play-muted)" }}
                >
                    {hero.role}
                </p>

                <div
                    className="mx-auto my-6 h-px w-40"
                    style={{ background: "var(--play-border)" }}
                />

                <p
                    className="mx-auto max-w-xl text-base leading-8"
                    style={{ color: "var(--play-text)" }}
                >
                    {hero.description}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            scrollToId("play-projects")
                        }
                        className="px-6 py-3 text-xs uppercase tracking-[0.24em] transition hover:opacity-85"
                        style={{
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                        }}
                    >
                        View the work
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
                        className="border-b-2 pb-0.5 text-xs uppercase tracking-[0.24em] transition hover:opacity-70"
                        style={{
                            borderColor: "var(--play-text)",
                        }}
                    >
                        Résumé
                    </a>
                </div>
            </motion.div>
        </PlaySection>
    );
}
