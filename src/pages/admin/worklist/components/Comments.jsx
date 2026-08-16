import {
    useMemo,
    useState,
} from "react";

import {
    MessageSquare,
    Pencil,
    Send,
    Trash2,
    X,
} from "lucide-react";

import {
    canAddComment,
    canEditComment,
    canDeleteComment,
} from "../../../../utils/workPermissions";

const getId = (value) => {
    if (!value) {
        return null;
    }

    if (typeof value === "string") {
        return value;
    }

    return (
        value?._id ||
        value?.id ||
        null
    )?.toString?.() || null;
};

function Comments({
    work,
    comments = [],
    currentAdmin = null,
    onAdd,
    onUpdate,
    onDelete,
    disabled = false,
}) {
    const [text, setText] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [editingText, setEditingText] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const sortedComments =
        useMemo(
            () =>
                [...comments].sort(
                    (a, b) =>
                        new Date(
                            a?.createdAt || 0
                        ) -
                        new Date(
                            b?.createdAt || 0
                        )
                ),
            [comments]
        );

    const canComment =
        !disabled &&
        canAddComment(
            currentAdmin,
            work
        );

    const handleSubmit = async () => {
        const value =
            text.trim();

        if (
            !value ||
            !canComment ||
            saving
        ) {
            return;
        }

        try {
            setSaving(true);

            await onAdd?.(
                value
            );

            setText("");
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (
        comment
    ) => {
        const commentId =
            getId(comment);

        if (!commentId) {
            return;
        }

        if (
            !canEditComment(
                currentAdmin,
                comment
            )
        ) {
            return;
        }

        setEditingId(
            commentId
        );

        setEditingText(
            comment.description ||
                comment.text ||
                ""
        );
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    const saveEdit = async (
        comment
    ) => {
        const value =
            editingText.trim();

        const commentId =
            getId(comment);

        if (
            !value ||
            !commentId ||
            saving
        ) {
            return;
        }

        if (
            !canEditComment(
                currentAdmin,
                comment
            )
        ) {
            return;
        }

        try {
            setSaving(true);

            await onUpdate?.(
                commentId,
                value
            );

            cancelEdit();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (
        comment
    ) => {
        const commentId =
            getId(comment);

        if (
            !commentId ||
            saving
        ) {
            return;
        }

        if (
            !canDeleteComment(
                currentAdmin,
                comment
            )
        ) {
            return;
        }

        try {
            setSaving(true);

            await onDelete?.(
                commentId
            );
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (
        value
    ) => {
        if (!value) {
            return "Unknown";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "Unknown";
        }

        return date.toLocaleString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    return (
        <section className="border border-[var(--border)] bg-[var(--card)]">
            <div className="flex items-center gap-3 border-b border-[var(--border)] p-5">
                <MessageSquare
                    size={19}
                    className="text-purple-400"
                />

                <div>
                    <h2 className="text-base font-semibold">
                        Comments
                    </h2>

                    <p className="mt-0.5 text-xs text-[var(--muted)]">
                        Discuss this work with other admins.
                    </p>
                </div>
            </div>

            <div className="divide-y divide-[var(--border)]">
                {sortedComments.length ===
                0 ? (
                    <div className="p-8 text-center">
                        <MessageSquare
                            size={24}
                            className="mx-auto text-[var(--muted)]"
                        />

                        <p className="mt-3 text-sm font-medium">
                            No comments yet.
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                            Start the discussion below.
                        </p>
                    </div>
                ) : (
                    sortedComments.map(
                        (comment) => {
                            const commentId =
                                getId(
                                    comment
                                );

                            const author =
                                comment?.admin ||
                                comment?.createdBy ||
                                {};

                            const authorName =
                                author?.fullName ||
                                author?.username ||
                                "Unknown admin";

                            const authorImage =
                                author?.profileImage
                                    ?.url ||
                                null;

                            const commentText =
                                comment?.description ||
                                comment?.text ||
                                "";

                            const editable =
                                canEditComment(
                                    currentAdmin,
                                    comment
                                );

                            const deletable =
                                canDeleteComment(
                                    currentAdmin,
                                    comment
                                );

                            return (
                                <div
                                    key={
                                        commentId
                                    }
                                    className="p-5"
                                >
                                    <div className="flex items-start gap-3">
                                        {authorImage ? (
                                            <img
                                                src={
                                                    authorImage
                                                }
                                                alt=""
                                                className="h-9 w-9 shrink-0 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-purple-500/10 text-xs font-bold text-purple-400">
                                                {authorName
                                                    .charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                <span className="text-sm font-semibold">
                                                    {
                                                        authorName
                                                    }
                                                </span>

                                                <span className="text-xs text-[var(--muted)]">
                                                    {formatDate(
                                                        comment?.createdAt
                                                    )}
                                                </span>

                                                {comment?.updatedAt &&
                                                    comment.createdAt !==
                                                        comment.updatedAt && (
                                                        <span className="text-[10px] text-[var(--muted)]">
                                                            edited
                                                        </span>
                                                    )}
                                            </div>

                                            {editingId ===
                                            commentId ? (
                                                <div className="mt-3">
                                                    <textarea
                                                        value={
                                                            editingText
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setEditingText(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        rows={3}
                                                        maxLength={
                                                            2000
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                        className="w-full resize-none border border-[var(--border)] bg-[var(--surface)] p-3 text-sm outline-none focus:border-purple-400 disabled:opacity-50"
                                                    />

                                                    <div className="mt-2 flex justify-end gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                cancelEdit
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            className="flex items-center gap-1.5 border border-[var(--border)] px-3 py-2 text-xs font-semibold transition hover:bg-[var(--surface)] disabled:opacity-50"
                                                        >
                                                            <X size={14} />
                                                            Cancel
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                saveEdit(
                                                                    comment
                                                                )
                                                            }
                                                            disabled={
                                                                saving ||
                                                                !editingText.trim()
                                                            }
                                                            className="flex items-center gap-1.5 bg-purple-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <Send size={14} />
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">
                                                    {
                                                        commentText
                                                    }
                                                </p>
                                            )}

                                            {editingId !==
                                                commentId && (
                                                <div className="mt-3 flex gap-3">
                                                    {editable && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEdit(
                                                                    comment
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--text)] disabled:opacity-50"
                                                        >
                                                            <Pencil size={13} />
                                                            Edit
                                                        </button>
                                                    )}

                                                    {deletable && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    comment
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 transition hover:text-red-300 disabled:opacity-50"
                                                        >
                                                            <Trash2 size={13} />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )
                )}
            </div>

            <div className="border-t border-[var(--border)] p-5">
                <textarea
                    value={text}
                    onChange={(event) =>
                        setText(
                            event.target.value
                        )
                    }
                    disabled={
                        !canComment ||
                        saving
                    }
                    maxLength={2000}
                    rows={3}
                    placeholder={
                        canComment
                            ? "Write a comment..."
                            : "Comments are unavailable."
                    }
                    className="w-full resize-none border border-[var(--border)] bg-[var(--surface)] p-3 text-sm outline-none transition focus:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)]">
                        {text.length}/2000
                    </span>

                    <button
                        type="button"
                        onClick={
                            handleSubmit
                        }
                        disabled={
                            !canComment ||
                            saving ||
                            !text.trim()
                        }
                        className="flex items-center gap-2 bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send size={15} />
                        Comment
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Comments;