import {
    CheckCircle2,
    Circle,
    Lock,
    Archive,
} from "lucide-react";

const formatDate = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
};

function Card({
    work,
    onClick,
}) {
    if (!work) {
        return null;
    }

    const progress =
        Number.isFinite(work.progress)
            ? Math.max(
                0,
                Math.min(
                    100,
                    work.progress
                )
            )
            : 0;

    const isCompleted =
        work.status === "COMPLETED";

    const isArchived =
        work.status === "ARCHIVED";

    const isLocked =
        work.isLocked === true;

    const statusLabel = isArchived
        ? "Archived"
        : isCompleted
            ? "Completed"
            : work.status ===
                "IN_PROGRESS"
                ? "In progress"
                : "Planned";

    return (
        <button
            type="button"
            onClick={() =>
                onClick?.(work)
            }
            className="group w-full border border-[var(--border)] bg-[var(--card)] p-5 text-left transition hover:border-purple-500/40 hover:bg-[var(--surface)]"
        >
            <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">

                        <h3 className="truncate text-base font-semibold">
                            {work.title}
                        </h3>

                        {isLocked && (
                            <span className="inline-flex items-center gap-1 bg-yellow-500/10 px-2 py-1 text-[10px] font-semibold text-yellow-400">
                                <Lock size={11} />
                                Locked
                            </span>
                        )}

                    </div>

                    {work.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                            {work.description}
                        </p>
                    )}
                </div>

                <div className="shrink-0">
                    {isArchived ? (
                        <Archive
                            size={18}
                            className="text-yellow-400"
                        />
                    ) : isCompleted ? (
                        <CheckCircle2
                            size={18}
                            className="text-green-400"
                        />
                    ) : (
                        <Circle
                            size={18}
                            className="text-[var(--muted)]"
                        />
                    )}
                </div>
            </div>

            <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="text-[var(--muted)]">
                        {statusLabel}
                    </span>

                    <span className="font-semibold">
                        {progress}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden bg-[var(--border)]">
                    <div
                        className="h-full bg-purple-500 transition-all duration-300"
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--muted)]">

                <span>
                    {work.taskCount ??
                        work.tasks?.length ??
                        0}{" "}
                    task
                    {(work.taskCount ??
                        work.tasks?.length ??
                        0) === 1
                        ? ""
                        : "s"}
                </span>

                {work.createdAt && (
                    <span>
                        Created{" "}
                        {formatDate(
                            work.createdAt
                        )}
                    </span>
                )}

                {work.createdBy && (
                    <span>
                        By{" "}
                        {work.createdBy.fullName ||
                            work.createdBy.username ||
                            "Unknown"}
                    </span>
                )}

            </div>
        </button>
    );
}

export default Card;