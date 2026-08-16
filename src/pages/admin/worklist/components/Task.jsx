import { useState } from "react";
import {
    Check,
    ChevronDown,
    ChevronRight,
    GripVertical,
    MoreVertical,
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
}) {
    const [expanded, setExpanded] =
        useState(true);

    const [menuOpen, setMenuOpen] =
        useState(false);

    const hasSubtasks =
        subtasks.length > 0;

    const completedSubtasks =
        subtasks.filter(
            (subtask) =>
                subtask.completed
        ).length;

    const progress =
        hasSubtasks
            ? Math.round(
                (completedSubtasks /
                    subtasks.length) *
                100
            )
            : task.status ===
                "COMPLETED"
                ? 100
                : 0;

    const completed =
        progress === 100;

    const canToggle =
        !locked &&
        !archived &&
        (completed
            ? canReopen
            : canComplete);

    const handleToggle = () => {
        if (!canToggle) {
            return;
        }

        onToggle?.(
            task._id,
            !completed
        );
    };

    return (
        <article
            draggable={
                canEdit &&
                !locked &&
                !archived
            }
            onDragStart={(event) => {
                event.dataTransfer.setData(
                    "text/plain",
                    String(task._id)
                );
            }}
            onDragOver={(event) =>
                event.preventDefault()
            }
            onDrop={(event) => {
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
            className={`border border-[var(--border)] bg-[var(--card)] ${archived
                ? "opacity-60"
                : ""
                }`}
        >

            <div className="flex items-start gap-3 p-4">

                {canEdit &&
                    !locked &&
                    !archived && (
                        <GripVertical
                            size={18}
                            className="mt-1 shrink-0 cursor-grab text-[var(--muted)] active:cursor-grabbing"
                        />
                    )}


                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={!canToggle}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border transition ${completed
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-[var(--border)] hover:border-purple-400"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                    aria-label={
                        completed
                            ? "Reopen task"
                            : "Complete task"
                    }
                >
                    {completed && (
                        <Check
                            size={14}
                        />
                    )}
                </button>


                <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                        <h3
                            className={`text-sm font-semibold ${completed
                                ? "text-[var(--muted)] line-through"
                                : ""
                                }`}
                        >
                            {task.title}
                        </h3>

                        {task.status ===
                            "BLOCKED" && (
                            <span className="bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-400">
                                Blocked
                            </span>
                        )}

                    </div>


                    {task.description && (
                        <p className="mt-1 text-sm leading-5 text-[var(--muted)]">
                            {
                                task.description
                            }
                        </p>
                    )}


                    <div className="mt-3 flex items-center gap-3">

                        <div className="h-1.5 flex-1 overflow-hidden bg-[var(--surface)]">

                            <div
                                className="h-full bg-purple-500 transition-all"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                        <span className="text-[11px] font-semibold text-[var(--muted)]">
                            {progress}%
                        </span>

                    </div>

                </div>


                <div className="relative flex shrink-0 items-center gap-1">

                    {hasSubtasks && (
                        <button
                            type="button"
                            onClick={() =>
                                setExpanded(
                                    (value) =>
                                        !value
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
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


                    {(canEdit ||
                        canArchive ||
                        canRestore) && (
                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen(
                                    (value) =>
                                        !value
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                        >
                            <MoreVertical
                                size={17}
                            />
                        </button>
                    )}


                    {menuOpen && (
                        <div className="absolute right-0 top-9 z-20 min-w-[160px] border border-[var(--border)] bg-[var(--card)] p-1 shadow-xl">

                            {canEdit &&
                                !locked &&
                                !archived && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(
                                                false
                                            );
                                            onEdit?.(
                                                task
                                            );
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition hover:bg-[var(--surface)]"
                                    >
                                        <Pencil
                                            size={14}
                                        />
                                        Edit task
                                    </button>
                                )}


                            {canEdit &&
                                !locked &&
                                !archived && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(
                                                false
                                            );
                                            onAddSubtask?.(
                                                task
                                            );
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition hover:bg-[var(--surface)]"
                                    >
                                        <Plus
                                            size={14}
                                        />
                                        Add subtask
                                    </button>
                                )}


                            {canArchive &&
                                !archived && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(
                                                false
                                            );
                                            onArchive?.(
                                                task._id
                                            );
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-yellow-400 transition hover:bg-yellow-500/10"
                                    >
                                        <Archive
                                            size={14}
                                        />
                                        Archive task
                                    </button>
                                )}


                            {canRestore &&
                                archived && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(
                                                false
                                            );
                                            onRestore?.(
                                                task._id
                                            );
                                        }}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-green-400 transition hover:bg-green-500/10"
                                    >
                                        <RotateCcw
                                            size={14}
                                        />
                                        Restore task
                                    </button>
                                )}

                        </div>
                    )}

                </div>

            </div>


            {/* SUBTASKS */}

            {hasSubtasks &&
                expanded && (
                    <div className="border-t border-[var(--border)] bg-[var(--surface)]/40">

                        {subtasks.map(
                            (
                                subtask,
                                subtaskIndex
                            ) => (
                                <SubtaskRow
                                    key={
                                        subtask._id
                                    }
                                    subtask={
                                        subtask
                                    }
                                    index={
                                        subtaskIndex
                                    }
                                    canEdit={
                                        canEdit
                                    }
                                    canComplete={
                                        canComplete
                                    }
                                    canReopen={
                                        canReopen
                                    }
                                    canArchive={
                                        canArchive
                                    }
                                    canRestore={
                                        canRestore
                                    }
                                    locked={
                                        locked
                                    }
                                    archived={
                                        archived
                                    }
                                    onToggle={
                                        onToggleSubtask
                                    }
                                />
                            )
                        )}

                    </div>
                )}

        </article>
    );
}

function SubtaskRow({
    subtask,
    canEdit,
    canComplete,
    canReopen,
    canArchive,
    canRestore,
    locked,
    archived,
    onToggle,
}) {
    const completed =
        Boolean(subtask.completed);

    const canToggle =
        !locked &&
        !archived &&
        (completed
            ? canReopen
            : canComplete);

    return (
        <div className="flex items-start gap-3 border-b border-[var(--border)] p-4 pl-12 last:border-b-0">

            <button
                type="button"
                onClick={() =>
                    onToggle?.(
                        subtask._id,
                        !completed
                    )
                }
                disabled={!canToggle}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition ${completed
                    ? "border-purple-500 bg-purple-500 text-white"
                    : "border-[var(--border)]"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
            >
                {completed && (
                    <Check size={12} />
                )}
            </button>


            <div className="min-w-0 flex-1">

                <p
                    className={`text-sm font-medium ${completed
                        ? "text-[var(--muted)] line-through"
                        : ""
                        }`}
                >
                    {subtask.title}
                </p>

                {subtask.description && (
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        {
                            subtask.description
                        }
                    </p>
                )}

            </div>

        </div>
    );
}

export default Task;