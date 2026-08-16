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
    const completed =
        Boolean(subtask?.completed);

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
            subtask._id,
            !completed
        );
    };

    return (
        <div
            draggable={
                canEdit &&
                !locked &&
                !archived
            }
            onDragStart={(event) => {
                event.dataTransfer.setData(
                    "text/plain",
                    String(subtask._id)
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
                        String(
                            subtask._id
                        )
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

            {canEdit &&
                !locked &&
                !archived && (
                    <GripVertical
                        size={16}
                        className="mt-0.5 shrink-0 cursor-grab text-[var(--muted)] active:cursor-grabbing"
                    />
                )}


            <button
                type="button"
                onClick={handleToggle}
                disabled={!canToggle}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition ${completed
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
                    <Check size={12} />
                )}
            </button>


            <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                    <p
                        className={`text-sm font-medium ${completed
                            ? "text-[var(--muted)] line-through"
                            : ""
                            }`}
                    >
                        {subtask.title}
                    </p>

                    {completed &&
                        subtask.completedBy && (
                            <span className="text-[10px] text-[var(--muted)]">
                                Completed by{" "}
                                {subtask.completedBy
                                    ?.fullName ||
                                    subtask
                                        .completedBy
                                        ?.username ||
                                    ""}
                            </span>
                        )}

                </div>


                {subtask.description && (
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                        {
                            subtask.description
                        }
                    </p>
                )}

            </div>


            <div className="flex shrink-0 items-center gap-1">

                {canEdit &&
                    !locked &&
                    !archived && (
                        <button
                            type="button"
                            onClick={() =>
                                onEdit?.(
                                    subtask
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--text)]"
                            title="Edit subtask"
                        >
                            <Pencil
                                size={14}
                            />
                        </button>
                    )}


                {canArchive &&
                    !archived && (
                        <button
                            type="button"
                            onClick={() =>
                                onArchive?.(
                                    subtask._id
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center text-yellow-400 transition hover:bg-yellow-500/10"
                            title="Archive subtask"
                        >
                            <Archive
                                size={14}
                            />
                        </button>
                    )}


                {canRestore &&
                    archived && (
                        <button
                            type="button"
                            onClick={() =>
                                onRestore?.(
                                    subtask._id
                                )
                            }
                            className="flex h-8 w-8 items-center justify-center text-green-400 transition hover:bg-green-500/10"
                            title="Restore subtask"
                        >
                            <RotateCcw
                                size={14}
                            />
                        </button>
                    )}

            </div>

        </div>
    );
}

export default Subtask;