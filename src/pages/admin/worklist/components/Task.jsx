import { useState } from "react";
import {
    Check,
    ChevronDown,
    ChevronRight,
    GripVertical,
    Pencil,
    Plus,
    Archive,
    RotateCcw,
} from "lucide-react";

function Task({
    task,
    subtasks = [],
    index = 0,

    canEdit = false,
    canComplete = false,
    canReopen = false,
    canArchive = false,
    canRestore = false,

    locked = false,
    archived = false,

    onToggle,
    onEdit,
    onAddSubtask,
    onArchive,
    onRestore,
    onReorder,

    renderSubtask,

    // Optional — when provided, replaces the "+ Add subtask" button
    // with this content (used to render the inline add-subtask form
    // directly under THIS task instead of at the bottom of the list).
    subtaskFormSlot = null,
}) {
    const storageKey =
        task?._id
            ? `work-task-expanded:${task._id}`
            : null;

    const [expanded, setExpanded] =
        useState(() => {
            if (!storageKey) {
                return false;
            }

            try {
                return (
                    localStorage.getItem(
                        storageKey
                    ) === "true"
                );
            } catch {
                return false;
            }
        });

    const toggleExpanded = () => {
        setExpanded(
            (current) => {
                const next = !current;

                if (storageKey) {
                    try {
                        localStorage.setItem(
                            storageKey,
                            String(next)
                        );
                    } catch {
                        // ignore storage errors (e.g. private mode)
                    }
                }

                return next;
            }
        );
    };

    if (!task) {
        return null;
    }

    const safeSubtasks =
        Array.isArray(subtasks)
            ? subtasks
            : Array.isArray(task.subtasks)
                ? task.subtasks
                : [];

    const completedSubtasks =
        safeSubtasks.filter(
            (subtask) =>
                subtask?.completed === true
        ).length;

    const hasSubtasks =
        safeSubtasks.length > 0;

    const progress =
        hasSubtasks
            ? Math.round(
                (completedSubtasks /
                    safeSubtasks.length) *
                100
            )
            : task.status === "COMPLETED"
                ? 100
                : 0;

    const completed =
        progress === 100;

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

        onToggle?.(task);
    };

    const handleEdit = () => {
        if (
            !canEdit ||
            locked ||
            archived
        ) {
            return;
        }

        onEdit?.(task);
    };

    const handleArchive = () => {
        if (
            !canArchive ||
            locked ||
            archived
        ) {
            return;
        }

        onArchive?.(task);
    };

    const handleRestore = () => {
        if (!canRestore) {
            return;
        }

        onRestore?.(task);
    };

    return (
        <article
            draggable={draggable}

            onDragStart={(event) => {
                if (!draggable) {
                    return;
                }

                event.dataTransfer.setData(
                    "text/plain",
                    String(task._id)
                );
            }}

            onDragOver={(event) => {
                if (draggable) {
                    event.preventDefault();
                }
            }}

            onDrop={(event) => {
                if (!draggable) {
                    return;
                }

                event.preventDefault();

                const sourceId =
                    event.dataTransfer.getData(
                        "text/plain"
                    );

                if (
                    sourceId &&
                    sourceId !==
                    String(task._id)
                ) {
                    onReorder?.(
                        sourceId,
                        task._id
                    );
                }
            }}

            className={`border-b border-[var(--border)] last:border-b-0 ${
                archived
                    ? "opacity-60"
                    : ""
            }`}
        >

            {/* TASK HEADER */}

            <div className="flex items-start gap-3 p-5">

                {draggable && (
                    <GripVertical
                        size={17}
                        className="mt-1 shrink-0 cursor-grab text-[var(--muted)]"
                    />
                )}

                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={!canToggle}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] transition ${
                        completed
                            ? "border-purple-500 bg-purple-500 text-white"
                            : "border-[var(--border)] hover:border-purple-400"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                    aria-label={
                        completed
                            ? "Reopen task"
                            : "Complete task"
                    }
                >
                    {completed && (
                        <Check size={12} />
                    )}
                </button>

                <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="min-w-0 flex-1">

                            <div className="flex items-center gap-2">

                                {hasSubtasks && (
                                    <button
                                        type="button"
                                        onClick={
                                            toggleExpanded
                                        }
                                        className="shrink-0 text-[var(--muted)] transition hover:text-[var(--text)]"
                                        aria-label={
                                            expanded
                                                ? "Collapse task"
                                                : "Expand task"
                                        }
                                    >
                                        {expanded ? (
                                            <ChevronDown
                                                size={17}
                                            />
                                        ) : (
                                            <ChevronRight
                                                size={17}
                                            />
                                        )}
                                    </button>
                                )}

                                <h3
                                    className={`text-sm font-semibold ${
                                        completed
                                            ? "text-[var(--muted)] line-through"
                                            : ""
                                    }`}
                                >
                                    {task.title ||
                                        "Untitled task"}
                                </h3>

                            </div>

                            {task.description && (
                                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                                    {task.description}
                                </p>
                            )}

                        </div>

                        <div className="flex shrink-0 flex-nowrap items-center gap-2 whitespace-nowrap">

                            <span className="text-xs font-semibold text-[var(--muted)]">
                                {progress}%
                            </span>

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

                            {archived &&
                                canRestore && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleRestore
                                        }
                                        className="flex items-center gap-1.5 text-xs font-semibold text-green-400"
                                    >
                                        <RotateCcw
                                            size={13}
                                        />
                                        Restore
                                    </button>
                                )}

                        </div>

                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden bg-[var(--surface)]">

                        <div
                            className={`h-full transition-all duration-300 ${
                                completed
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                            }`}
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                </div>

            </div>

            {/* SUBTASKS */}

            {expanded &&
                hasSubtasks && (

                    <div className="ml-8 border-t border-[var(--border)] sm:ml-12">

                        {safeSubtasks.map(
                            (subtask) =>
                                renderSubtask
                                    ? renderSubtask(
                                        subtask
                                    )
                                    : null
                        )}

                    </div>
                )}

            {/* ADD SUBTASK */}

            {canEdit &&
                !locked &&
                !archived && (

                    <div className="border-t border-[var(--border)] px-5 py-3">

                        {subtaskFormSlot ? (
                            subtaskFormSlot
                        ) : (
                            <button
                                type="button"
                                onClick={() =>
                                    onAddSubtask?.(
                                        task
                                    )
                                }
                                className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 transition hover:text-purple-300"
                            >
                                <Plus size={14} />
                                Add subtask
                            </button>
                        )}

                    </div>
                )}

        </article>
    );
}

export default Task;