import { useRef } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";

import { useEditMode } from "../../context/EditModeContext";
import EditableImage from "./EditableImage";
import EditableParagraphs from "./EditableParagraphs";
import { useImageUpload } from "./useImageUpload";


// ============================================================
// EditableManuscriptSections
// ============================================================
//
// Renders a project's `descriptions` — the screen-by-screen
// "PROJECT DETAILS" walkthrough, each block = { images[], texts[] }.
//
// Public: the original read-only layout (numbered sections,
// responsive image grid, paragraphs).
//
// Edit mode: every image can be replaced or removed, images and
// paragraphs can be added, and whole sections can be added or
// removed. Each change hands the whole new array to `onSave`,
// which does the optimistic project update.
// ============================================================

const imageGridClass = (count) => {
    if (count === 1) {
        return "grid grid-cols-1 max-w-[850px] mx-auto";
    }

    if (count === 2) {
        return "grid grid-cols-1 gap-4 md:grid-cols-2";
    }

    return "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3";
};


// --- add-an-image button ---------------------------------------

function AddImageButton({ onAdd }) {
    const inputRef = useRef(null);
    const { upload, busy, error } = useImageUpload("PROJECT_IMAGE");

    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        const url = await upload(file);
        if (url) {
            await onAdd(url);
        }
    };

    return (
        <div className="flex flex-col items-start gap-1">
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="inline-flex items-center gap-1.5 border border-dashed border-[var(--accent)]/50 px-2.5 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/5 disabled:opacity-60"
            >
                {busy ? (
                    <Loader2 size={13} className="animate-spin" />
                ) : (
                    <ImagePlus size={13} />
                )}
                {busy ? "Uploading…" : "Add image"}
            </button>

            {error && (
                <span className="text-xs text-red-400">
                    {error}
                </span>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
            />
        </div>
    );
}


function EditableManuscriptSections({
    descriptions,
    projectName = "project",
    onSave,
}) {
    const { editing } = useEditMode();

    const sections = Array.isArray(descriptions)
        ? descriptions
        : [];

    if (!editing && sections.length === 0) {
        return null;
    }

    const commitSections = (next) =>
        onSave ? onSave(next) : Promise.resolve();

    const patchSection = (index, patch) => {
        const next = sections.map((section, i) =>
            i === index ? { ...section, ...patch } : section
        );
        return commitSections(next);
    };

    const setSectionImages = (index, images) =>
        patchSection(index, { images });

    const setSectionTexts = (index, texts) =>
        patchSection(index, { texts });

    const addSection = () =>
        commitSections([
            ...sections,
            { images: [], texts: [] },
        ]);

    const removeSection = (index) =>
        commitSections(
            sections.filter((_, i) => i !== index)
        );

    return (
        <section className="mt-16">

            {/* SECTION HEADER */}

            <div className="mb-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border)]" />
                <span className="text-[9px] tracking-[0.2em] text-[var(--muted)]">
                    PROJECT DETAILS
                </span>
            </div>

            <div className="space-y-20">
                {sections.map((section, index) => {
                    const rawImages = Array.isArray(
                        section.images
                    )
                        ? section.images
                        : [];

                    const images = editing
                        ? rawImages
                        : rawImages.filter(Boolean);

                    const rawTexts = Array.isArray(section.texts)
                        ? section.texts
                        : [];

                    const texts = editing
                        ? rawTexts
                        : rawTexts.filter(Boolean);

                    return (
                        <motion.article
                            key={`${projectName}-${index}`}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{ duration: 0.45 }}
                        >
                            {/* SECTION NUMBER */}

                            <div className="mb-5 flex items-center gap-3">
                                <span className="text-[9px] font-medium tracking-[0.15em] text-[var(--accent)]">
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </span>

                                <div className="h-px flex-1 bg-[var(--border)]" />

                                {editing && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSection(index)
                                        }
                                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--muted)] transition hover:text-red-400"
                                    >
                                        <X size={12} />
                                        Remove section
                                    </button>
                                )}
                            </div>

                            {/* IMAGES */}

                            {images.length > 0 && (
                                <div
                                    className={imageGridClass(
                                        images.length
                                    )}
                                >
                                    {images.map(
                                        (image, imageIndex) => (
                                            <div
                                                key={`${projectName}-${index}-${imageIndex}`}
                                                className="group relative w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]"
                                            >
                                                <EditableImage
                                                    uploadType="PROJECT_IMAGE"
                                                    onUpload={(
                                                        url
                                                    ) =>
                                                        setSectionImages(
                                                            index,
                                                            images.map(
                                                                (
                                                                    value,
                                                                    i
                                                                ) =>
                                                                    i ===
                                                                    imageIndex
                                                                        ? url
                                                                        : value
                                                            )
                                                        )
                                                    }
                                                    className="block"
                                                >
                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={`${projectName} section ${
                                                            index +
                                                            1
                                                        } image ${
                                                            imageIndex +
                                                            1
                                                        }`}
                                                        loading="lazy"
                                                        className="block h-auto max-h-[650px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                                    />
                                                </EditableImage>

                                                {editing && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSectionImages(
                                                                index,
                                                                images.filter(
                                                                    (
                                                                        _,
                                                                        i
                                                                    ) =>
                                                                        i !==
                                                                        imageIndex
                                                                )
                                                            )
                                                        }
                                                        aria-label="Remove image"
                                                        className="absolute right-2 top-2 z-30 flex size-6 items-center justify-center border border-red-500/40 bg-[var(--surface)] text-red-400"
                                                    >
                                                        <X
                                                            size={
                                                                12
                                                            }
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {editing && (
                                <div className="mt-4">
                                    <AddImageButton
                                        onAdd={(url) =>
                                            setSectionImages(
                                                index,
                                                [
                                                    ...images,
                                                    url,
                                                ]
                                            )
                                        }
                                    />
                                </div>
                            )}

                            {/* TEXT */}

                            {editing ? (
                                <div
                                    className={
                                        images.length > 0
                                            ? "mt-7"
                                            : "mt-4"
                                    }
                                >
                                    <EditableParagraphs
                                        className="space-y-5"
                                        value={texts}
                                        onSave={(next) =>
                                            setSectionTexts(
                                                index,
                                                next
                                            )
                                        }
                                        renderItem={(
                                            paragraph,
                                            paragraphIndex
                                        ) => (
                                            <p
                                                key={
                                                    paragraphIndex
                                                }
                                                className="max-w-[760px] text-sm leading-8 text-[var(--muted)] md:text-base"
                                            >
                                                {paragraph}
                                            </p>
                                        )}
                                    />
                                </div>
                            ) : (
                                texts.length > 0 && (
                                    <div
                                        className={
                                            images.length > 0
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
                                                    key={`${projectName}-${index}-text-${paragraphIndex}`}
                                                    className="max-w-[760px] text-sm leading-8 text-[var(--muted)] md:text-base"
                                                >
                                                    {paragraph}
                                                </p>
                                            )
                                        )}
                                    </div>
                                )
                            )}
                        </motion.article>
                    );
                })}
            </div>

            {editing && (
                <button
                    type="button"
                    onClick={addSection}
                    className="mt-12 inline-flex items-center gap-1.5 border border-dashed border-[var(--accent)]/50 px-3 py-2 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)]/5"
                >
                    <Plus size={14} />
                    Add detail section
                </button>
            )}
        </section>
    );
}

export default EditableManuscriptSections;
