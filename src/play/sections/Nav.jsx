import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Display } from "./primitives";


const LABELS = {
    hero: "Top",
    about: "About",
    skills: "Skills",
    projects: "Work",
    journey: "Journey",
    contact: "Contact",
};

const COMMANDS = {
    about: "about",
    skills: "skills",
    projects: "work",
    journey: "journey",
    contact: "contact",
};

const scrollToId = (id) => {
    document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth" });
};

const sectionLinks = (order) =>
    order
        .filter((key) => key !== "hero")
        .map((key) => ({
            key,
            label: LABELS[key] || key,
            id: `play-${key}`,
        }));


// ============================================================
// NAV — minimal
// ============================================================

export function NavMinimal({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full border-b backdrop-blur"
            style={{
                borderColor: "var(--play-border)",
                background:
                    "color-mix(in srgb, var(--play-bg) 82%, transparent)",
            }}
        >
            <div
                className="mx-auto flex h-14 items-center justify-between px-6 md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => scrollToId("play-hero")}
                    className="text-sm font-bold tracking-tight"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {data.hero.name}
                </button>

                <nav className="hidden items-center gap-1 sm:flex">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() =>
                                scrollToId(link.id)
                            }
                            className="px-3 py-1.5 text-xs font-medium transition hover:opacity-60"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="flex items-center gap-1.5 text-xs font-medium transition hover:opacity-60"
                    style={{ color: "var(--play-muted)" }}
                >
                    <ArrowLeft size={13} />
                    Main site
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — masthead  (editorial)
// ============================================================

export function NavMasthead({ order, data }) {
    const links = sectionLinks(order);

    const today = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <header
            className="sticky top-0 z-40 w-full border-b backdrop-blur"
            style={{
                borderColor: "var(--play-text)",
                background:
                    "color-mix(in srgb, var(--play-bg) 88%, transparent)",
            }}
        >
            <div
                className="mx-auto px-6 md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <div
                    className="flex items-center justify-between py-1.5 text-[10px] uppercase tracking-[0.24em]"
                    style={{ color: "var(--play-muted)" }}
                >
                    <span>{today}</span>
                    <Link
                        to="/"
                        className="flex items-center gap-1 transition hover:opacity-60"
                    >
                        <ArrowLeft size={11} />
                        Main site
                    </Link>
                </div>

                <div
                    className="flex items-center justify-center border-y py-2"
                    style={{
                        borderColor: "var(--play-text)",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => scrollToId("play-hero")}
                    >
                        <Display
                            as="span"
                            className="text-xl font-black tracking-tight md:text-2xl"
                        >
                            {data.hero.name}
                        </Display>
                    </button>
                </div>

                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() =>
                                scrollToId(link.id)
                            }
                            className="text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:opacity-60"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
}


// ============================================================
// NAV — terminal
// ============================================================

export function NavTerminal({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full border-b"
            style={{
                borderColor: "var(--play-border)",
                background: "var(--play-surface)",
            }}
        >
            <div
                className="mx-auto flex flex-wrap items-center gap-x-3 gap-y-1 px-6 py-2 text-xs md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => scrollToId("play-hero")}
                >
                    <span style={{ color: "var(--play-accent)" }}>
                        visitor@
                        {data.hero.name
                            .toLowerCase()
                            .replace(/\s+/g, "")}
                    </span>
                    <span style={{ color: "var(--play-muted)" }}>
                        :~$
                    </span>
                </button>

                {links.map((link) => (
                    <button
                        key={link.key}
                        type="button"
                        onClick={() => scrollToId(link.id)}
                        className="transition hover:opacity-60"
                    >
                        cd&nbsp;
                        <span
                            style={{
                                color: "var(--play-accent)",
                            }}
                        >
                            {COMMANDS[link.key] || link.key}
                        </span>
                    </button>
                ))}

                <Link
                    to="/"
                    className="ml-auto transition hover:opacity-60"
                    style={{ color: "var(--play-muted)" }}
                >
                    exit
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — brutal
// ============================================================

export function NavBrutal({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full"
            style={{
                borderBottom:
                    "var(--play-border-width) solid var(--play-border)",
                background: "var(--play-bg)",
            }}
        >
            <div
                className="mx-auto flex items-stretch justify-between px-4 md:px-8"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => scrollToId("play-hero")}
                    className="py-3 text-lg font-bold uppercase tracking-tight"
                >
                    {data.hero.name}
                </button>

                <nav className="flex">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() =>
                                scrollToId(link.id)
                            }
                            className="hidden px-4 text-xs font-bold uppercase tracking-widest transition sm:block"
                            style={{
                                borderLeft:
                                    "var(--play-border-width) solid var(--play-border)",
                            }}
                            onMouseEnter={(event) => {
                                event.currentTarget.style.background =
                                    "var(--play-accent)";
                                event.currentTarget.style.color =
                                    "var(--play-accent-contrast)";
                            }}
                            onMouseLeave={(event) => {
                                event.currentTarget.style.background =
                                    "";
                                event.currentTarget.style.color =
                                    "";
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                    <Link
                        to="/"
                        className="flex items-center px-4 text-xs font-bold uppercase tracking-widest"
                        style={{
                            borderLeft:
                                "var(--play-border-width) solid var(--play-border)",
                            background: "var(--play-accent)",
                            color: "var(--play-accent-contrast)",
                        }}
                    >
                        <ArrowLeft size={13} />
                    </Link>
                </nav>
            </div>
        </header>
    );
}


// ============================================================
// NAV — cyber
// ============================================================

export function NavCyber({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full border-b backdrop-blur"
            style={{
                borderColor: "var(--play-accent)",
                background:
                    "color-mix(in srgb, var(--play-bg) 78%, transparent)",
                boxShadow: "0 0 20px rgba(0,0,0,0.6)",
            }}
        >
            <div
                className="mx-auto flex h-12 items-center justify-between px-6 text-xs md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => scrollToId("play-hero")}
                    className="font-bold uppercase tracking-[0.2em]"
                    style={{
                        color: "var(--play-accent)",
                        textShadow:
                            "0 0 8px var(--play-accent)",
                    }}
                >
                    SYS://
                    {data.hero.name.replace(/\s+/g, "_")}
                </button>

                <nav className="hidden items-center gap-5 sm:flex">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() =>
                                scrollToId(link.id)
                            }
                            className="uppercase tracking-[0.15em] transition hover:brightness-150"
                            style={{
                                color: "var(--play-muted)",
                            }}
                        >
                            <span
                                style={{
                                    color: "var(--play-accent)",
                                }}
                            >
                                &gt;
                            </span>{" "}
                            {link.label}
                        </button>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="uppercase tracking-[0.15em] transition hover:brightness-150"
                    style={{ color: "var(--play-accent-2)" }}
                >
                    [ exit ]
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — synth
// ============================================================

export function NavSynth({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full border-b backdrop-blur"
            style={{
                borderColor: "var(--play-accent)",
                background:
                    "color-mix(in srgb, var(--play-bg) 80%, transparent)",
            }}
        >
            <div
                className="mx-auto flex h-14 items-center justify-between px-6 md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => scrollToId("play-hero")}
                    className="text-lg font-bold uppercase tracking-tight"
                    style={{
                        color: "var(--play-accent)",
                        textShadow:
                            "0 0 12px var(--play-accent)",
                    }}
                >
                    {data.hero.name}
                </button>

                <nav className="hidden items-center gap-6 sm:flex">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() =>
                                scrollToId(link.id)
                            }
                            className="text-xs font-bold uppercase tracking-[0.2em] transition hover:brightness-125"
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="text-xs font-bold uppercase tracking-[0.2em] transition hover:brightness-125"
                    style={{ color: "var(--play-accent-2)" }}
                >
                    Exit
                </Link>
            </div>
        </header>
    );
}
