import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { trackInteraction } from "../../analytics/track";
import {
    PlaySection,
    Display,
    Kicker,
    Rule,
} from "./primitives";
import { panelStyle } from "./styles";


const projectHref = (project) =>
    project.liveLink || project.demoLink || project.github || null;

const openProject = (project) => {
    trackInteraction("PROJECT_OPENED", project.name);
};


// ============================================================
// PROJECTS — grid  (minimalist)
// ============================================================

export function ProjectsGrid({ data }) {
    const { projects } = data;

    if (projects.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-projects">
            <Kicker>Selected work</Kicker>
            <Display
                as="h2"
                className="mt-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
                Things I&apos;ve built
            </Display>

            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => {
                    const href = projectHref(project);
                    const Wrapper = href ? "a" : "div";

                    return (
                        <motion.article
                            key={project.id || index}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.4,
                                delay: Math.min(
                                    index * 0.05,
                                    0.3
                                ),
                            }}
                            className="group h-full"
                        >
                            <Wrapper
                                {...(href
                                    ? {
                                          href,
                                          target: "_blank",
                                          rel: "noreferrer",
                                          onClick: () =>
                                              openProject(
                                                  project
                                              ),
                                      }
                                    : {})}
                                className="flex h-full flex-col overflow-hidden transition group-hover:-translate-y-1"
                                style={panelStyle}
                            >
                                <div
                                    className="aspect-[16/10] w-full overflow-hidden"
                                    style={{
                                        background:
                                            "var(--play-surface)",
                                    }}
                                >
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : null}
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <p
                                        className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                                        style={{
                                            color: "var(--play-accent)",
                                        }}
                                    >
                                        {project.type}
                                    </p>
                                    <Display
                                        as="h3"
                                        className="mt-1.5 text-lg font-bold"
                                    >
                                        {project.name}
                                    </Display>
                                    <p
                                        className="mt-2 line-clamp-3 text-sm leading-6"
                                        style={{
                                            color: "var(--play-muted)",
                                        }}
                                    >
                                        {project.description}
                                    </p>

                                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                                        {(
                                            project.technologies ||
                                            []
                                        )
                                            .slice(0, 4)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="border px-2 py-0.5 text-[11px]"
                                                    style={{
                                                        borderColor:
                                                            "var(--play-border)",
                                                        color: "var(--play-muted)",
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </Wrapper>
                        </motion.article>
                    );
                })}
            </div>
        </PlaySection>
    );
}


// ============================================================
// PROJECTS — feature  (editorial)
// ============================================================

export function ProjectsFeature({ data }) {
    const { projects } = data;

    if (projects.length === 0) {
        return null;
    }

    const [lead, ...rest] = projects;
    const leadHref = projectHref(lead);

    return (
        <PlaySection id="play-projects">
            <Rule />
            <p
                className="mt-6 text-xs uppercase tracking-[0.28em]"
                style={{ color: "var(--play-muted)" }}
            >
                The Feature
            </p>

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr]"
            >
                <div
                    className="aspect-[4/3] w-full overflow-hidden border"
                    style={{
                        borderColor: "var(--play-border)",
                        background: "var(--play-surface)",
                    }}
                >
                    {lead.image ? (
                        <img
                            src={lead.image}
                            alt={lead.name}
                            className="h-full w-full object-cover"
                        />
                    ) : null}
                </div>

                <div className="flex flex-col justify-center">
                    <p
                        className="text-sm italic"
                        style={{ color: "var(--play-accent)" }}
                    >
                        {lead.type}
                    </p>
                    <Display
                        as="h2"
                        className="mt-2 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl"
                    >
                        {lead.name}
                    </Display>
                    <p
                        className="mt-4 leading-8"
                        style={{ color: "var(--play-muted)" }}
                    >
                        {lead.description}
                    </p>
                    {leadHref && (
                        <a
                            href={leadHref}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => openProject(lead)}
                            className="mt-5 inline-flex w-fit items-center gap-2 border-b-2 pb-0.5 text-sm font-semibold uppercase tracking-wider transition hover:opacity-70"
                            style={{
                                borderColor:
                                    "var(--play-text)",
                            }}
                        >
                            Visit
                            <ArrowUpRight size={14} />
                        </a>
                    )}
                </div>
            </motion.div>

            {rest.length > 0 && (
                <div className="mt-16">
                    <Rule />
                    <p
                        className="mt-6 text-xs uppercase tracking-[0.28em]"
                        style={{ color: "var(--play-muted)" }}
                    >
                        Also in this issue
                    </p>

                    <ol className="mt-4">
                        {rest.map((project, index) => {
                            const href =
                                projectHref(project);
                            const Row = href ? "a" : "div";

                            return (
                                <Row
                                    key={project.id || index}
                                    {...(href
                                        ? {
                                              href,
                                              target: "_blank",
                                              rel: "noreferrer",
                                              onClick: () =>
                                                  openProject(
                                                      project
                                                  ),
                                          }
                                        : {})}
                                    className="group flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5"
                                    style={{
                                        borderTopWidth: 1,
                                        borderColor:
                                            "var(--play-border)",
                                    }}
                                >
                                    <div className="flex items-baseline gap-4">
                                        <span
                                            className="text-sm"
                                            style={{
                                                color: "var(--play-muted)",
                                            }}
                                        >
                                            {String(
                                                index + 2
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>
                                        <Display
                                            as="span"
                                            className="text-xl font-semibold transition group-hover:italic"
                                        >
                                            {project.name}
                                        </Display>
                                    </div>
                                    <span
                                        className="text-sm italic"
                                        style={{
                                            color: "var(--play-muted)",
                                        }}
                                    >
                                        {project.type}
                                    </span>
                                </Row>
                            );
                        })}
                    </ol>
                </div>
            )}
        </PlaySection>
    );
}


