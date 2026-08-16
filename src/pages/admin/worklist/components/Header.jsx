import { Link } from "react-router-dom";

import {
    Archive,
    ArrowLeft,
    Lock,
    RotateCcw,
    Unlock,
} from "lucide-react";

const getStatusLabel = (
    status
) => {
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

const getStatusClasses = (
    status
) => {
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

function Header({
    work,
    progress = 0,
    canEdit = false,
    canArchive = false,
    canRestore = false,
    canLock = false,
    canUnlock = false,
    onArchive,
    onRestore,
    onLock,
    onUnlock,
    workListPath = "/portfolio-Nales/admin/dashboard/worklist",
    loading = false,
}) {
    if (!work) {
        return null;
    }

    const status =
        work.status || "PLANNED";

    const isArchived =
        status === "ARCHIVED";

    const isLocked =
        work.isLocked === true ||
        work.locked === true;

    const safeProgress =
        Math.min(
            100,
            Math.max(
                0,
                Number(progress) || 0
            )
        );

    return (
        <header className="border border-[var(--border)] bg-[var(--card)]">
            <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            to={workListPath}
                            className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
                        >
                            <ArrowLeft size={16} />
                            Work list
                        </Link>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <span
                                className={`px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                    status
                                )}`}
                            >
                                {getStatusLabel(
                                    status
                                )}
                            </span>

                            {isLocked && (
                                <span className="flex items-center gap-1.5 bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                                    <Lock size={12} />
                                    Locked
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="min-w-0">
                            <h1 className="heading-font text-3xl font-bold tracking-tight md:text-4xl">
                                {work.title}
                            </h1>

                            {work.description && (
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                                    {
                                        work.description
                                    }
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {canEdit &&
                                canLock &&
                                !isArchived &&
                                !isLocked &&
                                onLock && (
                                    <button
                                        type="button"
                                        onClick={
                                            onLock
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Lock size={15} />
                                        Lock
                                    </button>
                                )}

                            {canEdit &&
                                canUnlock &&
                                !isArchived &&
                                isLocked &&
                                onUnlock && (
                                    <button
                                        type="button"
                                        onClick={
                                            onUnlock
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Unlock size={15} />
                                        Unlock
                                    </button>
                                )}

                            {canRestore &&
                                isArchived &&
                                onRestore && (
                                    <button
                                        type="button"
                                        onClick={
                                            onRestore
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="flex items-center gap-2 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-400 transition hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <RotateCcw
                                            size={15}
                                        />
                                        Restore
                                    </button>
                                )}

                            {canArchive &&
                                !isArchived &&
                                onArchive && (
                                    <button
                                        type="button"
                                        onClick={
                                            onArchive
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="flex items-center gap-2 border border-yellow-500/30 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Archive size={15} />
                                        Archive
                                    </button>
                                )}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                                Progress
                            </span>

                            <span className="text-sm font-bold">
                                {Math.round(
                                    safeProgress
                                )}
                                %
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden bg-[var(--surface)]">
                            <div
                                className={`h-full transition-all duration-500 ${
                                    isArchived
                                        ? "bg-zinc-500"
                                        : safeProgress ===
                                            100
                                            ? "bg-green-500"
                                            : "bg-purple-500"
                                }`}
                                style={{
                                    width: `${safeProgress}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;