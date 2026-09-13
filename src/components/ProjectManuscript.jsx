import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, GitBranch, ExternalLink, X } from "lucide-react";

import Editable from "./edit/Editable";
import EditableTags from "./edit/EditableTags";
import EditableParagraphs from "./edit/EditableParagraphs";
import EditableImage from "./edit/EditableImage";
import EditableManuscriptSections from "./edit/EditableManuscriptSections";


// ============================================================
// QUICK-PICK SETTINGS  (status / layout / type — edit mode only)
// ============================================================
//
// These three fields are real enums (or, for `type`, effectively
// one in practice) with no free-text affordance anywhere else, so
// they need an actual picker rather than double-click text edit.
// ============================================================

const STATUS_OPTIONS = [
    { value: "complete", label: "Completed" },
    { value: "incomplete", label: "In Development" },
    { value: "planned", label: "Planned" },
];

const LAYOUT_OPTIONS = [
    { value: "portrait", label: "Portrait (mobile)" },
    { value: "landscape", label: "Landscape (web)" },
];

const TYPE_PRESETS = [
    "Web App",
    "Mobile App",
    "Full-Stack App",
    "Desktop App",
    "API / Backend",
    "Browser Extension",
];

function EditSelect({ label, value, options, onChange }) {
    return (
        <label className="flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wide text-[var(--muted)]">
                {label}
            </span>
            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                className="border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}

function ProjectSettings({ project, onEditField }) {
    const typeValue = (project.type || "").trim();
    const matchedPreset = TYPE_PRESETS.find(
        (preset) =>
            preset.toLowerCase() === typeValue.toLowerCase()
    );
    const typeOptions = matchedPreset
        ? TYPE_PRESETS
        : [typeValue || "Web App", ...TYPE_PRESETS];
    const typeSelectValue = matchedPreset || typeOptions[0];

    return (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-dashed border-[var(--accent)]/30 bg-[var(--accent)]/5 px-4 py-3">
            <EditSelect
                label="Status"
                value={project.status || "complete"}
                options={STATUS_OPTIONS}
                onChange={(value) =>
                    onEditField("status", value)
                }
            />
            <EditSelect
                label="Type"
                value={typeSelectValue}
                options={typeOptions.map((option) => ({
                    value: option,
                    label: option,
                }))}
                onChange={(value) =>
                    onEditField("type", value)
                }
            />
            <EditSelect
                label="Cover layout"
                value={project.layout || "portrait"}
                options={LAYOUT_OPTIONS}
                onChange={(value) =>
                    onEditField("layout", value)
                }
            />
        </div>
    );
}


function ProjectManuscript({
    project,
    onClose,
    editing = false,
    onEditField,
    onEditFields,
}) {
    if (!project) return null;

    const save = (field) => (value) =>
        onEditField
            ? onEditField(field, value)
            : Promise.resolve();

    const notes = project.notes || {};

    const saveNoteList = (listKey) => (next) =>
        onEditFields
            ? onEditFields({
                  notes: { ...notes, [listKey]: next },
              })
            : Promise.resolve();

    const hasLiveView = Boolean(project.liveLink);
    const hasDemo = Boolean(project.demoLink);
    const hasSource = Boolean(project.github);

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
                                <Editable
                                    as="p"
                                    value={project.type}
                                    onSave={save("type")}
                                    placeholder="Project type"
                                    className="text-[9px] tracking-[0.22em] text-[var(--accent)]"
                                />

                                <Editable
                                    as="h1"
                                    value={project.name}
                                    onSave={save("name")}
                                    className="heading-font mt-2 block text-3xl font-bold tracking-tight md:text-5xl"
                                />

                                {(project.description || editing) && (
                                    <Editable
                                        as="p"
                                        value={project.description}
                                        onSave={save("description")}
                                        multiline
                                        placeholder="Short description"
                                        className="mt-4 block max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base"
                                    />
                                )}

                                {editing && onEditField && (
                                    <ProjectSettings
                                        project={project}
                                        onEditField={
                                            onEditField
                                        }
                                    />
                                )}
                            </section>

                            {/* MAIN PROJECT IMAGE */}

                            {(project.image || editing) && (
                                <div
                                    className={
                                        project.layout === "portrait"
                                            ? `
                                                relative
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
                                                relative
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
                                    <EditableImage
                                        uploadType="PROJECT_IMAGE"
                                        onUpload={save("image")}
                                        className="absolute inset-0"
                                    >
                                        {project.image ? (
                                            <img
                                                src={project.image}
                                                alt={`${project.name} home screen`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-[var(--muted)]">
                                                No cover image
                                            </div>
                                        )}
                                    </EditableImage>
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

                            <EditableManuscriptSections
                                descriptions={project.descriptions}
                                projectName={project.name}
                                onSave={(next) =>
                                    onEditFields
                                        ? onEditFields({
                                              descriptions: next,
                                          })
                                        : Promise.resolve()
                                }
                            />

                            {/* TECHNOLOGIES */}

                            {(project.technologies?.length > 0 ||
                                editing) && (
                                <section className="mt-20 border-t border-[var(--border)] pt-8">
                                    <p className="text-[9px] tracking-[0.2em] text-[var(--muted)]">
                                        BUILT WITH
                                    </p>

                                    <EditableTags
                                        className="mt-4 flex flex-wrap items-center gap-2"
                                        value={
                                            project.technologies ||
                                            []
                                        }
                                        onSave={(next) =>
                                            onEditField
                                                ? onEditField(
                                                      "technologies",
                                                      next
                                                  )
                                                : Promise.resolve()
                                        }
                                        renderTag={(
                                            technology
                                        ) => (
                                            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] text-[var(--muted)]">
                                                {technology}
                                            </span>
                                        )}
                                    />
                                </section>
                            )}

                            {/* NOTES & LEARNINGS */}

                            {(project.notes || editing) && (
                                <section className="mt-20 border-t border-[var(--border)] pt-10">

                                    <div className="mb-8">
                                        <p className="text-[9px] tracking-[0.2em] text-[var(--accent)]">
                                            NOTES & LEARNINGS
                                        </p>

                                        <h3 className="heading-font mt-2 text-2xl font-bold md:text-3xl">
                                            What I learned
                                        </h3>

                                        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                                            Personal notes, technical observations, challenges, and
                                            lessons learned while developing this project.
                                        </p>
                                    </div>

                                    <div className="space-y-10">
                                        {[
                                            {
                                                key: "learned",
                                                label: "Things I Learned",
                                            },
                                            {
                                                key: "challenges",
                                                label: "Challenges",
                                            },
                                            {
                                                key: "technical",
                                                label: "Technical Notes",
                                            },
                                            {
                                                key: "reflection",
                                                label: "Reflection",
                                            },
                                        ].map((block) => {
                                            const list =
                                                notes[
                                                    block.key
                                                ] || [];

                                            if (
                                                list.length ===
                                                    0 &&
                                                !editing
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={
                                                        block.key
                                                    }
                                                >
                                                    <p className="text-xs font-semibold text-[var(--text)]">
                                                        {
                                                            block.label
                                                        }
                                                    </p>

                                                    <EditableParagraphs
                                                        className="mt-4 space-y-3"
                                                        value={
                                                            list
                                                        }
                                                        onSave={saveNoteList(
                                                            block.key
                                                        )}
                                                        renderItem={(
                                                            note,
                                                            index
                                                        ) => (
                                                            <li
                                                                key={
                                                                    index
                                                                }
                                                                className="border-l-2 border-[var(--border)] pl-4 text-sm leading-7 text-[var(--muted)]"
                                                            >
                                                                {
                                                                    note
                                                                }
                                                            </li>
                                                        )}
                                                    />
                                                </div>
                                            );
                                        })}
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