// ============================================================
// PROJECTS — listing  (terminal)
// ============================================================

export function ProjectsListing({ data }) {
    const { projects } = data;

    if (projects.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-projects">
            <p className="text-sm md:text-base">
                <span style={{ color: "var(--play-accent)" }}>
                    ${" "}
                </span>
                <span style={{ color: "var(--play-muted)" }}>
                    ls -la ~/projects/
                </span>
            </p>

            <div className="mt-4 p-4 text-sm" style={panelStyle}>
                <p style={{ color: "var(--play-muted)" }}>
                    total {projects.length}
                </p>
                {projects.map((project, index) => {
                    const href = projectHref(project);
                    const Row = href ? "a" : "div";

                    return (
                        <Row
                            key={project.id || index}
                            {...(href
                                ? {
                                      href,
                                      target: "_blank",
                                      rel: "noreferrer",
                                      onClick: () =>
                                          openProject(project),
                                  }
                                : {})}
                            className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-1.5 transition hover:opacity-80"
                        >
                            <span
                                style={{
                                    color: "var(--play-muted)",
                                }}
                            >
                                drwxr-xr-x
                            </span>
                            <span className="truncate font-semibold group-hover:underline">
                                {project.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}
                                /
                            </span>
                            <span
                                className="text-xs"
                                style={{
                                    color: "var(--play-accent)",
                                }}
                            >
                                {project.type}
                            </span>
                        </Row>
                    );
                })}
            </div>
        </PlaySection>
    );
}


// ============================================================
// PROJECTS — blocks  (neo-brutalist)
// ============================================================

