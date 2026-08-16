import { useState } from "react";
import {
    ExternalLink,
    Link as LinkIcon,
    Plus,
    Pencil,
    Trash2,
    X,
    Check,
} from "lucide-react";

function Links({
    links = [],
    canEdit = false,
    disabled = false,
    onAdd,
    onUpdate,
    onRemove,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] =
        useState("");

    const resetForm = () => {
        setTitle("");
        setUrl("");
        setDescription("");
        setEditingLink(null);
        setModalOpen(false);
    };

    const openCreate = () => {
        setEditingLink(null);
        setTitle("");
        setUrl("");
        setDescription("");
        setModalOpen(true);
    };

    const openEdit = (link) => {
        setEditingLink(link);
        setTitle(link.title || "");
        setUrl(link.url || "");
        setDescription(
            link.description || ""
        );
        setModalOpen(true);
    };

    const validateUrl = (value) => {
        try {
            const parsed =
                new URL(value.trim());

            return parsed.protocol ===
                "https:";
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        const cleanTitle =
            title.trim();

        const cleanUrl =
            url.trim();

        const cleanDescription =
            description.trim();

        if (!cleanTitle || !cleanUrl) {
            return;
        }

        if (!validateUrl(cleanUrl)) {
            return;
        }

        const payload = {
            title: cleanTitle,
            url: cleanUrl,
            description:
                cleanDescription || null,
        };

        if (editingLink) {
            await onUpdate?.(
                editingLink._id,
                payload
            );
        } else {
            await onAdd?.(payload);
        }

        resetForm();
    };

    return (
        <section className="border border-[var(--border)] bg-[var(--card)]">

            <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center bg-purple-500/10 text-purple-400">
                        <LinkIcon size={18} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold">
                            Links
                        </h2>

                        <p className="mt-0.5 text-xs text-[var(--muted)]">
                            Useful references and external resources.
                        </p>
                    </div>

                </div>


                {canEdit &&
                    !disabled && (
                        <button
                            type="button"
                            onClick={openCreate}
                            className="flex items-center justify-center gap-2 bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
                        >
                            <Plus size={16} />
                            Add link
                        </button>
                    )}

            </div>


            {links.length === 0 ? (

                <div className="p-8 text-center">

                    <LinkIcon
                        size={25}
                        className="mx-auto text-[var(--muted)]"
                    />

                    <p className="mt-3 text-sm font-medium">
                        No links added.
                    </p>

                    {canEdit &&
                        !disabled && (
                            <p className="mt-1 text-xs text-[var(--muted)]">
                                Add a GitHub repository,
                                documentation, or another
                                useful reference.
                            </p>
                        )}

                </div>

            ) : (

                <div className="divide-y divide-[var(--border)]">

                    {links.map((link) => (

                        <div
                            key={link._id}
                            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between"
                        >

                            <div className="flex min-w-0 items-start gap-3">

                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--surface)] text-[var(--muted)]">
                                    <ExternalLink
                                        size={16}
                                    />
                                </div>


                                <div className="min-w-0">

                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="break-words text-sm font-semibold text-purple-400 transition hover:text-purple-300 hover:underline"
                                    >
                                        {link.title ||
                                            link.url}
                                    </a>


                                    {link.description && (
                                        <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                                            {
                                                link.description
                                            }
                                        </p>
                                    )}


                                    <p className="mt-2 break-all text-xs text-[var(--muted)]">
                                        {link.url}
                                    </p>


                                    {link.createdBy && (
                                        <p className="mt-2 text-[11px] text-[var(--muted)]">
                                            Added by{" "}
                                            {
                                                link.createdBy
                                                    ?.fullName ||
                                                link.createdBy
                                                    ?.username ||
                                                "Unknown admin"
                                            }
                                        </p>
                                    )}

                                </div>

                            </div>


                            {canEdit &&
                                !disabled && (
                                    <div className="flex shrink-0 gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEdit(
                                                    link
                                                )
                                            }
                                            className="flex items-center gap-1.5 border border-[var(--border)] px-3 py-2 text-xs font-semibold transition hover:bg-[var(--surface)]"
                                        >
                                            <Pencil
                                                size={13}
                                            />
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                onRemove?.(
                                                    link._id
                                                )
                                            }
                                            className="flex items-center gap-1.5 border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                                        >
                                            <Trash2
                                                size={13}
                                            />
                                            Remove
                                        </button>

                                    </div>
                                )}

                        </div>

                    ))}

                </div>

            )}


            {/* =====================================================
                LINK MODAL
            ===================================================== */}

            {modalOpen && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-5">

                    <div className="w-full max-w-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl">

                        <div className="flex items-center justify-between border-b border-[var(--border)] p-5">

                            <div>

                                <h3 className="text-base font-semibold">
                                    {editingLink
                                        ? "Edit link"
                                        : "Add link"}
                                </h3>

                                <p className="mt-1 text-xs text-[var(--muted)]">
                                    Only HTTPS links are allowed.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-[var(--muted)] transition hover:text-[var(--text)]"
                            >
                                <X size={18} />
                            </button>

                        </div>


                        <div className="space-y-5 p-5">

                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Link title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(
                                            event.target.value
                                        )
                                    }
                                    maxLength={200}
                                    placeholder="GitHub repository"
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    URL
                                </label>

                                <input
                                    type="url"
                                    value={url}
                                    onChange={(event) =>
                                        setUrl(
                                            event.target.value
                                        )
                                    }
                                    placeholder="https://github.com/..."
                                    className="w-full border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-medium">
                                    Description{" "}
                                    <span className="font-normal text-[var(--muted)]">
                                        (optional)
                                    </span>
                                </label>

                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value
                                        )
                                    }
                                    maxLength={1000}
                                    rows={3}
                                    placeholder="What is this link for?"
                                    className="w-full resize-none border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none focus:border-purple-400"
                                />

                            </div>


                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="border border-[var(--border)] px-5 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)]"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={
                                        !title.trim() ||
                                        !url.trim()
                                    }
                                    className="flex items-center justify-center gap-2 bg-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Check size={15} />

                                    {editingLink
                                        ? "Save changes"
                                        : "Add link"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}

export default Links;