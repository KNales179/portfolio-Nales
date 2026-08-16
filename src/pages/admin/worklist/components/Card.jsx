import {
    Archive,
    CheckCircle2,
    Circle,
    Lock,
    Users,
} from "lucide-react";

const getProgress = (work) => {
    const value = Number(
        work?.progress ??
        work?.progressPercentage ??
        0
    );

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            Math.round(value)
        )
    );
};

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

const getStatusLabel = (status) => {
    switch (status) {
        case "PLANNED":
            return "Planned";

        case "IN_PROGRESS":
            return "In progress";

        case "COMPLETED":
            return "Completed";

        case "ARCHIVED":
            return "Archived";

        default:
            return "Unknown";
    }
};

const getStatusClasses = (status) => {
    switch (status) {
        case "PLANNED":
            return "bg-blue-500/10 text-blue-400";

        case "IN_PROGRESS":
            return "bg-yellow-500/10 text-yellow-400";

        case "COMPLETED":
            return "bg-green-500/10 text-green-400";

        case "ARCHIVED":
            return "bg-zinc-500/10 text-zinc-400";

        default:
            return "bg-[var(--surface)] text-[var(--muted)]";
    }
};

function Card({
    work,
    onClick,
}) {
    if (!work) {
        return null;
    }

    const progress =
        getProgress(work);

    const isCompleted =
        work.status === "COMPLETED";

    const isArchived =
        work.status === "ARCHIVED";

    const isLocked =
        work.isLocked === true ||
        work.locked === true;

    const participants =
        Array.isArray(work.participants)
            ? work.participants
            : [];

    const totalTasks =
        Number.isFinite(
            Number(work.totalTasks)
        )
            ? Number(work.totalTasks)
            : Array.isArray(work.tasks)
                ? work.tasks.length
                : Number(work.taskCount || 0);

    const completedTasks =
        Number.isFinite(
            Number(work.completedTasks)
        )
            ? Number(work.completedTasks)
            : 0;

    return (
        <button
            type="button"
            onClick={() =>
                onClick?.(work)
            }
            className="group w-full border border-[var(--border)] bg-[var(--card)] p-5 text-left transition hover:border-purple-500/40 hover:bg-[var(--surface)]"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold">
                            {work.title}
                        </h3>

                        <span
                            className={`px-2 py-1 text-[10px] font-semibold ${getStatusClasses(
                                work.status
                            )}`}
                        >
                            {getStatusLabel(
                                work.status
                            )}
                        </span>

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
                            className="text-zinc-400"
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
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--muted)]">
                            Progress
                        </span>

                        {work.totalTasks !==
                            undefined && (
                            <span className="text-[var(--muted)]">
                                {completedTasks} /{" "}
                                {totalTasks} tasks
                            </span>
                        )}
                    </div>

                    <span className="font-semibold">
                        {progress}%
                    </span>
                </div>

                <div className="h-2 overflow-hidden bg-[var(--border)]">
                    <div
                        className={`h-full transition-all duration-300 ${
                            isArchived
                                ? "bg-zinc-500"
                                : progress === 100
                                    ? "bg-green-500"
                                    : "bg-purple-500"
                        }`}
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                    <Users size={13} />

                    {participants.length}{" "}
                    participant
                    {participants.length === 1
                        ? ""
                        : "s"}
                </span>

                <span>
                    {totalTasks} task
                    {totalTasks === 1
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