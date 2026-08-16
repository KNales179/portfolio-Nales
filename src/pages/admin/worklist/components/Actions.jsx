import {
    Archive,
    Lock,
    RotateCcw,
    Unlock,
} from "lucide-react";

function Actions({
    work,
    canEdit = false,
    canArchive = false,
    canRestore = false,
    canLock = false,
    canUnlock = false,
    onArchive,
    onRestore,
    onLock,
    onUnlock,
    loading = false,
}) {
    if (!work) {
        return null;
    }

    const isArchived =
        work.status === "ARCHIVED";

    const isLocked =
        work.isLocked === true ||
        work.locked === true;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {!isArchived && canEdit && (
                <>
                    {canLock && !isLocked && (
                        <button
                            type="button"
                            onClick={onLock}
                            disabled={loading}
                            className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Lock size={15} />
                            Lock
                        </button>
                    )}

                    {canUnlock && isLocked && (
                        <button
                            type="button"
                            onClick={onUnlock}
                            disabled={loading}
                            className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Unlock size={15} />
                            Unlock
                        </button>
                    )}

                    {canArchive && (
                        <button
                            type="button"
                            onClick={onArchive}
                            disabled={loading}
                            className="inline-flex items-center gap-2 border border-yellow-500/30 px-3 py-2 text-sm font-medium text-yellow-400 transition hover:bg-yellow-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Archive size={15} />
                            Archive
                        </button>
                    )}
                </>
            )}

            {isArchived && canRestore && (
                <button
                    type="button"
                    onClick={onRestore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 border border-green-500/30 px-3 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RotateCcw size={15} />
                    Restore
                </button>
            )}
        </div>
    );
}

export default Actions;