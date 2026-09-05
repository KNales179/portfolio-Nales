import {
    Check,
    GripVertical,
    Pencil,
    Archive,
    RotateCcw,
} from "lucide-react";

function Subtask({
    subtask,

    canEdit = false,
    canComplete = false,
    canReopen = false,
    canArchive = false,
    canRestore = false,

    locked = false,
    archived = false,

    onToggle,
    onEdit,
    onArchive,
    onRestore,
    onReorder,
}) {
    if (!subtask) {
        return null;
    }

    const completed =
        subtask.completed === true;

    const canToggle =
        !locked &&
        !archived &&
        (
            completed
                ? canReopen
                : canComplete
        );

    const draggable =
        canEdit &&
        !locked &&
        !archived;

    const handleToggle = () => {
        if (!canToggle) {
            return;
        }

        onToggle?.(subtask);
    };

    const handleEdit = () => {
        if (
            !canEdit ||
            locked ||
            archived
        ) {
            return;
        }

        onEdit?.(subtask);
    };

    const handleArchive = () => {
        if (
            !canArchive ||
            locked ||
            archived
        ) {
            return;
        }

        onArchive?.(subtask);
    };

    const handleRestore = () => {
        if (!canRestore) {
            return;
        }

        onRestore?.(subtask);
    };

    return (
        <div
            draggable={draggable}

            onDragStart={(event) => {
                if (!draggable) {
                    return;
                }

                // Stop this from bubbling up to the parent Task's
                // onDragStart — Task's <article> is also draggable,
                // and nested draggables otherwise fight over the
                // same drag gesture.
                event.stopPropagation();

                event.dataTransfer.setData(
                    "text/plain",
                    String(subtask._id)
                );
            }}

            onDragOver={(event) => {
                if (draggable) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            }}

            onDrop={(event) => {
                if (!draggable) {
                    return;
                }

                // Prevent the parent Task's onDrop from also
                // firing for this same drop (see onDragStart note).
                event.stopPropagation();
                event.preventDefault();

                const sourceId =
                    event.dataTransfer.getData(
                        "text/plain"
                    );

                if (
                    sourceId &&
                    sourceId !==
                    String(subtask._id)
                ) {
                    onReorder?.(
                        sourceId,
                        subtask._id
                    );
                }
            }}

            className={`flex items-start gap-3 border-b border-[var(--border)] p-4 last:border-b-0 ${archived
                ? "opacity-60"
                : ""
                }`}
        >

            {draggable && (
                <GripVertical
                    size={16}
                    className="mt-1 shrink-0 cursor-grab text-[var(--muted)]"
                />
            )}

            <button
                type="button"
                onClick={handleToggle}
                disabled={!canToggle}
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border text-[10px] transition ${completed
                    ? "border-purple-500 bg-purple-500 text-white"
                    : "border-[var(--border)] hover:border-purple-400"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                aria-label={
                    completed
                        ? "Reopen subtask"
                        : "Complete subtask"
                }
            >
                {completed && (
                    <Check size={11} />
                )}
            </button>

            <div className="min-w-0 flex-1">

                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0 flex-1">

                        <p
                            className={`text-sm font-medium ${completed
                                ? "text-[var(--muted)] line-through"
                                : ""
                                }`}
                        >
                            {subtask.title ||
                                "Untitled subtask"}
                        </p>

                        {subtask.description && (
                            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                                {subtask.description}
                            </p>
                        )}

                    </div>

                    <div className="flex shrink-0 flex-nowrap items-center gap-2 whitespace-nowrap">

                        {archived && (
                            <button
                                type="button"
                                onClick={
                                    handleRestore
                                }
                                disabled={
                                    !canRestore
                                }
                                className="flex items-center gap-1.5 text-xs font-semibold text-green-400 disabled:opacity-40"
                            >
                                <RotateCcw
                                    size={13}
                                />
                                Restore
                            </button>
                        )}

                        {!archived &&
                            canEdit &&
                            !locked && (
                                <button
                                    type="button"
                                    onClick={
                                        handleEdit
                                    }
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] transition hover:text-[var(--text)]"
                                >
                                    <Pencil
                                        size={13}
                                    />
                                    Edit
                                </button>
                            )}

                        {!archived &&
                            canArchive &&
                            !locked && (
                                <button
                                    type="button"
                                    onClick={
                                        handleArchive
                                    }
                                    className="flex items-center gap-1.5 text-xs font-semibold text-red-400 transition hover:text-red-300"
                                >
                                    <Archive
                                        size={13}
                                    />
                                    Archive
                                </button>
                            )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Subtask;