import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Lock,
    Unlock,
    Archive,
    RotateCcw,
} from "lucide-react";

function Header({
    work,
    progress = 0,
    canEdit = false,
    canArchive = false,
    canRestore = false,
    canLock = false,
    onArchive,
    onRestore,
    onLock,
    onUnlock,
}) {
    if (!work) {
        return null;
    }

    const status = work.status || "PLANNED";

    const statusStyles = {
        PLANNED:
            "bg-blue-500/10 text-blue-400",
        IN_PROGRESS:
            "bg-yellow-500/10 text-yellow-400",
        COMPLETED:
            "bg-green-500/10 text-green-400",
        ARCHIVED:
            "bg-gray-500/10 text-gray-400",
    };

    return (
        <header className="border-b border-[var(--border)] bg-[var(--card)]">

            <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-10 lg:px-12">

                <div className="flex flex-col gap-5">

                    <div className="flex items-center justify-between gap-4">

                        <Link
                            to="/admin/worklist"
                            className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
                        >
                            <ArrowLeft size={16} />
                            Work list
                        </Link>


                        <div className="flex flex-wrap items-center justify-end gap-2">

                            <span
                                className={`px-2.5 py-1 text-xs font-semibold ${statusStyles[status] ||
                                    statusStyles.PLANNED
                                    }`}
                            >
                                {status.replace(
                                    "_",
                                    " "
                                )}
                            </span>


                            {work.locked && (
                                <span className="flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
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
                                    {work.description}
                                </p>
                            )}

                        </div>


                        <div className="flex flex-wrap gap-2">

                            {canLock &&
                                !work.locked &&
                                onLock && (
                                    <button
                                        type="button"
                                        onClick={onLock}
                                        className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)]"
                                    >
                                        <Lock size={15} />
                                        Lock
                                    </button>
                                )}


                            {canLock &&
                                work.locked &&
                                onUnlock && (
                                    <button
                                        type="button"
                                        onClick={onUnlock}
                                        className="flex items-center gap-2 border border-[var(--border)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--surface)]"
                                    >
                                        <Unlock size={15} />
                                        Unlock
                                    </button>
                                )}


                            {canRestore &&
                                status ===
                                "ARCHIVED" &&
                                onRestore && (
                                    <button
                                        type="button"
                                        onClick={onRestore}
                                        className="flex items-center gap-2 border border-green-500/30 px-4 py-2.5 text-sm font-semibold text-green-400 transition hover:bg-green-500/10"
                                    >
                                        <RotateCcw size={15} />
                                        Restore
                                    </button>
                                )}


                            {canArchive &&
                                status !==
                                "ARCHIVED" &&
                                onArchive && (
                                    <button
                                        type="button"
                                        onClick={onArchive}
                                        className="flex items-center gap-2 border border-yellow-500/30 px-4 py-2.5 text-sm font-semibold text-yellow-400 transition hover:bg-yellow-500/10"
                                    >
                                        <Archive size={15} />
                                        Archive
                                    </button>
                                )}

                        </div>

                    </div>


                    <div className="mt-2">

                        <div className="mb-2 flex items-center justify-between">

                            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                                Progress
                            </span>

                            <span className="text-sm font-bold">
                                {Math.round(progress)}%
                            </span>

                        </div>

                        <div className="h-2 overflow-hidden bg-[var(--surface)]">

                            <div
                                className="h-full bg-purple-500 transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        Math.max(
                                            0,
                                            progress
                                        )
                                    )}%`,
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