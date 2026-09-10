import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Display } from "./primitives";


// The preset nav mirrors the real site nav: it links to the
// dedicated pages, it does not collapse the site into one scroll.
const PAGE_LINKS = [
    { key: "projects", label: "Work", id: "/projects" },
    { key: "certificates", label: "Certificates", id: "/certificates" },
    { key: "about", label: "About", id: "/about" },
    { key: "contact", label: "Contact", id: "/contact" },
];

const COMMANDS = {
    projects: "work",
    certificates: "certs",
    about: "about",
    contact: "contact",
};

const ROUTE_FOR = {
    projects: "/projects",
    about: "/about",
    skills: "/about",
    certificates: "/certificates",
    contact: "/contact",
    journey: "/",
    hero: "/",
};

// A page link (starts with "/") always routes. A section id
// scrolls if it's on this page, else routes to the page that has
// it (HashRouter) — used by the brand / "Top" link.
const goSection = (id) => {
    const target = String(id || "");

    if (target.startsWith("/")) {
        if (typeof window !== "undefined") {
            window.location.hash = `#${target}`;
            window.scrollTo({ top: 0 });
        }
        return;
    }

    if (typeof document !== "undefined") {
        const el = document.getElementById(target);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            return;
        }
    }
    const key = target.replace(/^play-/, "");
    if (typeof window !== "undefined") {
        window.location.hash = `#${ROUTE_FOR[key] || "/"}`;
        window.scrollTo({ top: 0 });
    }
};

const sectionLinks = () => PAGE_LINKS;


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
                    onClick={() => goSection("play-hero")}
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
                                goSection(link.id)
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
                        onClick={() => goSection("play-hero")}
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
                                goSection(link.id)
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
                    onClick={() => goSection("play-hero")}
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
                        onClick={() => goSection(link.id)}
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
                    onClick={() => goSection("play-hero")}
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
                                goSection(link.id)
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
                    onClick={() => goSection("play-hero")}
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
                                goSection(link.id)
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
                    onClick={() => goSection("play-hero")}
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
                                goSection(link.id)
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


// ============================================================
// NAV — glass
// ============================================================

export function NavGlass({ order, data }) {
    const links = sectionLinks(order);

    return (
        <div className="pointer-events-none sticky top-4 z-40 flex w-full justify-center px-4">
            <div
                className="pointer-events-auto flex items-center gap-1 rounded-full border px-2 py-1.5"
                style={{
                    borderColor: "var(--play-border)",
                    backgroundColor: "var(--play-surface)",
                    backgroundImage:
                        "var(--play-sheen, none)",
                    backdropFilter: "var(--play-blur)",
                    WebkitBackdropFilter: "var(--play-blur)",
                    boxShadow: "var(--play-shadow)",
                }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {data.hero.name.split(" ")[0]}
                </button>

                {links.map((link) => (
                    <button
                        key={link.key}
                        type="button"
                        onClick={() => goSection(link.id)}
                        className="hidden rounded-full px-3 py-1.5 text-sm transition hover:brightness-110 sm:block"
                        style={{ color: "var(--play-muted)" }}
                    >
                        {link.label}
                    </button>
                ))}

                <Link
                    to="/"
                    className="rounded-full px-3 py-1.5 text-sm font-semibold transition"
                    style={{ color: "var(--play-accent)" }}
                >
                    ← Site
                </Link>
            </div>
        </div>
    );
}


// ============================================================
// NAV — spatial
// ============================================================

export function NavSpatial({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="fixed inset-x-0 top-0 z-40 w-full"
            style={{
                background:
                    "linear-gradient(var(--play-bg), transparent)",
            }}
        >
            <div
                className="mx-auto flex h-14 items-center justify-between px-6 text-sm md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="font-semibold tracking-tight"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {data.hero.name}
                </button>

                <nav className="hidden items-center gap-5 sm:flex">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() =>
                                goSection(link.id)
                            }
                            className="text-xs uppercase tracking-[0.14em] transition hover:opacity-100"
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
                    className="text-xs uppercase tracking-[0.14em] transition"
                    style={{ color: "var(--play-accent)" }}
                >
                    ← Site
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — holo  (holographic)
// ============================================================

export function NavHolo({ order, data }) {
    const links = sectionLinks(order);

    return (
        <div className="pointer-events-none sticky top-4 z-40 flex w-full justify-center px-4">
            <div
                className="pointer-events-auto relative flex items-center gap-1 overflow-hidden rounded-full border px-2 py-1.5"
                style={{
                    borderColor: "var(--play-border)",
                    backgroundColor: "var(--play-surface)",
                    backdropFilter: "var(--play-blur)",
                    WebkitBackdropFilter: "var(--play-blur)",
                    boxShadow: "var(--play-shadow)",
                }}
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage: "var(--play-iris)",
                        backgroundSize: "200% 200%",
                        mixBlendMode: "color-dodge",
                        opacity: 0.28,
                    }}
                />
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="relative rounded-full px-3 py-1.5 text-sm font-semibold"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {data.hero.name.split(" ")[0]}
                </button>

                {links.map((link) => (
                    <button
                        key={link.key}
                        type="button"
                        onClick={() => goSection(link.id)}
                        className="relative hidden rounded-full px-3 py-1.5 text-sm transition hover:brightness-125 sm:block"
                        style={{ color: "var(--play-muted)" }}
                    >
                        {link.label}
                    </button>
                ))}

                <Link
                    to="/"
                    className="relative rounded-full px-3 py-1.5 text-sm font-semibold transition"
                    style={{ color: "var(--play-accent)" }}
                >
                    ← Site
                </Link>
            </div>
        </div>
    );
}


