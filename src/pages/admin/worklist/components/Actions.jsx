import {
    Archive,
    Lock,
    Unlock,
    RotateCcw,
    MoreVertical,
} from "lucide-react";

function Actions({
    work,
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

    const isArchived =
        work.status === "ARCHIVED";

    const isLocked =
        work.isLocked === true;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {!isArchived && canEdit && (
                <>
                    {canLock && (
                        <button
                            type="button"
                            onClick={
                                isLocked
                                    ? onUnlock
                                    : onLock
                            }
                            className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-2 text-sm font-medium transition hover:bg-[var(--surface)]"
                        >
                            {isLocked ? (
                                <Unlock size={15} />
                            ) : (
                                <Lock size={15} />
                            )}

                            {isLocked
                                ? "Unlock"
                                : "Lock"}
                        </button>
                    )}

                    {canArchive && (
                        <button
                            type="button"
                            onClick={onArchive}
                            className="inline-flex items-center gap-2 border border-yellow-500/30 px-3 py-2 text-sm font-medium text-yellow-400 transition hover:bg-yellow-500/10"
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
                    className="inline-flex items-center gap-2 border border-green-500/30 px-3 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/10"
                >
                    <RotateCcw size={15} />

                    Restore
                </button>
            )}
        </div>
    );
}

export default Actions;