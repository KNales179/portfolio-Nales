import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, GitBranch, ExternalLink, X } from "lucide-react";

function ProjectManuscript({ project, onClose }) {
    if (!project) return null;

    const hasLiveView = Boolean(project.liveLink);
    const hasDemo = Boolean(project.demoLink);
    const hasSource = Boolean(project.github);

    const getImageGridClass = (imageCount) => {
        if (imageCount === 1) {
            return "grid grid-cols-1 max-w-[850px] mx-auto";
        }

        if (imageCount === 2) {
            return "grid grid-cols-1 gap-4 md:grid-cols-2";
        }

        return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
    };

    return (
        <AnimatePresence>
            <motion.div
                className="
                    fixed inset-0 z-[9999]
                    flex items-center justify-center
                    bg-black/45
                    backdrop-blur-md
                    p-3
                    md:p-6
                "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        onClose();
                    }
                }}
            >
                {/* BACKGROUND */}

                <div
                    className="
                        pointer-events-none
                        absolute inset-0
                        overflow-hidden
                    "
                    aria-hidden="true"
                >
                    <div
                        className="
                            absolute inset-0
                            opacity-70
                        "
                        style={{
                            backgroundImage: `
                                linear-gradient(var(--grid-line) 1px, transparent 1px),
                                linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
                            `,
                            backgroundSize: "80px 80px",
                            maskImage:
                                "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                            WebkitMaskImage:
                                "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)",
                        }}
                    />

                    <div
                        className="
                            absolute inset-0
                            opacity-60
                        "
                        style={{
                            background:
                                "radial-gradient(circle at 70% 15%, var(--accent-soft), transparent 30%)",
                        }}
                    />
                </div>

                {/* MANUSCRIPT */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                    }}
                    exit={{
                        opacity: 0,
                        y: 15,
                        scale: 0.985,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="
                        relative
                        z-10
                        flex
                        h-[92vh]
                        w-full
                        max-w-[1000px]
                        flex-col
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[var(--border)]
                        bg-[var(--bg)]
                        shadow-2xl
                    "
                >
                    {/* HEADER */}

                    <header
                        className="
                            flex
                            shrink-0
                            items-center
                            justify-between
                            border-b
                            border-[var(--border)]
                            bg-[var(--surface)]
                            px-4
                            py-3
                            md:px-6
                        "
                    >
                        <div className="min-w-0">
                            <p className="text-[8px] tracking-[0.2em] text-[var(--accent)]">
                                PROJECT MANUSCRIPT
                            </p>

                            <h2 className="heading-font truncate text-base font-bold md:text-lg">
                                {project.name}
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label={`Close ${project.name}`}
                            className="
                                ml-3
                                flex
                                size-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-[var(--border)]
                                bg-[var(--surface)]
                                text-[var(--muted)]
                                transition-colors
                                hover:border-[var(--accent)]
                                hover:text-[var(--text)]
                            "
                        >
                            <X size={16} />
                        </button>
                    </header>

                    {/* SCROLLABLE CONTENT */}

                    <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--bg)]">
                        <div className="mx-auto max-w-[850px] px-4 py-8 md:px-8 md:py-12">

                            {/* PROJECT INTRO */}

                            <section className="mb-10">
                                <p className="text-[9px] tracking-[0.22em] text-[var(--accent)]">
                                    {project.type}
                                </p>

                                <h1 className="heading-font mt-2 text-3xl font-bold tracking-tight md:text-5xl">
                                    {project.title || project.name}
                                </h1>

                                {project.description && (
                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
                                        {project.description}
                                    </p>
                                )}
                            </section>

                            {/* MAIN PROJECT IMAGE */}

                            {project.image && (
                                <div
                                    className={
                                        project.layout === "portrait"
                                            ? `
                                                mx-auto
                                                aspect-[3/4]
                                                w-full
                                                max-w-[430px]
                                                overflow-hidden
                                                rounded-xl
                                                border
                                                border-[var(--border)]
                                                bg-[var(--surface)]
                                            `
                                            : `
                                                mx-auto
                                                aspect-[16/9]
                                                w-full
                                                max-w-[850px]
                                                overflow-hidden
                                                rounded-xl
                                                border
                                                border-[var(--border)]
                                                bg-[var(--surface)]
                                            `
                                    }
                                >
                                    <img
                                        src={project.image}
                                        alt={`${project.name} home screen`}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* PROJECT LINKS */}

                            <div className="mt-5 flex flex-wrap items-center gap-3">

                                {/* LIVE VIEW */}

                                {hasLiveView ? (
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            bg-[var(--accent)]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            text-white
                                            shadow-sm
                                            transition-all
                                            hover:-translate-y-0.5
                                            hover:brightness-105
                                        "
                                    >
                                        Live View
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            border
                                            border-[var(--border)]
                                            bg-[var(--surface)]
                                            px-4
                                            py-2.5
                                            text-xs
                                            text-[var(--muted)]
                                        "
                                    >
                                        Live View Unavailable
                                    </div>
                                )}

                                {/* VIDEO DEMO */}

                                {hasDemo ? (
                                    <a
                                        href={project.demoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-[var(--border)]
                                            bg-[var(--surface)]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            text-[var(--text)]
                                            transition-all
                                            hover:-translate-y-0.5
                                            hover:border-[var(--accent)]
                                            hover:text-[var(--accent)]
                                        "
                                    >
                                        Watch Video Demo
                                        <ArrowUpRight size={14} />
                                    </a>
                                ) : (
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            border
                                            border-[var(--border)]
                                            bg-[var(--surface)]
                                            px-4
                                            py-2.5
                                            text-xs
                                            text-[var(--muted)]
                                        "
                                    >
                                        Video Demo Unavailable
                                    </div>
                                )}

                                {/* SOURCE */}

                                {hasSource ? (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-[var(--border)]
                                            bg-[var(--surface)]
                                            px-4
                                            py-2.5
                                            text-xs
                                            font-semibold
                                            text-[var(--text)]
                                            transition-all
                                            hover:-translate-y-0.5
                                            hover:border-[var(--accent)]
                                            hover:text-[var(--accent)]
                                        "
                                    >
                                        <GitBranch size={14} />
                                        Source
                                    </a>
                                ) : (
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            border
                                            border-[var(--border)]
                                            bg-[var(--surface)]
                                            px-4
                                            py-2.5
                                            text-xs
                                            text-[var(--muted)]
                                        "
                                    >
                                        Source Unavailable
                                    </div>
                                )}

                            </div>

                            {/* MANUSCRIPT */}

                            {project.descriptions?.length > 0 && (
                                <section className="mt-16">

                                    {/* SECTION HEADER */}

                                    <div className="mb-10 flex items-center gap-3">

                                        <div className="h-px flex-1 bg-[var(--border)]" />

                                        <span className="text-[9px] tracking-[0.2em] text-[var(--muted)]">
                                            PROJECT DETAILS
                                        </span>
                                    </div>

                                    <div className="space-y-20">

                                        {project.descriptions.map(
                                            (section, index) => {
                                                const images = Array.isArray(
                                                    section.images
                                                )
                                                    ? section.images.filter(
                                                        Boolean
                                                    )
                                                    : [];

                                                const texts = Array.isArray(
                                                    section.texts
                                                )
                                                    ? section.texts.filter(
                                                        Boolean
                                                    )
                                                    : [];

                                                return (
                                                    <motion.article
                                                        key={`${project.name}-${index}`}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 18,
                                                        }}
                                                        whileInView={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        viewport={{
                                                            once: true,
                                                            amount: 0.15,
                                                        }}
                                                        transition={{
                                                            duration: 0.45,
                                                        }}
                                                    >
                                                        {/* SECTION NUMBER */}

                                                        <div className="mb-5 flex items-center gap-3">
                                                            <span className="text-[9px] font-medium tracking-[0.15em] text-[var(--accent)]">
                                                                {String(
                                                                    index + 1
                                                                ).padStart(
                                                                    2,
                                                                    "0"
                                                                )}
                                                            </span>

                                                            <div className="h-px flex-1 bg-[var(--border)]" />
                                                        </div>

                                                        {/* IMAGES */}

                                                        {images.length > 0 && (
                                                            <div
                                                                className={getImageGridClass(
                                                                    images.length
                                                                )}
                                                            >
                                                                {images.map(
                                                                    (
                                                                        image,
                                                                        imageIndex
                                                                    ) => (
                                                                        <div
                                                                            key={`${project.name}-${index}-${imageIndex}`}
                                                                            className="
                                                                                group
                                                                                relative
                                                                                w-full
                                                                                overflow-hidden
                                                                                rounded-xl
                                                                                border
                                                                                border-[var(--border)]
                                                                                bg-[var(--surface)]
                                                                            "
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    image
                                                                                }
                                                                                alt={`${project.name} section ${index +
                                                                                    1
                                                                                    } image ${imageIndex +
                                                                                    1
                                                                                    }`}
                                                                                loading="lazy"
                                                                                className="
                                                                                    block
                                                                                    h-auto
                                                                                    max-h-[650px]
                                                                                    w-full
                                                                                    object-contain
                                                                                    transition-transform
                                                                                    duration-500
                                                                                    group-hover:scale-[1.02]
                                                                                "
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* TEXT */}

                                                        {texts.length > 0 && (
                                                            <div
                                                                className={
                                                                    images.length >
                                                                        0
                                                                        ? "mt-7 space-y-5"
                                                                        : "space-y-5"
                                                                }
                                                            >
                                                                {texts.map(
                                                                    (
                                                                        paragraph,
                                                                        paragraphIndex
                                                                    ) => (
                                                                        <p
                                                                            key={`${project.name}-${index}-text-${paragraphIndex}`}
                                                                            className="
                                                                                max-w-[760px]
                                                                                text-sm
                                                                                leading-8
                                                                                text-[var(--muted)]
                                                                                md:text-base
                                                                            "
                                                                        >
                                                                            {
                                                                                paragraph
                                                                            }
                                                                        </p>
                                                                    )
                                                                )}
                                                            </div>
                                                        )}
                                                    </motion.article>
                                                );
                                            }
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* TECHNOLOGIES */}

                            {project.technologies?.length > 0 && (
                                <section className="mt-20 border-t border-[var(--border)] pt-8">
                                    <p className="text-[9px] tracking-[0.2em] text-[var(--muted)]">
                                        BUILT WITH
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {project.technologies.map(
                                            (technology) => (
                                                <span
                                                    key={technology}
                                                    className="
                                                        rounded-full
                                                        border
                                                        border-[var(--border)]
                                                        bg-[var(--surface)]
                                                        px-3
                                                        py-1.5
                                                        text-[10px]
                                                        text-[var(--muted)]
                                                    "
                                                >
                                                    {technology}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* END */}

                            <div className="mt-20 border-t border-[var(--border)] pt-6 text-center">
                                <p className="text-[9px] tracking-[0.2em] text-[var(--muted)]">
                                    END OF MANUSCRIPT
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default ProjectManuscript;