// ============================================================
// NAV — clay  (claymorphism)
// ============================================================

export function NavClay({ order, data }) {
    const links = sectionLinks(order);

    return (
        <div className="sticky top-4 z-40 flex w-full justify-center px-4">
            <div
                className="flex items-center gap-1.5 p-2"
                style={{
                    borderRadius: "999px",
                    backgroundColor: "var(--play-surface)",
                    boxShadow: "var(--play-shadow)",
                }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="px-4 py-2 text-sm font-semibold"
                    style={{
                        borderRadius: "999px",
                        fontFamily: "var(--play-font-head)",
                        color: "var(--play-accent)",
                    }}
                >
                    {data.hero.name.split(" ")[0]}
                </button>

                {links.map((link) => (
                    <button
                        key={link.key}
                        type="button"
                        onClick={() => goSection(link.id)}
                        className="hidden px-4 py-2 text-sm font-medium transition active:scale-95 sm:block"
                        style={{
                            borderRadius: "999px",
                            color: "var(--play-muted)",
                        }}
                    >
                        {link.label}
                    </button>
                ))}

                <Link
                    to="/"
                    className="px-4 py-2 text-sm font-semibold transition active:scale-95"
                    style={{
                        borderRadius: "999px",
                        color: "var(--play-text)",
                        boxShadow:
                            "inset 3px 3px 7px rgba(155,165,205,0.35), inset -3px -3px 7px rgba(255,255,255,0.7)",
                    }}
                >
                    ← Site
                </Link>
            </div>
        </div>
    );
}


// ============================================================
// NAV — bento  (bento)
// ============================================================

export function NavBento({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header className="sticky top-0 z-40 w-full px-4 pt-4">
            <div
                className="mx-auto flex items-center justify-between gap-2 px-3 py-2"
                style={{
                    maxWidth: "var(--play-maxw)",
                    borderRadius: "var(--play-radius)",
                    border: "1px solid var(--play-border)",
                    background: "var(--play-surface)",
                    boxShadow: "var(--play-shadow)",
                }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="px-2 text-sm font-bold tracking-tight"
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
                            onClick={() => goSection(link.id)}
                            className="px-3 py-1.5 text-xs font-medium transition hover:opacity-100"
                            style={{
                                borderRadius: "999px",
                                color: "var(--play-muted)",
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="px-3 py-1.5 text-xs font-semibold transition"
                    style={{
                        borderRadius: "999px",
                        background: "var(--play-accent)",
                        color: "var(--play-accent-contrast)",
                    }}
                >
                    ← Site
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — maxi  (maximalism)
// ============================================================

export function NavMaxi({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full"
            style={{
                background: "var(--play-accent)",
                borderBottom: "3px solid var(--play-border)",
            }}
        >
            <div
                className="mx-auto flex flex-wrap items-stretch"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="px-4 py-3 text-lg font-black uppercase tracking-tight"
                    style={{
                        fontFamily: "var(--play-font-head)",
                        color: "var(--play-accent-contrast)",
                        borderRight:
                            "3px solid var(--play-border)",
                    }}
                >
                    {data.hero.name}
                </button>

                <nav className="flex flex-1 flex-wrap">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() => goSection(link.id)}
                            className="px-4 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-[var(--play-border)] hover:text-[var(--play-bg)]"
                            style={{
                                color: "var(--play-accent-contrast)",
                                borderRight:
                                    "3px solid var(--play-border)",
                            }}
                        >
                            {link.label}
                        </button>
                    ))}
                </nav>

                <Link
                    to="/"
                    className="flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest"
                    style={{
                        background: "var(--play-border)",
                        color: "var(--play-bg)",
                    }}
                >
                    ← Site
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — aurora  (aurora)
// ============================================================

export function NavAurora({ order, data }) {
    const links = sectionLinks(order);

    return (
        <div className="pointer-events-none sticky top-5 z-40 flex w-full justify-center px-4">
            <div
                className="pointer-events-auto flex items-center gap-1 rounded-full border px-2.5 py-2"
                style={{
                    borderColor: "var(--play-border)",
                    backgroundColor: "var(--play-card)",
                    backgroundImage: "var(--play-sheen, none)",
                    backdropFilter: "var(--play-blur)",
                    WebkitBackdropFilter: "var(--play-blur)",
                    boxShadow: "var(--play-shadow)",
                }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold"
                    style={{
                        fontFamily: "var(--play-font-head)",
                    }}
                >
                    {data.hero.name.split(" ")[0]}
                </button>

                {links.map((link) => (
                    <button
                        key={link.key}
                        type="button"
                        onClick={() => goSection(link.id)}
                        className="hidden rounded-full px-3 py-1.5 text-sm transition hover:opacity-100 sm:block"
                        style={{ color: "var(--play-muted)" }}
                    >
                        {link.label}
                    </button>
                ))}

                <Link
                    to="/"
                    className="rounded-full px-3 py-1.5 text-sm font-semibold transition"
                    style={{ color: "var(--play-accent)" }}
                >
                    ← Site
                </Link>
            </div>
        </div>
    );
}


// ============================================================
// NAV — blueprint  (blueprint)
// ============================================================

export function NavBlueprint({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full border-b"
            style={{
                borderColor: "var(--play-border)",
                background:
                    "color-mix(in srgb, var(--play-bg) 88%, transparent)",
            }}
        >
            <div
                className="mx-auto flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-2 text-xs md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <button
                    type="button"
                    onClick={() => goSection("play-hero")}
                    className="uppercase tracking-[0.2em]"
                    style={{ color: "var(--play-accent)" }}
                >
                    [ {data.hero.name} ]
                </button>

                <nav className="flex flex-wrap items-center gap-x-4">
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() => goSection(link.id)}
                            className="uppercase tracking-[0.16em] transition hover:text-[var(--play-accent)]"
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
                    className="ml-auto uppercase tracking-[0.16em] transition hover:text-[var(--play-accent)]"
                    style={{ color: "var(--play-muted)" }}
                >
                    ← exit
                </Link>
            </div>
        </header>
    );
}


// ============================================================
// NAV — vintage  (vintage)
// ============================================================

export function NavVintage({ order, data }) {
    const links = sectionLinks(order);

    return (
        <header
            className="sticky top-0 z-40 w-full"
            style={{
                borderBottom: "3px double var(--play-border)",
                background:
                    "color-mix(in srgb, var(--play-bg) 92%, transparent)",
            }}
        >
            <div
                className="mx-auto px-6 md:px-10 lg:px-16"
                style={{ maxWidth: "var(--play-maxw)" }}
            >
                <div className="flex items-center justify-center py-2">
                    <button
                        type="button"
                        onClick={() =>
                            goSection("play-hero")
                        }
                        className="text-xl tracking-[0.1em] md:text-2xl"
                        style={{
                            fontFamily:
                                "var(--play-font-head)",
                            fontWeight: 700,
                        }}
                    >
                        {data.hero.name}
                    </button>
                </div>

                <nav
                    className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-t py-2 text-[11px] uppercase tracking-[0.22em]"
                    style={{ borderColor: "var(--play-border)" }}
                >
                    {links.map((link) => (
                        <button
                            key={link.key}
                            type="button"
                            onClick={() => goSection(link.id)}
                            className="transition hover:text-[var(--play-accent)]"
                        >
                            {link.label}
                        </button>
                    ))}
                    <Link
                        to="/"
                        className="transition hover:text-[var(--play-accent)]"
                        style={{ color: "var(--play-muted)" }}
                    >
                        Main site
                    </Link>
                </nav>
            </div>
        </header>
    );
}