export function ProjectsBlocks({ data }) {
    const { projects } = data;

    if (projects.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-projects">
            <Display
                as="h2"
                className="text-4xl font-bold uppercase tracking-tighter md:text-6xl"
            >
                The Work
            </Display>

            <div className="mt-10 grid items-stretch gap-8 md:grid-cols-2">
                {projects.map((project, index) => {
                    const href = projectHref(project);
                    const Wrapper = href ? "a" : "div";

                    return (
                        <motion.div
                            key={project.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{ duration: 0.35 }}
                            className="h-full"
                        >
                            <Wrapper
                                {...(href
                                    ? {
                                          href,
                                          target: "_blank",
                                          rel: "noreferrer",
                                          onClick: () =>
                                              openProject(
                                                  project
                                              ),
                                      }
                                    : {})}
                                className="flex h-full flex-col overflow-hidden transition hover:-translate-x-1 hover:-translate-y-1"
                                style={panelStyle}
                            >
                                {project.image ? (
                                    <div
                                        className="aspect-[16/10] w-full overflow-hidden"
                                        style={{
                                            borderBottom:
                                                "var(--play-border-width) solid var(--play-border)",
                                            background:
                                                "var(--play-surface)",
                                        }}
                                    >
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : null}

                                <div className="flex flex-1 flex-col p-5">
                                    <p
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{
                                            color: "var(--play-accent)",
                                        }}
                                    >
                                        {project.type}
                                    </p>
                                    <Display
                                        as="h3"
                                        className="mt-1 text-2xl font-bold uppercase leading-tight"
                                    >
                                        {project.name}
                                    </Display>
                                    <p className="mt-2 line-clamp-3 text-sm font-medium leading-6">
                                        {project.description}
                                    </p>
                                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                                        {(
                                            project.technologies ||
                                            []
                                        )
                                            .slice(0, 4)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-0.5 text-[11px] font-bold uppercase"
                                                    style={{
                                                        background:
                                                            "var(--play-accent)",
                                                        color: "var(--play-accent-contrast)",
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </Wrapper>
                        </motion.div>
                    );
                })}
            </div>
        </PlaySection>
    );
}


// ============================================================
// PROJECTS — panels  (cyberpunk)
// ============================================================

const CLIP =
    "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)";

export function ProjectsPanels({ data }) {
    const { projects } = data;

    if (projects.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-projects">
            <p
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: "var(--play-accent)" }}
            >
                // ARCHIVE.dir
            </p>
            <Display
                as="h2"
                className="mt-3 text-4xl font-bold uppercase tracking-tight md:text-5xl"
            >
                Projects
            </Display>

            <div className="mt-10 grid items-stretch gap-6 md:grid-cols-2">
                {projects.map((project, index) => {
                    const href = projectHref(project);
                    const Wrapper = href ? "a" : "div";

                    return (
                        <motion.div
                            key={project.id || index}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{ duration: 0.4 }}
                            className="group h-full"
                        >
                            <Wrapper
                                {...(href
                                    ? {
                                          href,
                                          target: "_blank",
                                          rel: "noreferrer",
                                          onClick: () =>
                                              openProject(
                                                  project
                                              ),
                                      }
                                    : {})}
                                className="flex h-full flex-col p-5 transition group-hover:-translate-y-1"
                                style={{
                                    clipPath: CLIP,
                                    background:
                                        "var(--play-card)",
                                    border: "1px solid var(--play-accent)",
                                    boxShadow:
                                        "0 0 20px rgba(34,240,255,0.18)",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-[10px] font-bold uppercase tracking-[0.2em]"
                                        style={{
                                            color: "var(--play-accent-2)",
                                        }}
                                    >
                                        PROJECT_
                                        {String(index + 1)
                                            .padStart(2, "0")}
                                    </span>
                                    <span
                                        className="text-[10px] uppercase tracking-widest"
                                        style={{
                                            color: "var(--play-muted)",
                                        }}
                                    >
                                        {project.type}
                                    </span>
                                </div>

                                {project.image ? (
                                    <div
                                        className="mt-3 aspect-[16/9] w-full overflow-hidden"
                                        style={{
                                            border: "1px solid var(--play-border)",
                                        }}
                                    >
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                                        />
                                    </div>
                                ) : null}

                                <Display
                                    as="h3"
                                    className="mt-3 text-xl font-bold uppercase"
                                >
                                    {project.name}
                                </Display>
                                <p
                                    className="mt-2 line-clamp-2 text-sm leading-6"
                                    style={{
                                        color: "var(--play-muted)",
                                    }}
                                >
                                    {project.description}
                                </p>

                                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                                    {(
                                        project.technologies ||
                                        []
                                    )
                                        .slice(0, 4)
                                        .map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 text-[10px] uppercase tracking-wide"
                                                style={{
                                                    border: "1px solid var(--play-accent)",
                                                    color: "var(--play-accent)",
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                </div>
                            </Wrapper>
                        </motion.div>
                    );
                })}
            </div>
        </PlaySection>
    );
}


// ============================================================
// PROJECTS — arcade  (synthwave)
// ============================================================

export function ProjectsArcade({ data }) {
    const { projects } = data;

    if (projects.length === 0) {
        return null;
    }

    return (
        <PlaySection id="play-projects">
            <Display
                as="h2"
                className="text-center text-4xl font-bold uppercase tracking-tight md:text-6xl"
                style={{
                    color: "var(--play-accent)",
                    textShadow: "0 0 22px var(--play-accent)",
                }}
            >
                Insert Coin
            </Display>

            <div className="mt-12 grid items-stretch gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => {
                    const href = projectHref(project);
                    const Wrapper = href ? "a" : "div";

                    return (
                        <motion.div
                            key={project.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.4,
                                delay: Math.min(
                                    index * 0.05,
                                    0.3
                                ),
                            }}
                            className="group h-full"
                        >
                            <Wrapper
                                {...(href
                                    ? {
                                          href,
                                          target: "_blank",
                                          rel: "noreferrer",
                                          onClick: () =>
                                              openProject(
                                                  project
                                              ),
                                      }
                                    : {})}
                                className="flex h-full flex-col overflow-hidden transition group-hover:-translate-y-1.5"
                                style={{
                                    background:
                                        "var(--play-card)",
                                    border: "2px solid var(--play-accent)",
                                    boxShadow:
                                        "0 0 24px rgba(255,92,168,0.35)",
                                }}
                            >
                                {project.image ? (
                                    <div
                                        className="aspect-[16/10] w-full overflow-hidden"
                                        style={{
                                            borderBottom:
                                                "2px solid var(--play-accent)",
                                        }}
                                    >
                                        <img
                                            src={project.image}
                                            alt={project.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : null}

                                <div className="flex flex-1 flex-col p-5">
                                    <p
                                        className="text-[11px] font-bold uppercase tracking-[0.2em]"
                                        style={{
                                            color: "var(--play-accent-2)",
                                        }}
                                    >
                                        {project.type}
                                    </p>
                                    <Display
                                        as="h3"
                                        className="mt-1 text-xl font-bold uppercase"
                                    >
                                        {project.name}
                                    </Display>
                                    <p
                                        className="mt-2 line-clamp-3 text-sm leading-6"
                                        style={{
                                            color: "var(--play-muted)",
                                        }}
                                    >
                                        {project.description}
                                    </p>
                                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                                        {(
                                            project.technologies ||
                                            []
                                        )
                                            .slice(0, 3)
                                            .map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-0.5 text-[10px] font-bold uppercase"
                                                    style={{
                                                        background:
                                                            "var(--play-accent)",
                                                        color: "var(--play-accent-contrast)",
                                                    }}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            </Wrapper>
                        </motion.div>
                    );
                })}
            </div>
        </PlaySection>
    );
}
